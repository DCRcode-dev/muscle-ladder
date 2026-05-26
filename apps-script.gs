// ============================================================
// MUSCLE LADDER — Google Apps Script Backend
// Deploy as: Web App → Execute as: Me → Who has access: Anyone
// ============================================================

const SHEET_NAME_LOG     = "WorkoutLog";
const SHEET_NAME_SUMMARY = "WorkoutSummary";
const SHEET_NAME_STATE   = "AppState";

function doGet(e) {
  const action = e && e.parameter && e.parameter.action;
  if (action === 'ping') {
    return jsonResponse({ ok: true, message: 'Muscle Ladder backend connected!' });
  }
  if (action === 'pullState') {
    return pullState();
  }
  // ── GOOGLE FIT MODULE routes ──────────────────────────────
  if (action === 'getFitbit') {
    return fitbitGetLatestData();
  }
  if (action === 'fitbitAuth') {
    // Legacy route kept for backwards compat — now just a connectivity test
    return jsonResponse({ ok: true, message: 'Google Fit uses native Apps Script OAuth — no setup needed. Visit ?action=getFitbit to test.' });
  }
  return jsonResponse({ ok: false, message: 'Unknown action' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === 'syncWorkouts') {
      return syncWorkouts(body.workouts || []);
    }
    if (action === 'saveState') {
      return saveState(body.history || [], body.ts || 0);
    }

    return jsonResponse({ ok: false, message: 'Unknown action: ' + action });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// ── STATE BLOB (bidirectional sync) ───────────────────────────
function pullState() {
  const ss = getSpreadsheet_();
  const stateSheet = ss.getSheetByName(SHEET_NAME_STATE);
  if (!stateSheet) return jsonResponse({ ok: true, history: [], ts: 0 });
  try {
    const json = stateSheet.getRange(2, 1).getValue();
    const ts   = stateSheet.getRange(2, 2).getValue();
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

// ── SYNC WORKOUTS ──────────────────────────────────────────
function syncWorkouts(workouts) {
  const ss = getSpreadsheet_();

  // Ensure sheets exist
  let logSheet = ss.getSheetByName(SHEET_NAME_LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAME_LOG);
    logSheet.appendRow([
      'ID', 'Date', 'Program', 'Session',
      'Exercise', 'Set #', 'Weight', 'Reps', 'Volume (set)',
      'Duration', 'Total Volume', 'Total Sets'
    ]);
    logSheet.setFrozenRows(1);
    logSheet.getRange(1,1,1,12).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }

  let summarySheet = ss.getSheetByName(SHEET_NAME_SUMMARY);
  if (!summarySheet) {
    summarySheet = ss.insertSheet(SHEET_NAME_SUMMARY);
    summarySheet.appendRow([
      'ID', 'Date', 'Program', 'Session',
      'Duration', 'Total Volume', 'Total Sets', 'Exercises'
    ]);
    summarySheet.setFrozenRows(1);
    summarySheet.getRange(1,1,1,8).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }

  // Get existing IDs to avoid duplicates
  const logData     = logSheet.getDataRange().getValues();
  const summaryData = summarySheet.getDataRange().getValues();
  const existingLogIds     = new Set(logData.slice(1).map(r => r[0]));
  const existingSummaryIds = new Set(summaryData.slice(1).map(r => r[0]));

  let added = 0;
  workouts.forEach(w => {
    const wid = w.id || (w.date + '-' + w.sessionName);
    const dateStr = new Date(w.date).toLocaleDateString('en-US');

    // Summary row
    if (!existingSummaryIds.has(wid)) {
      summarySheet.appendRow([
        wid, dateStr, w.programName || '', w.sessionName || '',
        w.duration || '', w.totalVolume || 0, w.totalSets || 0,
        (w.exercises || []).map(e => e.name).join(', ')
      ]);
      added++;
    }

    // Log rows (one per set)
    (w.exercises || []).forEach(ex => {
      (ex.sets || []).forEach((s, i) => {
        const rowId = wid + '-' + ex.name + '-' + i;
        if (!existingLogIds.has(rowId)) {
          const setVol = (parseFloat(s.weight)||0) * (parseInt(s.reps)||0);
          logSheet.appendRow([
            rowId, dateStr, w.programName || '', w.sessionName || '',
            ex.name, i + 1, s.weight || '', s.reps || '', setVol,
            w.duration || '', w.totalVolume || 0, w.totalSets || 0
          ]);
        }
      });
    });
  });

  // Auto-resize columns
  logSheet.autoResizeColumns(1, 12);
  summarySheet.autoResizeColumns(1, 8);

  return jsonResponse({ ok: true, added });
}

// ── HELPERS ────────────────────────────────────────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Spreadsheet accessor — works for both bound and standalone scripts ────────
// Standalone scripts (deployed from script.google.com) have no active spreadsheet.
// This helper auto-creates "Muscle Ladder Data" on first run and stores the ID.
function getSpreadsheet_() {
  // 1. Try bound spreadsheet first (works if deployed from Sheets Extensions menu)
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch(e) { /* standalone — fall through */ }

  // 2. Try stored ID from a previous auto-create
  const props = PropertiesService.getScriptProperties();
  const storedId = props.getProperty('SPREADSHEET_ID');
  if (storedId) {
    try { return SpreadsheetApp.openById(storedId); } catch(e) { /* stale id — fall through */ }
  }

  // 3. Auto-create "Muscle Ladder Data" spreadsheet and store its ID
  const ss = SpreadsheetApp.create('Muscle Ladder Data');
  props.setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║                   GOOGLE FIT BIOMETRIC MODULE                            ║
// ║  Zero-credential setup — uses Apps Script native Google OAuth            ║
// ║  Fetches: Sleep · Heart Rate · Resting HR · Synthetic HRV · Readiness   ║
// ║                                                                           ║
// ║  SETUP (one-time):                                                        ║
// ║   1. Add appsscript.json with fitness scopes (see SETUP.md Step 5)       ║
// ║   2. Deploy as Web App (Execute as: Me, Anyone can access)               ║
// ║   3. Click "Authorize" when Google prompts for fitness permissions        ║
// ║   4. On Android: Fitbit app → Settings → Apps → Google Fit → ON         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const SHEET_NAME_FITBIT = 'FitbitData';

// ── Google Fit REST API helper — uses ScriptApp native OAuth (no credentials) ─
function gFitApi_(path, postBody) {
  const token = ScriptApp.getOAuthToken();
  const options = {
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true,
  };
  if (postBody) {
    options.method = 'post';
    options.contentType = 'application/json';
    options.payload = JSON.stringify(postBody);
  }
  const url = 'https://www.googleapis.com/fitness/v1/users/me' + path;
  const res  = UrlFetchApp.fetch(url, options);
  const code = res.getResponseCode();
  if (code >= 400) {
    console.warn('[GFit] HTTP ' + code + ' — ' + path + ': ' + res.getContentText());
    return null;
  }
  try { return JSON.parse(res.getContentText()); } catch(e) { return null; }
}

// ── Main fetch: pull today's full biometric payload from Google Fit ───────────
function fitbitFetchToday_() {
  const tz    = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

  // Time window: midnight → 11:59 PM today (milliseconds)
  const startMs = new Date(today + 'T00:00:00').getTime();
  const endMs   = startMs + 86400000;

  // Helper: build a dataset:aggregate request body
  function aggBody(dataTypeName, bucketMs) {
    return {
      aggregateBy: [{ dataTypeName: dataTypeName }],
      bucketByTime: { durationMillis: bucketMs || 86400000 },
      startTimeMillis: startMs,
      endTimeMillis:   endMs,
    };
  }

  // ── 1. Sleep stages ─────────────────────────────────────────────────────────
  // Google Fit sleep stage values: 1=awake, 2=asleep(generic), 4=light, 5=deep, 6=REM
  let sleepScore = null, deepSleepMinutes = 0, remSleepMinutes = 0, lightSleepMinutes = 0;
  try {
    const sleepRes = gFitApi_('/dataset:aggregate', aggBody('com.google.sleep.segment'));
    const buckets  = (sleepRes && sleepRes.bucket) || [];
    let deepMs = 0, remMs = 0, lightMs = 0, totalSleepMs = 0;
    buckets.forEach(function(b) {
      (b.dataset || []).forEach(function(ds) {
        (ds.point || []).forEach(function(pt) {
          const stage = pt.value && pt.value[0] && pt.value[0].intVal;
          const dur   = (parseInt(pt.endTimeNanos) - parseInt(pt.startTimeNanos)) / 1e6; // → ms
          if (stage === 4) { lightMs += dur; totalSleepMs += dur; }
          if (stage === 5) { deepMs  += dur; totalSleepMs += dur; }
          if (stage === 6) { remMs   += dur; totalSleepMs += dur; }
        });
      });
    });
    deepSleepMinutes  = Math.round(deepMs  / 60000);
    remSleepMinutes   = Math.round(remMs   / 60000);
    lightSleepMinutes = Math.round(lightMs / 60000);
    const totalMin    = Math.round(totalSleepMs / 60000);
    if (totalMin > 0) {
      // Synthetic sleep score: quality ratio (deep+REM ÷ total) × duration score (8h = max)
      const qualityRatio  = (deepSleepMinutes + remSleepMinutes) / totalMin;
      const durationScore = Math.min(100, (totalMin / 480) * 100);
      sleepScore = Math.round(qualityRatio * 50 + durationScore * 0.5);
      sleepScore = Math.max(0, Math.min(100, sleepScore));
    }
  } catch(e) { console.warn('[GFit] Sleep fetch failed:', e); }

  // ── 2. Heart rate (hourly buckets for resting HR + workout avg) ─────────────
  let restingHR = null, avgWorkoutHR = null;
  try {
    const hrRes  = gFitApi_('/dataset:aggregate', aggBody('com.google.heart_rate.bpm', 3600000));
    const bkts   = (hrRes && hrRes.bucket) || [];
    const allBpm = [];
    bkts.forEach(function(b) {
      (b.dataset || []).forEach(function(ds) {
        (ds.point || []).forEach(function(pt) {
          const bpm = pt.value && pt.value[0] && pt.value[0].fpVal;
          if (bpm && bpm > 0) allBpm.push(bpm);
        });
      });
    });
    if (allBpm.length > 0) {
      // Resting HR: bottom 5th-percentile reading (more robust than raw min)
      const sorted   = allBpm.slice().sort(function(a, b) { return a - b; });
      const p5idx    = Math.max(0, Math.floor(sorted.length * 0.05));
      restingHR      = Math.round(sorted[p5idx]);
      // Workout HR: readings ≥ 100 bpm
      const workout  = allBpm.filter(function(v) { return v >= 100; });
      if (workout.length > 5) {
        avgWorkoutHR = Math.round(workout.reduce(function(s, v) { return s + v; }, 0) / workout.length);
      }
    }
  } catch(e) { console.warn('[GFit] HR fetch failed:', e); }

  // ── 3. Synthetic HRV — RMSSD approximation from 1-minute resting HR data ────
  let hrv = null;
  try {
    const hrIntraRes = gFitApi_('/dataset:aggregate', {
      aggregateBy:    [{ dataTypeName: 'com.google.heart_rate.bpm' }],
      bucketByTime:   { durationMillis: 60000 },
      startTimeMillis: startMs,
      endTimeMillis:   endMs,
    });
    const intraBkts  = (hrIntraRes && hrIntraRes.bucket) || [];
    const minuteBpms = [];
    intraBkts.forEach(function(b) {
      (b.dataset || []).forEach(function(ds) {
        (ds.point || []).forEach(function(pt) {
          const bpm = pt.value && pt.value[0] && pt.value[0].fpVal;
          if (bpm && bpm > 0 && bpm < 100) minuteBpms.push(bpm); // resting-window only
        });
      });
    });
    if (minuteBpms.length > 5) {
      // Convert BPM → RR intervals (ms), compute RMSSD
      const rr = minuteBpms.map(function(b) { return 60000 / b; });
      let sumSq = 0;
      for (var i = 1; i < rr.length; i++) {
        var diff = rr[i] - rr[i - 1];
        sumSq += diff * diff;
      }
      hrv = Math.round(Math.sqrt(sumSq / (rr.length - 1)));
      hrv = Math.max(0, Math.min(150, hrv)); // sanity clamp
    }
  } catch(e) { console.warn('[GFit] HRV computation failed:', e); }

  // ── 4. Synthetic Readiness Score (Google Fit has no native equivalent) ───────
  // Weighted blend: 40% sleep quality · 35% HRV recovery · 25% resting HR
  let readinessScore = null, readinessFactor = null;
  {
    const sleepComp = sleepScore  !== null ? sleepScore  : 70;
    const hrvComp   = hrv         !== null ? Math.min(100, Math.round((hrv / 80) * 100))        : 70;
    const hrComp    = restingHR   !== null ? Math.max(0,  Math.round(100 - (restingHR - 45)))   : 70;
    readinessScore  = Math.round(sleepComp * 0.40 + hrvComp * 0.35 + hrComp * 0.25);
    readinessScore  = Math.max(0, Math.min(100, readinessScore));
    // Surface the weakest pillar as the readiness factor
    var components  = [
      ['sleep quality',       sleepComp],
      ['hrv recovery',        hrvComp],
      ['resting heart rate',  hrComp],
    ];
    components.sort(function(a, b) { return a[1] - b[1]; });
    readinessFactor = components[0][0];
  }

  return {
    readinessScore:   readinessScore,
    readinessFactor:  readinessFactor,
    sleepScore:       sleepScore,
    restingHR:        restingHR,
    hrv:              hrv,
    deepSleepMinutes: deepSleepMinutes,
    remSleepMinutes:  remSleepMinutes,
    lightSleepMinutes: lightSleepMinutes,
    averageWorkoutHR: avgWorkoutHR,
    spo2:             null, // Google Fit REST API does not expose SpO₂ for 3rd-party apps
    fetchedAt:        today,
  };
}

// ── Write biometric row to FitbitData sheet ───────────────────────────────────
function fitbitWriteToSheet_(payload) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME_FITBIT);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_FITBIT);
    sheet.appendRow(['Date','ReadinessScore','ReadinessFactor','SleepScore','RestingHR','HRV','DeepMin','REMMin','LightMin','AvgWorkoutHR','SpO2','FetchedAt']);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,12).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }

  // Avoid duplicate rows for same date — update in place if exists
  const data = sheet.getDataRange().getValues();
  const existingRowIdx = data.slice(1).findIndex(r => r[0] === payload.fetchedAt);
  const rowData = [
    payload.fetchedAt,
    payload.readinessScore,
    payload.readinessFactor || '',
    payload.sleepScore,
    payload.restingHR,
    payload.hrv,
    payload.deepSleepMinutes,
    payload.remSleepMinutes,
    payload.lightSleepMinutes,
    payload.averageWorkoutHR,
    payload.spo2,
    new Date().toLocaleString(),
  ];

  if (existingRowIdx >= 0) {
    sheet.getRange(existingRowIdx + 2, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  sheet.autoResizeColumns(1, 12);
}

// ── Build trailing arrays from last N sheet rows ──────────────────────────────
function fitbitBuildTrailing_(sheet, n) {
  n = n || 7;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { trailingReadiness: [], trailingSleep: [], trailingHRV: [] };
  const startRow = Math.max(2, lastRow - n + 1);
  const numRows  = lastRow - startRow + 1;
  const data     = sheet.getRange(startRow, 1, numRows, 6).getValues();
  // Columns: [Date, ReadinessScore, ReadinessFactor, SleepScore, RestingHR, HRV]
  return {
    trailingReadiness: data.map(r => Number(r[1]) || 0),
    trailingSleep:     data.map(r => Number(r[3]) || 0),
    trailingHRV:       data.map(r => Number(r[5]) || 0),
  };
}

// ── GET endpoint: app calls this on Maps('analysis') ─────────────────────────
function fitbitGetLatestData() {
  try {
    const payload = fitbitFetchToday_();
    fitbitWriteToSheet_(payload);

    const ss    = getSpreadsheet_();
    const sheet = ss.getSheetByName(SHEET_NAME_FITBIT);
    const trailing = sheet ? fitbitBuildTrailing_(sheet, 7) : {};

    return jsonResponse({ ok: true, fitbit: Object.assign({}, payload, trailing) });
  } catch(err) {
    // Return last known good data from sheet if live fetch fails
    try {
      const ss    = getSpreadsheet_();
      const sheet = ss.getSheetByName(SHEET_NAME_FITBIT);
      if (sheet && sheet.getLastRow() > 1) {
        const last     = sheet.getRange(sheet.getLastRow(), 1, 1, 12).getValues()[0];
        const trailing = fitbitBuildTrailing_(sheet, 7);
        return jsonResponse({ ok: true, cached: true, fitbit: Object.assign({
          fetchedAt:         last[0],
          readinessScore:    last[1],
          readinessFactor:   last[2],
          sleepScore:        last[3],
          restingHR:         last[4],
          hrv:               last[5],
          deepSleepMinutes:  last[6],
          remSleepMinutes:   last[7],
          lightSleepMinutes: last[8],
          averageWorkoutHR:  last[9],
          spo2:              last[10],
        }, trailing) });
      }
    } catch(e2) { /* fall through */ }
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// ── Scheduled daily trigger (set up manually in Apps Script triggers UI) ──────
// Runs daily at 8–9 AM Puerto Rico time (AST/GMT-4) via a time-based trigger.
// Trigger config: Triggers → Add Trigger → fitbitDailySync → Time-driven → Day timer → 8am
function fitbitDailySync() {
  try {
    const payload = fitbitFetchToday_();
    fitbitWriteToSheet_(payload);
    console.log('[Fitbit] Daily sync complete:', JSON.stringify(payload));
  } catch(err) {
    console.error('[Fitbit] Daily sync failed:', err.toString());
  }
}
