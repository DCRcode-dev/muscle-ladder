# Muscle Ladder — Project Status

**Last updated:** May 2026  
**Status:** App is built and patched. Awaiting user review before deployment.

---

## ✅ Completed

- [x] All 8 Muscle Ladder programs coded in `programs.js`
- [x] Full PWA built in `index.html` (home → session picker → workout → history → settings)
- [x] Rest timer (auto-fires fullscreen after each set)
- [x] Previous weight auto-populated from history
- [x] Substitution sheet with last-used weight hints
- [x] Per-exercise notes (permanent)
- [x] Live volume tracking in workout header
- [x] Workout duration timer
- [x] Finish summary overlay
- [x] Google Sheets sync via Apps Script (`apps-script.gs`)
- [x] Strong CSV import — **fixed**: semicolon delimiter, skips warmup rows ("W") and "Rest Timer" rows, only imports numeric Set Order rows (working sets)
- [x] Exercise name normalization — **fixed**: strips `"(Barbell)"` suffixes, alias map, fuzzy containment matching so Strong history links correctly to program exercises
- [x] Light mode UI
- [x] PWA manifest + service worker (offline, installable on Android)
- [x] SETUP.md deployment guide written
- [x] PROJECT_INSTRUCTIONS.md + PROJECT_STATUS.md (this file) created

---

## 🔜 Next Steps (in order)

### 1. DCR reviews the app (CURRENT STEP)
- Open `muscle-ladder/index.html` in a browser
- Test all screens: home → day picker → program → session → workout → finish
- Check exercise names match the book
- Check UI/UX feel — compare to Strong
- Give feedback for any fixes needed

### 2. Fix any issues from review
- Adjust exercise names, sets, reps, rest times if they don't match the book
- Fix any UI bugs or missing features
- Edit `programs.js` for exercise data changes, `index.html` for UI/logic changes

### 3. Deploy to GitHub Pages (free hosting)
Per `SETUP.md` Step 1:
1. Create public repo `muscle-ladder` on github.com
2. Upload: `index.html`, `programs.js`, `manifest.json`, `sw.js`
3. Settings → Pages → Deploy from branch → main
4. App live at `https://YOUR-USERNAME.github.io/muscle-ladder`

### 4. Set up Google Sheets backend
Per `SETUP.md` Step 2:
1. Create new Google Sheet named "Muscle Ladder Data"
2. Extensions → Apps Script → paste `apps-script.gs` → Save
3. Deploy → New deployment → Web app → Execute as Me → Anyone
4. Copy the URL
5. In app → Settings → paste URL → Test Connection → should show ✅

### 5. Install as Android app
Per `SETUP.md` Step 3:
1. Open Chrome on Android → navigate to GitHub Pages URL
2. ⋮ menu → Add to Home screen → "Muscle Ladder"
3. Works offline, looks like a native app

### 6. Import Strong history
Per `SETUP.md` Step 4:
1. Strong app → Profile → Settings → Export Data → CSV (will email it)
2. In Muscle Ladder app → Settings → Import from Strong → choose the CSV
3. All previous weights now show as "Last time" hints during workouts

---

## Key files reference

| File | Purpose | Edit when... |
|------|---------|--------------|
| `programs.js` | All program/exercise data | Exercise names, sets, reps, rest, substitutions are wrong |
| `index.html` | Entire app (UI + logic) | UI changes, feature changes, bug fixes |
| `apps-script.gs` | Google Sheets backend | Changing what data syncs to Sheets |
| `manifest.json` | PWA install config | App name, icon, colors for Android install |
| `sw.js` | Offline service worker | Caching strategy |
| `SETUP.md` | Deployment guide | Reference for Steps 3–6 above |

---

## Known issues / watch out for

- **Exercise name mismatches**: If a "Last time" weight isn't showing, the exercise name in `programs.js` may not fuzzy-match the Strong export name. Add an alias to `EX_ALIASES` in `index.html` or rename the exercise in `programs.js`.
- **Service worker caching**: After uploading new versions to GitHub, do a hard refresh on the phone (clear site data or re-add to home screen) to bust the cache.
- **Google Apps Script CORS**: The Apps Script URL must be deployed with "Anyone" access. If sync fails, re-deploy a new version (the URL changes each deploy).
