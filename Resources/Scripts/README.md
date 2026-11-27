# Server script

The live Google Apps Script (sync-v2 and later) lives only in the Apps Script
project bound to the "Muscle Ladder Data" Sheet. It is not kept in this repo.

The old `apps-script.gs` / `_apps_script_paste.txt` were removed in ota-36:
pasting them over the live script would overwrite it with a version that can
wipe Sheet history. They remain in git history only for reference. Never paste
them into the live project.

`programs.js` was also removed in ota-36. The app never loaded it; programs
live inside `index.html`.
