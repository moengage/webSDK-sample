# Step-by-Step ChatGPT Testing Guide

Follow these steps to test your hotel booking app in ChatGPT.

## Step 1: Deploy Your App to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample
   vercel
   ```

4. **Follow prompts**:
   - Link to existing project? **N** (for first time)
   - Project name: **hotel-booking-app** (or your choice)
   - Directory: **./** (current directory)
   - Override settings? **N**

5. **Note your deployment URL**: 
   - You'll get something like: `https://hotel-booking-app-xyz.vercel.app`
   - **IMPORTANT**: Copy this URL - you'll need it!

6. **Add Environment Variables in Vercel Dashboard**:
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_MOENGAGE_DATACENTER` = `dc_01`
     - `NEXT_PUBLIC_MOENGAGE_APP_ID` = `3RADPYNEBZ2MCOJ43EEW5FWV`
   - Click "Save"
   - Redeploy: Go to Deployments → Click "..." → "Redeploy"

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository (or drag & drop your project folder)
3. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **./**
4. Add Environment Variables:
   - `NEXT_PUBLIC_MOENGAGE_DATACENTER` = `dc_01`
   - `NEXT_PUBLIC_MOENGAGE_APP_ID` = `3RADPYNEBZ2MCOJ43EEW5FWV`
5. Click "Deploy"
6. Wait for deployment to complete
7. Copy your deployment URL

---

## Step 2: Update Configuration Files

After deployment, update these files with your actual deployment URL:

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

### 2.3 Redeploy After Changes

```bash
vercel --prod
```

Or push to GitHub if using GitHub integration.

---

## Step 3: Create ChatGPT GPT

1. **Go to OpenAI Platform**:
   - Visit: https://platform.openai.com/
   - Login with your ChatGPT Plus account

2. **Navigate to GPTs**:
   - Click "GPTs" in the left sidebar
   - Click "Create" or "+" button

3. **Configure GPT**:
   
   **Configure Tab:**
   - **Name**: `Hotel Booking Assistant`
   - **Description**: `Helps users search and book hotels with real-time availability`
   - **Instructions**: 
     ```
     You are a helpful hotel booking assistant. When users ask about hotels, 
     help them search for available hotels by destination, dates, and number of guests. 
     Use the hotel booking widget to show them options and help them complete bookings.
     ```

4. **Add Widget**:
   - Scroll down to "Additional Settings" or "Widget" section
   - **Widget URL**: `https://YOUR-ACTUAL-URL.vercel.app`
   - **Widget CSP** (if available): Add this JSON:
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

5. **Save GPT**:
   - Click "Save" button (top right)
   - Choose visibility: **"Only me"** (for testing) or **"Anyone with a link"**
   - Click "Confirm"

---

## Step 4: Test in ChatGPT

1. **Open ChatGPT**:
   - Go to: https://chat.openai.com
   - Make sure you're logged in with ChatGPT Plus

2. **Access Your GPT**:
   - Click on your profile/name (top right)
   - Click "My GPTs"
   - Find and click "Hotel Booking Assistant"

3. **Start Testing**:

   **Test 1: Basic Search**
   ```
   "I want to book a hotel in Paris for next week"
   ```
   - Expected: Widget should appear with hotel search form

   **Test 2: Specific Search**
   ```
   "Find hotels in New York from December 20 to December 25 for 2 guests"
   ```
   - Expected: Search form should appear with pre-filled dates

   **Test 3: View Hotels**
   - Click "Search" in the widget
   - Expected: Hotel results should appear

   **Test 4: Select Hotel**
   - Click on a hotel card
   - Expected: Booking form should appear

   **Test 5: Complete Booking**
   - Fill in guest information
   - Select payment method
   - Click "Complete Booking"
   - Expected: Booking confirmation

---

## Step 5: Verify MoEngage Tracking

1. **Open Browser DevTools**:
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to "Network" tab
   - Filter by: `moengage`

2. **Perform Actions**:
   - Search for hotels
   - View hotel details
   - Start booking
   - Complete booking

3. **Check Network Requests**:
   - You should see requests to `*.moengage.com`
   - Check request payloads contain event data

4. **Check MoEngage Dashboard**:
   - Login to: https://app.moengage.com/
   - Go to "Analytics" → "Events"
   - Look for events:
     - `app_loaded`
     - `hotel_search`
     - `hotel_viewed`
     - `booking_started`
     - `booking_completed`
     - `gpt_app_session_start` (if in ChatGPT)

5. **Verify User Attributes**:
   - Go to "Users" section
   - Check for attributes:
     - `gpt_app_user: true`
     - `ai_platform: "chatgpt"`
     - `is_gpt_app: true`

---

## Step 6: Troubleshooting

### Widget Not Showing?

1. **Check Widget URL**: Make sure it's correct in GPT settings
2. **Check CSP**: Verify CSP headers in browser console
3. **Check HTTPS**: Ensure your app is on HTTPS
4. **Check Console**: Look for errors in browser DevTools

### MoEngage Not Tracking?

1. **Check SDK Loading**:
   - Network tab → Filter "moengage"
   - Look for `sdk.js` file loading
   - Check for errors (red requests)

2. **Check App ID**:
   - Verify `NEXT_PUBLIC_MOENGAGE_APP_ID` is correct
   - Check environment variables in Vercel

3. **Check CSP**:
   - Browser console → Look for CSP errors
   - Verify `js.moengage.com` is allowed

4. **Check AI Bot Detection**:
   - If bot detected, events will be blocked
   - Check tracking logs in sidebar

### Events Not in Dashboard?

1. **Wait a few minutes**: Events may take 1-2 minutes to appear
2. **Check Filters**: Make sure no date/event filters are applied
3. **Check App ID**: Verify you're looking at the correct app
4. **Check Debug Logs**: Enable debug logs in `.env.local`:
   ```
   NEXT_PUBLIC_MOENGAGE_DEBUG_LOGS=1
   ```

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment
vercel ls
```

---

## Next Steps After Testing

1. ✅ Verify all events are tracking
2. ✅ Test user identification
3. ✅ Check AI detection attributes
4. ✅ Monitor MoEngage dashboard
5. ✅ Create segments for GPT app users
6. ✅ Set up alerts for conversions

---

## Support

- **MoEngage Docs**: https://docs.moengage.com/
- **OpenAI GPTs**: https://platform.openai.com/docs/guides/gpts
- **Vercel Docs**: https://vercel.com/docs

Good luck! 🚀

