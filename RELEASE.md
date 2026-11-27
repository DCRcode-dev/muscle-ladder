# Releasing a build

Rules that never change: no past workout, set or streak may change; nothing goes live without DCR's yes.

1. **Tests.** `cd tests && npm install && npm test`. They also run on every push (GitHub Actions,
   "tests" workflow). They use only synthetic data and the seed history already in `index.html`.
   Before/after counts on a copy of DCR's real history are run outside the repo (project files).
2. **Preview (optional).** `tools/make-preview.sh candidate.html`, commit only `preview/index.html`, push.
   Open `https://dcrcode-dev.github.io/muscle-ladder/preview/` on the phone. It shows his real
   workouts but writes nothing (no local saves, no vault writes, no Sheet calls, no service worker).
   Closing it and opening the app as usual goes back to the live build.
3. **Live.** Bump `APP_BUILD` in `index.html` and `CACHE` in `sw.js`, commit, push to `main` on his yes.
   `index.html` is network-first, so the next open runs the new build; the "Update ready" chip covers
   the service worker.
4. **Safety built into the app (ota-36):**
   - a save that would drop workouts he didn't delete is refused and logged (`dcrgym_save_refused`);
   - delete hides a workout and keeps a full copy; Settings › Deleted workouts restores it exactly;
   - the ota-31/32/33 one-time repairs are frozen after their first run (`dcrgym_repairs_frozen`).

The live Google Apps Script is not in this repo. Never paste an old `apps-script.gs` into it.
