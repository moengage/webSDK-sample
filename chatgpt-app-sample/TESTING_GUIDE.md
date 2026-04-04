# Testing Guide

Complete guide for testing the MoEngage Sample App locally and in ChatGPT.

## Part 1: Local Testing

### Prerequisites

- Node.js 18+ installed (or Node 12 via nvm as per project requirements)
- npm or yarn installed
- MoEngage account with App ID and Data Center
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Install Dependencies

```bash
cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK
npm install
```

Expected output:
```
added 200+ packages in 30s
```

### Step 2: Configure MoEngage

**Option A: Using Environment Variables (Recommended)**

1. Create `.env.local` file in the root directory:
```bash
touch .env.local
```

2. Add your MoEngage credentials:
```env
NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
NEXT_PUBLIC_MOENGAGE_APP_ID=YOUR_ACTUAL_APP_ID
```

**Option B: Direct Configuration**

Edit `app/page.tsx` and update the `MOENGAGE_CONFIG` object:

```typescript
const MOENGAGE_CONFIG = {
  dataCenter: 'dc_01', // Replace with your Data Center
  appId: 'YOUR_ACTUAL_APP_ID', // Replace with your App ID
  sdkVersion: '2',
  debugLogs: 1,
};
```

**How to Get Your MoEngage Credentials:**

1. Log in to your MoEngage dashboard: https://app.moengage.com
2. Navigate to **Settings** → **Apps** → **Web**
3. Copy your **App ID** (also called Workspace ID)
4. Note your **Data Center** (usually `dc_01`, `dc_02`, etc.)
   - You can find this in the SDK integration code provided by MoEngage
   - Or check the URL pattern: `https://api-XX.moengage.com` where XX is your data center number

### Step 3: Start Development Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 4: Open in Browser

1. Open your browser
2. Navigate to: `http://localhost:3000`
3. You should see the MoEngage Sample App interface

### Step 5: Verify MoEngage SDK Initialization

1. **Check the UI:**
   - Look for "MoEngage SDK Ready ✓" message at the top
   - If you see "Initializing MoEngage SDK...", wait a few seconds

2. **Check Browser Console:**
   - Open Developer Tools (F12 or Cmd+Option+I on Mac)
   - Go to Console tab
   - You should see: `MoEngage Web SDK initialised` or similar messages
   - No red error messages related to MoEngage

3. **Check Network Tab:**
   - Go to Network tab in Developer Tools
   - Filter by "moengage"
   - You should see requests to MoEngage CDN and API endpoints
   - Status should be 200 (success)

### Step 6: Test User Identification

1. Fill in the User Identification form:
   - **User ID:** `test_user_123`
   - **Name:** `Test User`
   - **Email:** `test@example.com`
   - **Mobile:** `1234567890`

2. Click **"Identify User"** button

3. **Verify:**
   - Check the Tracking Logs section - should show "User identified: test_user_123"
   - Check browser console - should see MoEngage API calls
   - Check MoEngage dashboard → Users → Search for `test_user_123`

### Step 7: Test Event Tracking

1. **Test Pre-configured Events:**
   - Click **"Track Page View"** - Check logs show success
   - Click **"Track Button Click"** - Check logs
   - Click **"Track Product View"** - Check logs
   - Click **"Track Add to Cart"** - Check logs
   - Click **"Track Purchase"** - Check logs
   - Click **"Track Search"** - Check logs

2. **Test Custom Event:**
   - Enter Event Name: `custom_test_event`
   - Enter Event Properties: `{"test_key": "test_value", "number": 123}`
   - Click **"Track Custom Event"**
   - Verify in logs and MoEngage dashboard

3. **Verify in MoEngage Dashboard:**
   - Go to MoEngage Dashboard → Analytics → Events
   - You should see all tracked events
   - Click on an event to see properties

### Step 8: Test AI Detection

1. **Check AI Detection Section:**
   - Should automatically show detection results on page load
   - **User Agent:** Should show your browser's user agent
   - **AI Bot Detected:** Should show "No" (unless you're using a bot)
   - **AI-Assisted Browser:** May show "Yes" if using Arc, etc.
   - **GPT App User:** Should show "No" (you're testing locally)

2. **Test Refresh:**
   - Click **"Refresh Detection"** button
   - Results should update

3. **Verify in MoEngage:**
   - Check user attributes in MoEngage dashboard
   - Should see: `ai_bot_detected`, `ai_assisted_browser`, `gpt_app_user` attributes

### Step 9: Test Session Management

1. **Destroy Session:**
   - Click **"Destroy Session"** button
   - Check logs for confirmation
   - Verify in MoEngage dashboard

2. **Update User ID:**
   - Click **"Update User ID"** button
   - Enter new ID: `test_user_456`
   - Check logs for confirmation

### Step 10: Verify Tracking Logs

1. All actions should appear in the **Tracking Logs** section
2. Logs should show:
   - Timestamp
   - Event/action description
   - Color coding (green for success, red for errors, blue for info)

### Step 11: Test AI Bot Detection (Optional)

To test bot detection blocking:

1. Open browser console
2. Temporarily modify user agent:
   ```javascript
   Object.defineProperty(navigator, 'userAgent', {
     get: () => 'Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)'
   });
   ```
3. Refresh the page
4. Try tracking an event
5. Should see "Event blocked (AI Bot detected)" in logs
6. Events should NOT appear in MoEngage dashboard

### Troubleshooting Local Testing

**Issue: SDK not loading**
- ✅ Check Data Center and App ID are correct
- ✅ Check internet connection
- ✅ Check browser console for errors
- ✅ Verify MoEngage CDN is accessible

**Issue: Events not appearing in MoEngage**
- ✅ Wait 1-2 minutes (events may be delayed)
- ✅ Check MoEngage dashboard → Settings → Data Pipeline
- ✅ Verify App ID is correct
- ✅ Check browser console for API errors

**Issue: Build errors**
- ✅ Clear `.next` folder: `rm -rf .next`
- ✅ Reinstall dependencies: `rm -rf node_modules && npm install`
- ✅ Check Node.js version: `node --version` (should be 18+)

---

## Part 2: Testing in ChatGPT

### Prerequisites

- Completed local testing successfully
- HTTPS server/hosting (required for ChatGPT Apps)
- OpenAI account with ChatGPT Apps access
- Domain name (or use a hosting service like Vercel)

### Step 1: Build the Application

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Linting
✓ Collecting page data
✓ Generating static pages
```

### Step 2: Deploy to HTTPS Server

**Option A: Deploy to Vercel (Recommended - Free & Easy)**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - Choose production deployment
   - Note the deployment URL (e.g., `https://your-app.vercel.app`)

4. **Set Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_MOENGAGE_DATACENTER` = `dc_01`
     - `NEXT_PUBLIC_MOENGAGE_APP_ID` = `YOUR_APP_ID`
   - Redeploy if needed

**Option B: Deploy to Netlify**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Set Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add your MoEngage credentials

**Option C: Deploy to Your Own Server**

1. Build the app: `npm run build`
2. Copy `.next`, `public`, `package.json`, `node_modules` to your server
3. Install dependencies: `npm install --production`
4. Start server: `npm start`
5. Ensure HTTPS is configured (use Let's Encrypt or similar)

### Step 3: Update ChatGPT App Manifest

1. **Edit `public/.well-known/openai-apps.json`:**

   ```json
   {
     "name": "MoEngage Sample App",
     "description": "Sample application with MoEngage WebSDK integration",
     "version": "1.0.0",
     "author": "MoEngage",
     "homepage_url": "https://your-deployed-url.com",
     ...
   }
   ```

   Replace `https://your-deployed-url.com` with your actual deployment URL.

2. **Verify Manifest is Accessible:**
   - Open: `https://your-deployed-url.com/.well-known/openai-apps.json`
   - Should see the JSON file in browser
   - Check that `Content-Type` is `application/json`

### Step 4: Register App with OpenAI

1. **Access ChatGPT Apps Platform:**
   - Go to: https://platform.openai.com
   - Navigate to **Apps** section (or check OpenAI documentation for current URL)

2. **Create New App:**
   - Click "Create App" or "New App"
   - Fill in app details:
     - **Name:** MoEngage Sample App
     - **Description:** Sample app with MoEngage tracking
     - **Manifest URL:** `https://your-deployed-url.com/.well-known/openai-apps.json`

3. **Configure App Settings:**
   - Set app permissions (user_data, analytics)
   - Review CSP settings (should match your manifest)
   - Save configuration

4. **Get App ID/Token:**
   - Note your app's unique identifier
   - May need this for advanced configurations

### Step 5: Test in ChatGPT

1. **Open ChatGPT:**
   - Go to: https://chat.openai.com
   - Log in to your account

2. **Access Your App:**
   - Look for your app in the ChatGPT interface
   - May be in a sidebar, menu, or accessible via command
   - Or use the app URL directly if provided by OpenAI

3. **Verify App Loads:**
   - App should load within ChatGPT interface
   - Should see "MoEngage Sample App" interface
   - Check for "MoEngage SDK Ready ✓" message

### Step 6: Test GPT App Detection

1. **Check AI Detection Section:**
   - **GPT App User:** Should now show **"Yes"** ✅
   - This confirms the app is running in ChatGPT environment

2. **Verify in Logs:**
   - Should see `gpt_app_session_start` event in logs
   - Should see `chatgpt_app_initialized` event

3. **Check MoEngage Dashboard:**
   - User attributes should show `gpt_app_user: true`
   - Events should have `ai_platform: "chatgpt"`

### Step 7: Test Tracking in ChatGPT

1. **Test User Identification:**
   - Fill in user details
   - Click "Identify User"
   - Verify in MoEngage dashboard
   - Check that `gpt_app_user: true` attribute is set

2. **Test Events:**
   - Track various events
   - Verify they appear in MoEngage
   - Check that events have `ai_platform: "chatgpt"` property

3. **Test ChatGPT Actions:**
   - If your app receives actions from ChatGPT, they should be tracked
   - Check logs for `chatgpt_action` events

### Step 8: Verify MoEngage Integration

1. **Check MoEngage Dashboard:**
   - Go to Users → Search for your test user
   - Verify attributes:
     - `gpt_app_user: true`
     - `ai_platform: "chatgpt"` (in events)
     - Other user attributes

2. **Check Events:**
   - Go to Analytics → Events
   - Filter by your test user
   - Verify all events are tracked
   - Check event properties include `ai_platform: "chatgpt"`

3. **Check Segments:**
   - Create a segment: `gpt_app_user == true`
   - Should include your test user

### Troubleshooting ChatGPT Integration

**Issue: App not loading in ChatGPT**
- ✅ Verify HTTPS is enabled
- ✅ Check manifest URL is accessible
- ✅ Verify CSP configuration in manifest
- ✅ Check OpenAI app registration status
- ✅ Review OpenAI console for errors

**Issue: GPT App detection not working**
- ✅ Check if app is actually running in ChatGPT (not just iframe)
- ✅ Verify `window.parent` detection logic
- ✅ Check browser console for errors

**Issue: Events not tracking in ChatGPT**
- ✅ Verify MoEngage SDK loads (check console)
- ✅ Check CSP allows MoEngage domains
- ✅ Verify network requests to MoEngage API
- ✅ Check MoEngage dashboard for events (may be delayed)

**Issue: CSP errors**
- ✅ Verify all MoEngage domains are in manifest
- ✅ Check your data center matches the domains
- ✅ Review browser console for CSP violations

### Step 9: Advanced Testing

1. **Test Multiple Users:**
   - Identify different users
   - Track events for each
   - Verify segmentation works

2. **Test Campaigns:**
   - Create MoEngage campaigns targeting `gpt_app_user == true`
   - Verify campaigns appear in app
   - Test campaign interactions

3. **Test Analytics:**
   - Create funnels in MoEngage
   - Build reports with GPT app events
   - Verify attribution works correctly

### Checklist

**Local Testing:**
- [ ] Dependencies installed
- [ ] MoEngage configured
- [ ] App runs on localhost:3000
- [ ] SDK initializes successfully
- [ ] User identification works
- [ ] Events track correctly
- [ ] AI detection works
- [ ] Logs display properly
- [ ] Events appear in MoEngage dashboard

**ChatGPT Testing:**
- [ ] App built successfully
- [ ] Deployed to HTTPS server
- [ ] Manifest accessible
- [ ] App registered with OpenAI
- [ ] App loads in ChatGPT
- [ ] GPT app detection works
- [ ] Tracking works in ChatGPT
- [ ] Events have correct properties
- [ ] User attributes set correctly
- [ ] MoEngage dashboard shows GPT app users

## Support

If you encounter issues:

1. Check browser console for errors
2. Review MoEngage dashboard for data
3. Verify all configuration steps
4. Check OpenAI/OpenAI Apps documentation
5. Review this guide's troubleshooting sections

For MoEngage-specific issues, contact MoEngage support.
For ChatGPT Apps issues, check OpenAI documentation or support.

