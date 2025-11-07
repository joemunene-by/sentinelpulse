# Quick Start Guide - SentinelPulse

## ✅ Your App is Ready!

The website has been recreated and should be working. Follow these steps:

### Step 1: Make sure Node.js 18+ is installed
```powershell
node --version
# Should show v18.x.x or higher
```

### Step 2: Install dependencies (if not already done)
```powershell
npm install
```

### Step 3: Start the development server
```powershell
npm run dev
```

### Step 4: Access your app

The dev server will show you the URL. It's usually one of these:

- **Primary URL**: http://localhost:3000
- **If port 3000 is busy**: http://localhost:3001
- **If port 3001 is busy**: http://localhost:3002

**Look for this message in your terminal:**
```
VITE v5.x.x  ready in XXXX ms

➜  Local:   http://localhost:XXXX/
```

### Step 5: Open in Chrome

1. Copy the URL from the terminal (e.g., `http://localhost:3000`)
2. Open Chrome browser
3. Paste the URL in the address bar
4. Press Enter

## 🔧 Troubleshooting

### If you see "localhost refused to connect":

1. **Check if the server is running:**
   - Look at your terminal/PowerShell window
   - You should see "VITE ready" message
   - If not, the server might have crashed

2. **Check the correct port:**
   - The terminal will tell you which port it's using
   - It might not be 3000 if that port is busy

3. **Kill any old processes:**
   ```powershell
   # Find Node processes
   Get-Process -Name node
   
   # Kill all Node processes (if needed)
   Stop-Process -Name node -Force
   ```

4. **Restart the dev server:**
   ```powershell
   npm run dev
   ```

### If you see errors in the browser console:

1. Open Chrome DevTools (F12)
2. Check the Console tab for errors
3. Check the Network tab to see if files are loading

### Common Issues:

- **Port already in use**: The server will automatically try the next port (3001, 3002, etc.)
- **Module not found**: Run `npm install` again
- **Node version**: Make sure you're using Node.js 18+

## 📝 What You Should See

When the app loads correctly, you should see:

- Dark blue/navy background (#071226)
- "SentinelPulse" logo in the top left
- "Built by CEO Joe Munene" text
- Navigation menu (Dashboard, Feed, Incidents, Research, About)
- Global Threat Level badge
- Top headlines section
- Filters panel on the left
- News feed in the center
- Metrics on the right
- Timeline and heatmap sections below

## 🎯 Direct Links to Try

If the server is running, try these URLs in order:

1. http://localhost:3000
2. http://localhost:3001  
3. http://localhost:3002
4. http://127.0.0.1:3000
5. http://127.0.0.1:3001
6. http://127.0.0.1:3002

## ✅ Success Indicators

You'll know it's working when you see:
- ✅ No errors in the terminal
- ✅ "VITE ready" message
- ✅ A URL like `http://localhost:XXXX`
- ✅ The page loads in Chrome
- ✅ Dark theme with SentinelPulse branding
- ✅ News feed with 20+ items visible

---

**Need help?** Check the terminal output for the exact URL and any error messages.
