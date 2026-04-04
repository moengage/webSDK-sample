# Complete Guide: Testing Your Booking.com App in ChatGPT

This guide will walk you through every step to test your MoEngage-integrated hotel booking app inside ChatGPT.

## Prerequisites

1. **OpenAI Account**: You need a ChatGPT Plus subscription (required for GPT apps)
2. **Deployed App**: Your app must be deployed and accessible via HTTPS
3. **MoEngage Account**: Access to MoEngage dashboard to verify events

---

## Step 1: Deploy Your App

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from your project directory**:
   ```bash
   cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm project settings
   - Wait for deployment to complete

4. **Note your deployment URL**: You'll get a URL like `https://your-app.vercel.app`

### Option B: Deploy to Other Platforms

- **Netlify**: `npm run build` then drag `out` folder to Netlify
- **Railway**: Connect GitHub repo and deploy
- **Any HTTPS hosting**: Ensure your app is accessible via HTTPS

---

## Step 2: Configure Environment Variables

1. **Create `.env.local` file** (if not exists):
   ```bash
   NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
   NEXT_PUBLIC_MOENGAGE_APP_ID=3RADPYNEBZ2MCOJ43EEW5FWV
   ```

2. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

---

## Step 3: Create ChatGPT App Configuration

### 3.1 Create `ai-plugin.json` File

Create a file named `ai-plugin.json` in your `public` folder:

```json
{
  "schema_version": "v1",
  "name_for_human": "Hotel Booking",
  "name_for_model": "hotel_booking",
  "description_for_human": "Search and book hotels with real-time availability and pricing.",
  "description_for_model": "A hotel booking service that allows users to search for hotels by destination, check-in/check-out dates, and number of guests. Users can view hotel details, compare prices, and complete bookings.",
  "auth": {
    "type": "none"
  },
  "api": {
    "type": "openapi",
    "url": "https://your-app.vercel.app/.well-known/openapi.yaml"
  },
  "logo_url": "https://your-app.vercel.app/logo.png",
  "contact_email": "support@example.com",
  "legal_info_url": "https://your-app.vercel.app/legal"
}
```

### 3.2 Create OpenAPI Specification

Create `public/.well-known/openapi.yaml`:

```yaml
openapi: 3.0.0
info:
  title: Hotel Booking API
  version: 1.0.0
  description: API for searching and booking hotels
servers:
  - url: https://your-app.vercel.app
paths:
  /:
    get:
      summary: Hotel booking interface
      description: Main interface for hotel search and booking
      responses:
        '200':
          description: HTML page with hotel booking interface
```

### 3.3 Update Next.js Config for ChatGPT Apps

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://chat.openai.com https://chatgpt.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## Step 4: Configure Content Security Policy for MoEngage

### 4.1 Update `app/layout.tsx`

Add CSP meta tag to allow MoEngage SDK:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors 'self' https://chat.openai.com https://chatgpt.com; script-src 'self' 'unsafe-inline' https://js.moengage.com https://cdn.moengage.com https://cdn.openai.com; connect-src 'self' https://*.moengage.com https://api.openai.com;"
        />
        <script
          src="https://cdn.openai.com/apps-sdk-js/latest/apps-sdk.js"
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Step 5: Create ChatGPT App in OpenAI Platform

1. **Go to OpenAI Platform**: https://platform.openai.com/

2. **Navigate to GPTs**: Click on "GPTs" in the left sidebar

3. **Create New GPT**:
   - Click "Create" or "+" button
   - Choose "Create a GPT"

4. **Configure Your GPT**:
   - **Name**: "Hotel Booking Assistant"
   - **Description**: "Helps users search and book hotels"
   - **Instructions**: 
     ```
     You are a helpful hotel booking assistant. When users ask about hotels, 
     use the hotel booking tool to search for available hotels. Help them 
     find the best options based on their destination, dates, and preferences.
     ```

5. **Add Action/Plugin**:
   - Click "Add Action" or "Configure"
   - **Authentication**: Select "No Auth" (for testing)
   - **Schema**: Paste your OpenAPI schema or upload `openapi.yaml`

6. **Configure Widget**:
   - In the GPT configuration, go to "Widget" section
   - **Widget URL**: `https://your-app.vercel.app`
   - **Widget CSP**: Add the following:
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

7. **Save and Publish**:
   - Click "Save" 
   - Choose visibility (Private for testing, Public for production)

---

## Step 6: Test in ChatGPT

### 6.1 Access Your GPT

1. **Open ChatGPT**: Go to https://chat.openai.com
2. **Find Your GPT**: Click on your name → "My GPTs" → Select "Hotel Booking Assistant"
3. **Start Chat**: Begin a conversation with your GPT

### 6.2 Test Scenarios

#### Scenario 1: Basic Hotel Search
```
User: "I want to book a hotel in Paris for next week"
```
**Expected**: GPT should use your app to show hotel search interface

#### Scenario 2: Specific Search
```
User: "Find hotels in New York from December 15 to December 20 for 2 guests"
```
**Expected**: App should display search form with pre-filled data

#### Scenario 3: View Hotel Details
```
User: "Show me details about the Grand Plaza Hotel"
```
**Expected**: App should show hotel details and booking options

### 6.3 Verify MoEngage Tracking

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Filter by "moengage"**
4. **Perform actions** in the app:
   - Search for hotels
   - View hotel details
   - Start booking
   - Complete booking

5. **Check MoEngage Dashboard**:
   - Log in to MoEngage dashboard
   - Go to "Events" section
   - Verify events are being tracked:
     - `app_loaded`
     - `hotel_search`
     - `hotel_viewed`
     - `booking_started`
     - `booking_completed`

---

## Step 7: Debugging Common Issues

### Issue 1: App Not Loading in ChatGPT

**Symptoms**: Blank screen or error message

**Solutions**:
- Check CSP headers are correct
- Verify HTTPS is enabled
- Check browser console for errors
- Ensure widget URL is correct in GPT configuration

### Issue 2: MoEngage SDK Not Loading

**Symptoms**: No events in MoEngage dashboard

**Solutions**:
- Check Network tab for SDK load errors
- Verify CSP allows `js.moengage.com`
- Check MoEngage App ID is correct
- Verify Data Center configuration

### Issue 3: Events Not Tracking

**Symptoms**: Events not appearing in dashboard

**Solutions**:
- Check browser console for JavaScript errors
- Verify user is identified (check `identifyUser` calls)
- Check MoEngage dashboard filters
- Verify debug logs are enabled

### Issue 4: CORS Errors

**Symptoms**: CORS errors in console

**Solutions**:
- Add CORS headers in `next.config.js`
- Verify `Access-Control-Allow-Origin` headers
- Check MoEngage API endpoints allow your domain

---

## Step 8: Advanced Testing

### 8.1 Test AI Detection

1. **Check AI Detection Component**: The app should detect it's running in ChatGPT
2. **Verify Attributes**: Check MoEngage dashboard for:
   - `gpt_app_user: true`
   - `ai_platform: "chatgpt"`
   - `is_gpt_app: true`

### 8.2 Test User Identification

1. **Fill User Profile** in the sidebar
2. **Click "Identify User"**
3. **Verify in MoEngage**: User should appear in "Users" section

### 8.3 Test Event Tracking

1. **Perform Complete Booking Flow**:
   - Search hotels
   - Select hotel
   - Fill booking form
   - Complete booking

2. **Verify Events**:
   - `hotel_search`
   - `hotel_search_results`
   - `hotel_viewed`
   - `booking_started`
   - `booking_completed`

---

## Step 9: Production Checklist

Before going live:

- [ ] App deployed to production URL
- [ ] MoEngage App ID configured correctly
- [ ] CSP headers configured for ChatGPT
- [ ] Widget CSP configured in GPT settings
- [ ] HTTPS enabled
- [ ] All events tracking correctly
- [ ] User identification working
- [ ] AI detection working
- [ ] Error handling in place
- [ ] Analytics dashboard configured

---

## Step 10: Monitoring and Analytics

### 10.1 MoEngage Dashboard

Monitor:
- **Events**: Track all user interactions
- **Users**: Monitor user identification
- **Segments**: Create segments for GPT app users
- **Journeys**: Create engagement journeys

### 10.2 Key Metrics to Track

- Number of hotel searches
- Hotel views
- Booking completion rate
- Average booking value
- GPT app vs web app usage

---

## Troubleshooting Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| App won't load | Check CSP headers and HTTPS |
| SDK not loading | Verify CSP allows MoEngage domains |
| Events not tracking | Check App ID and Data Center |
| CORS errors | Add CORS headers in next.config.js |
| Widget not showing | Verify widget URL in GPT config |

---

## Support Resources

- **MoEngage Docs**: https://docs.moengage.com/
- **OpenAI GPTs Docs**: https://platform.openai.com/docs/guides/gpts
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Deployment**: https://vercel.com/docs

---

## Next Steps

1. ✅ Deploy your app
2. ✅ Create ChatGPT GPT
3. ✅ Configure widget and CSP
4. ✅ Test all scenarios
5. ✅ Verify MoEngage tracking
6. ✅ Monitor analytics
7. ✅ Iterate and improve

Good luck with your ChatGPT app! 🚀

