# Fix for 404 Error on localhost:3000

## The Problem
The Vite server shows "ready" but the browser displays a 404 error. This is usually caused by:
1. Multiple Node processes running
2. Port conflicts
3. Browser cache issues

## Solution Steps

### Step 1: Kill All Node Processes
```powershell
Stop-Process -Name node -Force
```

### Step 2: Clear Browser Cache
1. Open Chrome
2. Press `Ctrl + Shift + Delete`
3. Select "Cached images and files"
4. Click "Clear data"

### Step 3: Restart the Server
```powershell
npm run dev
```

### Step 4: Try These URLs in Order
1. http://localhost:3000
2. http://127.0.0.1:3000
3. http://localhost:3001 (if 3000 is busy)
4. http://192.168.61.53:3000 (from your network IP)

### Step 5: Check Browser Console
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Go to Network tab
5. Refresh the page
6. Check if files are loading (should see main.jsx, index.css, etc.)

## Alternative: Use Network IP
Your server shows:
- Network: http://192.168.61.53:3000/

Try this URL in Chrome - it might work better than localhost.

## If Still Not Working

### Check if Server is Actually Running
Look at your terminal - you should see:
```
VITE v5.x.x  ready in XXXX ms
➜  Local:   http://localhost:3000/
```

If you see errors before "ready", that's the problem.

### Verify Files Exist
```powershell
Test-Path "public\index.html"  # Should return True
Test-Path "src\main.jsx"        # Should return True
Test-Path "src\App.jsx"         # Should return True
```

### Try Hard Refresh
In Chrome, press `Ctrl + Shift + R` to do a hard refresh.

### Check Firewall
Windows Firewall might be blocking the connection. Try temporarily disabling it to test.

## Expected Behavior
When working correctly:
1. Terminal shows "VITE ready"
2. Browser loads the page (not 404)
3. You see dark blue background with "SentinelPulse" logo
4. No errors in browser console

## Still Having Issues?
Share:
1. What you see in the terminal (any errors?)
2. What you see in browser console (F12 → Console tab)
3. What you see in Network tab (F12 → Network tab, then refresh)
