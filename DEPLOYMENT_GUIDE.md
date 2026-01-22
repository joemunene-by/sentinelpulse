# Deployment Guide - SentinelPulse

Complete guide to deploy SentinelPulse to GitHub and Vercel (or other free platforms).

## 🚀 Quick Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Prepare Your Code

1. **Make sure everything works locally:**
   ```powershell
   npm run build
   ```
   If this succeeds, you're ready to deploy!

2. **Create a `.env.production` file** (optional - for production API keys):
   ```env
   VITE_USE_REAL_API=true
   VITE_NEWSAPI_KEY=your_production_api_key
   ```

### Step 2: Push to GitHub

1. **Initialize Git** (if not already done):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - SentinelPulse Dashboard"
   ```

2. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `sentinelpulse` (or your choice)
   - Description: "Real-time Threat Intelligence Dashboard"
   - Choose Public or Private
   - **Don't** initialize with README (you already have one)
   - Click "Create repository"

3. **Push your code:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/sentinelpulse.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import your project:**
   - Click "Add New Project"
   - Select your `sentinelpulse` repository
   - Click "Import"

3. **Configure build settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - `VITE_USE_REAL_API` = `true`
     - `VITE_NEWSAPI_KEY` = `your_newsapi_key`
     - `VITE_USE_BACKEND` = `false` (set to `true` if you deploy backend)
     - `VITE_API_BASE_URL` = `your_backend_url/api` (only if using backend)
   - Click "Save"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://sentinelpulse.vercel.app` (or custom domain)

### Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## 🌐 Alternative: Deploy to Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Netlify

1. **Go to Netlify:**
   - Visit https://www.netlify.com
   - Sign up/Login with GitHub

2. **Import your project:**
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Click "Connect"

3. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Click "Show advanced"
   - Add environment variables:
     - `VITE_USE_REAL_API` = `true`
     - `VITE_NEWSAPI_KEY` = `your_newsapi_key`

4. **Deploy:**
   - Click "Deploy site"
   - Your app will be live at `https://random-name.netlify.app`

## 📦 Alternative: Deploy to GitHub Pages

### Step 1: Update package.json

Add this to your `package.json`:
```json
{
  "homepage": "https://.github.io/sentinelpulse",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 2: Install gh-pages

```powershell
npm install --save-dev gh-pages
```

### Step 3: Update vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for better portability across different hosting environments
  server: {
    port: 3000,
    open: true,
    host: true
  }
})
```

### Step 4: Deploy

```powershell
npm run deploy
```

Your app will be at: `https://YOUR_USERNAME.github.io/sentinelpulse`

## 🔧 Pre-Deployment Checklist

- [ ] Test build locally: `npm run build`
- [ ] Check `.env` file is in `.gitignore` (it should be)
- [ ] Remove any console.logs or debug code
- [ ] Update README.md with deployment URL
- [ ] Test all features work in production build
- [ ] Verify API keys are set in deployment platform
- [ ] **Backend:** Decide if you want to deploy backend (optional - frontend works without it)

## 🔌 Backend Deployment (Optional)

**Important:** The frontend works perfectly without the backend! It will automatically:
1. Try backend API (if enabled)
2. Fall back to real APIs (NewsAPI, CISA)
3. Fall back to mock data

### Option 1: Deploy Backend to Render (Recommended - Free)

1. **Push backend to GitHub:**
   ```powershell
   cd SentinelPulse-Backend
   git init
   git add .
   git commit -m "Backend API"
   git remote add origin https://github.com/YOUR_USERNAME/sentinelpulse-backend.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect your backend repository
   - Settings:
     - **Name:** sentinelpulse-api
     - **Environment:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variable:
     - `DATABASE_URL` = `sqlite:///./sentinelpulse.db` (or PostgreSQL URL)
   - Click "Create Web Service"
   - Your backend will be at: `https://sentinelpulse-api.onrender.com`

3. **Update Frontend Environment Variables:**
   In your frontend deployment (Vercel/Netlify):
   - `VITE_USE_BACKEND` = `true`
   - `VITE_API_BASE_URL` = `https://sentinelpulse-api.onrender.com/api`

### Option 2: Deploy Backend to Railway (Free Tier Available)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your backend repository
5. Railway auto-detects Python and FastAPI
6. Add environment variable: `DATABASE_URL`
7. Deploy!

### Option 3: Keep Backend Local (Development Only)

If you only want backend for local development:
- Keep `VITE_USE_BACKEND=false` in production
- Frontend will use real APIs (NewsAPI, CISA) or mock data
- Backend only runs locally for testing

### Backend Deployment Checklist

- [ ] Backend repository pushed to GitHub
- [ ] Backend deployed to Render/Railway/etc.
- [ ] Database configured (SQLite or PostgreSQL)
- [ ] CORS configured for frontend domain
- [ ] Frontend environment variables updated
- [ ] Test backend API endpoints work
- [ ] Test frontend connects to backend

## 🐛 Common Deployment Issues

### Build Fails

**Error: "Module not found"**
- Run `npm install` locally first
- Make sure all dependencies are in `package.json`
- Check `node_modules` is in `.gitignore`

**Error: "Environment variables not found"**
- Add them in Vercel/Netlify dashboard
- Make sure they start with `VITE_` prefix
- Redeploy after adding variables

### App Shows Blank Page

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Base path in `vite.config.js` (for GitHub Pages)
4. Environment variables are set correctly

### CORS Errors in Production

**Solution:**
- Use a backend proxy for API calls
- Or use Vercel/Netlify serverless functions
- See `src/api/README_API.md` for details
- **Note:** If using backend, make sure CORS is configured for your frontend domain

### Backend Connection Issues

**Frontend works without backend:**
- The frontend automatically falls back to real APIs or mock data
- Set `VITE_USE_BACKEND=false` if you don't want to use backend
- Backend is completely optional

**If using backend:**
- Make sure backend is deployed and accessible
- Check `VITE_API_BASE_URL` points to correct backend URL
- Verify CORS allows your frontend domain
- Check backend logs for errors

## 📝 Post-Deployment

1. **Test your live site:**
   - Check all pages load
   - Test filters and search
   - Verify real-time updates work
   - Test on mobile devices

2. **Update README:**
   - Add deployment URL
   - Update screenshots
   - Add live demo link

3. **Share your app:**
   - Add to your portfolio
   - Share on social media
   - Update LinkedIn/GitHub profile

## 🎯 Recommended: Vercel

**Why Vercel?**
- ✅ Free tier is generous
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Automatic deployments from GitHub
- ✅ Great performance (CDN)
- ✅ Easy environment variable management
- ✅ Preview deployments for PRs

## 📊 Deployment Comparison

| Platform | Free Tier | Custom Domain | Auto Deploy | Best For |
|----------|-----------|---------------|-------------|----------|
| **Vercel** | ✅ Excellent | ✅ Free | ✅ Yes | **Recommended** |
| **Netlify** | ✅ Good | ✅ Free | ✅ Yes | Good alternative |
| **GitHub Pages** | ✅ Free | ❌ No | ⚠️ Manual | Static sites |
| **Render** | ✅ Limited | ✅ Free | ✅ Yes | Full-stack apps |

## 🚀 Quick Start Commands

```powershell
# 1. Build locally to test
npm run build

# 2. Initialize Git (if needed)
git init
git add .
git commit -m "Ready for deployment"

# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sentinelpulse.git
git push -u origin main

# 4. Deploy to Vercel (via dashboard or CLI)
# Visit vercel.com and import your repo
```

## ✅ Success!

Once deployed, your app will be live and accessible worldwide! 🎉

**Next Steps:**
- Share your deployment URL
- Monitor analytics (if added)
- Set up custom domain
- Add more features based on feedback

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- GitHub Pages: https://pages.github.com
