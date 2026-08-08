# 🚀 Use Your App Directly in ChatGPT - Step by Step

This guide will help you deploy and use your hotel booking app directly in ChatGPT in just a few minutes.

---

## Step 1: Deploy to Vercel (5 minutes)

### Option A: Deploy from GitHub (Easiest)

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/new
   - Click **"Import Git Repository"**

2. **Select Your Repository**:
   - Find: `moengage/webSDK-sample`
   - Branch: `feat/chatgpt-app-integration`
   - Click **"Import"**

3. **Configure Project**:
   - Framework: **Next.js** (auto-detected)
   - Root Directory: **`chatgpt-app-sample`** ⚠️ **IMPORTANT**
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**:
   Click **"Environment Variables"** and add:
   
   **Variable 1:**
   - Name: `NEXT_PUBLIC_MOENGAGE_DATACENTER`
   - Value: `dc_01`
   - Click **"Add"**
   
   **Variable 2:**
   - Name: `NEXT_PUBLIC_MOENGAGE_APP_ID`
   - Value: `3RADPYNEBZ2MCOJ43EEW5FWV`
   - Click **"Add"**

5. **Deploy**:
   - Click **"Deploy"** button
   - Wait 2-3 minutes for deployment
   - **Copy your deployment URL** (e.g., `https://websdk-sample-xyz.vercel.app`)

### Option B: Deploy via CLI

```bash
cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample

# Login to Vercel
vercel login

# Deploy
vercel

# When prompted:
# - Link to existing? → N
# - Project name → Press Enter
# - Directory → Type: chatgpt-app-sample
# - Override? → N
```

Then add environment variables in Vercel dashboard.

---

## Step 2: Update Configuration Files

After deployment, you need to update the config files with your **actual Vercel URL**.

### 2.1 Update `public/ai-plugin.json`

Replace `https://your-app.vercel.app` with your actual URL:

```json
{
  "api": {
    "url": "https://YOUR-ACTUAL-URL.vercel.app/.well-known/openapi.yaml"
  },
  "logo_url": "https://YOUR-ACTUAL-URL.vercel.app/logo.png",
  "legal_info_url": "https://YOUR-ACTUAL-URL.vercel.app/legal"
}
```

### 2.2 Update `public/.well-known/openapi.yaml`

Replace `https://your-app.vercel.app` with your actual URL:

```yaml
servers:
  - url: https://YOUR-ACTUAL-URL.vercel.app
```

### 2.3 Commit and Push

```bash
cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample

git add public/ai-plugin.json public/.well-known/openapi.yaml
git commit -m "Update deployment URLs"
git push origin feat/chatgpt-app-integration
```

Vercel will automatically redeploy!

---

## Step 3: Create ChatGPT GPT (2 minutes)

1. **Go to OpenAI Platform**:
   - Visit: https://platform.openai.com/
   - Make sure you're logged in with **ChatGPT Plus** account

2. **Create New GPT**:
   - Click **"GPTs"** in left sidebar
   - Click **"Create"** or **"+"** button

3. **Configure Your GPT**:

   **In the "Configure" tab:**
   
   - **Name**: `Hotel Booking Assistant`
   - **Description**: `Search and book hotels with real-time availability`
   - **Instructions**: 
     ```
     You are a helpful hotel booking assistant. When users ask about hotels, 
     help them search for available hotels by destination, dates, and number of guests. 
     Use the hotel booking widget to show them options and help them complete bookings.
     ```

4. **Add Widget** (This is the key step!):

   - Scroll down to find **"Widget"** section (or look for "Additional Settings")
   - **Widget URL**: Enter your Vercel URL
     ```
     https://YOUR-ACTUAL-URL.vercel.app
     ```
   
   - **Widget CSP** (Content Security Policy) - Click to expand and add:
     ```json
     {
       "openai/widgetCSP": {
         "connect_domains": [
           "https://*.moengage.com",
           "https://api.moengage.com"
         ],
         "resource_domains": [
           "https://js.moengage.com",
           "https://cdn.moengage.com",
           "https://sdk-0X-moengage.com"
         ]
       }
     }
     ```

5. **Save Your GPT**:
   - Click **"Save"** button (top right)
   - Choose visibility:
     - **"Only me"** - For testing
     - **"Anyone with a link"** - To share with others
     - **"Public"** - Make it public
   - Click **"Confirm"**

---

## Step 4: Use in ChatGPT (1 minute)

1. **Open ChatGPT**:
   - Go to: https://chat.openai.com
   - Make sure you're logged in

2. **Access Your GPT**:
   - Click on your **profile/name** (top right corner)
   - Click **"My GPTs"**
   - Find and click **"Hotel Booking Assistant"**

3. **Start Using It!**

   Try these commands:
   
   ```
   "I want to book a hotel in Paris for next week"
   ```
   
   ```
   "Find hotels in New York from December 20 to December 25 for 2 guests"
   ```
   
   ```
   "Show me hotels in Tokyo"
   ```

4. **The Widget Will Appear!**
   - Your hotel booking app will load inside ChatGPT
   - You can search, view hotels, and complete bookings
   - All actions are tracked in MoEngage!

---

## Step 5: Verify Everything Works

### Check Widget Loading:
1. Open **Browser DevTools** (Press `F12`)
2. Go to **"Console"** tab
3. Look for any errors (should be none)
4. Check **"Network"** tab → Filter `moengage`
5. You should see SDK loading requests

### Check MoEngage Tracking:
1. Perform actions in the app:
   - Search for hotels
   - View hotel details
   - Start booking
   - Complete booking

2. Check MoEngage Dashboard:
   - Go to: https://app.moengage.com/
   - Login to your account
   - Go to **"Analytics"** → **"Events"**
   - Look for events:
     - `app_loaded`
     - `hotel_search`
     - `hotel_viewed`
     - `booking_started`
     - `booking_completed`
     - `gpt_app_session_start` ✅ (This confirms it's running in ChatGPT!)

3. Check User Attributes:
   - Go to **"Users"** section
   - Look for:
     - `gpt_app_user: true` ✅
     - `ai_platform: "chatgpt"` ✅
     - `is_gpt_app: true` ✅

---

## 🎯 Quick Reference

### Your Deployment URL Format:
```
https://websdk-sample-[random].vercel.app
```

### Widget URL in ChatGPT:
```
https://YOUR-VERCEL-URL.vercel.app
```

### Environment Variables:
```
NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
NEXT_PUBLIC_MOENGAGE_APP_ID=3RADPYNEBZ2MCOJ43EEW5FWV
```

---

## 🐛 Troubleshooting

### Widget Not Showing?

1. **Check Widget URL**:
   - Make sure it's exactly: `https://YOUR-URL.vercel.app`
   - No trailing slash
   - Must be HTTPS

2. **Check Browser Console**:
   - Press `F12` → Console tab
   - Look for errors
   - Common issues:
     - CSP errors → Check Widget CSP settings
     - CORS errors → Already handled in code
     - 404 errors → Check URL is correct

3. **Check Vercel Deployment**:
   - Go to Vercel dashboard
   - Check deployment status (should be "Ready")
   - Check build logs for errors

### MoEngage Not Tracking?

1. **Check SDK Loading**:
   - DevTools → Network tab
   - Filter: `moengage`
   - Look for `sdk.js` file loading
   - Should see 200 status

2. **Check Environment Variables**:
   - Vercel Dashboard → Settings → Environment Variables
   - Make sure both are set correctly
   - Redeploy after adding

3. **Check App ID**:
   - Verify `NEXT_PUBLIC_MOENGAGE_APP_ID` is correct
   - Check MoEngage dashboard for correct App ID

### Events Not Appearing?

1. **Wait 1-2 minutes** - Events may be delayed
2. **Check Dashboard Filters** - Make sure no date filters
3. **Check Correct App** - Verify you're looking at right MoEngage app
4. **Check Debug Logs** - Enable in `.env.local`:
   ```
   NEXT_PUBLIC_MOENGAGE_DEBUG_LOGS=1
   ```

---

## ✅ Success Checklist

- [ ] App deployed to Vercel
- [ ] Environment variables added
- [ ] Config files updated with Vercel URL
- [ ] ChatGPT GPT created
- [ ] Widget URL added
- [ ] Widget CSP configured
- [ ] GPT saved
- [ ] Widget appears in ChatGPT
- [ ] MoEngage SDK loads
- [ ] Events tracking in dashboard
- [ ] User attributes set correctly

---

## 🎉 You're Done!

Once you complete these steps, your hotel booking app will work directly in ChatGPT!

**Test it now:**
1. Open ChatGPT
2. Go to "My GPTs"
3. Select "Hotel Booking Assistant"
4. Try: `"I want to book a hotel in Paris"`

The widget will appear and you can start booking hotels! 🚀

---

## 📞 Need Help?

- **Vercel Issues**: https://vercel.com/docs
- **ChatGPT GPTs**: https://platform.openai.com/docs/guides/gpts
- **MoEngage Docs**: https://docs.moengage.com/

