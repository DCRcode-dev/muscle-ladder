// ============================================================
// MUSCLE LADDER — Google Apps Script Backend
// Deploy as: Web App → Execute as: Me → Who has access: Anyone
// ============================================================
const SHEET_NAME_LOG     = "WorkoutLog";
const SHEET_NAME_SUMMARY = "WorkoutSummary";
const SHEET_NAME_STATE   = "AppState";

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === 'ping')         return jsonResponse({ ok: true, message: 'Muscle Ladder backend connected!' });
  if (action === 'pullState')    return pullState();
  if (action === 'getFitbit')    return fitbitGetLatestData();
  if (action === 'fitbitAuth')   return fitbitStartAuth_();
  if (action === 'fitbitStatus') return fitbitStatus_();

  return jsonResponse({ ok: false, message: 'Unknown action' });
}

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === 'syncWorkouts') return syncWorkouts(body.workouts || []);
    if (action === 'saveState')    return saveState(body.history || [], body.ts || 0);
    if (action === 'deleteWorkout') return deleteWorkoutInSheet(body.id);

    return jsonResponse({ ok: false, message: 'Unknown action: ' + action });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// ── STATE BLOB (bidirectional sync) ──────────────────────────────────────────
function pullState() {
  const ss         = getSpreadsheet_();
  const stateSheet = ss.getSheetByName(SHEET_NAME_STATE);
  if (!stateSheet) return jsonResponse({ ok: true, history: [], ts: 0 });
  try {
    const values = stateSheet.getDataRange().getValues();
    const history = [];
    let maxTs = 0;
    
    // Check for old format (single row containing JSON array in column A)
    if (values.length === 2 && values[1][0] && String(values[1][0]).trim().startsWith('[')) {
      try {
        const oldHistory = JSON.parse(values[1][0]);
        if (Array.isArray(oldHistory)) {
          return jsonResponse({ ok: true, history: oldHistory, ts: Number(values[1][1]) || 0 });
        }
      } catch(e) {}
    }
    
    for (let i = 1; i < values.length; i++) {
      const jsonStr = values[i][1];
      if (jsonStr) {
        try {
          const w = JSON.parse(jsonStr);
          if (w) history.push(w);
        } catch(e) {}
      }
      const ts = Number(values[i][2]);
      if (ts > maxTs) maxTs = ts;
    }
    return jsonResponse({ ok: true, history: history, ts: maxTs });
  } catch(e) {
    return jsonResponse({ ok: true, history: [], ts: 0 });
  }
}

function saveState(history, ts) {
  const ss = getSpreadsheet_();
  let stateSheet = ss.getSheetByName(SHEET_NAME_STATE);
  if (!stateSheet) {
    stateSheet = ss.insertSheet(SHEET_NAME_STATE);
    stateSheet.appendRow(['Workout ID', 'Workout JSON', 'Timestamp', 'Updated']);
    stateSheet.setFrozenRows(1);
    stateSheet.getRange(1,1,1,4).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  } else {
    // Ensure header row is set to the new 4-column format
    if (stateSheet.getMaxColumns() < 4) {
      stateSheet.insertColumnsAfter(stateSheet.getMaxColumns(), 4 - stateSheet.getMaxColumns());
    }
    stateSheet.getRange(1, 1, 1, 4).setValues([['Workout ID', 'Workout JSON', 'Timestamp', 'Updated']]);
    stateSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }

  // ── Non-destructive union merge ───────────────────────────────────────────
  // The cloud copy must never lose workouts to a smaller/older device push.
  // Merge incoming with what is already stored, keyed by id (incoming wins on
  // conflict so edits propagate). A wiped or partial device can never shrink
  // the cloud history — it can only ever add to it.
  let existing = [];
  const values = stateSheet.getDataRange().getValues();
  if (values.length === 2 && values[1][0] && String(values[1][0]).trim().startsWith('[')) {
    try {
      const oldHistory = JSON.parse(values[1][0]);
      if (Array.isArray(oldHistory)) existing = oldHistory;
    } catch(e) {}
  } else {
    for (let i = 1; i < values.length; i++) {
      const jsonStr = values[i][1];
      if (jsonStr) {
        try {
          existing.push(JSON.parse(jsonStr));
        } catch(e) {}
      }
    }
  }

  const map = {};
  (existing || []).forEach(function(w) { if (w && w.id) map[w.id] = w; });
  (history  || []).forEach(function(w) { if (w && w.id) map[w.id] = w; });
  const merged = Object.keys(map).map(function(k) { return map[k]; })
                       .sort(function(a, b) { return (a.endTime || 0) - (b.endTime || 0); });

  // Guard: never overwrite a populated cloud copy with nothing.
  if (merged.length === 0 && (existing || []).length > 0) {
    return jsonResponse({ ok: true, skipped: 'empty-incoming', count: existing.length });
  }

  const rowsToWrite = merged.map(function(w) {
    return [
      String(w.id),
      JSON.stringify(w),
      String(ts || Date.now()),
      new Date().toLocaleString()
    ];
  });

  if (stateSheet.getLastRow() > 1) {
    stateSheet.getRange(2, 1, stateSheet.getLastRow() - 1, 4).clearContent();
  }
  if (rowsToWrite.length > 0) {
    stateSheet.getRange(2, 1, rowsToWrite.length, 4).setValues(rowsToWrite);
  }
  return jsonResponse({ ok: true, count: merged.length });
}

// ── SYNC WORKOUTS ─────────────────────────────────────────────────────────────
function syncWorkouts(workouts) {
  const ss = getSpreadsheet_();

  let logSheet = ss.getSheetByName(SHEET_NAME_LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAME_LOG);
    logSheet.appendRow(['ID','Date','Program','Session','Exercise','Set #','Weight','Reps','Volume (set)','Duration','Total Volume','Total Sets']);
    logSheet.setFrozenRows(1);
    logSheet.getRange(1,1,1,12).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }

  let summarySheet = ss.getSheetByName(SHEET_NAME_SUMMARY);
  if (!summarySheet) {
    summarySheet = ss.insertSheet(SHEET_NAME_SUMMARY);
    summarySheet.appendRow(['ID','Date','Program','Session','Duration','Total Volume','Total Sets','Exercises']);
    summarySheet.setFrozenRows(1);
    summarySheet.getRange(1,1,1,8).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }

  const logValues = logSheet.getDataRange().getValues();
  const summaryValues = summarySheet.getDataRange().getValues();
  
  const workoutIdsToSync = workouts.map(function(w) { return w.id || (w.date + '-' + w.sessionName); });
  const idsSet = new Set(workoutIdsToSync);

  // 1. Delete matching rows from WorkoutSummary (iterate backwards to preserve indices)
  for (let i = summaryValues.length - 1; i >= 1; i--) {
    const rowId = String(summaryValues[i][0]);
    if (idsSet.has(rowId)) {
      summarySheet.deleteRow(i + 1);
    }
  }

  // 2. Delete matching rows from WorkoutLog (iterate backwards)
  for (let i = logValues.length - 1; i >= 1; i--) {
    const rowId = String(logValues[i][0]);
    const match = workoutIdsToSync.some(function(wid) {
      return rowId === wid || rowId.indexOf(wid + '-') === 0;
    });
    if (match) {
      logSheet.deleteRow(i + 1);
    }
  }

  let added = 0;
  workouts.forEach(w => {
    const wid     = w.id || (w.date + '-' + w.sessionName);
    const dateStr = new Date(w.date).toLocaleDateString('en-US');

    summarySheet.appendRow([wid, dateStr, w.programName||'', w.sessionName||'', w.duration||'', w.totalVolume||0, w.totalSets||0, (w.exercises||[]).map(e=>e.name).join(', ')]);
    added++;

    (w.exercises||[]).forEach(ex => {
      (ex.sets||[]).forEach((s, i) => {
        const rowId = wid + '-' + ex.name + '-' + i;
        const setVol = (parseFloat(s.weight)||0) * (parseInt(s.reps)||0);
        logSheet.appendRow([rowId, dateStr, w.programName||'', w.sessionName||'', ex.name, i+1, s.weight||'', s.reps||'', setVol, w.duration||'', w.totalVolume||0, w.totalSets||0]);
      });
    });
  });

  logSheet.autoResizeColumns(1, 12);
  summarySheet.autoResizeColumns(1, 8);
  return jsonResponse({ ok: true, added });
}

function deleteWorkoutInSheet(wid) {
  if (!wid) return jsonResponse({ ok: false, message: 'Missing ID' });
  const ss = getSpreadsheet_();
  
  let summarySheet = ss.getSheetByName(SHEET_NAME_SUMMARY);
  if (summarySheet) {
    const values = summarySheet.getDataRange().getValues();
    for (let i = values.length - 1; i >= 1; i--) {
      if (String(values[i][0]) === String(wid)) {
        summarySheet.deleteRow(i + 1);
      }
    }
  }
  
  let logSheet = ss.getSheetByName(SHEET_NAME_LOG);
  if (logSheet) {
    const values = logSheet.getDataRange().getValues();
    for (let i = values.length - 1; i >= 1; i--) {
      const rowId = String(values[i][0]);
      if (rowId === String(wid) || rowId.indexOf(wid + '-') === 0) {
        logSheet.deleteRow(i + 1);
      }
    }
  }
  return jsonResponse({ ok: true });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet_() {
  try { const ss = SpreadsheetApp.getActiveSpreadsheet(); if (ss) return ss; } catch(e) {}
  const props    = PropertiesService.getScriptProperties();
  const storedId = props.getProperty('SPREADSHEET_ID');
  if (storedId) { try { return SpreadsheetApp.openById(storedId); } catch(e) {} }
  const ss = SpreadsheetApp.create('Muscle Ladder Data');
  props.setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}

// ════════════════════════════════════════════════════════════════════════════
// GOOGLE HEALTH API v4 — server-side proxy with a HEALTH-ONLY OAuth token.
//
// Why not ScriptApp.getOAuthToken(): it ALWAYS carries this script's scopes
// (spreadsheets + script.external_request, needed for Sheets + UrlFetch), and
// the Health API rejects any token that mixes non-health scopes
// (403 DISALLOWED_OAUTH_SCOPES). So we mint a token via the apps-script-oauth2
// library against a dedicated GCP OAuth client that requests ONLY health scopes.
//
// One-time owner consent: open ?action=getFitbit → tap the returned authUrl →
// approve. The refresh token lands in Script Properties; the web app then serves
// the owner's biometrics to any caller (executeAs USER_DEPLOYING, access ANYONE).
//
// SETUP (owner, once):
//   1. Apps Script editor → Libraries → add  1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF  (identifier: OAuth2)
//   2. GCP console → Credentials → Create OAuth client → "Web application".
//      Authorized redirect URI = output of getHealthRedirectUri() (run it once).
//   3. Script Properties: GH_OAUTH_CLIENT_ID, GH_OAUTH_CLIENT_SECRET = that client's id/secret.
//   4. Redeploy the web app, then open ?action=getFitbit and complete the authUrl once.
// ════════════════════════════════════════════════════════════════════════════
const HEALTH_API        = 'https://health.googleapis.com/v4/users/me';
const SHEET_NAME_FITBIT = 'FitbitData';
const GH_OAUTH_SCOPES   = [
  'https://www.googleapis.com/auth/googlehealth.sleep.readonly',
  'https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly',
].join(' ');

function ghProp_(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }

// Health-only OAuth2 service (apps-script-oauth2 library, identifier "OAuth2").
function getHealthService_() {
  return OAuth2.createService('dcrHealth')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/v2/auth')
    .setTokenUrl('https://oauth2.googleapis.com/token')
    .setClientId(ghProp_('GH_OAUTH_CLIENT_ID'))
    .setClientSecret(ghProp_('GH_OAUTH_CLIENT_SECRET'))
    .setCallbackFunction('healthAuthCallback')
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setCache(CacheService.getScriptCache())
    .setScope(GH_OAUTH_SCOPES)
    .setParam('access_type', 'offline')
    .setParam('prompt', 'consent');
}

// OAuth2 redirect target (library handles /usercallback → this fn).
function healthAuthCallback(request) {
  const ok = getHealthService_().handleCallback(request);
  return HtmlService.createHtmlOutput(
    '<body style="font-family:-apple-system,sans-serif;padding:48px;text-align:center;background:#FAF7F2;color:#2A2421">' +
    (ok ? '<h2>&#10003; Google Health connected</h2><p>Close this tab and pull-to-refresh the DCR&nbsp;Gym AI tab.</p>'
        : '<h2>Authorization failed</h2><p>Reopen the AI tab and try again.</p>') + '</body>');
}

// Run ONCE from the editor; paste the logged URI into the GCP OAuth client.
function getHealthRedirectUri() { Logger.log(getHealthService_().getRedirectUri()); }

function healthHasAccess_() {
  try { return !!(ghProp_('GH_OAUTH_CLIENT_ID') && getHealthService_().hasAccess()); } catch (e) { return false; }
}

// Authenticated GET against the Health API with the health-only token.
function healthFetch_(path, params) {
  const service = getHealthService_();
  if (!service.hasAccess()) throw new Error('no-access');
  let url = HEALTH_API + path;
  if (params) {
    const qs = Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    url += (url.indexOf('?') >= 0 ? '&' : '?') + qs;
  }
  const res  = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + service.getAccessToken(), Accept: 'application/json' }, muteHttpExceptions: true });
  const code = res.getResponseCode();
  if (code >= 200 && code < 300) { try { return JSON.parse(res.getContentText() || '{}'); } catch (e) { return null; } }
  if (code === 401 || code === 403) { Logger.log('Health ' + path + ' → ' + code + ': ' + res.getContentText().slice(0, 220)); throw new Error('auth-' + code); }
  Logger.log('Health ' + path + ' → HTTP ' + code + ': ' + res.getContentText().slice(0, 220));
  return null;
}

// list method (verified v4 contract), following nextPageToken up to maxPages.
function healthList_(dataType, filter, pageSize, maxPages) {
  maxPages = maxPages || 1;
  let all = [], pageToken = '', pages = 0;
  do {
    const params = { pageSize: pageSize, filter: filter };
    if (pageToken) params.pageToken = pageToken;
    const r = healthFetch_('/dataTypes/' + dataType + '/dataPoints', params);
    if (r && r.dataPoints) all = all.concat(r.dataPoints);
    pageToken = (r && r.nextPageToken) || '';
    pages++;
  } while (pageToken && pages < maxPages);
  return all;
}

// ── Pure parsers (no GAS calls — unit-tested in Node) ───────────────────────
function healthDateKey_(d) {
  if (!d) return null;
  const dd = d.date || d;
  if (dd && dd.year) return Utilities.formatString('%04d-%02d-%02d', dd.year, dd.month || 1, dd.day || 1);
  return null;
}
function healthNum_(v) { if (v === null || v === undefined) return null; const n = typeof v === 'string' ? Number(v) : v; return (typeof n === 'number' && isFinite(n)) ? n : null; }

const HEALTH_NUM_KEYS  = ['bpm', 'beatsPerMinute', 'rmssd', 'milliseconds', 'averageHeartRateVariabilityMilliseconds', 'value', 'percentage', 'avg', 'average'];
const HEALTH_SKIP_KEYS = { interval: 1, sampleTime: 1, civilTime: 1, civilStartTime: 1, civilEndTime: 1, date: 1, time: 1, dataSource: 1, name: 1, createTime: 1, updateTime: 1, metadata: 1 };
function healthFirstNumber_(node, depth) {
  depth = depth || 0;
  if (node === null || node === undefined || depth > 4) return null;
  if (typeof node === 'number' && isFinite(node)) return node;
  if (typeof node === 'string' && node !== '' && isFinite(Number(node))) return Number(node);
  if (typeof node !== 'object') return null;
  for (let i = 0; i < HEALTH_NUM_KEYS.length; i++) { const k = HEALTH_NUM_KEYS[i]; if (node[k] !== undefined) { const v = healthFirstNumber_(node[k], depth + 1); if (v !== null) return v; } }
  for (const k in node) { if (HEALTH_SKIP_KEYS[k]) continue; const v = healthFirstNumber_(node[k], depth + 1); if (v !== null) return v; }
  return null;
}

function healthParseSleep_(pts) {
  const byDay = {};
  (pts || []).forEach(function (p) {
    const s = p.sleep; if (!s) return;
    if (s.metadata && s.metadata.nap) return;
    const day = healthDateKey_(s.interval && s.interval.civilEndTime) || (s.interval && s.interval.endTime ? String(s.interval.endTime).slice(0, 10) : null);
    if (!day) return;
    const sum = s.summary || {};
    const total = healthNum_(sum.minutesAsleep); if (!total) return;
    const period = healthNum_(sum.minutesInSleepPeriod);
    let deep = null, rem = null, light = null;
    (sum.stagesSummary || []).forEach(function (st) { const m = healthNum_(st.minutes); if (st.type === 'DEEP') deep = m; else if (st.type === 'REM') rem = m; else if (st.type === 'LIGHT') light = m; });
    const eff = (total && period) ? Math.round((total / period) * 100) : null;
    if (!byDay[day] || total > byDay[day]._rank) byDay[day] = { _rank: total, score: healthComputeSleepScore_(total, deep, rem, eff), deep: deep, rem: rem, light: light, total: total, eff: eff };
  });
  return byDay;
}
function healthParseDaily_(pts, camelField, valueFn) {
  const byDay = {};
  (pts || []).forEach(function (p) {
    const node = p[camelField]; if (!node) return;
    const day = healthDateKey_(node.date); if (!day) return;
    const v = valueFn(node);
    if (v !== null && byDay[day] === undefined) byDay[day] = Math.round(v * 10) / 10;
  });
  return byDay;
}

function computeReadiness_(rhr, hrv, sleepScore) {
  const pillars = [];
  if (sleepScore !== null && sleepScore !== undefined) pillars.push(['sleep quality', sleepScore]);
  if (hrv !== null && hrv !== undefined)               pillars.push(['hrv recovery', Math.min(100, Math.round((hrv / 80) * 100))]);
  if (rhr !== null && rhr !== undefined)               pillars.push(['resting heart rate', Math.max(0, Math.round(100 - (rhr - 45)))]);
  if (!pillars.length) return { score: null, factor: null };
  const avg = Math.round(pillars.reduce(function (s, p) { return s + p[1]; }, 0) / pillars.length);
  return { score: Math.max(0, Math.min(100, avg)), factor: pillars.sort(function (a, b) { return a[1] - b[1]; })[0][0] };
}
function healthComputeSleepScore_(totalMins, deepMins, remMins, efficiency) {
  if (!totalMins || totalMins < 90) return null;
  const durScore  = totalMins < 300 ? (totalMins / 300) * 40 : totalMins < 420 ? 40 + ((totalMins - 300) / 120) * 30 : totalMins <= 540 ? 70 + ((totalMins - 420) / 120) * 25 : 95 - ((totalMins - 540) / 60) * 5;
  const deepScore = deepMins ? Math.min(100, (deepMins / totalMins) * 100 / 0.18) : 40;
  const remScore  = remMins  ? Math.min(100, (remMins / totalMins) * 100 / 0.20)  : 40;
  const effScore  = efficiency ? Math.min(100, efficiency) : 80;
  return Math.max(0, Math.min(100, Math.round(Math.min(durScore, 95) * 0.35 + deepScore * 0.30 + remScore * 0.20 + effScore * 0.15)));
}

// Assemble 30-day trailing arrays + last-known snapshot. dateFmt(daysAgo)→'YYYY-MM-DD'.
function healthAssemble_(today, dateFmt, sleepByDay, rhrByDay, hrvByDay, spo2ByDay, DAYS) {
  DAYS = DAYS || 30;
  const tReadiness = [], tSleep = [], tHRV = [], tRHR = [], tDates = [];
  let any = false;
  for (let i = DAYS - 1; i >= 0; i--) {
    const ds  = dateFmt(i);
    const slp = sleepByDay[ds] || {};
    const rhr = (rhrByDay[ds] === undefined) ? null : rhrByDay[ds];
    const hrv = (hrvByDay[ds] === undefined) ? null : hrvByDay[ds];
    const rd  = computeReadiness_(rhr, hrv, slp.score != null ? slp.score : null);
    tDates.push(ds); tReadiness.push(rd.score); tSleep.push(slp.score != null ? slp.score : null); tHRV.push(hrv); tRHR.push(rhr);
    if (rd.score != null || slp.score != null || hrv != null || rhr != null) any = true;
  }
  let idx = -1;
  for (let j = tDates.length - 1; j >= 0; j--) { if (tReadiness[j] != null || tSleep[j] != null || tHRV[j] != null || tRHR[j] != null) { idx = j; break; } }
  const asOf = idx >= 0 ? tDates[idx] : null;
  const cd   = asOf ? (sleepByDay[asOf] || {}) : {};
  const cRhr = asOf ? ((rhrByDay[asOf] === undefined) ? null : rhrByDay[asOf]) : null;
  const cHrv = asOf ? ((hrvByDay[asOf] === undefined) ? null : hrvByDay[asOf]) : null;
  const readiness = computeReadiness_(cRhr, cHrv, cd.score != null ? cd.score : null);
  return {
    readinessScore: readiness.score, readinessFactor: readiness.factor,
    sleepScore: cd.score != null ? cd.score : null, restingHR: cRhr, hrv: cHrv,
    spo2: asOf ? ((spo2ByDay[asOf] === undefined) ? null : spo2ByDay[asOf]) : null,
    deepSleepMinutes: cd.deep != null ? cd.deep : null, remSleepMinutes: cd.rem != null ? cd.rem : null, lightSleepMinutes: cd.light != null ? cd.light : null,
    sleepEfficiency: cd.eff != null ? cd.eff : null,
    asOf: asOf, fetchedAt: today,
    trailingReadiness: tReadiness, trailingSleep: tSleep, trailingHRV: tHRV, trailingRHR: tRHR, trailingDates: tDates,
    source: 'google-health-api', _any: any,
  };
}

// ── Main GET endpoint (action=getFitbit — name kept for client compat) ──────
function fitbitGetLatestData() {
  let authUrl = '';
  try { authUrl = getHealthService_().getAuthorizationUrl(); } catch (e) { authUrl = ScriptApp.getService().getUrl() + '?action=fitbitAuth'; }

  if (!healthHasAccess_()) {
    const cachedNA = healthGetCached_();
    if (cachedNA) return jsonResponse({ ok: true, connected: true, cached: true, stale: true, fitbit: cachedNA });
    return jsonResponse({ ok: true, connected: false, authUrl: authUrl, reason: 'unauthorized' });
  }

  try {
    const cache = CacheService.getScriptCache();
    const memo  = cache.get('dcr_health_payload');
    if (memo) return jsonResponse({ ok: true, connected: true, cached: 'memo', fitbit: JSON.parse(memo) });

    const tz       = Session.getScriptTimeZone();
    const today    = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    const monthAgo = Utilities.formatDate(new Date(Date.now() - 31 * 86400000), tz, 'yyyy-MM-dd');
    const dateFmt  = function (daysAgo) { const d = new Date(today + 'T12:00:00'); d.setDate(d.getDate() - daysAgo); return Utilities.formatDate(d, tz, 'yyyy-MM-dd'); };

    const sleepByDay = healthParseSleep_(healthList_('sleep', 'sleep.interval.civil_end_time >= "' + monthAgo + '"', 25, 2));
    const rhrByDay   = healthParseDaily_(healthList_('daily-resting-heart-rate',     'dailyRestingHeartRate.date >= "'     + monthAgo + '"', 60, 1), 'dailyRestingHeartRate',     function (n) { return healthNum_(n.beatsPerMinute); });
    const hrvByDay   = healthParseDaily_(healthList_('daily-heart-rate-variability', 'dailyHeartRateVariability.date >= "' + monthAgo + '"', 60, 1), 'dailyHeartRateVariability', function (n) { return healthNum_(n.averageHeartRateVariabilityMilliseconds); });
    const spo2ByDay  = healthParseDaily_(healthList_('daily-oxygen-saturation',      'dailyOxygenSaturation.date >= "'     + monthAgo + '"', 60, 1), 'dailyOxygenSaturation',     function (n) { return healthFirstNumber_(n, 0); });

    const payload = healthAssemble_(today, dateFmt, sleepByDay, rhrByDay, hrvByDay, spo2ByDay, 30);

    if (!payload._any) {
      const cached = healthGetCached_();
      if (cached) return jsonResponse({ ok: true, connected: true, cached: true, stale: true, fitbit: cached });
      return jsonResponse({ ok: true, connected: false, authUrl: authUrl, reason: 'no-data' });
    }
    delete payload._any;
    healthCacheToSheet_(payload);
    try { cache.put('dcr_health_payload', JSON.stringify(payload), 1800); } catch (e) {}
    return jsonResponse({ ok: true, connected: true, fitbit: payload });

  } catch (err) {
    Logger.log('fitbitGetLatestData error: ' + err.message);
    if (String(err.message).indexOf('auth') === 0) {
      try { getHealthService_().reset(); } catch (e) {}
      return jsonResponse({ ok: true, connected: false, authUrl: authUrl, reason: 'reauth' });
    }
    try { const cached = healthGetCached_(); if (cached) return jsonResponse({ ok: true, connected: true, cached: true, stale: true, fitbit: cached }); } catch (e2) {}
    return jsonResponse({ ok: true, connected: false, authUrl: authUrl, reason: 'error' });
  }
}

// Landing page that links to the OAuth consent (owner taps once).
function fitbitStartAuth_() {
  let url = '';
  try { url = getHealthService_().getAuthorizationUrl(); } catch (e) {}
  if (!url) return HtmlService.createHtmlOutput('<body style="font-family:-apple-system,sans-serif;padding:40px">OAuth client not configured. Set GH_OAUTH_CLIENT_ID / GH_OAUTH_CLIENT_SECRET in Script Properties.</body>');
  return HtmlService.createHtmlOutput(
    '<body style="font-family:-apple-system,sans-serif;padding:48px;text-align:center;background:#FAF7F2;color:#2A2421">' +
    '<h2>DCR Gym · Connect Google Health</h2><p>One-time approval for the script owner\'s account.</p>' +
    '<p><a href="' + url + '" target="_blank" rel="noopener" style="display:inline-block;padding:12px 26px;background:#2A2421;color:#fff;border-radius:24px;text-decoration:none">Authorize &rarr;</a></p></body>');
}

function fitbitStatus_() {
  return jsonResponse({ ok: true, connected: healthHasAccess_(), api: 'google-health-v4', clientConfigured: !!ghProp_('GH_OAUTH_CLIENT_ID') });
}

// ── Sheet cache (stale fallback) ────────────────────────────────────────────
function healthCacheToSheet_(payload) {
  try {
    const ss = getSpreadsheet_();
    let sheet = ss.getSheetByName(SHEET_NAME_FITBIT);
    if (!sheet) { sheet = ss.insertSheet(SHEET_NAME_FITBIT); sheet.appendRow(['Date', 'Readiness', 'ReadinessFactor', 'Sleep', 'RHR', 'HRV', 'DeepMin', 'RemMin', 'LightMin', 'SleepEff', 'SpO2', 'CachedAt']); sheet.setFrozenRows(1); }
    const data = sheet.getDataRange().getValues();
    const idx  = data.slice(1).findIndex(function (r) { return r[0] === payload.fetchedAt; });
    const row  = [payload.fetchedAt, payload.readinessScore, payload.readinessFactor || '', payload.sleepScore, payload.restingHR, payload.hrv, payload.deepSleepMinutes, payload.remSleepMinutes, payload.lightSleepMinutes, payload.sleepEfficiency, payload.spo2, new Date().toLocaleString()];
    if (idx >= 0) sheet.getRange(idx + 2, 1, 1, row.length).setValues([row]);
    else          sheet.appendRow(row);
  } catch (e) { Logger.log('healthCacheToSheet_ error: ' + e.message); }
}

function healthGetCached_() {
  try {
    const ss = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEET_NAME_FITBIT);
    if (!sheet || sheet.getLastRow() < 2) return null;
    const last = sheet.getRange(sheet.getLastRow(), 1, 1, 11).getValues()[0];
    if (last[1] === '' && last[3] === '' && last[4] === '' && last[5] === '') return null;  // all-null cache → treat as none
    return {
      fetchedAt: last[0], asOf: last[0],
      readinessScore: last[1] || null, readinessFactor: last[2] || null, sleepScore: last[3] || null,
      restingHR: last[4] || null, hrv: last[5] || null, deepSleepMinutes: last[6] || null,
      remSleepMinutes: last[7] || null, lightSleepMinutes: last[8] || null, sleepEfficiency: last[9] || null, spo2: last[10] || null,
      trailingReadiness: [], trailingSleep: [], trailingHRV: [], trailingRHR: [], trailingDates: [], source: 'google-health-cache',
    };
  } catch (e) { return null; }
}
