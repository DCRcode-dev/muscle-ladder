// ============================================================
// MUSCLE LADDER — Google Apps Script Backend (Pure Cloud Sync)
// Deploy as: Web App → Execute as: Me → Who has access: Anyone
// ============================================================
const SHEET_NAME_LOG     = "WorkoutLog";
const SHEET_NAME_SUMMARY = "WorkoutSummary";
const SHEET_NAME_STATE   = "AppState";

function doGet(e) {
  const rawAction = (e && e.parameter && e.parameter.action) || 'ping';
  const action = String(rawAction).trim().toLowerCase();

  if (action === 'ping')      return jsonResponse({ ok: true, message: 'Muscle Ladder backend connected!' });
  if (action === 'pullstate') return pullState();

  return jsonResponse({ ok: false, message: 'Unknown action: ' + rawAction });
}

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === 'syncWorkouts')  return syncWorkouts(body.workouts || []);
    if (action === 'saveState')     return saveState(body.history || [], body.ts || 0);
    if (action === 'deleteWorkout') return deleteWorkoutInSheet(body.id);

    return jsonResponse({ ok: false, message: 'Unknown action: ' + action });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

// ── STATE BLOB (bidirectional sync) ──────────────────────────────────────────
function reconstructHistoryFromLog_() {
  const ss = getSpreadsheet_();
  const logSheet = ss.getSheetByName(SHEET_NAME_LOG);
  if (!logSheet) return [];
  
  try {
    const values = logSheet.getDataRange().getValues();
    if (values.length < 2) return [];
    
    const workoutsMap = {};
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowId       = String(row[0] || '');
      const dateStr     = String(row[1] || '');
      const sessionName = String(row[3] || '');
      const exName      = String(row[4] || '');
      const setNum      = Number(row[5] || 0);
      const weight      = Number(row[6] || 0);
      const reps        = Number(row[7] || 0);
      const duration    = String(row[9] || '');
      
      if (!rowId || !exName || isNaN(setNum)) continue;
      
      const suffix = '-' + exName + '-' + (setNum - 1);
      let wid = '';
      if (rowId.indexOf(suffix) !== -1) {
        wid = rowId.substring(0, rowId.lastIndexOf(suffix));
      } else {
        const dashIdx = rowId.indexOf('-');
        wid = dashIdx !== -1 ? rowId.substring(0, dashIdx) : rowId;
      }
      
      if (!wid) wid = dateStr + '-' + sessionName;
      
      if (!workoutsMap[wid]) {
        const timestamp = isNaN(Number(wid)) ? new Date(dateStr).getTime() : Number(wid);
        workoutsMap[wid] = {
          id: wid,
          programId: 'import',
          sessionId: 'import',
          sessionName: sessionName || 'Imported Workout',
          startTime: timestamp || Date.now(),
          endTime: timestamp || Date.now(),
          duration: duration ? parseInt(duration) || 3600 : 3600,
          travelMode: false,
          sets: {}
        };
      }
      
      const wKey = 'import_' + exName.replace(/\s+/g, '_').toLowerCase();
      if (!workoutsMap[wid].sets[wKey]) {
        workoutsMap[wid].sets[wKey] = [];
      }
      
      const setIdx = setNum - 1;
      if (setIdx >= 0) {
        workoutsMap[wid].sets[wKey][setIdx] = {
          w: weight,
          r: reps,
          ts: workoutsMap[wid].startTime,
          _name: exName
        };
      }
    }
    
    const history = [];
    for (const wid in workoutsMap) {
      const w = workoutsMap[wid];
      const cleanSets = {};
      let hasSets = false;
      for (const k in w.sets) {
        const arr = w.sets[k];
        if (arr && arr.length > 0) {
          const filtered = arr.filter(Boolean);
          if (filtered.length > 0) {
            cleanSets[k] = filtered;
            hasSets = true;
          }
        }
      }
      if (hasSets) {
        w.sets = cleanSets;
        history.push(w);
      }
    }
    
    return history.sort((a, b) => (a.endTime || 0) - (b.endTime || 0));
  } catch(e) {
    Logger.log('Error reconstructing history: ' + e.toString());
    return [];
  }
}

function pullState() {
  const ss         = getSpreadsheet_();
  const stateSheet = ss.getSheetByName(SHEET_NAME_STATE);
  let history      = [];
  let maxTs        = 0;
  
  if (stateSheet) {
    try {
      const values = stateSheet.getDataRange().getValues();
      
      if (values.length === 2 && values[1][0] && String(values[1][0]).trim().startsWith('[')) {
        try {
          const oldHistory = JSON.parse(values[1][0]);
          if (Array.isArray(oldHistory)) {
            history = oldHistory;
            maxTs = Number(values[1][1]) || 0;
          }
        } catch(e) {}
      } else {
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
      }
    } catch(e) {}
  }
  
  // Reconstruct from WorkoutLog as a self-healing fallback/merge
  try {
    const reconstructed = reconstructHistoryFromLog_();
    if (reconstructed.length > 0) {
      const map = {};
      reconstructed.forEach(function(w) { if (w && w.id) map[w.id] = w; });
      history.forEach(function(w) { if (w && w.id) map[w.id] = w; });
      const merged = Object.keys(map).map(function(k) { return map[k]; })
                           .sort(function(a, b) { return (a.endTime || 0) - (b.endTime || 0); });
      
      if (merged.length > history.length) {
        history = merged;
        saveState(history, maxTs || Date.now());
      }
    }
  } catch(e) {
    Logger.log('Self-healing pullState merge failed: ' + e.toString());
  }
  
  return jsonResponse({ ok: true, history: history, ts: maxTs });
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
    if (stateSheet.getMaxColumns() < 4) {
      stateSheet.insertColumnsAfter(stateSheet.getMaxColumns(), 4 - stateSheet.getMaxColumns());
    }
    stateSheet.getRange(1, 1, 1, 4).setValues([['Workout ID', 'Workout JSON', 'Timestamp', 'Updated']]);
    stateSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('white');
  }

  // ── Non-destructive union merge ───────────────────────────────────────────
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

// ── SYNC WORKOUTS (Human-readable spreadsheet rows) ──────────────────────────
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

  // 1. Delete matching rows from WorkoutSummary
  for (let i = summaryValues.length - 1; i >= 1; i--) {
    const rowId = String(summaryValues[i][0]);
    if (idsSet.has(rowId)) {
      summarySheet.deleteRow(i + 1);
    }
  }

  // 2. Delete matching rows from WorkoutLog
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

  let stateSheet = ss.getSheetByName(SHEET_NAME_STATE);
  if (stateSheet) {
    const values = stateSheet.getDataRange().getValues();
    if (values.length === 2 && values[1][0] && String(values[1][0]).trim().startsWith('[')) {
      try {
        const oldHistory = JSON.parse(values[1][0]);
        if (Array.isArray(oldHistory)) {
          const filtered = oldHistory.filter(w => w && String(w.id) !== String(wid) && String(w.endTime) !== String(wid));
          stateSheet.getRange(2, 1).setValue(JSON.stringify(filtered));
        }
      } catch(e) {}
    } else {
      for (let i = values.length - 1; i >= 1; i--) {
        const rowId = String(values[i][0]);
        if (rowId === String(wid)) {
          stateSheet.deleteRow(i + 1);
        }
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
