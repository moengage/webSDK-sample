# Quick Start Guide - Next.js

## Prerequisites

- Node.js 18+ (or Node 12 via nvm as per project requirements)
- npm or yarn

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure MoEngage

Create `.env.local` file:

```env
NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
NEXT_PUBLIC_MOENGAGE_APP_ID=YOUR_MOENGAGE_APP_ID
```

Or edit `app/page.tsx` directly:

```typescript
const MOENGAGE_CONFIG = {
  dataCenter: 'dc_01', // Your Data Center
  appId: 'YOUR_MOENGAGE_APP_ID', // Your App ID
  // ...
};
```

### Step 3: Run Development Server

```bash
npm run dev
```

### Step 4: Open in Browser

Navigate to: `http://localhost:3000`

### Step 5: Test Tracking

1. Wait for "MoEngage SDK Ready ✓" message
2. Click "Track Page View" - Check logs
3. Enter user info and click "Identify User"
4. Click other tracking buttons
5. Check MoEngage dashboard for events

## For ChatGPT Integration

### Step 1: Build and Deploy

```bash
npm run build
```

Deploy to a platform like Vercel, Netlify, or any HTTPS server.

### Step 2: Update Manifest

Edit `public/.well-known/openai-apps.json`:
- Update `homepage_url` to your domain

### Step 3: Verify Manifest Access

Ensure the file is accessible at:
```
https://your-domain.com/.well-known/openai-apps.json
```

### Step 4: Register with OpenAI

Follow OpenAI's ChatGPT Apps registration process.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and SDK wrappers
- `public/` - Static files including ChatGPT manifest

## Common Issues

**SDK not loading?**
- Check Data Center and App ID in `.env.local` or `app/page.tsx`
- Verify internet connection
- Check browser console

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

**Events not tracking?**
- Verify SDK initialized (check UI status)
- Check if AI bot is blocking (see detection section)
- Ensure user is identified

## Next Steps

- Review `README.md` for detailed documentation
- Check `INTEGRATION_EXAMPLES.md` for code examples
- Customize tracking events for your use case
- Configure MoEngage campaigns
- Set up user segmentation
