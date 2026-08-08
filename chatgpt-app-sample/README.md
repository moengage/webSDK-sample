# Booking.com-like Hotel Booking App with MoEngage

A Next.js hotel booking application (similar to Booking.com) demonstrating MoEngage WebSDK integration with ChatGPT Apps. This app includes comprehensive tracking, AI detection, and user engagement capabilities.

## Features

- ✅ **Booking.com-like Interface** - Professional hotel booking UI
- ✅ **Next.js 14** - Modern React framework with App Router
- ✅ **TypeScript** - Full type safety
- ✅ **MoEngage WebSDK Integration** - Full tracking and analytics (Staging SDK v5.02.45)
- ✅ **ChatGPT Apps SDK Integration** - Compatible with OpenAI's ChatGPT Apps platform
- ✅ **AI Bot Detection** - Automatically detects and blocks AI bot traffic
- ✅ **AI-Assisted Browser Detection** - Identifies users on AI-assisted browsers
- ✅ **GPT App Detection** - Detects when app is running within ChatGPT
- ✅ **Comprehensive Event Tracking** - Tracks hotel searches, views, and bookings
- ✅ **User Identification** - Track users across sessions
- ✅ **Real-time Tracking Logs** - Monitor all events in real-time

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure MoEngage:**
   Create `.env.local`:
     ```
     NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
     NEXT_PUBLIC_MOENGAGE_APP_ID=3RADPYNEBZ2MCOJ43EEW5FWV
     ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open:** http://localhost:4000

## Testing in ChatGPT

**📖 Complete Step-by-Step Guide**: See [CHATGPT_TESTING_GUIDE.md](./CHATGPT_TESTING_GUIDE.md) for detailed instructions on:
- Deploying your app
- Creating a ChatGPT GPT
- Configuring widgets and CSP
- Testing all scenarios
- Verifying MoEngage tracking

## Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started quickly
- [ChatGPT Testing Guide](./CHATGPT_TESTING_GUIDE.md) - **Complete guide for testing in ChatGPT**
- [MoEngage Tracking Guide](./MOENGAGE_TRACKING.md) - **Complete event tracking documentation**
- [Deployment Instructions](./DEPLOYMENT_INSTRUCTIONS.md) - Production deployment
- [Integration Examples](./INTEGRATION_EXAMPLES.md) - Code examples

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
