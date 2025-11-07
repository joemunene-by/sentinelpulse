# Fix Git Authentication Issue

## Problem
You're authenticated as `complexdevelopers` but trying to push to `G160-C/sentinelpulse.git`.

## Solutions

### Option 1: Use Personal Access Token (Recommended)

1. **Generate a Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "SentinelPulse Deployment"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Update Git Remote with Token:**
   ```powershell
   git remote set-url origin https://YOUR_TOKEN@github.com/G160-C/sentinelpulse.git
   ```
   Replace `YOUR_TOKEN` with your actual token.

3. **Push again:**
   ```powershell
   git push -u origin main
   ```

### Option 2: Use SSH (More Secure)

1. **Check if you have SSH key:**
   ```powershell
   ls ~/.ssh
   ```
   Look for `id_rsa` or `id_ed25519`

2. **If no SSH key, generate one:**
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   Press Enter to accept defaults.

3. **Add SSH key to GitHub:**
   ```powershell
   cat ~/.ssh/id_ed25519.pub
   ```
   Copy the output, then:
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key
   - Click "Add SSH key"

4. **Change remote to SSH:**
   ```powershell
   git remote set-url origin git@github.com:G160-C/sentinelpulse.git
   ```

5. **Push:**
   ```powershell
   git push -u origin main
   ```

### Option 3: Switch GitHub Account (Windows)

1. **Clear cached credentials:**
   ```powershell
   git credential-manager-core erase
   ```
   When prompted, enter:
   ```
   protocol=https
   host=github.com
   ```
   Press Enter twice.

2. **Push again (will prompt for credentials):**
   ```powershell
   git push -u origin main
   ```
   Enter your G160-C GitHub username and password/token.

### Option 4: Use GitHub Desktop

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your G160-C account
3. Clone your repository
4. Make changes and push through the GUI

## Quick Fix (Easiest)

**Use Personal Access Token:**

```powershell
# 1. Get token from: https://github.com/settings/tokens
# 2. Update remote:
git remote set-url origin https://YOUR_TOKEN@github.com/G160-C/sentinelpulse.git

# 3. Push:
git push -u origin main
```

## Verify It Worked

After pushing, check:
```powershell
git remote -v
```

You should see your repository URL. Then visit:
https://github.com/G160-C/sentinelpulse

Your code should be there!

## Next: Deploy to Vercel

Once your code is on GitHub:
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your `sentinelpulse` repository
4. Add environment variables
5. Deploy!

---

**Need help?** The Personal Access Token method (Option 1) is usually the fastest.
