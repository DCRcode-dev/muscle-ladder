// Data safety (from ota-36). Runs on every push. Uses only the public seed history from index.html.
// Then: the save guard, delete with restore, the queue race, the private key, extras backup,
// cloud deletes that never remove local workouts, preview mode, time limit, one pull per open.
const assert = require('assert'), fs = require('fs');
const { boot, dumpStore, wait } = require('./harness');
const path = require('path');
const NEW = process.argv[2] || path.join(__dirname, '..', 'index.html');
const HIST = require('./seed')(NEW);
let passed = 0;
const norm = x => x === undefined ? x : JSON.parse(JSON.stringify(x));
const eq = (a, b, m) => { assert.deepStrictEqual(norm(a), norm(b), m); passed++; };
const ok = (c, m) => { assert.ok(c, m); passed++; };
const cleanErr = errs => errs.filter(e => !/Failed to fetch|Not implemented|offline|navigation|timed out|preview: cloud/i.test(e));
const clone = x => JSON.parse(JSON.stringify(x));
const AST = (y, mo, d, h, mi = 0) => Date.UTC(y, mo - 1, d, h + 4, mi);
const NOW = AST(2026, 11, 27, 19);
const KEY = 'k9Qz3fT7wLp2Xv8sN4bR6hYc';
const phone = () => clone(HIST).sort((a, b) => a.endTime - b.endTime);
const baseStore = (hist, more = {}) => Object.assign({ dcrgym_history: hist, dcrgym_onboarded: true, dcrgym_schema_version: 3, dcrgym_default_prog: 'p14',
  dcrgym_settings: { sound: false, sheets: 'https://script.google.com/macros/s/x/exec', weightUnit: 'lb' }, dcrgym_rows_synced: hist.map(w => String(w.id)), dcrgym_rows_backfilled: true }, more);
const allSets = hist => { const out = []; for (const w of hist) for (const [k, a] of Object.entries(w.sets || {})) if (Array.isArray(a)) a.forEach((s, i) => out.push([String(w.id), k, i, JSON.stringify(s)])); return out.sort((a, b) => (a.join('|') < b.join('|') ? -1 : 1)); };
const countSets = hist => hist.reduce((n, w) => n + Object.entries(w.sets || {}).reduce((m, [k, a]) => m + (Array.isArray(a) && !k.endsWith('_wu') ? a.filter(s => s && s.r > 0).length : 0), 0), 0);

// ── a small IndexedDB stand-in (the vault), shared across opens like the phone's ──
function fakeIDB(data) {
  let made = false;
  const cp = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  return { open() {
    const req = {};
    setTimeout(() => {
      const db = { objectStoreNames: { contains: () => made }, createObjectStore: () => { made = true; },
        transaction: () => ({ objectStore: () => ({
          get(k) { const r = {}; setTimeout(() => { r.result = data.has(k) ? cp(data.get(k)) : undefined; r.onsuccess && r.onsuccess(); }, 0); return r; },
          put(v, k) { data.set(k, cp(v)); },
        }) }) };
      req.result = db;
      if (!made && req.onupgradeneeded) req.onupgradeneeded({ target: { result: db } });
      made = true;
      req.onsuccess && req.onsuccess();
    }, 0);
    return req;
  } };
}
// ── a stand-in for his Google script: records every call, answers like sync-v2 ──
function fakeServer(cfg = {}) {
  const calls = [];
  const srv = { calls, cfg };
  srv.fetch = async (url, init) => {
    const u = new URL(url);
    const method = (init && init.method) || 'GET';
    const body = init && init.body ? JSON.parse(init.body) : null;
    const action = method === 'GET' ? u.searchParams.get('action') : body && body.action;
    const key = method === 'GET' ? u.searchParams.get('key') : body && body.key;
    calls.push({ method, action, key, body, url });
    if (cfg.hang) return new Promise((_, rej) => { if (init && init.signal) init.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' }))); });
    if (cfg.delay) await new Promise(r => setTimeout(r, cfg.delay));
    const mode = cfg.keyMode || 'off';
    const held = cfg.serverKey !== undefined ? cfg.serverKey : (mode !== 'off' ? KEY : null);
    const keyOk = !!held && key === held;
    let out;
    if (action === 'ping') out = { ok: true, build: 'sync-v2', keyMode: mode, ...(cfg.pairing ? { keyHeld: !!held, pairingOpen: !!cfg.pairingOpen } : {}), ...(key && held ? { keyOk } : {}) };
    else if (action === 'registerKey') {
      if (held) out = { ok: false, error: 'already-paired' };
      else if (!cfg.pairingOpen) out = { ok: false, error: 'pairing-closed' };
      else if (typeof key !== 'string' || key.length < 32) out = { ok: false, error: 'bad-key' };
      else { cfg.serverKey = key; cfg.pairingOpen = false; out = { ok: true, paired: true }; }
    }
    else if (mode === 'enforce' && !keyOk) out = { ok: false, error: 'unauthorized' };   // what the ota-36 script answers
    else if (action === 'pullState') out = Object.assign({ ok: true }, cfg.pull || {});
    else if (action === 'workoutHeartRate') out = cfg.hrErr ? { ok: false, error: cfg.hrErr } : cfg.hrUnknown ? { ok: false, message: 'Unknown action: workoutHeartRate' } : { ok: true, hr: cfg.hr ? cfg.hr(body.windows) : {} };
    else out = { ok: true };
    return { ok: true, status: 200, text: async () => JSON.stringify(out) };
  };
  return srv;
}
async function run(store, opts = {}) {
  const idb = opts.idb || new Map();
  const srv = opts.srv || null;
  const b = boot(NEW, store, { now: opts.now || NOW, url: opts.url, setup(win) {
    win.indexedDB = fakeIDB(idb);
    if (srv) win.fetch = srv.fetch;
    if (opts.setup) opts.setup(win);
  } });
  await wait(opts.wait || 1800);
  return Object.assign(b, { idb, srv });
}
const H = win => JSON.parse(win.localStorage.getItem('dcrgym_history'));

(async () => {
  // ── A. Open twice: the second open changes nothing ──
  const idb = new Map();
  let s35;
  { const b = await run(baseStore(phone()), { idb }); s35 = dumpStore(b.win); b.win.close(); }
  const h35 = JSON.parse(s35.dcrgym_history);
  const A = await run(s35, { idb });
  eq(cleanErr(A.errors), [], 'boots clean');
  const SA = dumpStore(A.win), hA = JSON.parse(SA.dcrgym_history);
  eq(SA.dcrgym_history, s35.dcrgym_history, 'reopen: stored history byte-identical');
  eq(hA.length, h35.length, `workout count unchanged (${hA.length})`);
  eq(countSets(hA), countSets(h35), `set count unchanged (${countSets(hA)})`);
  eq(allSets(hA), allSets(h35), 'every set identical, field by field');
  ok(SA.dcrgym_repairs_frozen, 'old repairs frozen after this open');
  eq(JSON.stringify(idb.get('dcrgym_history')), SA.dcrgym_history, 'vault copy matches');
  { const again = await run(dumpStore(A.win), { idb }); eq(dumpStore(again.win).dcrgym_history, SA.dcrgym_history, 'second open changes nothing'); again.win.close(); }
  eq(A.win.eval('unsyncedRowWorkouts().length'), 0, 'nothing new for the Sheet');
  for (const k of ['dcrgym_ota31_flags', 'dcrgym_ota32_fix', 'dcrgym_ota33_fix']) eq(SA[k], s35[k], `${k} kept as it was`);
  console.log(`  seed: ${hA.length} workouts, ${countSets(hA)} sets, identical`);
  A.win.close();

  // ── B. Frozen means the old repairs don't run on open ──
  {
    const st = clone(SA); for (const k of ['dcrgym_ota31_flags', 'dcrgym_ota32_fix', 'dcrgym_ota33_fix']) delete st[k];
    const b = await run(st);   // fresh vault so nothing restores the flags
    const S = dumpStore(b.win);
    ok(!S.dcrgym_ota32_fix && !S.dcrgym_ota33_fix, 'with the freeze set, the ota-32/33 repairs did not run');
    eq(S.dcrgym_history, SA.dcrgym_history, 'and history is untouched');
    b.win.close();
  }

  // ── C. The guard: no save can make workouts disappear ──
  {
    const b = await run(SA, { idb: new Map() });
    const r = b.win.eval(`saveHistory(getHistory().slice(3))`);
    eq(r, false, 'a save that would drop 3 workouts is refused');
    eq(H(b.win).length, hA.length, 'history still has every workout');
    const ref = JSON.parse(b.win.localStorage.getItem('dcrgym_save_refused'));
    eq(ref.ids.length, 3, 'the refusal is logged with the 3 ids');
    eq(b.win.eval(`saveHistory(getHistory().concat([]))`), true, 'a normal save still works');
    b.win.close();
  }

  // ── D. Delete hides a workout; Restore brings it back exactly ──
  {
    const vault = new Map();
    const b = await run(SA, { idb: vault });
    const seedId = b.win.eval(`String(SEED_RECOVERED_HISTORY[5].id)`);
    ok(hA.some(w => String(w.id) === seedId), 'test target is a seed workout he has');
    const before = b.win.localStorage.getItem('dcrgym_history');
    b.win.eval(`softDeleteWorkout('${seedId}')`);
    await wait(100);
    eq(H(b.win).length, hA.length - 1, 'deleted workout leaves the history');
    ok(JSON.parse(b.win.localStorage.getItem('dcrgym_deleted_archive'))[seedId], 'full copy kept in the deleted archive');
    ok(vault.get('dcrgym_deleted_archive')[seedId], 'and in the vault');
    b.win.eval(`Maps('settings')`);
    ok(/Deleted workouts/.test(b.win.document.getElementById('screen-settings').textContent), 'Settings lists it under Deleted workouts');
    const st = dumpStore(b.win); b.win.close();
    const c = await run(st, { idb: vault });
    eq(H(c.win).length, hA.length - 1, 'stays deleted after reopening (the seed does not bring it back)');
    c.win.eval(`restoreDeletedWorkout('${seedId}')`);
    eq(c.win.localStorage.getItem('dcrgym_history'), before, 'Restore: history byte-identical to before the delete');
    const st2 = dumpStore(c.win); c.win.close();
    const d = await run(st2, { idb: vault });
    eq(d.win.localStorage.getItem('dcrgym_history'), before, 'still identical after reopening');
    d.win.close();
  }

  // ── E. Queue: one sender at a time; something queued mid-send stays queued ──
  {
    const srv = fakeServer({ delay: 200 });
    const b = await run(SA, { srv, wait: 2500 });
    srv.calls.length = 0;
    b.win.eval(`enqueueSyncPayload({ action: 'syncWorkouts', workouts: [{ id: 'q1' }] })`);
    const p1 = b.win.eval(`drainSyncQueue()`), p2 = b.win.eval(`drainSyncQueue()`);
    ok(p1 === p2, 'a second drain joins the one already running');
    await wait(50);
    b.win.eval(`enqueueSyncPayload({ action: 'syncWorkouts', workouts: [{ id: 'q2' }] })`);
    await p1;
    const q = b.win.eval(`JSON.stringify(LS.get('dcrgym_sync_queue', []))`);
    const ids = JSON.parse(q).map(i => i.payload.workouts[0].id);
    eq(ids, ['q2'], 'item sent is gone, item queued mid-send is still queued');
    eq(srv.calls.filter(c => c.body && c.body.workouts && c.body.workouts[0].id === 'q1').length, 1, 'q1 sent once');
    b.win.close();
  }

  // ── F. Private key: added at send time, never stored in the queue or the code ──
  {
    ok(!fs.readFileSync(NEW, 'utf8').includes(KEY), 'no key in the code');
    const srv = fakeServer({ keyMode: 'log' });
    const b = await run(SA, { srv, wait: 2500 });
    eq(b.win.eval(`setSyncKey('short')`), false, 'a too-short key is rejected');
    eq(b.win.eval(`setSyncKey('${KEY}')`), true, 'key saved');
    ok(b.win.eval(`sheetsGetUrl('https://x/exec','pullState')`).endsWith('&key=' + KEY), 'GET carries &key=');
    srv.cfg.hang = false; srv.cfg.delay = 0;
    b.win.fetch = async () => { throw new TypeError('Failed to fetch'); };
    b.win.eval(`postToSheets({ action: 'syncWorkouts', workouts: [{ id: 'k1' }] })`);
    await wait(100);
    const q = JSON.parse(b.win.localStorage.getItem('dcrgym_sync_queue'));
    ok(q.length && q.every(i => !('key' in i.payload)), 'queued item holds no key');
    b.win.fetch = srv.fetch; srv.calls.length = 0;
    await b.win.eval(`drainSyncQueue()`);
    const post = srv.calls.find(c => c.method === 'POST');
    eq(post && post.key, KEY, 'POST body carries the key when sent');
    eq(JSON.parse(b.win.localStorage.getItem('dcrgym_sync_queue')).length, 0, 'sent and cleared');
    b.win.close();
  }

  // ── G. Script enforcing the key, phone without it: everything stays queued, clear message ──
  {
    const srv = fakeServer({ keyMode: 'enforce' });
    const st = clone(SA); st.dcrgym_sync_queue = JSON.stringify([{ payload: { action: 'syncWorkouts', workouts: [{ id: 'g1' }], _qid: 'g1' }, ts: 1 }]);
    const b = await run(st, { srv, wait: 2500 });
    eq(JSON.parse(b.win.localStorage.getItem('dcrgym_sync_queue')).map(i => i.payload._qid), ['g1'], 'queued item kept');
    eq(b.win.eval('ST.lastCloudSyncError'), 'sync key needed', 'error says key, not offline');
    eq(b.win.eval(`[isKeyRefusal({ ok: false, error: 'key' }), isKeyRefusal({ ok: false, error: 'unauthorized' }), isKeyRefusal({ ok: false, error: 'busy' })]`), [true, true, false], 'both refusal words read as key; busy does not');
    srv.calls.length = 0;
    const d = await b.win.eval(`runSyncNow()`);
    b.win.__d = d;
    const lines = b.win.eval(`JSON.stringify(syncResultLines(window.__d))`);
    console.log('  Sync Now lines:', lines);
    ok(/isn't paired/i.test(lines) && !/offline/i.test(lines), 'Sync Now says the phone isn\'t paired yet, not offline');
    ok(JSON.parse(b.win.localStorage.getItem('dcrgym_sync_queue')).some(i => i.payload._qid === 'g1'), 'still queued after Sync Now');
    eq(H(b.win).length, hA.length, 'history untouched');
    b.win.close();
  }

  // ── H. ota-37: the phone makes its own key and registers it once; no key ever comes in a link ──
  {
    const vault = new Map();
    const srv = fakeServer({ pairing: true, serverKey: null, pairingOpen: true });
    const b = await run(SA, { idb: vault, srv, wait: 3000 });
    const k = b.win.eval('getSyncKey()');
    ok(/^[A-Za-z0-9_-]{32}$/.test(k), 'phone made a 32-character key');
    const regs = srv.calls.filter(c => c.action === 'registerKey');
    eq(regs.length, 1, 'registered once');
    eq(regs[0].key, k, 'register sends the phone\'s own key');
    eq(srv.cfg.serverKey, k, 'script now holds that key, window closed');
    ok(JSON.parse(b.win.localStorage.getItem('dcrgym_key_paired')).at > 0, 'phone remembers it is paired');
    eq(vault.get('dcrgym_sync_key'), k, 'key kept in the phone vault too');
    srv.calls.length = 0;
    await b.win.eval('runSyncNow()');
    const posts = srv.calls.filter(c => c.method === 'POST');
    ok(posts.length && posts.every(c => c.key === k), 'every later call carries the key');
    const stateCall = posts.find(c => c.action === 'saveState');
    ok(stateCall, 'restore copy sent');
    const { key: _drop, ...saved } = stateCall.body;
    ok(!JSON.stringify(saved).includes(k), 'the key is not inside the restore copy (history, notes, extras)');
    ok(!JSON.stringify(b.win.eval('buildCloudExtras()')).includes(k), 'extras never carry the key');
    ok(!(b.win.localStorage.getItem('dcrgym_sync_queue') || '').includes(k), 'queue never stores the key');
    ok(b.win.eval('syncKeyLine()').includes('paired with this phone'), 'Settings: paired with this phone');
    eq(H(b.win).length, hA.length, 'history untouched');
    const st = dumpStore(b.win); b.win.close();
    const again = await run(st, { idb: vault, srv, wait: 3000 });
    eq(srv.calls.filter(c => c.action === 'registerKey').length, 0, 'not registered again on the next open');
    eq(again.win.eval('getSyncKey()'), k, 'same key on the next open');
    const wiped = dumpStore(again.win); delete wiped.dcrgym_sync_key; delete wiped.dcrgym_key_paired; again.win.close();
    const c = await run(wiped, { idb: vault, srv, wait: 3000 });
    eq(c.win.eval('getSyncKey()'), k, 'key comes back from the vault after a storage wipe');
    eq(srv.calls.filter(x => x.action === 'registerKey').length, 0, 'and no new key is made');
    c.win.close();
  }
  {
    const srv = fakeServer({ pairing: true, serverKey: null, pairingOpen: false });
    const b = await run(SA, { srv, wait: 3000 });
    eq(srv.calls.filter(c => c.action === 'registerKey').length, 0, 'window closed: nothing sent');
    eq(b.win.eval('getSyncKey()'), '', 'and no key made yet');
    b.win.close();
    const srv2 = fakeServer({ pairing: true, serverKey: 'someone-elses-key-0123456789abcdef', pairingOpen: true });
    const d = await run(SA, { srv: srv2, wait: 3000 });
    eq(srv2.calls.filter(c => c.action === 'registerKey').length, 0, 'script already holds a key: no attempt to replace it');
    ok(d.win.eval('syncKeyLine()').includes('another key'), 'Settings says the script is paired with another key');
    eq(H(d.win).length, hA.length, 'history untouched');
    d.win.close();
    const srv3 = fakeServer({ keyMode: 'off' });   // today's live script: no pairing fields
    const e = await run(SA, { srv: srv3, wait: 3000 });
    eq(srv3.calls.filter(c => c.action === 'registerKey').length, 0, 'today\'s script: nothing new sent');
    e.win.close();
    const f = await run(SA, { srv: fakeServer({ keyMode: 'log' }), url: 'https://dcrcode-dev.github.io/muscle-ladder/#k=' + KEY, wait: 2500 });
    ok(!f.win.eval('getSyncKey()'), 'an old pairing link is not saved');
    ok(!f.win.location.href.includes(KEY), 'and is cleared from the address bar');
    f.win.close();
  }

  // ── I. Extras survive a wipe: measurements, swaps, custom and hidden exercises, rest times ──
  {
    const vault = new Map();
    const extras = {
      dcrgym_measurements: [{ id: 'm1', date: '2026-11-01', weight: 145.5 }, { id: 'm2', date: '2026-11-20', weight: 146.2 }],
      dcrgym_slot_defaults: { p14_s1_1: { name: 'Machine Chest Press', at: 1 } },
      dcrgym_custom_exercises: [{ name: 'Seal Row', muscle: 'Back' }],
      dcrgym_blacklist: ['Dips'],
      dcrgym_rest: { 'Bench Press': 150 },
    };
    const b = await run(Object.assign(clone(SA), Object.fromEntries(Object.entries(extras).map(([k, v]) => [k, JSON.stringify(v)]))), { idb: vault });
    for (const k of Object.keys(extras)) eq(vault.get(k), extras[k], `${k} copied to the vault`);
    const extrasSent = b.win.eval(`JSON.stringify(buildCloudExtras())`);
    ok(JSON.parse(extrasSent).measurements.length === 2 && JSON.parse(extrasSent).hiddenExercises[0] === 'Dips', 'cloud copy carries them');
    b.win.close();
    const wiped = clone(SA); for (const k of Object.keys(extras)) delete wiped[k];
    const c = await run(wiped, { idb: vault });
    for (const k of Object.keys(extras)) eq(JSON.parse(c.win.localStorage.getItem(k)), extras[k], `${k} back after storage wipe`);
    eq(c.win.localStorage.getItem('dcrgym_history'), SA.dcrgym_history, 'history untouched by the restore');
    c.win.close();
    // what's on the phone wins
    const mine = Object.assign(clone(SA), { dcrgym_slot_defaults: JSON.stringify({ p14_s2_0: { name: 'Hack Squat', at: 2 } }) });
    const d = await run(mine, { idb: vault });
    eq(JSON.parse(d.win.localStorage.getItem('dcrgym_slot_defaults')), { p14_s2_0: { name: 'Hack Squat', at: 2 } }, 'phone swaps not overwritten by the vault');
    d.win.close();
    // and from the cloud copy on a new phone
    const srv = fakeServer({ pull: { extras: { v: 1, measurements: extras.dcrgym_measurements, slotDefaults: extras.dcrgym_slot_defaults, customExercises: extras.dcrgym_custom_exercises, hiddenExercises: ['Dips'], restTimes: extras.dcrgym_rest } } });
    const e = await run(wiped, { srv, wait: 2500 });
    eq(JSON.parse(e.win.localStorage.getItem('dcrgym_measurements')), extras.dcrgym_measurements, 'measurements back from the cloud copy');
    eq(JSON.parse(e.win.localStorage.getItem('dcrgym_custom_exercises')), extras.dcrgym_custom_exercises, 'custom exercises back from the cloud copy');
    e.win.close();
  }

  // ── J. Cloud delete list blocks incoming copies; never removes a workout on this phone ──
  {
    const localId = String(hA[hA.length - 1].id);
    const ghost = { id: '1795800000000', programId: 'p14', sessionId: 'p14_s1', sessionName: 'Upper', startTime: 1795796400000, endTime: 1795800000000, duration: 3600, sets: { p14_s1_0: [{ w: 100, r: 8, _name: 'Bench Press' }] } };
    const fresh = Object.assign(clone(ghost), { id: '1795900000000', endTime: 1795900000000, startTime: 1795896400000 });
    const srv = fakeServer({ pull: { deletedIds: [localId, ghost.id], history: [ghost, fresh] } });
    const b = await run(SA, { srv, wait: 2500 });
    const h = H(b.win);
    ok(h.some(w => String(w.id) === localId), 'his workout stays even though the cloud list names it');
    ok(!h.some(w => String(w.id) === ghost.id), 'a cloud-deleted workout is not brought in');
    ok(h.some(w => String(w.id) === fresh.id), 'a real new cloud workout still comes in');
    eq(h.length, hA.length + 1, 'only the one new workout added');
    b.win.close();
  }

  // ── K. Preview build: reads his data, writes nothing anywhere ──
  {
    const vault = new Map([['dcrgym_history', clone(hA)]]);
    const srv = fakeServer();
    const b = await run(SA, { idb: vault, srv, url: 'https://dcrcode-dev.github.io/muscle-ladder/preview/', wait: 2000 });
    const startLS = clone(SA);
    eq(b.win.eval('IS_PREVIEW'), true, 'preview mode on');
    eq(b.win.eval('getHistory().length'), hA.length, 'shows his workouts');
    b.win.eval(`softDeleteWorkout('${hA[2].id}')`);
    b.win.eval(`LS.set('dcrgym_rest', { x: 1 })`);
    eq(b.win.eval('getHistory().length'), hA.length - 1, 'changes show inside the preview');
    await wait(300);
    eq(dumpStore(b.win), startLS, 'phone storage unchanged');
    eq(JSON.stringify(vault.get('dcrgym_history')), JSON.stringify(hA), 'vault unchanged');
    ok(!vault.has('dcrgym_deleted_archive') && !vault.has('dcrgym_repairs_frozen'), 'nothing new in the vault');
    eq(srv.calls.length, 0, 'nothing sent to the Sheet');
    b.win.close();
  }

  // ── L. Time limit: a script that never answers stops waiting ──
  {
    const srv = fakeServer({ hang: true });
    const b = await run(SA, { srv, wait: 300, setup(win) { win.__dcrSheetsTimeoutMs = 400; } });
    await wait(1500);
    eq(b.win.eval('ST.lastCloudSyncError'), 'timed out', 'hung ping gives up and says timed out');
    const r = await b.win.eval(`pullFromSheets()`);
    eq(r, 0, 'hung pull gives up');
    eq(b.win.eval('ST.lastCloudSyncError'), 'timed out', 'and says timed out');
    eq(H(b.win).length, hA.length, 'history untouched');
    b.win.close();
  }

  // ── M. One cloud pull per open; coming back within 2 minutes doesn't pull again ──
  {
    const srv = fakeServer();
    const b = await run(SA, { srv, wait: 3500 });
    eq(srv.calls.filter(c => c.action === 'pullState').length, 1, 'one pull on open');
    Object.defineProperty(b.win.document, 'visibilityState', { configurable: true, get: () => 'visible' });
    b.win.document.dispatchEvent(new b.win.Event('visibilitychange'));
    await wait(200);
    eq(srv.calls.filter(c => c.action === 'pullState').length, 1, 'no second pull right after');
    b.win.close();
  }

  // ── N. Sheet rows say their unit; the backup copy carries the extras ──
  {
    const b = await run(SA);
    const rows = JSON.parse(b.win.eval(`JSON.stringify(historyToWorkoutRows(getHistory().slice(-2)))`));
    ok(rows.length > 0 && rows.every(r => r.unit === 'lb'), 'every workout row has unit lb');
    b.win.close();
  }

  // ── O. Delete and restore tell the Sheet (its delete log never removes rows) ──
  {
    const srv = fakeServer();
    const b = await run(SA, { srv, wait: 2500 });
    srv.calls.length = 0;
    const id = String(hA[4].id);
    b.win.eval(`softDeleteWorkout('${id}')`); await wait(300);
    ok(srv.calls.some(c => c.action === 'deleteWorkout' && String(c.body.id) === id), 'delete sends deleteWorkout');
    const st = srv.calls.filter(c => c.action === 'saveState').pop();
    ok(st && st.body.extras && st.body.extras.deletedIds.includes(id) && st.body.extras.deletedArchive[id], 'backup copy carries the deleted list and the archived workout');
    srv.calls.length = 0;
    b.win.eval(`restoreDeletedWorkout('${id}')`); await wait(300);
    ok(srv.calls.some(c => c.action === 'undeleteWorkout' && String(c.body.id) === id), 'restore sends undeleteWorkout');
    ok(srv.calls.some(c => c.action === 'syncWorkouts' && c.body.workouts.some(w => String(w.id) === id)), 'and resends its rows');
    eq(b.win.localStorage.getItem('dcrgym_history'), SA.dcrgym_history, 'history back to exactly how it was');
    b.win.close();
  }

  // ── P. Strain on Home: from watch heart rate, vs his average for that workout type ──
  {
    const pullW = (id, end, mins) => ({ id: String(id), programId: 'p14', sessionId: 'p14_s4', sessionName: 'Pull #1 (Hypertrophy Focus)', startTime: end - mins * 60000, endTime: end, duration: mins * 60,
      sets: { p14_s4_0: [{ w: 100, r: 8, _name: 'Lat Pulldown' }] } });
    const flat = (n, b, peak) => { const a = Array(n).fill(b); if (peak) a[0] = peak; return a; };
    const e1 = AST(2026, 10, 10, 18), e2 = AST(2026, 11, 5, 18), e3 = NOW - 3600000, old = AST(2026, 8, 20, 18);
    const h = clone(hA).concat([pullW(old, old, 60), pullW(e1, e1, 60), pullW(e2, e2, 50), pullW(e3, e3, 60)]);
    const hr = { [old]: { bpm: flat(60, 170, 180), at: 1 }, [e1]: { bpm: flat(60, 140, 180), at: 1 }, [e2]: { bpm: flat(50, 140), at: 1 }, [e3]: { bpm: flat(60, 160), at: 1 } };
    const st = baseStore(h, { dcrgym_hr: hr });
    const b = await run(st);
    eq(b.win.eval('strainHrMax()'), 180, 'zones from his highest recorded heart rate (floor 175)');
    eq(b.win.eval(`workoutStrain(getHistory().find(w => w.id === '${e1}'))`), 182, '60 min mostly at 78% of max, one minute at max = 182');
    eq(b.win.eval(`strainAverage('pull', '${e3}')`), { avg: 166, n: 2 }, 'Pull floor = his Pulls before today since Sep 1 (Aug workout not counted, today not counted)');
    const home = b.win.document.getElementById('screen-home').textContent.replace(/\s+/g, ' ');
    const svgTxt = [...b.win.document.querySelectorAll('#screen-home svg text')].map(t => t.textContent.trim().toUpperCase());
    ok(!svgTxt.includes('FRONT') && !svgTxt.includes('BACK'), 'Home figure has no Front/Back labels');
    ok(b.win.document.querySelector('.premium-metrics-grid .metric-strain svg'), 'strain sits in the bottom stats row with its icon');
    ok(/strain ↑ 45% vs avg Pull/.test(home), 'Home after a workout: "strain ↑ 45% vs avg Pull" (' + (home.match(/strain[^│]*/) || [''])[0].trim() + ')');
    ok(!/\b(240|166|182|150)\b/.test(home), 'no bare strain score anywhere on Home');
    ok(!/goal/.test(home), 'the word "goal" is gone');
    b.win.eval(`showStrainInfo()`);
    await wait(400);
    eq(b.win.eval('ST.screen + "/" + ST.progressTab + "/" + ST.strainFocus'), 'history/strain/' + String(e3), 'tap opens Progress > Strain on today\'s Pull');
    const page = b.win.document.getElementById('screen-history').textContent.replace(/\s+/g, ' ');
    ok(/↑ 45% vs your last 2 Pulls/.test(page), 'the Strain page leads with the same comparison (' + (page.match(/[↑↓][^·]{0,40}Pulls/) || [''])[0] + ')');
    eq(b.win.document.querySelectorAll('#screen-history .st-dot').length, 3, 'one dot per Pull since Sep 1 with heart rate');
    ok(/By exercise/.test(page) && !/Lat Pulldown/.test(page), 'exercise detail sits behind "By exercise", not on the page');
    b.win.eval(`showStrainExercises()`);
    ok(/Lat Pulldown/.test(b.win.document.getElementById('sheet-content').textContent), 'By exercise opens a sheet listing each exercise');
    b.win.eval(`closeSheet()`);
    ok(!/\b(240|166|182|150|195|211)\b/.test(page), 'no raw strain scores on the page');
    // the rolling floor: Nov 5 only had one earlier Pull, so it has no comparison
    eq(JSON.parse(b.win.eval(`JSON.stringify(strainComparisons('pull').map(r => [r.pct, r.n]))`)), [[45, 2]], 'each Pull is judged only against the Pulls before it');
    eq([b.win.eval('strainVerdict(110, 100)'), b.win.eval('strainVerdict(111, 100)'), b.win.eval('strainVerdict(90, 100)'), b.win.eval('strainVerdict(89, 100)')], ['about', 'more', 'about', 'less'], 'about avg means within ±10%');
    const before = JSON.parse(b.win.eval(`JSON.stringify(strainStatus({ session: { name: 'Pull #1 (Hypertrophy Focus)' } }))`));
    eq(before.mode, 'after', 'same day: still shows the workout just done');
    eq(b.win.localStorage.getItem('dcrgym_history'), JSON.stringify(JSON.parse(b.win.localStorage.getItem('dcrgym_history'))), 'history stored as is');
    eq(JSON.parse(b.win.localStorage.getItem('dcrgym_history')).length, h.length, 'no workout added or removed');
    b.win.close();
    const c = await run(st, { now: NOW + 30 * 3600000 });
    const bf = JSON.parse(c.win.eval(`JSON.stringify(strainStatus({ session: { name: 'Pull #1 (Hypertrophy Focus)' } }))`));
    eq([bf.mode, bf.pct, bf.verdict, bf.lastId], ['before', 45, 'more', String(e3)], 'next day: how his last Pull compared with his Pull average');
    eq(c.win.eval(`strainLabelText(strainStatus({ session: { name: 'Pull #1 (Hypertrophy Focus)' } }))`), 'last Pull ↑ 45%', 'before a workout: "last Pull ↑ 45%", no raw score');
    const homeNext = c.win.document.getElementById('screen-home').textContent.replace(/\s+/g, ' ');
    ok(!/\b(240|166|182|150|191)\b/.test(homeNext) && !/goal/.test(homeNext), 'next day Home: no bare score, no "goal"');
    eq(c.win.eval(`strainStatus({ session: { name: 'Legs #1' } })`), null, 'no Legs heart rate yet: nothing shown');
    const few2 = clone(hr); delete few2[e2];
    const c2 = await run(baseStore(h, { dcrgym_hr: few2 }), { now: NOW + 30 * 3600000 });
    eq(c2.win.eval(`strainStatus({ session: { name: 'Pull #1 (Hypertrophy Focus)' } })`), null, 'before a workout with too few Pulls with heart rate: hidden');
    c2.win.close();
    c.win.close();
    const d = await run(baseStore(h));
    ok(!d.win.document.querySelector('.metric-strain'), 'no heart rate at all: the stat stays hidden');
    d.win.close();
    const fewHr = clone(hr); delete fewHr[e2];
    const d3 = await run(baseStore(h, { dcrgym_hr: fewHr }));
    ok(!d3.win.document.querySelector('.metric-strain'), 'only one other Pull with heart rate: no comparison shown yet');
    d3.win.close();
    const noHr = clone(hr); delete noHr[e3];
    const d2 = await run(baseStore(h, { dcrgym_hr: noHr }));
    ok(/Pull strain · syncing/.test(d2.win.document.getElementById('screen-home').textContent.replace(/\s+/g, ' ')), 'today\'s workout has no heart rate yet: "syncing", no dash or number');
    d2.win.close();
    // fetching from the script
    const srv = fakeServer({ hr: wins => Object.fromEntries(wins.map(w => [w.id, { bpm: flat(Math.round((w.end - w.start) / 60000), 135) }])) });
    const f = await run(baseStore(h), { srv, wait: 3500 });
    const got = JSON.parse(f.win.localStorage.getItem('dcrgym_hr') || '{}');
    ok(got[e3] && got[e3].bpm.length === 60, 'heart rate fetched for today\'s workout');
    ok(!got[old], 'nothing fetched before Sep 1');
    const req = srv.calls.filter(x => x.action === 'workoutHeartRate');
    ok(req.length >= 1 && req.every(x => x.key === undefined || x.key === null || typeof x.key === 'string'), 'heart-rate call made');
    srv.calls.length = 0;
    await f.win.eval('fetchWorkoutHeartRates()');
    eq(srv.calls.filter(x => x.action === 'workoutHeartRate').length, 0, 'not asked again once stored');
    eq(JSON.parse(f.win.localStorage.getItem('dcrgym_history')).map(w => w.id).sort(), h.map(w => w.id).sort(), 'history untouched by the fetch');
    eq(JSON.parse(f.win.localStorage.getItem('dcrgym_history')).length, h.length, 'same workout count after the fetch');
    f.win.close();
    // the script leaves out ids it ran short on: those are asked again later, not marked as none
    const srv3 = fakeServer({ hr: wins => ({ [wins[wins.length - 1].id]: { bpm: flat(60, 150) } }) });
    const k = await run(baseStore(h), { srv: srv3, wait: 3500 });
    const kc = JSON.parse(k.win.localStorage.getItem('dcrgym_hr') || '{}');
    ok(kc[e3] && Object.values(kc).every(v => Array.isArray(v.bpm)) && Object.keys(kc).length <= 2, 'only answered workouts are stored (one per batch); left-out ones are not marked as none');
    k.win.close();
    const srv4 = fakeServer({ hrErr: 'health-auth' });
    const m = await run(baseStore(h), { srv: srv4, wait: 3500 });
    eq(m.win.eval('ST.hrUnsupported'), true, 'Health sign-in to redo: stops asking for this open');
    eq(m.win.localStorage.getItem('dcrgym_hr'), null, 'nothing stored on an error');
    m.win.close();
    const srv2 = fakeServer({ hrUnknown: true });
    const g = await run(baseStore(h), { srv: srv2, wait: 3500 });
    eq(g.win.eval('ST.hrUnsupported'), true, 'today\'s script doesn\'t know the call: skipped quietly');
    eq(srv2.calls.filter(x => x.action === 'workoutHeartRate').length, 1, 'asked once, not in a loop');
    ok(!g.win.document.querySelector('.metric-strain'), 'and nothing shows');
    g.win.close();
  }

  // ── R. ota-40: strain right after a workout: "syncing" until the watch's heart rate is in, then a notification ──
  {
    const upW = (id, end, mins) => ({ id: String(id), programId: 'p14', sessionId: 'p14_s1', sessionName: 'Upper #1 (Strength Focus)', startTime: end - mins * 60000, endTime: end, duration: mins * 60,
      sets: { p14_s1_0: [{ w: 100, r: 8, _name: 'Bench Press' }] } });
    const flat = (n, b, peak) => { const a = Array(n).fill(b); if (peak) a[0] = peak; return a; };
    const u1 = AST(2026, 11, 10, 18), u2 = AST(2026, 11, 20, 18), uT = NOW - 20 * 60000;
    const h = clone(hA).concat([upW(u1, u1, 60), upW(u2, u2, 50), upW(uT, uT, 50)]);
    const hr0 = { [u1]: { bpm: flat(60, 140, 180), at: 1 }, [u2]: { bpm: flat(50, 140), at: 1 } };
    const srv = fakeServer({ hr: wins => Object.fromEntries(wins.map(w => [w.id, null])) });
    const shown = [];
    const b = await run(baseStore(h, { dcrgym_hr: hr0 }), { srv, wait: 3500, setup(w) { w.Notification = { permission: 'granted', requestPermission: () => Promise.resolve('granted') }; } });
    const homeT = () => b.win.document.getElementById('screen-home').textContent.replace(/\s+/g, ' ');
    ok(srv.calls.some(c => c.action === 'workoutHeartRate' && c.body.windows.some(x => x.id === String(uT))), 'heart rate asked for right after the workout');
    ok(/Upper strain · syncing/.test(homeT()), 'Home right after: "Upper strain · syncing" (' + (homeT().match(/\S+ strain[^│]*/) || [''])[0].trim() + ')');
    b.win.eval(`showStrainInfo()`);
    ok(/hasn't reached Google yet/.test(b.win.document.body.textContent) && /notification when it's ready/.test(b.win.document.body.textContent), 'tap explains it and says a notification will come');
    b.win.eval(`closeSheet()`);
    const nCalls = () => srv.calls.filter(c => c.action === 'workoutHeartRate').length;
    let n0 = nCalls();
    await b.win.eval('refreshHeartRates()');
    eq(nCalls(), n0, 'not asked again within 5 minutes');
    b.win.__shown = shown;
    b.win.eval(`ST.swReg = { showNotification: (t, o) => { window.__shown.push([t, o]); return Promise.resolve(); } }`);
    const age = () => b.win.eval(`(() => { const c = getHrCache(); for (const k in c) if (c[k].at > 1) c[k].at -= 6 * 60000; LS.set('dcrgym_hr', c); })()`);
    // part of it arrives: still syncing, nothing notified
    srv.cfg.hr = wins => Object.fromEntries(wins.map(w => [w.id, { bpm: flat(20, 160) }]));
    age(); await b.win.eval('refreshHeartRates()');
    eq(nCalls(), n0 + 1, 'asked again after 5 minutes');
    ok(/Upper strain · syncing/.test(homeT()), 'only part of the heart rate in: still syncing');
    eq(shown.length, 0, 'no notification yet');
    // less than before never replaces what's stored
    srv.cfg.hr = wins => Object.fromEntries(wins.map(w => [w.id, { bpm: flat(10, 160) }]));
    age(); await b.win.eval('refreshHeartRates()');
    eq(b.win.eval(`getHrCache()['${uT}'].bpm.filter(x => x > 0).length`), 20, 'a smaller answer never replaces heart rate already stored');
    srv.cfg.hr = wins => Object.fromEntries(wins.map(w => [w.id, null]));
    age(); await b.win.eval('refreshHeartRates()');
    eq(b.win.eval(`getHrCache()['${uT}'].bpm.length`), 20, 'an empty answer never wipes it either');
    // all of it arrives
    srv.cfg.hr = wins => Object.fromEntries(wins.map(w => [w.id, { bpm: flat(50, 160) }]));
    age(); await b.win.eval('refreshHeartRates()');
    ok(/strain ↑ 20% vs avg Upper/.test(homeT()), 'filled in on Home: "strain ↑ 20% vs avg Upper" (' + (homeT().match(/strain[^│]*/) || [''])[0].trim() + ')');
    eq(shown.length, 1, 'one notification');
    eq([shown[0][0], shown[0][1].body, shown[0][1].tag], ['Upper strain is in', 'Strain ↑ 20% vs avg Upper', 'dcr-strain'], 'notification says what it came to');
    ok(!/\b(200|182|150|166)\b/.test(homeT()) && !/\b(200|182|150|166)\b/.test(shown[0][1].body), 'no raw score on Home or in the notification');
    age(); await b.win.eval('refreshHeartRates()');
    eq(nCalls(), n0 + 4, 'complete heart rate is not asked for again');
    eq(b.win.eval('notifyStrainReady()'), false, 'never notified twice for the same workout');
    eq(b.win.localStorage.getItem('dcrgym_history'), JSON.stringify(JSON.parse(b.win.localStorage.getItem('dcrgym_history'))), 'history stored as is');
    eq(H(b.win).length, h.length, 'no workout added or removed');
    eq(countSets(H(b.win)), countSets(h), 'every set kept');
    b.win.close();
    // notifications not allowed yet: the sheet offers Notify me; nothing is shown without permission
    const srv2 = fakeServer({ hr: wins => Object.fromEntries(wins.map(w => [w.id, null])) });
    const c = await run(baseStore(h, { dcrgym_hr: hr0 }), { srv: srv2, wait: 3500, setup(w) { w.Notification = { permission: 'default', requestPermission: () => Promise.resolve('granted') }; } });
    c.win.eval(`showStrainInfo()`);
    ok(/Notify me/.test(c.win.document.body.textContent), 'no permission yet: the sheet offers Notify me');
    c.win.close();
    // three hours on with no heart rate at all: the syncing line goes away
    const d = await run(baseStore(h, { dcrgym_hr: Object.assign(clone(hr0), { [uT]: { none: 1, at: uT } }) }), { srv: fakeServer({ hr: wins => Object.fromEntries(wins.map(w => [w.id, null])) }), wait: 3500, now: uT + 3.5 * 3600000 });
    ok(!/syncing/.test(d.win.document.getElementById('screen-home').textContent), 'after 3 hours with no heart rate: no syncing line left behind');
    d.win.close();
    // no other Upper with heart rate: nothing to compare with, so no syncing line either
    const e = await run(baseStore(h, { dcrgym_hr: { [u1]: hr0[u1] } }), { srv: fakeServer({ hr: wins => Object.fromEntries(wins.map(w => [w.id, null])) }), wait: 3500 });
    ok(!e.win.document.querySelector('.metric-strain'), 'only one other Upper with heart rate: nothing shown');
    e.win.close();
  }

  // ── Q. ota-38: a start time after the finish is set from the first set, with its own Undo ──
  {
    const e1 = AST(2026, 11, 20, 9, 30), e2 = AST(2026, 11, 21, 9, 0);
    const wA = { id: 'sx1', programId: 'p14', sessionId: 'p14_s4', sessionName: 'Pull #1 (Hypertrophy Focus)', startTime: e1 + 7 * 3600000, endTime: e1, duration: 2900,
      sets: { p14_s4_0: [{ w: 100, r: 8, ts: e1 - 48 * 60000, _name: 'Lat Pulldown' }, { w: 100, r: 8, ts: e1, _name: 'Lat Pulldown' }] } };
    const wB = { id: 'sx2', programId: 'p14', sessionId: 'p14_s2', sessionName: 'Lower #1 (Strength Focus)', startTime: e2 + 3600000, endTime: e2, duration: 3000,
      sets: { p14_s2_0: [{ w: 200, r: 5, _name: 'Deadlift' }] } };
    const h = clone(hA).concat([wA, wB]);
    const b = await run(baseStore(h));
    const got = H(b.win);
    const a = got.find(w => w.id === 'sx1'), bb = got.find(w => w.id === 'sx2');
    eq([a.startTime, a._startFix.from, a.endTime], [e1 - 48 * 60000, e1 + 7 * 3600000, e1], 'start from the first set, old start kept, end unchanged');
    eq([bb.startTime, bb._startFix.from], [e2 - 3000 * 1000, e2 + 3600000], 'no set times: start = end minus the saved duration');
    eq(got.filter(w => !w.id.startsWith('sx')), JSON.parse(JSON.stringify(hA)).map(w => got.find(x => x.id === w.id)), 'other workouts untouched');
    eq(got.filter(w => w._startFix).length, 2, 'only the two bad ones fixed');
    eq(b.win.eval(`undoDateFixFor('start:sx1')`), true, 'Undo works');
    const u = H(b.win).find(w => w.id === 'sx1');
    eq([u.startTime, !!u._startFix, !!(u._dateFixUndone && u._dateFixUndone.startFix)], [e1 + 7 * 3600000, false, true], 'old start back, undo recorded');
    const st = dumpStore(b.win); b.win.close();
    const c = await run(st);
    eq(c.win.localStorage.getItem('dcrgym_history'), st.dcrgym_history, 'undone fix is not redone; reopen changes nothing');
    eq(H(c.win).length, h.length, 'no workout added or removed');
    c.win.close();
  }

  console.log(`safety tests: ${passed} passed`);
  process.exit(0);
})().catch(e => { console.error('FAIL:', e.message); console.error(e.stack.split('\n').slice(1, 4).join('\n')); console.log(`(${passed} passed before the failure)`); process.exit(1); });
