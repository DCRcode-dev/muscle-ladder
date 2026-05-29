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
// ║              GOOGLE FIT API MODULE                                      ║
// ║  Uses fitness.googleapis.com — valid consumer Google account scopes.   ║
// ║  No CLIENT_ID/SECRET needed. ScriptApp.getOAuthToken() handles auth.   ║
// ║                                                                          ║
// ║  ONE-TIME SETUP (do this ONCE from the Apps Script editor):             ║
// ║   1. Run authorizeHealthAPI → approve the Google Fit access prompt      ║
// ║   2. Deploy → New deployment (Execute as: Me, Anyone) → copy URL       ║
// ║   3. Update BACKEND_URL in index.html with the new URL                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const FIT_API         = 'https://www.googleapis.com/fitness/v1/users/me';
const SHEET_NAME_FITBIT = 'FitbitData';

// Run this ONCE from the editor to trigger the Google Fit scope authorization.
function authorizeHealthAPI() {
  const token = ScriptApp.getOAuthToken();
  const now   = Date.now();
  const url   = FIT_API + '/dataset:aggregate';
  const body  = JSON.stringify({
    aggregateBy: [{ dataTypeName: 'com.google.heart_rate.bpm' }],
    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: now - 86400000,
    endTimeMillis:   now
  });
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: body,
    muteHttpExceptions: true
  });
  Logger.log('Auth test — HTTP ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 300));
}

// ── Main GET endpoint ─────────────────────────────────────────────────────────
function fitbitGetLatestData() {
  const authUrl = ScriptApp.getService().getUrl() + '?action=fitbitAuth';
  try {
    const token = ScriptApp.getOAuthToken();
    const tz    = Session.getScriptTimeZone();
    const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

    const rhr     = fitFetchRHR_(token, today);
    const sleep   = fitFetchSleep_(token, today);
    const trailing = fitBuildTrailing_(token, today, 7);
    const readiness = computeReadiness_(rhr, null, sleep.score);

    const payload = {
      readinessScore:    readiness.score,
      readinessFactor:   readiness.factor,
      sleepScore:        sleep.score,
      restingHR:         rhr,
      hrv:               null,
      deepSleepMinutes:  sleep.deepMinutes,
      fetchedAt:         today,
      trailingReadiness: trailing.readiness,
      trailingSleep:     trailing.sleep,
      trailingHRV:       trailing.hrv
    };

    healthCacheToSheet_(payload);
    return jsonResponse({ ok: true, connected: true, fitbit: payload });

  } catch(err) {
    Logger.log('fitbitGetLatestData error: ' + err.message);
    try {
      const cached = healthGetCached_();
      if (cached) return jsonResponse({ ok: true, connected: true, cached: true, fitbit: cached });
    } catch(e2) {}
    return jsonResponse({ ok: true, connected: false, authUrl: authUrl });
  }
}

function fitbitStartAuth_() {
  return HtmlService.createHtmlOutput(
    '<body style="font-family:-apple-system,sans-serif;padding:48px;text-align:center;background:#FAF7F2">' +
    '<h2>✅ Google Fit API is active</h2>' +
    '<p>Your health data is authorized via your Google account.<br>Return to DCR Gym and refresh the Analysis tab.</p>' +
    '</body>'
  );
}

function fitbitStatus_() {
  return jsonResponse({ ok: true, connected: true });
}

// ── Google Fit API fetchers ───────────────────────────────────────────────────
function fitAggregate_(token, dataTypeName, startMs, endMs) {
  const body = JSON.stringify({
    aggregateBy: [{ dataTypeName }],
    bucketByTime: { durationMillis: endMs - startMs },
    startTimeMillis: startMs,
    endTimeMillis:   endMs
  });
  const res  = UrlFetchApp.fetch(FIT_API + '/dataset:aggregate', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: body,
    muteHttpExceptions: true
  });
  const code = res.getResponseCode();
  if (code !== 200) { Logger.log('fitAggregate_ ' + dataTypeName + ' HTTP ' + code + ': ' + res.getContentText().slice(0,200)); return null; }
  return JSON.parse(res.getContentText());
}

function fitFetchRHR_(token, dateStr) {
  try {
    const d    = new Date(dateStr + 'T00:00:00');
    const sMs  = d.getTime();
    const eMs  = sMs + 86400000;
    const data = fitAggregate_(token, 'com.google.heart_rate.bpm', sMs, eMs);
    if (!data || !data.bucket || !data.bucket.length) return null;
    const pts  = data.bucket[0].dataset && data.bucket[0].dataset[0] && data.bucket[0].dataset[0].point || [];
    if (!pts.length) return null;
    // Use minimum HR as RHR approximation
    const vals = pts.map(p => p.value && p.value[0] && p.value[0].fpVal).filter(Boolean);
    return vals.length ? Math.round(Math.min(...vals)) : null;
  } catch(e) { Logger.log('fitFetchRHR_ error: ' + e.message); return null; }
}

function fitFetchSleep_(token, dateStr) {
  try {
    // Sleep session that ended on dateStr (started previous evening)
    const d    = new Date(dateStr + 'T00:00:00');
    const eMs  = d.getTime() + 14 * 3600000;      // up to 2pm today
    const sMs  = d.getTime() - 8 * 3600000;        // from 4pm yesterday
    const data = fitAggregate_(token, 'com.google.sleep.segment', sMs, eMs);
    if (!data || !data.bucket || !data.bucket.length) return { score: null, deepMinutes: null };

    const pts = data.bucket[0].dataset && data.bucket[0].dataset[0] && data.bucket[0].dataset[0].point || [];
    if (!pts.length) return { score: null, deepMinutes: null };

    let totalMs = 0, deepMs = 0, remMs = 0;
    pts.forEach(p => {
      const dur  = parseInt(p.endTimeNanos || 0) / 1e6 - parseInt(p.startTimeNanos || 0) / 1e6;
      const type = p.value && p.value[0] && p.value[0].intVal;
      totalMs += dur;
      if (type === 4) deepMs += dur; // DEEP = 4
      if (type === 5) remMs  += dur; // REM  = 5
    });

    const totalMins = Math.round(totalMs / 60000);
    const deepMins  = deepMs  ? Math.round(deepMs  / 60000) : null;
    const remMins   = remMs   ? Math.round(remMs   / 60000) : null;
    const score     = healthComputeSleepScore_(totalMins, deepMins, remMins, null);
    return { score, deepMinutes: deepMins };
  } catch(e) { Logger.log('fitFetchSleep_ error: ' + e.message); return { score: null, deepMinutes: null }; }
}

function fitBuildTrailing_(token, todayStr, days) {
  const readiness = [], sleep = [], hrv = [];
  const end   = new Date(todayStr + 'T12:00:00');
  for (let i = days - 1; i >= 0; i--) {
    const d   = new Date(end); d.setDate(d.getDate() - i);
    const ds  = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const slp = fitFetchSleep_(token, ds);
    const r   = fitFetchRHR_(token, ds);
    const rd  = computeReadiness_(r, null, slp.score);
    readiness.push(rd.score);
    sleep.push(slp.score);
    hrv.push(null);
  }
  return { readiness, sleep, hrv };
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
