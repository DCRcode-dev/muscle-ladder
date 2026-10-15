# Fitbit API Integration Guide + Post-Workout Analysis Overlay

## Overview

This guide walks through the complete Fitbit Web API OAuth 2.0 setup and the post-workout analysis overlay built on top of the Gym spoke (programs.js + index.html).

**Deliverables:**
1. This guide — step-by-step OAuth flow
2. `fitbit-overlay.js` — post-workout analysis module (heart rate, steps, sleep)
3. Updated `sw.js` — service worker cache bump

---

## Part 1: Fitbit OAuth 2.0 Setup

### Step 1 — Create a Fitbit App

1. Go to **https://dev.fitbit.com/apps** and log in with DCR's Fitbit account
2. Click **"Register a New App"**
3. Fill in the application details:
   - **Application Name**: `DCR Gym` (or `Jarvis Fitness`)
   - **Description**: `Personal training analytics and recovery tracking`
   - **Application Website**: `https://localhost` (or any valid URL)
   - **Organization**: `Personal`
   - **Organization Website**: `https://localhost`
   - **OAuth 2.0 Application Type**: **Server** (we'll use the token endpoint server-side)
   - **Redirect URL**: `http://localhost:8080/callback` (or a custom scheme like `dcrgym://callback`)
   - **Default Access Type**: **Read**
4. Accept the Fitbit Platform Terms of Service
5. Click **Save**

### Step 2 — Get Your Credentials

After creating the app, you'll see:
- **Client ID**: a 24-character string (e.g., `23Q123`)
- **Client Secret**: a 40-character string

**Store these securely.** The Client Secret must never be exposed in client-side code. For this PWA, we'll use the **Authorization Code Grant Flow with PKCE** so the secret stays server-side.

### Step 3 — OAuth 2.0 Authorization Flow (PKCE)

The flow has three phases:

#### Phase A: Generate PKCE Values

```javascript
// Generate code verifier (43-128 chars)
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

// Generate code challenge (SHA-256 of verifier, base64url)
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
}

function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
```

#### Phase B: Redirect to Fitbit Authorization

Build the authorization URL and redirect the browser:

```
https://www.fitbit.com/oauth2/authorize?
  response_type=code
  &client_id=<CLIENT_ID>
  &redirect_uri=<REDIRECT_URI>
  &scope=activity%20heartrate%20sleep%20profile
  &code_challenge=<CODE_CHALLENGE>
  &code_challenge_method=S256
  &state=<RANDOM_STATE>
```

**Scopes needed:**
- `activity` — steps, distance, calories
- `heartrate` — heart rate zones and intraday data
- `sleep` — sleep stages and duration
- `profile` — user profile info

#### Phase C: Exchange Code for Tokens

After the user authorizes, Fitbit redirects to:
```
http://localhost:8080/callback?code=<AUTH_CODE>&state=<STATE>
```

Exchange the code for tokens:

```javascript
const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier  // PKCE verifier
  })
});

const tokens = await tokenResponse.json();
// tokens.access_token  — 8-hour lifespan
// tokens.refresh_token — for getting new access tokens
// tokens.user_id       — Fitbit user ID
// tokens.scope         — granted scopes
```

### Step 4 — Token Refresh

Access tokens expire after 8 hours. Use the refresh token:

```javascript
const refreshResponse = await fetch('https://api.fitbit.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
  },
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: storedRefreshToken
  })
});
```

---

## Part 2: API Endpoints Used

| Endpoint | Purpose |
|---|---|
| `GET /1/user/-/activities/heart/date/{date}/1d.json` | Heart rate zones + resting HR |
| `GET /1/user/-/activities/steps/date/{date}/1d.json` | Step count for the day |
| `GET /1/user/-/sleep/date/{date}.json` | Sleep stages, duration, efficiency |
| `GET /1/user/-/profile.json` | User profile (display name, avatar) |

All requests require header: `Authorization: Bearer <access_token>`

---

## Part 3: Post-Workout Analysis Overlay

The overlay (`fitbit-overlay.js`) integrates with the existing gym PWA:

### Architecture

```
┌─────────────────────────────────────────────┐
│  Gym PWA (index.html)                       │
│  ┌───────────────────────────────────────┐  │
│  │  Finish Screen (showFinish)           │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  Fitbit Overlay                 │  │  │
│  │  │  • Recovery Score (HRV-based)  │  │  │
│  │  │  • Heart Rate Zones            │  │  │
│  │  │  • Sleep Quality (last night)  │  │  │
│  │  │  • Step Count (today)          │  │  │
│  │  │  • Training Load vs Recovery   │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Integration Points

1. **Token storage**: `localStorage` keys `fitbit_access_token`, `fitbit_refresh_token`, `fitbit_token_expires`
2. **Data fetch**: On `showFinish()`, the overlay fetches today's heart rate, steps, and last night's sleep
3. **Render**: Injected into the finish screen as a card below the existing stats
4. **Auto-refresh**: If token is expired, silently refreshes before fetching

### Key Features

- **Recovery Score** (0–100): Based on resting HR trend + sleep efficiency + HRV if available
- **Heart Rate Zones**: Time in fat burn / cardio / peak during the workout window
- **Sleep Analysis**: Last night's sleep duration, efficiency, and deep/REM breakdown
- **Step Count**: Today's total steps with progress toward 10k goal
- **Training Load Indicator**: Compares today's workout intensity vs recovery metrics

---

## Part 4: Security Notes

- **Client Secret** must never appear in client-side code. For production, proxy token exchange through a server.
- **PKCE** prevents authorization code interception.
- **State parameter** prevents CSRF.
- **Tokens in localStorage** are acceptable for a personal PWA but consider `sessionStorage` for higher security.
- **Scope minimization**: Only request `activity`, `heartrate`, `sleep`, `profile`.

---

## Part 5: Testing the Integration

1. Open the gym PWA
2. Go to Settings → Connect Fitbit
3. Authorize via the Fitbit consent screen
4. Complete a workout
5. On the finish screen, the Fitbit overlay appears with:
   - Recovery score and trend
   - Heart rate zone breakdown
   - Last night's sleep summary
   - Today's step count

---

## Files Modified/Created

| File | Action |
|---|---|
| `Gym/fitbit-overlay.js` | **Created** — post-workout analysis module |
| `Gym/sw.js` | **Modified** — cache version bump to v36, added fitbit-overlay.js |
| `Gym/index.html` | **Modified** — script tag for fitbit-overlay.js |
| `Gym/Output/Fitbit-API-Integration-Guide.md` | **Created** — this guide |
