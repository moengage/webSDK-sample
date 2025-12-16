# MoEngage ChatGPT App Sample

A Next.js sample application demonstrating MoEngage WebSDK integration with ChatGPT Apps, including comprehensive tracking, AI detection, and user engagement capabilities.

## Features

- ✅ **Next.js 14** - Modern React framework with App Router
- ✅ **TypeScript** - Full type safety
- ✅ **MoEngage WebSDK Integration** - Full tracking and analytics
- ✅ **ChatGPT Apps SDK Integration** - Compatible with OpenAI's ChatGPT Apps platform
- ✅ **AI Bot Detection** - Automatically detects and blocks AI bot traffic
- ✅ **AI-Assisted Browser Detection** - Identifies users on AI-assisted browsers
- ✅ **GPT App Detection** - Detects when app is running within ChatGPT
- ✅ **Comprehensive Event Tracking** - Tracks all user interactions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure MoEngage:**
   - Update `app/page.tsx` with your MoEngage App ID and Data Center
   - Or create `.env.local`:
     ```
     NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
     NEXT_PUBLIC_MOENGAGE_APP_ID=YOUR_APP_ID
     ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open:** http://localhost:4000

## Documentation

- [Quick Start Guide](./QUICKSTART.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Deployment Instructions](./DEPLOYMENT_INSTRUCTIONS.md)
- [Integration Examples](./INTEGRATION_EXAMPLES.md)

## Project Structure

```
chatgpt-app-sample/
├── app/                    # Next.js App Router
├── components/              # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static files
└── package.json
```

## For More Details

See the individual documentation files for:
- Local testing instructions
- ChatGPT integration steps
- Deployment to Vercel
- Code examples and use cases
