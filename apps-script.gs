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
    const json    = stateSheet.getRange(2, 1).getValue();
    const ts      = stateSheet.getRange(2, 2).getValue();
    const history = json ? JSON.parse(json) : [];
    return jsonResponse({ ok: true, history, ts: ts || 0 });
  } catch(e) {
    return jsonResponse({ ok: true, history: [], ts: 0 });
  }
}

function saveState(history, ts) {
  const ss = getSpreadsheet_();
  let stateSheet = ss.getSheetByName(SHEET_NAME_STATE);
  if (!stateSheet) {
    stateSheet = ss.insertSheet(SHEET_NAME_STATE);
    stateSheet.appendRow(['History JSON', 'Timestamp', 'Updated']);
    stateSheet.setFrozenRows(1);
    stateSheet.getRange(1,1,1,3).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }
  stateSheet.getRange(2, 1).setValue(JSON.stringify(history));
  stateSheet.getRange(2, 2).setValue(ts || Date.now());
  stateSheet.getRange(2, 3).setValue(new Date().toLocaleString());
  return jsonResponse({ ok: true });
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

  const existingLogIds     = new Set(logSheet.getDataRange().getValues().slice(1).map(r => r[0]));
  const existingSummaryIds = new Set(summarySheet.getDataRange().getValues().slice(1).map(r => r[0]));

  let added = 0;
  workouts.forEach(w => {
    const wid     = w.id || (w.date + '-' + w.sessionName);
    const dateStr = new Date(w.date).toLocaleDateString('en-US');

    if (!existingSummaryIds.has(wid)) {
      summarySheet.appendRow([wid, dateStr, w.programName||'', w.sessionName||'', w.duration||'', w.totalVolume||0, w.totalSets||0, (w.exercises||[]).map(e=>e.name).join(', ')]);
      added++;
    }

    (w.exercises||[]).forEach(ex => {
      (ex.sets||[]).forEach((s, i) => {
        const rowId = wid + '-' + ex.name + '-' + i;
        if (!existingLogIds.has(rowId)) {
          const setVol = (parseFloat(s.weight)||0) * (parseInt(s.reps)||0);
          logSheet.appendRow([rowId, dateStr, w.programName||'', w.sessionName||'', ex.name, i+1, s.weight||'', s.reps||'', setVol, w.duration||'', w.totalVolume||0, w.totalSets||0]);
        }
      });
    });
  });

  logSheet.autoResizeColumns(1, 12);
  summarySheet.autoResizeColumns(1, 8);
  return jsonResponse({ ok: true, added });
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

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║              GOOGLE HEALTH API MODULE  (v4 — successor to Fitbit Web API)║
// ║  Base: https://health.googleapis.com/v4/users/me                        ║
// ║  Serves Fitbit Air + Google Health app data via Google OAuth.           ║
// ║  ScriptApp.getOAuthToken() carries the googlehealth.* scopes declared   ║
// ║  in appsscript.json — no client secret, no refresh-token dance.         ║
// ║                                                                          ║
// ║  ONE-TIME SETUP (≈10 min, do ONCE):                                     ║
// ║   1. console.cloud.google.com → create project "dcr-gym-health"         ║
// ║      → APIs & Services → Enable "Google Health API"                     ║
// ║      → OAuth consent screen → External → add yourself as test user      ║
// ║   2. Apps Script editor → Project Settings → change GCP project to      ║
// ║      that project's NUMBER                                              ║
// ║   3. Paste this file + the updated appsscript.json (Show manifest)      ║
// ║   4. Run authorizeHealthAPI → approve the consent prompt                ║
// ║      → check the log says HTTP 200                                      ║
// ║   5. Deploy → Manage deployments → Edit → New version                   ║
// ║      (URL stays the same — the app keeps working untouched)             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const HEALTH_API        = 'https://health.googleapis.com/v4/users/me';
const SHEET_NAME_FITBIT = 'FitbitData';

// Run this ONCE from the editor to trigger the Google Health scope consent.
function authorizeHealthAPI() {
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const data  = healthFetch_('/dataTypes/sleep/dataPoints:reconcile', {
    dataSourceFamily: 'users/me/dataSourceFamilies/google-wearables',
    filter: 'sleep.interval.civil_end_time >= "' + healthPrevDay_(today) + '"',
  });
  Logger.log(data ? 'Auth OK — Health API reachable. Sample: ' + JSON.stringify(data).slice(0, 300)
                  : 'Auth test FAILED — check GCP project link, API enablement, and scopes.');
}

// ── Generic authenticated GET against the Health API ─────────────────────────
function healthFetch_(path, params) {
  const token = ScriptApp.getOAuthToken();
  let url = HEALTH_API + path;
  if (params) {
    const qs = Object.keys(params)
      .map(function(k) { return k + '=' + encodeURIComponent(params[k]); })
      .join('&');
    url += (url.indexOf('?') >= 0 ? '&' : '?') + qs;
  }
  const res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  if (code >= 200 && code < 300) {
    try { return JSON.parse(res.getContentText() || '{}'); } catch(e) { return null; }
  }
  Logger.log('Health API ' + path + ' → HTTP ' + code + ': ' + res.getContentText().slice(0, 280));
  return null;
}

// ── Main GET endpoint (action=getFitbit — name kept for client compat) ──────
function fitbitGetLatestData() {
  const authUrl = ScriptApp.getService().getUrl() + '?action=fitbitAuth';
  try {
    // 30-min memo cache — app opens stay instant, API stays unhammered
    const cache = CacheService.getScriptCache();
    const memo  = cache.get('dcr_health_payload');
    if (memo) return jsonResponse({ ok: true, connected: true, cached: 'memo', fitbit: JSON.parse(memo) });

    const tz    = Session.getScriptTimeZone();
    const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

    const sleep = healthSleepFor_(today);
    const rhr   = healthDailyValue_('daily-resting-heart-rate', today);
    const hrv   = healthDailyValue_('daily-heart-rate-variability', today);
    const spo2  = healthDailyValue_('daily-oxygen-saturation', today);

    // If every single signal is empty the account likely isn't authorized —
    // fall through to the cached copy / reconnect path rather than serving voids.
    const allEmpty = sleep.score === null && rhr === null && hrv === null;

    const trailing  = healthBuildTrailing_(today, 7);
    const readiness = computeReadiness_(rhr, hrv, sleep.score);

    const payload = {
      readinessScore:    readiness.score,
      readinessFactor:   readiness.factor,
      sleepScore:        sleep.score,
      restingHR:         rhr,
      hrv:               hrv,
      spo2:              spo2,
      deepSleepMinutes:  sleep.deepMinutes,
      remSleepMinutes:   sleep.remMinutes,
      lightSleepMinutes: sleep.lightMinutes,
      fetchedAt:         today,
      trailingReadiness: trailing.readiness,
      trailingSleep:     trailing.sleep,
      trailingHRV:       trailing.hrv,
      source:            'google-health-api',
    };

    if (allEmpty) {
      const cached = healthGetCached_();
      if (cached) return jsonResponse({ ok: true, connected: true, cached: true, stale: true, fitbit: cached });
      return jsonResponse({ ok: true, connected: false, authUrl: authUrl, reason: 'no-data' });
    }

    healthCacheToSheet_(payload);
    try { cache.put('dcr_health_payload', JSON.stringify(payload), 1800); } catch(e) {}
    return jsonResponse({ ok: true, connected: true, fitbit: payload });

  } catch(err) {
    Logger.log('fitbitGetLatestData error: ' + err.message);
    try {
      const cached = healthGetCached_();
      if (cached) return jsonResponse({ ok: true, connected: true, cached: true, stale: true, fitbit: cached });
    } catch(e2) {}
    return jsonResponse({ ok: true, connected: false, authUrl: authUrl, reason: 'error' });
  }
}

function fitbitStartAuth_() {
  return HtmlService.createHtmlOutput(
    '<body style="font-family:-apple-system,sans-serif;padding:48px;text-align:center;background:#FAF7F2;color:#2A2421">' +
    '<h2>DCR Gym · Google Health API</h2>' +
    '<p>Biometrics are authorized through the script owner\'s Google account.<br>' +
    'If data is missing: open the Apps Script editor → run <b>authorizeHealthAPI</b> → approve → redeploy.<br><br>' +
    'Then return to DCR Gym and pull down on the AI tab.</p>' +
    '</body>'
  );
}

function fitbitStatus_() {
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const rhr   = healthDailyValue_('daily-resting-heart-rate', today);
  const sleep = healthSleepFor_(today);
  return jsonResponse({ ok: true, connected: rhr !== null || sleep.score !== null, api: 'google-health-v4' });
}

// ── Sleep — reconciled wearable stream, main sleep ending today ──────────────
function healthSleepFor_(dateStr) {
  const empty = { score: null, deepMinutes: null, remMinutes: null, lightMinutes: null, totalMinutes: null };
  try {
    const data = healthFetch_('/dataTypes/sleep/dataPoints:reconcile', {
      dataSourceFamily: 'users/me/dataSourceFamilies/google-wearables',
      filter: 'sleep.interval.civil_end_time >= "' + dateStr + '"',
    });
    const pts = (data && data.dataPoints) || [];
    if (!pts.length) return empty;

    // Prefer the MAIN sleep whose end date == dateStr; else longest available
    let best = null, bestMins = -1;
    pts.forEach(function(p) {
      const s = p.sleep || {};
      const sum = s.summary || {};
      const mins = parseInt(sum.minutesAsleep || 0, 10);
      const endsToday = (s.interval && String(s.interval.endTime || '').slice(0, 10) === dateStr)
        || (s.interval && s.interval.civilEndTime && s.interval.civilEndTime.date &&
            Utilities.formatString('%04d-%02d-%02d',
              s.interval.civilEndTime.date.year, s.interval.civilEndTime.date.month, s.interval.civilEndTime.date.day) === dateStr);
      const main = s.metadata && s.metadata.main;
      const rank = (endsToday ? 100000 : 0) + (main ? 10000 : 0) + mins;
      if (rank > bestMins) { bestMins = rank; best = s; }
    });
    if (!best || !best.summary) return empty;

    const sum   = best.summary;
    const total = parseInt(sum.minutesAsleep || 0, 10) || null;
    let deep = null, rem = null, light = null;
    (sum.stagesSummary || []).forEach(function(st) {
      const m = parseInt(st.minutes || 0, 10);
      if (st.type === 'DEEP')  deep  = m;
      if (st.type === 'REM')   rem   = m;
      if (st.type === 'LIGHT') light = m;
    });
    const period = parseInt(sum.minutesInSleepPeriod || 0, 10);
    const eff    = (total && period) ? Math.round((total / period) * 100) : null;
    const score  = healthComputeSleepScore_(total, deep, rem, eff);
    return { score: score, deepMinutes: deep, remMinutes: rem, lightMinutes: light, totalMinutes: total };
  } catch(e) {
    Logger.log('healthSleepFor_ error: ' + e.message);
    return empty;
  }
}

// ── Generic daily metric — tolerant numeric extraction ───────────────────────
// Lists dataPoints for a daily-* data type around dateStr and deep-scans the
// payload for the first plausible numeric reading. Survives shape drift in the
// young API; logs misses instead of guessing.
function healthDailyValue_(dataType, dateStr) {
  try {
    const snake = dataType.replace(/-/g, '_');
    let data = healthFetch_('/dataTypes/' + dataType + '/dataPoints', {
      filter: snake + '.sample_time.civil_time >= "' + dateStr + 'T00:00:00"',
      page_size: 8,
    });
    if (!data || !(data.dataPoints || []).length) {
      // Some daily types are interval-based — retry with interval filter
      data = healthFetch_('/dataTypes/' + dataType + '/dataPoints', {
        filter: snake + '.interval.civil_start_time >= "' + dateStr + 'T00:00:00"',
        page_size: 8,
      });
    }
    const pts = (data && data.dataPoints) || [];
    if (!pts.length) return null;

    const camel = dataType.replace(/-([a-z])/g, function(_, c) { return c.toUpperCase(); });
    for (let i = 0; i < pts.length; i++) {
      const node = pts[i][camel] || pts[i];
      const v = healthFirstNumber_(node, 0);
      if (v !== null) return Math.round(v * 10) / 10;
    }
    return null;
  } catch(e) {
    Logger.log('healthDailyValue_(' + dataType + ') error: ' + e.message);
    return null;
  }
}

const HEALTH_NUM_KEYS  = ['bpm', 'beatsPerMinute', 'rmssd', 'milliseconds', 'dailyRmssd', 'value', 'percentage', 'avg', 'average'];
const HEALTH_SKIP_KEYS = { interval: 1, sampleTime: 1, civilTime: 1, civilStartTime: 1, civilEndTime: 1, date: 1, time: 1, dataSource: 1, name: 1, createTime: 1, updateTime: 1, metadata: 1 };

function healthFirstNumber_(node, depth) {
  if (node === null || node === undefined || depth > 4) return null;
  if (typeof node === 'number' && isFinite(node)) return node;
  if (typeof node === 'string' && node !== '' && isFinite(Number(node))) return Number(node);
  if (typeof node !== 'object') return null;
  // Preferred keys first
  for (let i = 0; i < HEALTH_NUM_KEYS.length; i++) {
    const k = HEALTH_NUM_KEYS[i];
    if (node[k] !== undefined) {
      const v = healthFirstNumber_(node[k], depth + 1);
      if (v !== null) return v;
    }
  }
  // Then any non-structural key
  for (const k in node) {
    if (HEALTH_SKIP_KEYS[k]) continue;
    const v = healthFirstNumber_(node[k], depth + 1);
    if (v !== null) return v;
  }
  return null;
}

// ── 7-day trailing arrays for the AI tab sparklines ──────────────────────────
function healthBuildTrailing_(todayStr, days) {
  const readiness = [], sleep = [], hrv = [];
  const tz  = Session.getScriptTimeZone();
  const end = new Date(todayStr + 'T12:00:00');
  for (let i = days - 1; i >= 0; i--) {
    const d  = new Date(end); d.setDate(d.getDate() - i);
    const ds = Utilities.formatDate(d, tz, 'yyyy-MM-dd');
    const slp = healthSleepFor_(ds);
    const r   = healthDailyValue_('daily-resting-heart-rate', ds);
    const h   = healthDailyValue_('daily-heart-rate-variability', ds);
    const rd  = computeReadiness_(r, h, slp.score);
    readiness.push(rd.score);
    sleep.push(slp.score);
    hrv.push(h);
  }
  return { readiness: readiness, sleep: sleep, hrv: hrv };
}

// ── Readiness score ───────────────────────────────────────────────────────────
function computeReadiness_(rhr, hrv, sleepScore) {
  const pillars = [];
  if (sleepScore !== null) pillars.push(['sleep quality',      sleepScore]);
  if (hrv        !== null) pillars.push(['hrv recovery',       Math.min(100, Math.round((hrv / 80) * 100))]);
  if (rhr        !== null) pillars.push(['resting heart rate', Math.max(0,   Math.round(100 - (rhr - 45)))]);
  if (!pillars.length) return { score: null, factor: null };

  const avg    = Math.round(pillars.reduce((s,p) => s + p[1], 0) / pillars.length);
  const score  = Math.max(0, Math.min(100, avg));
  const factor = pillars.sort((a,b) => a[1]-b[1])[0][0];
  return { score, factor };
}

// ── Sleep score (0–100 estimate) ─────────────────────────────────────────────
function healthComputeSleepScore_(totalMins, deepMins, remMins, efficiency) {
  if (!totalMins || totalMins < 90) return null;
  const durScore  = totalMins < 300 ? (totalMins/300)*40 : totalMins < 420 ? 40+((totalMins-300)/120)*30 : totalMins <= 540 ? 70+((totalMins-420)/120)*25 : 95-((totalMins-540)/60)*5;
  const deepScore = deepMins ? Math.min(100, (deepMins/totalMins)*100/0.18) : 40;
  const remScore  = remMins  ? Math.min(100, (remMins/totalMins)*100/0.20)  : 40;
  const effScore  = efficiency ? Math.min(100, efficiency) : 80;
  return Math.max(0, Math.min(100, Math.round(Math.min(durScore,95)*0.35 + deepScore*0.30 + remScore*0.20 + effScore*0.15)));
}

// ── Sheet cache ───────────────────────────────────────────────────────────────
function healthCacheToSheet_(payload) {
  try {
    const ss = getSpreadsheet_();
    let sheet = ss.getSheetByName(SHEET_NAME_FITBIT);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_FITBIT);
      sheet.appendRow(['Date','Readiness','ReadinessFactor','Sleep','RHR','HRV','DeepMin','CachedAt']);
      sheet.setFrozenRows(1);
    }
    const data = sheet.getDataRange().getValues();
    const idx  = data.slice(1).findIndex(r => r[0] === payload.fetchedAt);
    const row  = [payload.fetchedAt, payload.readinessScore, payload.readinessFactor||'', payload.sleepScore, payload.restingHR, payload.hrv, payload.deepSleepMinutes, new Date().toLocaleString()];
    if (idx >= 0) sheet.getRange(idx+2, 1, 1, row.length).setValues([row]);
    else          sheet.appendRow(row);
  } catch(e) { Logger.log('healthCacheToSheet_ error: ' + e.message); }
}

function healthGetCached_() {
  try {
    const ss    = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEET_NAME_FITBIT);
    if (!sheet || sheet.getLastRow() < 2) return null;
    const last = sheet.getRange(sheet.getLastRow(), 1, 1, 7).getValues()[0];
    return { fetchedAt: last[0], readinessScore: last[1]||null, readinessFactor: last[2]||null, sleepScore: last[3]||null, restingHR: last[4]||null, hrv: last[5]||null, deepSleepMinutes: last[6]||null, trailingReadiness: [], trailingSleep: [], trailingHRV: [] };
  } catch(e) { return null; }
}

function healthNextDay_(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z'); d.setDate(d.getDate()+1); return Utilities.formatDate(d,'UTC','yyyy-MM-dd');
}

function healthPrevDay_(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z'); d.setDate(d.getDate()-1); return Utilities.formatDate(d,'UTC','yyyy-MM-dd');
}
