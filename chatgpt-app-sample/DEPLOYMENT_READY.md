# ✅ Your App is Ready for Deployment!

## Current Status

✅ **Project built successfully**  
✅ **All files committed**  
✅ **Environment variables configured**  
✅ **GitHub repository connected**

---

## 🚀 Next Steps to Deploy

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if you want to deploy from GitHub):
   ```bash
   git push origin feat/chatgpt-app-integration
   ```

2. **Go to Vercel Dashboard**:
   - Visit: **https://vercel.com/new**
   - Click **"Import Git Repository"**
   - Select: `moengage/webSDK-sample`
   - Branch: `feat/chatgpt-app-integration`

3. **Configure Project**:
   - Framework: **Next.js** (auto-detected)
   - Root Directory: **./**
   - **Add Environment Variables**:
     ```
     NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
     NEXT_PUBLIC_MOENGAGE_APP_ID=3RADPYNEBZ2MCOJ43EEW5FWV
     ```

4. **Deploy**:
   - Click **"Deploy"**
   - Wait 2-3 minutes
   - **Copy your deployment URL** (e.g., `https://websdk-sample-xyz.vercel.app`)

5. **Update Config Files**:
   - Update `public/ai-plugin.json` with your Vercel URL
   - Update `public/.well-known/openapi.yaml` with your Vercel URL
   - Commit and push:
     ```bash
     git add .
     git commit -m "Update deployment URLs"
     git push
     ```

---

### Option B: Deploy via Vercel CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```
   (This will open browser for authentication)

2. **Deploy**:
   ```bash
   cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample
   vercel
   ```

3. **Follow prompts**:
   - Link to existing? → **N**
   - Project name → Press **Enter**
   - Directory → Press **Enter**
   - Override? → **N**

4. **Add Environment Variables in Dashboard**:
   - Go to: https://vercel.com/dashboard
   - Select your project
   - **Settings** → **Environment Variables**
   - Add both variables
   - **Redeploy**

---

## 🤖 After Deployment: Create ChatGPT GPT

1. **Go to OpenAI Platform**: https://platform.openai.com/
2. **Click "GPTs"** → **"Create"**
3. **Configure**:
   - **Name**: `Hotel Booking Assistant`
   - **Description**: `Helps users search and book hotels`
   - **Instructions**: 
     ```
     You are a helpful hotel booking assistant. When users ask about hotels, 
     help them search for available hotels by destination, dates, and number of guests. 
     Use the hotel booking widget to show them options and help them complete bookings.
     ```

4. **Add Widget**:
   - Scroll to **"Widget"** section
   - **Widget URL**: `https://YOUR-VERCEL-URL.vercel.app`
   - **Widget CSP** (optional):
     ```json
     {
       "openai/widgetCSP": {
         "connect_domains": [
           "https://*.moengage.com",
           "https://api.moengage.com"
         ],
         "resource_domains": [
           "https://js.moengage.com",
           "https://cdn.moengage.com"
         ]
       }
     }
     ```

5. **Save**:
   - Click **"Save"** (top right)
   - Choose visibility: **"Only me"** or **"Anyone with a link"**

---

## ✅ Test in ChatGPT

1. **Open ChatGPT**: https://chat.openai.com
2. **Access Your GPT**:
   - Click your name (top right)
   - Click **"My GPTs"**
   - Select **"Hotel Booking Assistant"**

3. **Test Scenarios**:

   **Test 1: Basic Search**
   ```
   "I want to book a hotel in Paris for next week"
   ```
   - Expected: Widget appears with search form

   **Test 2: Specific Search**
   ```
   "Find hotels in New York from December 20 to December 25 for 2 guests"
   ```
   - Expected: Search form with pre-filled dates

   **Test 3: Complete Booking Flow**
   - Search for hotels
   - Click on a hotel
   - Fill booking form
   - Complete booking

---

## 📊 Verify MoEngage Tracking

1. **Open Browser DevTools**:
   - Press `F12` or `Cmd+Option+I`
   - Go to **"Network"** tab
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
   - Login: https://app.moengage.com/
   - Go to **"Analytics"** → **"Events"**
   - Look for events:
     - `app_loaded`
     - `hotel_search`
     - `hotel_viewed`
     - `booking_started`
     - `booking_completed`
     - `gpt_app_session_start`

5. **Verify User Attributes**:
   - Go to **"Users"** section
   - Check for:
     - `gpt_app_user: true`
     - `ai_platform: "chatgpt"`
     - `is_gpt_app: true`

---

## 🐛 Troubleshooting

### Widget Not Showing?
- Check Widget URL is correct
- Check browser console for errors
- Verify HTTPS is enabled
- Check CSP headers

### MoEngage Not Tracking?
- Check Network tab for SDK loading
- Verify App ID is correct
- Check CSP allows MoEngage domains
- Verify environment variables in Vercel

### Events Not in Dashboard?
- Wait 1-2 minutes (events may be delayed)
- Check dashboard filters
- Verify you're looking at correct app
- Check browser console for errors

---

## 📚 Documentation

- **Quick Deploy**: `QUICK_DEPLOY.md`
- **Testing Steps**: `TESTING_STEPS.md`
- **Full Guide**: `CHATGPT_TESTING_GUIDE.md`
- **Tracking Details**: `MOENGAGE_TRACKING.md`

---

**Ready to deploy? Choose Option A or B above and follow the steps!** 🚀

