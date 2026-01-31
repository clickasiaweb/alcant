# Node.js Version Downgrade Guide

## Current Version
- **Installed**: Node.js v24.13.0 (Latest)
- **Recommended**: Node.js 18 LTS (Stable for MongoDB)

## Why Downgrade?
- Node.js v24 may have compatibility issues with MongoDB
- Node.js 18 LTS is proven stable for production
- Better support for MongoDB Node.js driver

## Installation Options

### Option 1: Install NVM for Windows (Recommended)

1. **Download NVM for Windows**
   ```
   https://github.com/coreybutler/nvm-windows/releases
   ```
   
2. **Install nvm-setup.exe**
   - Close all terminals
   - Run installer with default settings
   - Restart terminal

3. **Install Node.js 18 LTS**
   ```bash
   nvm install 18.20.4
   nvm use 18.20.4
   nvm list
   ```

### Option 2: Manual Install

1. **Download Node.js 18 LTS**
   ```
   https://nodejs.org/download/release/v18.20.4/
   ```
   
2. **Download**: `node-v18.20.4-x64.msi`
   
3. **Install**
   - Uninstall current Node.js v24 first
   - Install Node.js 18.20.4
   - Restart terminal

## Verification

After installation, verify the version:
```bash
node --version
# Should show: v18.20.4

npm --version
# Should show npm 10.x.x
```

## Test MongoDB Connection

After downgrading:
```bash
cd backend
node test-robust-connection.js
```

## Expected Results

With Node.js 18 LTS, you should see:
- Better MongoDB driver compatibility
- More stable connection handling
- Reduced connection errors

## Rollback (if needed)

To switch back to v24:
```bash
nvm install 24.13.0
nvm use 24.13.4
```

## Notes

- All your npm packages will work with Node.js 18
- MongoDB connection issues should be resolved
- Your project will be more production-ready
