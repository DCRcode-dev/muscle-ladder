// ota-36 (B2): stored text must never render as HTML. Every text field a workout, note, swap,
// custom exercise, measurement or server message can carry is filled with a tag-breaking payload,
// then every screen and sheet is opened. Any element that came from a payload is a leak.
const fs = require('fs');
const { boot, wait } = require('./harness');
const path = require('path');
const NEW = process.argv[2] || path.join(__dirname, '..', 'index.html');
const HIST = require('./seed')(NEW);
const clone = x => JSON.parse(JSON.stringify(x));
const P = f => `x'"><i data-pwn="${f}"></i><img src=x data-pwn="${f}">`;
const NOW = Date.UTC(2026, 10, 26, 23);
const hist = clone(HIST);
const tail = hist.slice(-4);
for (const w of tail) {
  w.sessionName = P('sessionName');
  const keys = Object.keys(w.sets || {}).filter(k => !k.endsWith('_wu'));
  if (keys[0]) for (const s of w.sets[keys[0]]) s._name = P('setName');
  if (keys[1]) { w.subs = Object.assign({}, w.subs || {}, { [keys[1]]: P('subs') }); }
  w.notes = Object.assign({}, w.notes || {}, { [keys[0] || 'x']: P('workoutNote') });
  w.additions = [{ name: P('additionName'), muscle: 'Chest', sets: 3, reps: '10' }];
  w.sets.add_0 = [{ w: 50, r: 10, _name: P('additionSet') }];
}
// ota-41: one payload workout is an Upper with heart rate, so the Strain page draws its exercise names
tail[0].sessionName = 'Upper ' + P('sessionName');
const target = tail[tail.length - 1];
const hrCache = {};
for (const w of hist) if (w.startTime && w.endTime > w.startTime && w.endTime >= Date.UTC(2026, 8, 1)) {
  const n = Math.round((w.endTime - w.startTime) / 60000); hrCache[w.id] = { bpm: Array.from({ length: n }, (_, i) => 120 + (i * 7) % 45), at: 1 };
}
const store = {
  dcrgym_history: hist, dcrgym_onboarded: true, dcrgym_schema_version: 3, dcrgym_default_prog: 'p14',
  dcrgym_settings: { sound: false, sheets: 'https://script.google.com/macros/s/x/exec', weightUnit: 'lb' },
  dcrgym_hr: hrCache,
  dcrgym_rows_synced: hist.map(w => String(w.id)), dcrgym_rows_backfilled: true,
  dcrgym_notes: { [P('globalNoteKey')]: P('globalNote'), 'Bench Press': P('globalNote2') },
  dcrgym_custom_exercises: [{ name: P('customEx'), muscle: 'Chest', subMuscle: 'Chest' }],
  dcrgym_blacklist: [P('hiddenEx')],
  dcrgym_slot_defaults: { p14_s1_0: { name: P('slotDefault'), sets: 3, reps: '8' } },
  dcrgym_measurements: [{ id: 'm1', date: '2026-11-01', weight: 150, notes: P('measureNote'), note: P('measureNote2') }],
  dcrgym_deleted_archive: { '123': { at: NOW, workout: Object.assign(clone(target), { id: '123', sessionName: P('deletedName') }) } },
  dcrgym_deleted_ids: ['123'],
  dcrgym_current_workout: { programId: 'p14', sessionId: 'p14_s1', sessionName: P('liveName'), startTime: NOW - 600000,
    sets: { p14_s1_0: [{ w: 100, r: 8, _name: P('liveSet'), ts: NOW - 300000 }] }, subs: { p14_s1_1: P('liveSub') }, notes: { p14_s1_0: P('liveNote') },
    additions: [{ name: P('liveAddition'), muscle: 'Chest', sets: 3, reps: '10' }], completedCards: [] },
};
(async () => {
  const { win, errors } = boot(NEW, store, { now: NOW });
  await wait(1800);
  const leaks = new Map();
  const look = where => { for (const el of win.document.querySelectorAll('[data-pwn]')) { const f = el.getAttribute('data-pwn'); if (!leaks.has(f)) leaks.set(f, new Set()); leaks.get(f).add(where); el.remove(); } };
  const tryRun = (where, code, ms = 120) => { try { win.eval(code); } catch (e) { /* screen not applicable */ } return wait(ms).then(() => look(where)); };
  look('boot');
  await tryRun('home', `Maps('home')`);
  for (const t of ['overview', 'monthly', 'strength', 'strain', 'log', 'recent']) await tryRun('progress:' + t, `Maps('history'); setProgressTab('${t}')`);
  await tryRun('strain page upper', `openStrainPage('upper', '${tail[0].id}')`);
  await tryRun('strain page focus', `setStrainType('upper'); setStrainFocus('${tail[0].id}')`);
  const strainTxt = win.document.getElementById('screen-history').textContent;
  if (!/data-pwn="setName"/.test(strainTxt)) { console.error('FAIL: the Strain page did not draw the payload exercise names, so it was not tested'); process.exit(1); }
  for (let i = 0; i < 3; i++) await tryRun('insight ' + i, `Maps('history'); setProgressTab('overview'); openInsight(${i})`);
  await tryRun('calendar day', `openCalDay('${target.id}')`);
  await tryRun('close cal', `closeCalPopup()`);
  await tryRun('settings', `Maps('settings')`);
  await tryRun('workouts tab', `Maps('workouts')`);
  await tryRun('workout (live)', `resumeWorkout && resumeWorkout()`, 300);
  await tryRun('workout screen', `Maps('workout')`, 300);
  for (const k of ['p14_s1_0', 'p14_s1_1', 'add_0']) {
    await tryRun('card menu ' + k, `showExerciseActionSheet({stopPropagation(){}}, '${k}', ${k === 'add_0' ? 0 : +k.split('_').pop()}, ${k === 'add_0'})`);
    await tryRun('close', `closeSheet(false)`);
    await tryRun('subs ' + k, `showSubs({stopPropagation(){}}, '${k}', ${+k.split('_').pop() || 0})`);
    await tryRun('close', `closeSheet(false)`);
  }
  await tryRun('add sheet', `showAddSheet()`); await tryRun('close', `closeSheet(false)`);
  await tryRun('custom sheet', `showCustomExerciseSheet('x')`); await tryRun('close', `closeSheet(false)`);
  await tryRun('progress graph', `showProgressGraph({stopPropagation(){}}, ${JSON.stringify(P('graphName'))})`); await tryRun('close', `closeProgressGraph()`);
  await tryRun('progress graph bench', `showProgressGraph({stopPropagation(){}}, 'Bench Press')`); await tryRun('close', `closeProgressGraph()`);
  for (const m of ['Chest', 'Back', 'Quads']) { await tryRun('muscle graph ' + m, `openMuscleGraph('${m}')`); await tryRun('close', `closeMuscleGraph()`); await tryRun('muscle detail ' + m, `showMuscleDetail('${m}')`); await tryRun('close', `closeSheet(false)`); }
  await tryRun('edit past', `editCompletedWorkout('${target.id}')`, 300);
  await tryRun('finish', `showFinish()`, 300);
  await tryRun('delete sheet', `deleteCompletedWorkout('${target.id}')`); await tryRun('close', `closeSheet(false)`);
  await tryRun('restore sheet', `confirmRestoreDeleted('123')`); await tryRun('close', `closeSheet(false)`);
  await tryRun('measurement', `Maps('history'); setProgressTab('overview'); openAddMeasurementModal()`); await tryRun('close', `closeSheet(false)`);
  await tryRun('sync result', `ST.lastSyncDetail = { rowsOk:false, stateOk:false, err: ${JSON.stringify(P('serverError'))}, stateErr: ${JSON.stringify(P('serverStateErr'))} }; Maps('settings'); syncNowFromHome && 0`);
  await tryRun('notice sync', `noticeSheet('Sync result', syncResultLines(ST.lastSyncDetail).map(l => '<div>' + l + '</div>').join(''))`); await tryRun('close', `closeSheet(false)`);
  await tryRun('home badge', `ST.lastCloudSyncError = ${JSON.stringify(P('badgeErr'))}; Maps('home')`);
  if (leaks.size) {
    console.log('LEAKS:'); for (const [f, w] of leaks) console.log('  ' + f + ': ' + [...w].join(', '));
    process.exitCode = 1;
  } else console.log('xss test: no stored text rendered as HTML across all screens');
  process.exit();
})();
