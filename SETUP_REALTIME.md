# Real-Time Threat Intelligence Setup Guide

## ✅ Quick Setup (5 minutes)

### Step 1: Get NewsAPI Key (Free)

1. Go to https://newsapi.org/
2. Click "Get API Key" 
3. Sign up (free tier: 100 requests/day)
4. Copy your API key

### Step 2: Create .env File

In your project root, create a file named `.env`:

```env
VITE_USE_REAL_API=true
VITE_NEWSAPI_KEY=your_actual_api_key_here
```

**Replace `your_actual_api_key_here` with your actual NewsAPI key**

### Step 3: Restart Dev Server

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🎯 What You Get

- ✅ **Real cybersecurity news** from NewsAPI
- ✅ **CISA security advisories** (automatically included, no key needed)
- ✅ **Auto-refresh every 5 minutes**
- ✅ **Real-time threat updates**
- ✅ **Automatic severity detection**
- ✅ **Smart tag extraction**

## 📊 Current Sources

1. **NewsAPI** - Latest cybersecurity news articles
   - Requires: API key (free)
   - Updates: Real-time
   
2. **CISA RSS Feed** - U.S. Cybersecurity advisories
   - Requires: Nothing (free)
   - Updates: Real-time

## 🔍 How It Works

The app will:
1. Fetch real news from NewsAPI
2. Fetch CISA advisories automatically
3. Combine with mock data for demonstration
4. Auto-refresh every 5 minutes
5. Fall back to mock data if APIs fail

## 🐛 Troubleshooting

### "No real news showing"

1. Check your `.env` file exists in project root
2. Verify `VITE_USE_REAL_API=true`
3. Verify your NewsAPI key is correct
4. Check browser console for errors
5. Restart the dev server after creating `.env`

### "CORS errors"

- The app uses a CORS proxy for development
- For production, set up a backend proxy
- See `src/api/README_API.md` for production setup

### "Still seeing only mock data"

- Make sure `.env` file is in the project root (not in `src/`)
- Restart the dev server after creating `.env`
- Check terminal for any error messages
- Verify your NewsAPI key is valid

## 📝 Example .env File

```env
# Enable real-time updates
VITE_USE_REAL_API=true

# Your NewsAPI key (get free key at https://newsapi.org/)
VITE_NEWSAPI_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## ✅ Verification

After setup, you should see:
- News articles with recent timestamps (today/this week)
- CISA advisories in the feed
- Real source names (not just "Security Daily")
- Auto-refreshing content every 5 minutes

## 🚀 Next Steps

For production, consider:
- Setting up a backend proxy (avoid CORS issues)
- Adding more sources (VirusTotal, MISP, etc.)
- See `src/api/README_API.md` for advanced integration
