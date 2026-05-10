# Switch Node version on Windows (so CRA 5 works)

## Current problem
Your terminal is still using Node 22 (`node -v` shows `v22...`), so CRA 5 (`react-scripts@5.0.1`) crashes.

## Option 1 (best): use nvm-windows
### 1) Install nvm-windows
- Download: https://github.com/coreybutler/nvm-windows/releases
- Install the installer (nvm-setup.exe)

### 2) Install the Node version(s)
Open a NEW terminal and run:
```powershell
nvm install 18.20.4
nvm install 20.18.1
```

### 3) Switch to Node 18 (try 18 first)
```powershell
nvm use 18.20.4
node -v
```

If you still want to try Node 20:
```powershell
nvm use 20.18.1
node -v
```

### 4) Start the app
```powershell
cd frontend\laundry-app
npm start
```

## Option 2: uninstall Node 22
1. Settings → Apps → Installed apps
2. Uninstall **Node.js (22.x)**
3. Reopen terminal
4. Verify:
   - `node -v`
5. Start app.

## What you must confirm after switching
After switching, in the same terminal where you run `npm start`, run:
```powershell
node -v
where.exe node
```
You must see Node 18.x/20.x (not 22.x). 

