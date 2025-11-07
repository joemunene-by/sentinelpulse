# Troubleshooting Guide

## Node.js Version Issue

**Problem**: You're running Node.js v16.20.2, but this project requires Node.js 18.0.0 or higher.

**Solution**: 
1. Download and install Node.js 18 LTS or higher from [nodejs.org](https://nodejs.org/)
2. After installing, restart your terminal/PowerShell
3. Verify the version: `node --version` (should show v18.x.x or higher)
4. Delete `node_modules` folder and `package-lock.json`
5. Run `npm install` again
6. Run `npm run dev`

## Path Issues with Spaces in Folder Name

**Problem**: The folder name "SentinelPulse (Cybersecurity News & Threat Intelligence Dashboard)" contains spaces which can cause path resolution issues.

**Solution**: 
1. Rename the folder to remove spaces (e.g., `SentinelPulse` or `sentinelpulse`)
2. Or, ensure you're in the correct directory when running commands
3. If issues persist, try using quotes: `cd "SentinelPulse (Cybersecurity News & Threat Intelligence Dashboard)"`

## Module Not Found Errors

**Problem**: `Cannot find module 'C:\Users\TestUser\Desktop\vite\bin\vite.js'`

**Solution**:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. If still failing, clear npm cache: `npm cache clean --force`
5. Then reinstall: `npm install`

## GitHub Permission Error

**Problem**: `Permission to G160-C/sentinelpulse.git denied`

**Solution**: This is unrelated to running the dev server. If you're trying to deploy:
1. Make sure you're authenticated with GitHub: `gh auth login`
2. Or use SSH instead of HTTPS for the repository
3. This error won't prevent `npm run dev` from working

## Quick Fix Steps

1. **Upgrade Node.js** to version 18 or higher
2. **Clean install**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. **Verify installation**:
   ```bash
   node --version  # Should be >= 18.0.0
   npm --version
   ```
4. **Run dev server**:
   ```bash
   npm run dev
   ```

## Windows PowerShell Commands

If you're on Windows PowerShell:

```powershell
# Remove node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall
npm install

# Run dev server
npm run dev
```

## Still Having Issues?

1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`
3. Check if Vite is installed: `npm list vite`
4. Try clearing npm cache: `npm cache clean --force`
5. Reinstall all dependencies: `npm install`

If problems persist, make sure you're using Node.js 18+ and all dependencies installed correctly.
