# Gym & Hypertrophy Spoke — Master Operating Manual & Sitemap

## 1. Domain Scope & Schedule Anchor
- **Spoke Focus**: Daniel Cruz Rosso (DCR)'s strength and hypertrophy progression tracking, Muscle Ladder workout definitions, and workout logging.
- **Daily Anchor**: `17:30 (5:30 PM AST)` non-negotiable hypertrophy training window.

## 2. Architecture & File Sitemap
- **Progression Database**: [`programs.js`](file:///Users/dcr/Documents/LLMs/Projects/Gym/programs.js) — Contains structured JSON array of exercise blocks, target RPE, rep ranges, progression rules, and session definitions.
- **Web PWA Application**:
  - [`index.html`](file:///Users/dcr/Documents/LLMs/Projects/Gym/index.html) — Mobile-optimized single-page web app for in-gym workout tracking.
  - [`manifest.json`](file:///Users/dcr/Documents/LLMs/Projects/Gym/manifest.json) & [`sw.js`](file:///Users/dcr/Documents/LLMs/Projects/Gym/sw.js) — Progressive Web App configuration and offline caching.
  - `icon-192.png`, `icon-512.png` — PWA home screen icons.
- **Directories**:
  - `Workouts/`: High-resolution camera logs and historical paper workout sheet photos.
  - `scripts/`: Google Apps Script bridge (`apps-script.gs`, `appsscript.json`), deployment runner (`deploy.sh`), and integration scratch notes.
  - `docs/`: Muscle Ladder and workout documentation.
  - `_Archive/`: Deprecated routines and legacy logs.

## 3. Governance & Invariants
- **Data Integrity**: Modifications to exercise definitions or progression schema must strictly preserve the existing export format in `programs.js` to ensure the PWA and Google Sheets Apps Script bridge do not fail.
- **Zero Raw Backups in Root**: Keep all deployment artifacts and Apps Script payloads within `scripts/`.
