# Quick Deployment & Testing Guide

## 🚀 Step 1: Create Environment File

Create `.env.local` file in the project root:

```bash
NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
NEXT_PUBLIC_MOENGAGE_APP_ID=3RADPYNEBZ2MCOJ43EEW5FWV
```

## 🚀 Step 2: Deploy to Vercel

Run these commands:

```bash
cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample

# Login to Vercel (if not logged in)
vercel login

# Deploy
vercel
```

**When prompted:**
- Link to existing project? → **N** (first time)
- Project name → **hotel-booking-app** (or press Enter)
- Directory → **./** (press Enter)
- Override settings? → **N** (press Enter)

**After deployment:**
- Copy the deployment URL (e.g., `https://hotel-booking-app-xyz.vercel.app`)
- You'll need this URL in the next steps!

## 🔧 Step 3: Add Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these:
   - **Name**: `NEXT_PUBLIC_MOENGAGE_DATACENTER`
   - **Value**: `dc_01`
   - Click **Save**
   
   - **Name**: `NEXT_PUBLIC_MOENGAGE_APP_ID`
   - **Value**: `3RADPYNEBZ2MCOJ43EEW5FWV`
   - Click **Save**

5. Go to **Deployments** tab
6. Click **"..."** on latest deployment → **Redeploy**

## 📝 Step 4: Update Configuration Files

After deployment, update these files with your **actual Vercel URL**:

### Update `public/ai-plugin.json`:
Replace `https://your-app.vercel.app` with your actual URL

### Update `public/.well-known/openapi.yaml`:
Replace `https://your-app.vercel.app` with your actual URL

### Then redeploy:
```bash
vercel --prod
```

## 🤖 Step 5: Create ChatGPT GPT

1. Go to: https://platform.openai.com/
2. Click **"GPTs"** → **"Create"**
3. **Configure**:
   - Name: `Hotel Booking Assistant`
   - Instructions: `You are a hotel booking assistant. Help users search and book hotels.`
4. **Add Widget**:
   - Widget URL: `https://YOUR-VERCEL-URL.vercel.app`
   - Widget CSP (if available):
     ```json
     {
       "openai/widgetCSP": {
         "connect_domains": ["https://*.moengage.com"],
         "resource_domains": ["https://js.moengage.com", "https://cdn.moengage.com"]
       }
     }
     ```
5. Click **"Save"**

## ✅ Step 6: Test in ChatGPT

1. Go to: https://chat.openai.com
2. Click your name → **"My GPTs"** → **"Hotel Booking Assistant"**
3. Try: `"I want to book a hotel in Paris for next week"`
4. Widget should appear!

## 📊 Step 7: Verify MoEngage

1. Open DevTools (F12) → Network tab
2. Filter: `moengage`
3. Perform actions in the app
4. Check MoEngage Dashboard: https://app.moengage.com/

---

**Need help?** See `TESTING_STEPS.md` for detailed instructions.

