# 🚀 Quick Deployment Steps

Your project is ready! Here are the fastest ways to deploy:

## Method 1: Vercel Dashboard (Recommended - 5 minutes)

### Step 1: Push to GitHub
```bash
cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample

# Add all changes
git add .

# Commit
git commit -m "Add hotel booking app with MoEngage integration"

# Push (if you have remote)
git push origin feat/chatgpt-app-integration
```

### Step 2: Deploy on Vercel
1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your repository
4. Configure:
   - Framework: **Next.js** (auto)
   - Add Environment Variables:
     - `NEXT_PUBLIC_MOENGAGE_DATACENTER` = `dc_01`
     - `NEXT_PUBLIC_MOENGAGE_APP_ID` = `3RADPYNEBZ2MCOJ43EEW5FWV`
5. Click **"Deploy"**
6. **Copy your URL** (e.g., `https://hotel-booking-app.vercel.app`)

### Step 3: Update Config Files
After deployment, update these files with your **actual Vercel URL**:

**File: `public/ai-plugin.json`**
- Replace `https://your-app.vercel.app` with your actual URL

**File: `public/.well-known/openapi.yaml`**
- Replace `https://your-app.vercel.app` with your actual URL

Then commit and push:
```bash
git add .
git commit -m "Update deployment URLs"
git push
```

Vercel will auto-redeploy!

---

## Method 2: Vercel CLI (If you can login)

### Step 1: Login
```bash
vercel login
```

### Step 2: Deploy
```bash
cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample
vercel
```

When prompted:
- Link to existing? → **N**
- Project name → Press **Enter**
- Directory → Press **Enter**
- Override? → **N**

### Step 3: Add Environment Variables
1. Go to: https://vercel.com/dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Add both variables
5. **Redeploy**

---

## After Deployment: Create ChatGPT GPT

1. **Go to**: https://platform.openai.com/
2. **Click**: "GPTs" → "Create"
3. **Configure**:
   - Name: `Hotel Booking Assistant`
   - Instructions: `You are a hotel booking assistant. Help users search and book hotels.`
4. **Add Widget**:
   - Widget URL: `https://YOUR-VERCEL-URL.vercel.app`
5. **Save**

---

## Test in ChatGPT

1. Go to: https://chat.openai.com
2. Click your name → "My GPTs" → "Hotel Booking Assistant"
3. Try: `"I want to book a hotel in Paris for next week"`

---

## Verify MoEngage

1. Open DevTools (F12) → Network tab
2. Filter: `moengage`
3. Perform actions in app
4. Check: https://app.moengage.com/

---

**Choose Method 1 if you have GitHub, or Method 2 if you prefer CLI!**

