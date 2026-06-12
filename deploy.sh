#!/bin/bash
# DCR Gym — GitHub Pages deploy
# Usage: ./deploy.sh "commit message"

set -e

REPO_DIR="/Users/dcr/Documents/Claude/Projects/Gym"
REMOTE="https://github.com/DCRcode-dev/muscle-ladder.git"
MSG="${1:-chore: deploy $(date '+%Y-%m-%d %H:%M')}"

cd "$REPO_DIR"

if [ ! -d ".git" ]; then
  git init
  git remote add origin "$REMOTE"
else
  git remote set-url origin "$REMOTE" 2>/dev/null || git remote add origin "$REMOTE"
fi

echo "📦 Staging app files..."
git add index.html programs.js manifest.json sw.js icon-192.png icon-512.png apps-script.gs appsscript.json .gitignore deploy.sh SETUP.md 2>/dev/null || true

echo "📝 Committing: $MSG"
git commit -m "$MSG" || echo "Nothing new to commit"

echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Live at: https://dcrcode-dev.github.io/muscle-ladder"
echo "👉 Pixel: open the URL in Chrome → it updates on next launch (or ⋮ → refresh)"
