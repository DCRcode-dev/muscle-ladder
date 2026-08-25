# Muscle Ladder — Setup Guide

## What you have

```
index.html       ← Main PWA app (open this in Chrome on your phone)
programs.js      ← All 8 Muscle Ladder programs
manifest.json    ← Makes it installable on Android
sw.js            ← Service worker (offline support)
apps-script.gs   ← Google Sheets backend code
SETUP.md         ← This file
```

---

## Step 1: Host the app (GitHub Pages — free, 5 min)

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click **New repository** → name it `muscle-ladder` → **Public** → Create
3. Click **uploading an existing file** → drag all 5 files (`index.html`, `programs.js`, `manifest.json`, `sw.js`) into the box → **Commit**
4. Go to **Settings → Pages → Source → Deploy from branch → main → Save**
5. Your app is live at: `https://YOUR-USERNAME.github.io/muscle-ladder`

---

## Step 2: Set up Google Sheets backend (10 min)

1. Go to [sheets.google.com](https://sheets.google.com) → create a **New spreadsheet** → name it `Muscle Ladder Data`
2. In the spreadsheet, go to **Extensions → Apps Script**
3. Delete the default code, paste the entire contents of `apps-script.gs`
4. Click **Save** (floppy disk icon)
5. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
6. Copy the URL that appears (looks like `https://script.google.com/macros/s/ABCD.../exec`)
7. In your Muscle Ladder app → **Settings tab** → paste that URL → tap **Test Connection**
8. You should see ✅ Connected

From now on, every workout you finish auto-syncs to Google Sheets. Two tabs are created:
- **WorkoutLog** — every individual set (great for detailed analysis)
- **WorkoutSummary** — one row per workout session

---

## Step 3: Install on Android

1. Open Chrome on your Android phone
2. Navigate to your GitHub Pages URL
3. Tap the **⋮ menu → Add to Home screen**
4. Name it "Muscle Ladder" → Add
5. It now lives on your home screen like a native app — works offline

---

## Step 4: Import your Strong history

1. In the **Strong app** → Profile → Settings → **Export Data → CSV**
2. Strong will email you the CSV file
3. In Muscle Ladder → **Settings tab → Import from Strong → Choose file**
4. Select the CSV → done. All your history imports instantly.

Your previous weights now appear as the "Last time" hint when you start any exercise.

---

## How to use week-to-week

**Monday morning:**
1. Open Muscle Ladder
2. Tap how many days you have this week (2–6)
3. Pick the program (e.g. P7: Upper/Lower if you have 4 days)
4. Your sessions appear — tap any to start

**At the gym:**
1. Tap the session (e.g. Upper #1)
2. Each exercise shows your **previous weight** in the input placeholder
3. Log sets by entering weight + reps → tap **✓**
4. Rest timer starts automatically
5. Hit **Substitute** if equipment is taken — app shows your history for each sub option
6. Hit **Finish** when done

**Progressive overload tracking:**
Because exercise names are consistent across all programs, the app correctly chains your history. Whether you did Bench Press in P7 or P12 last week, it shows the same number.

---

## Tips

- **Notes per exercise:** tap 📝 to add form cues or rep targets — these save permanently
- **Add sets:** tap "+ Add Set" at the bottom of any exercise card
- **Volume tracking:** live kg total shown in the header throughout workout
- **Edit a program exercise:** open `programs.js` in any text editor and update the exercise names, sets, reps — then re-upload to GitHub

---

## File to edit exercises: programs.js

If I misread an exercise from the photos, open `programs.js` and find the exercise. Each one looks like:

```js
{
  id: "bench_press", name: "Bench Press",
  warmupSets: "2–3", workingSets: 3, reps: "3–5",
  rest: "3–4 min",
  substitutions: ["Machine Chest Press", "Flat Dumbbell Press"],
  notes: ""
}
```

Edit the `name`, `reps`, `rest`, or `substitutions` to match the book exactly, save, and re-upload.

---

Built from The Muscle Ladder by Jeff Nippard · jeffnippard.com

---

## Step 5: Connect biometrics (AI screen) via Google Fit

The AI tab pulls your daily sleep score, HRV, resting heart rate, and readiness directly from **Google Fit** — no Fitbit developer account or API keys required. Your Fitbit data flows into Google Fit on Android automatically. Apps Script handles the OAuth natively; you just click Allow once.

### 5a. Enable Fitbit → Google Fit sync on Android (~2 min)

1. Open the **Fitbit app** on your Android phone
2. Tap your profile photo → **Settings** → **Apps**
3. Scroll to **Google Fit** → tap it → toggle **Sync Fitbit data to Google Fit: ON**
4. Open **Google Fit** once and confirm it shows your step/sleep data from Fitbit

That's it for the phone side. Fitbit will now push sleep and heart rate into Google Fit continuously.

### 5b. Add appsscript.json to your Apps Script project (~3 min)

The `appsscript.json` file in this folder declares the fitness OAuth scopes. Without it, Apps Script won't request permission to read Google Fit data.

1. Open your Apps Script project (from Step 2)
2. In the left sidebar, click the gear icon (**Project Settings**)
3. Check **Show "appsscript.json" manifest file in editor**
4. Click **Editor** (back to the code view) — you'll now see `appsscript.json` in the file list
5. Replace its contents with the contents of the `appsscript.json` file in this folder
6. Click **Save**

### 5c. Redeploy and authorize (one-time, ~3 min)

Because you added new OAuth scopes, you need to create a new deployment:

1. In Apps Script → **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
2. Google will show a permissions screen listing fitness scopes — click **Allow**
3. Copy the new exec URL (it's different from the previous one)
4. In DCR Gym → Settings (gear icon on home) → paste the new URL → tap **Test Connection**
5. You should see ✅ Connected

From now on, every time you open the AI tab the app fetches live Google Fit data for that day.

### 5d. Set up automatic daily sync (optional but recommended)

Pre-loads biometric data every morning before you open the app:

1. In Apps Script → **Triggers** (clock icon in left sidebar)
2. Click **+ Add Trigger** (bottom right)
3. Configure:
   - **Function to run:** `fitbitDailySync`
   - **Event source:** `Time-driven`
   - **Type of time based trigger:** `Day timer`
   - **Time of day:** `7am to 8am`
4. Click **Save**

The AI screen will always show fresh numbers when you open it each morning.

### 5e. What data is fetched

| Field | Source | Notes |
|---|---|---|
| Sleep Score | Google Fit `com.google.sleep.segment` | Synthetic: quality ratio × duration |
| Deep Sleep | Google Fit sleep stages | Stage 5 minutes |
| REM Sleep | Google Fit sleep stages | Stage 6 minutes |
| Resting HR | Google Fit `com.google.heart_rate.bpm` | 5th-percentile of daily readings |
| Avg Workout HR | Google Fit HR (hourly) | Readings ≥ 100 bpm |
| HRV | Computed from 1-min HR data | RMSSD approximation from RR intervals |
| Readiness Score | Computed (no native equivalent) | 40% sleep · 35% HRV · 25% resting HR |

> **Note:** Google Fit does not expose SpO₂ to third-party apps via REST — that field will show `—` in the UI.

### Troubleshooting

- **AI screen shows placeholder data** — tap the AI tab once to trigger a live fetch; check the browser console (F12) for fetch errors
- **"Error 403 Forbidden"** from Apps Script — the fitness scopes weren't authorized; redeploy and click Allow again (Step 5c)
- **Sleep/HRV shows 0** — confirm Fitbit → Google Fit sync is ON (Step 5a) and that yesterday's sleep session has synced in the Google Fit app
- **Workout HR is null** — only populates on days you wore your Fitbit during a session with sustained HR above 100 bpm

---

## Google Health API Migration (June 2026) — one-time setup, ~10 min

The old Google Fit REST API is dead (sunset 2026). The backend now uses the
**Google Health API v4** — the official successor that serves Fitbit Air +
Google Health app data. Do this ONCE:

1. **Google Cloud project**
   - Go to console.cloud.google.com → New Project → name it `dcr-gym-health`.
   - APIs & Services → Library → search **"Google Health API"** → Enable.
   - APIs & Services → OAuth consent screen → External → fill app name
     `DCR Gym` + your email → Save. Add **yourself** as a Test user.
   - Note the **project number** (Dashboard, top card).

2. **Link Apps Script to that project**
   - Open the Apps Script editor for the Muscle Ladder backend.
   - ⚙ Project Settings → Google Cloud Platform (GCP) Project → Change project
     → paste the project **number** → Set.

3. **Update the code**
   - Replace `Code.gs` contents with the repo's `apps-script.gs`.
   - ⚙ Project Settings → check "Show appsscript.json manifest" → replace its
     contents with the repo's `appsscript.json` (new googlehealth scopes).

4. **Authorize once**
   - In the editor, select `authorizeHealthAPI` → Run → approve the consent
     screen (it will warn the app is unverified — Continue; it's your own app).
   - View → Logs: should print `Auth OK — Health API reachable`.

5. **Redeploy (same URL)**
   - Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy.
   - The web app URL does not change, so index.html needs no edits.

6. **Verify on the phone**
   - DCR Gym → AI tab → tap ↻. Readiness, sleep, RHR and HRV should populate.
   - If it shows "reconnect health sync", repeat step 4 (token/consent issue).

Notes
- Apps Script manages its own OAuth grant — no weekly token expiry, no client
  secret. "Recurring" sync = the app pulls on open (30-min server memo cache).
- The server falls back to the last-good cached day (FitbitData sheet) if the
  API hiccups, so the AI tab never goes blank.
