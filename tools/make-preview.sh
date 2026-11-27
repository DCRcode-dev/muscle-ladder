#!/bin/bash
# Copies a candidate build to preview/index.html so it can be tried at …/muscle-ladder/preview/
# before it replaces the real app. The preview reads the workouts on the phone but saves nothing,
# sends nothing to the Sheet and never installs itself (see IS_PREVIEW in index.html, and sw.js).
# Usage: tools/make-preview.sh [candidate.html]   (default: ./index.html)
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${1:-index.html}"
mkdir -p preview
python3 -I - "$SRC" preview/index.html <<'PY'
import sys, re
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
if '<base href="../">' not in s:
    s, n = re.subn(r'(<head[^>]*>)', r'\1\n<base href="../">', s, count=1)
    if n != 1: sys.exit('no <head> tag found')
open(dst, 'w', encoding='utf-8').write(s)
PY
grep -q "IS_PREVIEW" preview/index.html || { echo "this build has no preview guard; refusing"; rm -f preview/index.html; exit 1; }
echo "preview/index.html ready. Commit it alone; the real app (index.html) is unchanged."
