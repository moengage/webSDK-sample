# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
NEXT_PUBLIC_MOENGAGE_APP_ID=3RADPYNEBZ2MCOJ43EEW5FWV
```

## 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:4000

## 4. Test Locally

1. **Search for Hotels**: Enter a destination, dates, and guests
2. **View Results**: Browse available hotels
3. **Complete Booking**: Fill in guest information and complete booking
4. **Check Tracking**: View tracking logs in the sidebar

## 5. Deploy to Production

### Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

### Update ChatGPT Configuration:

1. Update `public/ai-plugin.json` with your deployment URL
2. Update `public/.well-known/openapi.yaml` with your deployment URL
3. Follow the [ChatGPT Testing Guide](./CHATGPT_TESTING_GUIDE.md) for complete setup

## Features

- ✅ Hotel search and booking interface
- ✅ MoEngage WebSDK integration (staging version)
- ✅ AI bot detection and blocking
- ✅ AI-assisted browser detection
- ✅ GPT app detection
- ✅ Comprehensive event tracking
- ✅ User identification
- ✅ Real-time tracking logs

## Next Steps

- Read [CHATGPT_TESTING_GUIDE.md](./CHATGPT_TESTING_GUIDE.md) for complete ChatGPT integration
- Check [README.md](./README.md) for project overview
- Review [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) for deployment details

