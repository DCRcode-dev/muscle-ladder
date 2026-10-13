// ============================================================
// Fitbit Post-Workout Analysis Overlay
// Integrates with DCR Gym PWA — fetches heart rate, steps, sleep
// and renders recovery analysis on the finish screen.
// ============================================================

(function() {
  'use strict';

  // ── Configuration ──────────────────────────────────────────
  const FITBIT_CONFIG = {
    clientId: '', // Set after creating app at dev.fitbit.com
    clientSecret: '', // Server-side only — never expose in client
    redirectUri: 'http://localhost:8080/callback',
    scopes: ['activity', 'heartrate', 'sleep', 'profile'],
    authUrl: 'https://www.fitbit.com/oauth2/authorize',
    tokenUrl: 'https://api.fitbit.com/oauth2/token',
    apiBase: 'https://api.fitbit.com/1/user/-'
  };

  // ── Token Storage ──────────────────────────────────────────
  const TokenStore = {
    get accessToken() { return localStorage.getItem('fitbit_access_token'); },
    set accessToken(v) { localStorage.setItem('fitbit_access_token', v); },
    get refreshToken() { return localStorage.getItem('fitbit_refresh_token'); },
    set refreshToken(v) { localStorage.setItem('fitbit_refresh_token', v); },
    get expiresAt() { return parseInt(localStorage.getItem('fitbit_token_expires') || '0'); },
    set expiresAt(v) { localStorage.setItem('fitbit_token_expires', v.toString()); },
    get userId() { return localStorage.getItem('fitbit_user_id'); },
    set userId(v) { localStorage.setItem('fitbit_user_id', v); },

    clear() {
      localStorage.removeItem('fitbit_access_token');
      localStorage.removeItem('fitbit_refresh_token');
      localStorage.removeItem('fitbit_token_expires');
      localStorage.removeItem('fitbit_user_id');
    },

    isExpired() {
      return Date.now() >= this.expiresAt - 60000; // 1 min buffer
    },

    isConnected() {
      return !!this.accessToken;
    }
  };

  // ── PKCE Helpers ───────────────────────────────────────────
  function base64URLEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
  }

  async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(digest);
  }

  // ── OAuth Flow ─────────────────────────────────────────────
  async function initiateAuth() {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    const state = base64URLEncode(crypto.getRandomValues(new Uint8Array(16)));

    // Store verifier and state for callback
    sessionStorage.setItem('fitbit_code_verifier', verifier);
    sessionStorage.setItem('fitbit_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: FITBIT_CONFIG.clientId,
      redirect_uri: FITBIT_CONFIG.redirectUri,
      scope: FITBIT_CONFIG.scopes.join(' '),
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state: state
    });

    window.location.href = `${FITBIT_CONFIG.authUrl}?${params.toString()}`;
  }

  async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('fitbit_state');

    if (!code || state !== storedState) {
      console.error('[Fitbit] Invalid OAuth callback');
      return false;
    }

    const verifier = sessionStorage.getItem('fitbit_code_verifier');
    if (!verifier) {
      console.error('[Fitbit] Missing code verifier');
      return false;
    }

    try {
      const response = await fetch(FITBIT_CONFIG.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(FITBIT_CONFIG.clientId + ':' + FITBIT_CONFIG.clientSecret)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: FITBIT_CONFIG.redirectUri,
          code_verifier: verifier
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.errors?.[0]?.message || 'Token exchange failed');
      }

      const data = await response.json();
      TokenStore.accessToken = data.access_token;
      TokenStore.refreshToken = data.refresh_token;
      TokenStore.expiresAt = Date.now() + (data.expires_in * 1000);
      TokenStore.userId = data.user_id;

      // Clean up session storage
      sessionStorage.removeItem('fitbit_code_verifier');
      sessionStorage.removeItem('fitbit_state');

      return true;
    } catch (err) {
      console.error('[Fitbit] Token exchange failed:', err);
      return false;
    }
  }

  async function refreshAccessToken() {
    if (!TokenStore.refreshToken) return false;

    try {
      const response = await fetch(FITBIT_CONFIG.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(FITBIT_CONFIG.clientId + ':' + FITBIT_CONFIG.clientSecret)
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: TokenStore.refreshToken
        })
      });

      if (!response.ok) {
        TokenStore.clear();
        return false;
      }

      const data = await response.json();
      TokenStore.accessToken = data.access_token;
      TokenStore.refreshToken = data.refresh_token;
      TokenStore.expiresAt = Date.now() + (data.expires_in * 1000);
      TokenStore.userId = data.user_id;

      return true;
    } catch (err) {
      console.error('[Fitbit] Token refresh failed:', err);
      return false;
    }
  }

  async function ensureValidToken() {
    if (!TokenStore.isConnected()) return false;
    if (TokenStore.isExpired()) {
      return await refreshAccessToken();
    }
    return true;
  }

  // ── API Calls ──────────────────────────────────────────────
  async function fetchFitbitData(endpoint) {
    if (!await ensureValidToken()) return null;

    try {
      const response = await fetch(`${FITBIT_CONFIG.apiBase}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${TokenStore.accessToken}`
        }
      });

      if (response.status === 401) {
        // Token expired mid-request
        if (await refreshAccessToken()) {
          return fetchFitbitData(endpoint);
        }
        return null;
      }

      if (!response.ok) {
        console.error(`[Fitbit] API error ${response.status}:`, endpoint);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('[Fitbit] Fetch failed:', err);
      return null;
    }
  }

  async function getHeartRateData(dateStr) {
    return fetchFitbitData(`/activities/heart/date/${dateStr}/1d.json`);
  }

  async function getStepsData(dateStr) {
    return fetchFitbitData(`/activities/steps/date/${dateStr}/1d.json`);
  }

  async function getSleepData(dateStr) {
    return fetchFitbitData(`/sleep/date/${dateStr}.json`);
  }

  // ── Analysis Engine ────────────────────────────────────────
  function calculateRecoveryScore(heartRateData, sleepData) {
    let score = 50; // Base score

    // Resting heart rate factor (lower is better for recovery)
    if (heartRateData?.activities_heart?.[0]?.value?.restingHeartRate) {
      const rhr = heartRateData.activities_heart[0].value.restingHeartRate;
      if (rhr < 60) score += 20;
      else if (rhr < 70) score += 10;
      else if (rhr > 80) score -= 15;
    }

    // Sleep efficiency factor
    if (sleepData?.sleep?.[0]?.efficiency) {
      const eff = sleepData.sleep[0].efficiency;
      if (eff >= 90) score += 20;
      else if (eff >= 80) score += 10;
      else if (eff < 70) score -= 10;
    }

    // Sleep duration factor
    if (sleepData?.sleep?.[0]?.minutesAsleep) {
      const mins = sleepData.sleep[0].minutesAsleep;
      if (mins >= 420) score += 10; // 7+ hours
      else if (mins < 360) score -= 10; // <6 hours
    }

    return Math.max(0, Math.min(100, score));
  }

  function getHeartRateZones(heartRateData) {
    const zones = heartRateData?.activities_heart?.[0]?.value?.heartRateZones || [];
    return zones.map(z => ({
      name: z.name,
      minutes: z.minutes,
      caloriesOut: z.caloriesOut,
      max: z.max,
      min: z.min
    }));
  }

  function getSleepSummary(sleepData) {
    const sleep = sleepData?.sleep?.[0];
    if (!sleep) return null;

    return {
      duration: sleep.minutesAsleep,
      efficiency: sleep.efficiency,
      deep: sleep.levels?.summary?.deep?.minutes || 0,
      rem: sleep.levels?.summary?.rem?.minutes || 0,
      light: sleep.levels?.summary?.light?.minutes || 0,
      awake: sleep.levels?.summary?.wake?.minutes || 0
    };
  }

  function getStepsSummary(stepsData) {
    const steps = stepsData?.['activities-steps']?.[0];
    if (!steps) return null;

    return {
      count: parseInt(steps.value),
      goal: 10000
    };
  }

  // ── UI Rendering ───────────────────────────────────────────
  function formatDuration(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  function getRecoveryColor(score) {
    if (score >= 80) return 'var(--accent-success)';
    if (score >= 60) return 'var(--accent-timer)';
    return 'var(--accent-danger)';
  }

  function getRecoveryLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }

  function renderOverlayHTML(recoveryScore, heartRateZones, sleepSummary, stepsSummary) {
    const recoveryColor = getRecoveryColor(recoveryScore);
    const recoveryLabel = getRecoveryLabel(recoveryScore);

    const zonesHTML = heartRateZones.map(z => {
      const pct = Math.round((z.minutes / Math.max(1, heartRateZones.reduce((a, b) => a + b.minutes, 0))) * 100);
      return `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <div style="width:8px;height:8px;border-radius:50%;background:${z.name === 'Peak' ? '#EF4444' : z.name === 'Cardio' ? '#F59E0B' : z.name === 'Fat Burn' ? '#22C55E' : '#94A3B8'};"></div>
          <div style="flex:1;font-size:12px;color:var(--text-secondary);">${z.name}</div>
          <div style="font-size:12px;font-weight:600;color:var(--text-primary);">${z.minutes}m</div>
          <div style="font-size:10px;color:var(--text-tertiary);width:32px;text-align:right;">${pct}%</div>
        </div>
      `;
    }).join('');

    const sleepHTML = sleepSummary ? `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Last Night's Sleep</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${formatDuration(sleepSummary.duration)}</div>
            <div style="font-size:11px;color:var(--text-tertiary);">${sleepSummary.efficiency}% efficiency</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;color:var(--text-secondary);">Deep ${formatDuration(sleepSummary.deep)}</div>
            <div style="font-size:11px;color:var(--text-secondary);">REM ${formatDuration(sleepSummary.rem)}</div>
          </div>
        </div>
      </div>
    ` : '';

    const stepsHTML = stepsSummary ? `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Today's Activity</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${stepsSummary.count.toLocaleString()}</div>
            <div style="font-size:11px;color:var(--text-tertiary);">steps</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;color:var(--text-secondary);">${Math.round((stepsSummary.count / stepsSummary.goal) * 100)}% of ${stepsSummary.goal.toLocaleString()} goal</div>
          </div>
        </div>
      </div>
    `: '';

    return `
      <div id="fitbit-overlay" style="margin:16px auto;max-width:360px;background:var(--surface-card);border:1px solid var(--border);border-radius:20px;padding:18px;box-shadow:var(--shadow);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);">Recovery Analysis</div>
          <div style="font-size:10px;color:var(--muted);">via Fitbit</div>
        </div>

        <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
          <div style="width:64px;height:64px;border-radius:50%;background:${recoveryColor}20;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <div style="font-size:24px;font-weight:700;color:${recoveryColor};">${recoveryScore}</div>
          </div>
          <div>
            <div style="font-size:16px;font-weight:600;color:var(--text-primary);">${recoveryLabel} Recovery</div>
            <div style="font-size:12px;color:var(--text-tertiary);">Based on RHR, sleep & HRV</div>
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Heart Rate Zones</div>
          ${zonesHTML || '<div style="font-size:12px;color:var(--text-tertiary);">No heart rate data available</div>'}
        </div>

        ${sleepHTML}
        ${stepsHTML}
      </div>
    `;
  }

  function renderConnectPrompt() {
    return `
      <div id="fitbit-overlay" style="margin:16px auto;max-width:360px;background:var(--surface-card);border:1px solid var(--border);border-radius:20px;padding:18px;box-shadow:var(--shadow);text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:12px;">Connect Fitbit</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;line-height:1.5;">
          Connect your Fitbit account to see recovery scores, heart rate zones, sleep analysis, and activity data after each workout.
        </div>
        <button onclick="FitbitOverlay.connect()" style="background:var(--accent);color:#fff;border:none;border-radius:12px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;">
          Connect Fitbit
        </button>
      </div>
    `;
  }

  // ── Main Entry Point ───────────────────────────────────────
  async function renderFitbitOverlay() {
    const finishScreen = document.getElementById('finish-screen');
    if (!finishScreen) return;

    // Remove existing overlay if any
    const existing = document.getElementById('fitbit-overlay');
    if (existing) existing.remove();

    if (!TokenStore.isConnected()) {
      finishScreen.insertAdjacentHTML('beforeend', renderConnectPrompt());
      return;
    }

    // Show loading state
    finishScreen.insertAdjacentHTML('beforeend', `
      <div id="fitbit-overlay" style="margin:16px auto;max-width:360px;background:var(--surface-card);border:1px solid var(--border);border-radius:20px;padding:18px;box-shadow:var(--shadow);text-align:center;">
        <div style="font-size:13px;color:var(--text-secondary);">Loading Fitbit data...</div>
      </div>
    `);

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const [heartRateData, stepsData, sleepData] = await Promise.all([
      getHeartRateData(today),
      getStepsData(today),
      getSleepData(yesterday)
    ]);

    const recoveryScore = calculateRecoveryScore(heartRateData, sleepData);
    const heartRateZones = getHeartRateZones(heartRateData);
    const sleepSummary = getSleepSummary(sleepData);
    const stepsSummary = getStepsSummary(stepsData);

    const overlay = document.getElementById('fitbit-overlay');
    if (overlay) {
      overlay.outerHTML = renderOverlayHTML(recoveryScore, heartRateZones, sleepSummary, stepsSummary);
    }
  }

  // ── Settings Integration ───────────────────────────────────
  function renderSettingsSection() {
    const isConnected = TokenStore.isConnected();
    const userId = TokenStore.userId;

    return `
      <div style="margin:16px auto;max-width:360px;background:var(--surface-card);border:1px solid var(--border);border-radius:20px;padding:18px;box-shadow:var(--shadow);">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:12px;">Fitbit Integration</div>
        ${isConnected ? `
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:14px;font-weight:600;color:var(--text-primary);">Connected</div>
              <div style="font-size:12px;color:var(--text-tertiary);">User: ${userId || 'Unknown'}</div>
            </div>
            <button onclick="FitbitOverlay.disconnect()" style="background:var(--accent-danger);color:#fff;border:none;border-radius:10px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;">
              Disconnect
            </button>
          </div>
        ` : `
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">
            Connect your Fitbit account for recovery tracking.
          </div>
          <button onclick="FitbitOverlay.connect()" style="background:var(--accent);color:#fff;border:none;border-radius:12px;padding:12px 24px;font-size:14px;font-weight:600;cursor:pointer;">
            Connect Fitbit
          </button>
        `}
      </div>
    `;
  }

  // ── Public API ────────────────────────────────────────────
  window.FitbitOverlay = {
    connect: initiateAuth,
    disconnect: () => {
      TokenStore.clear();
      const overlay = document.getElementById('fitbit-overlay');
      if (overlay) overlay.remove();
    },
    render: renderFitbitOverlay,
    renderSettings: renderSettingsSection,
    isConnected: () => TokenStore.isConnected(),
    handleCallback
  };

  // ── Auto-handle OAuth callback ────────────────────────────
  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    handleCallback().then(success => {
      if (success) {
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });
  }

  // ── Hook into showFinish ──────────────────────────────────
  // Wrap the original showFinish to inject Fitbit overlay
  const originalShowFinish = window.showFinish;
  if (originalShowFinish) {
    window.showFinish = function() {
      originalShowFinish();
      // Delay slightly to ensure finish screen is in DOM
      setTimeout(renderFitbitOverlay, 100);
    };
  }

  console.log('[Fitbit] Overlay module loaded');
})();
