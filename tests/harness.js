// Boots the real app (index.html) inside jsdom with a given localStorage, fixed clock, network off.
// Used by the data-safety and UI tests. Never touches the network or the user's Sheet.
const fs = require('fs'), path = require('path');
const JSDOM_DIR = process.env.JSDOM_DIR || 'jsdom';
const { JSDOM, VirtualConsole } = require(JSDOM_DIR);

function boot(htmlPath, store, opts = {}) {
  const now = opts.now || Date.UTC(2026, 10, 13, 3, 0, 0); // Nov 12 2026, 11 PM AST
  let html = fs.readFileSync(htmlPath, 'utf8').replace(/<script src="fitbit-overlay\.js"><\/script>/, '');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e && (e.stack || e.message) || e)));
  vc.on('error', (...a) => { const s = a.map(String).join(' '); if (!/Storage write trapped/.test(s)) errors.push(s); });
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: opts.url || 'https://dcrcode-dev.github.io/muscle-ladder/', virtualConsole: vc,
    beforeParse(win) {
      const RealDate = win.Date; let offset = now - RealDate.now();
      class FakeDate extends RealDate { constructor(...a) { if (a.length === 0) super(RealDate.now() + offset); else super(...a); } static now() { return RealDate.now() + offset; } }
      win.Date = FakeDate; win.__advanceClock = ms => { offset += ms; };
      for (const [k, v] of Object.entries(store || {})) win.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      win.fetch = async () => { throw new TypeError('Failed to fetch'); };
      win.matchMedia = win.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
      win.scrollTo = () => {}; win.HTMLElement.prototype.scrollIntoView = function () {};
      win.navigator.vibrate = () => true;
      win.AudioContext = undefined; win.webkitAudioContext = undefined;
      win.alert = () => {};
      win.__errors = errors;
      if (opts.setup) opts.setup(win);
    },
  });
  return { dom, win: dom.window, errors };
}
function dumpStore(win) { const o = {}; for (let i = 0; i < win.localStorage.length; i++) { const k = win.localStorage.key(i); o[k] = win.localStorage.getItem(k); } return o; }
const wait = ms => new Promise(r => setTimeout(r, ms));
module.exports = { boot, dumpStore, wait };
