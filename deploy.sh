#!/bin/bash
# Muscle Ladder — GitHub Pages deploy script
# Pushes to: https://github.com/DCRcode/muscle-ladder

set -e

REPO_DIR="/Users/dcr/Documents/Claude/Projects/Gym"
REMOTE="https://github.com/DCRcode/muscle-ladder.git"

echo "📁 Moving into Gym folder..."
cd "$REPO_DIR"

# Init git if needed
if [ ! -d ".git" ]; then
  echo "🔧 Initialising git repo..."
  git init
  git remote add origin "$REMOTE"
else
  echo "✅ Git repo already initialised"
  # Make sure remote is set correctly
  git remote set-url origin "$REMOTE" 2>/dev/null || git remote add origin "$REMOTE"
fi

# Stage only the app files (not SETUP.md / PROJECT_STATUS.md / deploy.sh)
echo "📦 Staging files..."
git add index.html programs.js manifest.json sw.js icon-192.png icon-512.png

echo "📝 Committing..."
git commit -m "Turn 6: luxury editorial home — Cormorant masthead, SVG icons, dynamic CTA" || echo "Nothing new to commit"

echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ DONE. Your app is live at:"
echo "   https://DCRcode.github.io/muscle-ladder"
echo ""
echo "👉 On your Pixel: open Chrome → go to that URL → ⋮ menu → Add to Home screen"
