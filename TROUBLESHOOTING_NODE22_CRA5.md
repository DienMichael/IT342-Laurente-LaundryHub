# CRA 5 + Node 22 crash (ModuleScopePlugin.js) - Quick Fix

## Symptom
`react-scripts start` crashes with:
- `react-dev-utils/ModuleScopePlugin.js: ... request.descriptionFileRoot.indexOf(...)`
- `TypeError: Cannot read properties of undefined (reading 'indexOf')`

## Root cause
`react-scripts@5.0.1` (CRA 5) / `react-dev-utils` is not compatible with **Node 22**.

## Fix (recommended)
### A) Install Node 18.x LTS (Windows)
1. Download/install **Node 18.x LTS** (NOT Node 22):
   - https://nodejs.org/en/download
2. During install, keep defaults (especially **“Add to PATH”** if shown).

### B) Switch the terminal to Node 18
1. Close ALL terminals (so PATH updates are picked up).
2. Re-open a new terminal.
3. Verify:
   - `node -v`  → should show `18.x.x`.

### C) Start the app
From `frontend/laundry-app`:
- `npm start`


## Commands (PowerShell-friendly)
```powershell
cd frontend\laundry-app
npm start
```

## Verify Node version
```powershell
node -v
```
Should be in the `18.x` line.

## If you still cannot start
Paste back:
- `node -v`
- first ~30 lines of `npm start` output

