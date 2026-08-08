# ⚡ Quick Start: Use in ChatGPT (5 Minutes)

## 🎯 Goal
Get your hotel booking app working directly in ChatGPT.

---

## Step 1: Deploy (2 minutes)

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select: `moengage/webSDK-sample`
4. Branch: `feat/chatgpt-app-integration`
5. **Root Directory**: `chatgpt-app-sample` ⚠️ **IMPORTANT**
6. Add Environment Variables:
   - `NEXT_PUBLIC_MOENGAGE_DATACENTER` = `dc_01`
   - `NEXT_PUBLIC_MOENGAGE_APP_ID` = `3RADPYNEBZ2MCOJ43EEW5FWV`
7. Click **"Deploy"**
8. **Copy your URL**: `https://your-app.vercel.app`

---

## Step 2: Update URLs (1 minute)

Update these files with your Vercel URL:

**File: `public/ai-plugin.json`**
```json
{
  "api": {
    "url": "https://YOUR-URL.vercel.app/.well-known/openapi.yaml"
  }
}
```

**File: `public/.well-known/openapi.yaml`**
```yaml
servers:
  - url: https://YOUR-URL.vercel.app
```

Then:
```bash
git add public/
git commit -m "Update URLs"
git push
```

---

## Step 3: Create ChatGPT GPT (1 minute)

1. Go to: **https://platform.openai.com/**
2. Click **"GPTs"** → **"Create"**
3. Name: `Hotel Booking Assistant`
4. **Widget URL**: `https://YOUR-URL.vercel.app`
5. **Widget CSP**:
   ```json
   {
     "openai/widgetCSP": {
       "connect_domains": ["https://*.moengage.com"],
       "resource_domains": ["https://js.moengage.com", "https://cdn.moengage.com"]
     }
   }
   ```
6. Click **"Save"**

---

## Step 4: Use It! (1 minute)

1. Go to: **https://chat.openai.com**
2. Click your name → **"My GPTs"**
3. Select **"Hotel Booking Assistant"**
4. Try: `"I want to book a hotel in Paris"`

**Done!** 🎉

---

## ✅ Verify

- Widget appears in ChatGPT ✅
- Can search hotels ✅
- Can complete booking ✅
- MoEngage tracking works ✅

---

**That's it! Your app is now live in ChatGPT!** 🚀

