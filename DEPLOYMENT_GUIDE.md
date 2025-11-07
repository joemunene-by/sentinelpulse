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
  "homepage": "https://YOUR_USERNAME.github.io/sentinelpulse",
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
  base: '/sentinelpulse/', // Replace with your repo name
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
