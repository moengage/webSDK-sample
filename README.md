# MoEngage Sample App - ChatGPT Integration (Next.js)

A modern Next.js application demonstrating MoEngage WebSDK integration with ChatGPT Apps, including comprehensive tracking, AI detection, and user engagement capabilities.

## Features

- ✅ **Next.js 14** - Modern React framework with App Router
- ✅ **TypeScript** - Full type safety
- ✅ **MoEngage WebSDK Integration** - Full tracking and analytics
- ✅ **ChatGPT Apps SDK Integration** - Compatible with OpenAI's ChatGPT Apps platform
- ✅ **AI Bot Detection** - Automatically detects and blocks AI bot traffic
- ✅ **AI-Assisted Browser Detection** - Identifies users on AI-assisted browsers
- ✅ **GPT App Detection** - Detects when app is running within ChatGPT
- ✅ **Comprehensive Event Tracking** - Tracks all user interactions
- ✅ **User Identification** - Full user profile management
- ✅ **Session Management** - Session tracking and management
- ✅ **Real-time Logging** - Visual feedback for all tracking events
- ✅ **React Hooks** - Custom hooks for easy integration
- ✅ **CSS Modules** - Scoped styling

## Project Structure

```
OPEN_AI_SDK/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── components/
│   ├── UserIdentification.tsx
│   ├── EventTracking.tsx
│   ├── AIDetection.tsx
│   ├── SessionManagement.tsx
│   └── TrackingLogs.tsx
├── hooks/
│   ├── useMoEngage.ts       # MoEngage initialization hook
│   ├── useAIDetection.ts    # AI detection hook
│   └── useTracking.ts       # Tracking utilities hook
├── lib/
│   ├── moengage.ts          # MoEngage SDK wrapper
│   ├── ai-detection.ts      # AI detection logic
│   └── chatgpt-apps.ts      # ChatGPT Apps SDK wrapper
├── public/
│   └── .well-known/
│       └── openai-apps.json # ChatGPT Apps manifest
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Prerequisites

- Node.js 18+ (or use nvm with Node 12 as per project requirements)
- npm or yarn
- MoEngage account with App ID and Data Center
- (Optional) ChatGPT Apps access for testing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
NEXT_PUBLIC_MOENGAGE_APP_ID=YOUR_MOENGAGE_APP_ID
```

Or update directly in `app/page.tsx`:

```typescript
const MOENGAGE_CONFIG = {
  dataCenter: 'dc_01', // Your Data Center
  appId: 'YOUR_MOENGAGE_APP_ID', // Your App ID
  sdkVersion: '2',
  debugLogs: 1,
};
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Configuration

### MoEngage Setup

1. **Get your MoEngage credentials:**
   - Log in to your MoEngage dashboard
   - Navigate to Settings → Apps → Web
   - Copy your **App ID** (Workspace ID)
   - Note your **Data Center** (e.g., `dc_01`, `dc_02`, etc.)

2. **Update configuration:**
   - Set environment variables in `.env.local`
   - Or update `MOENGAGE_CONFIG` in `app/page.tsx`

### ChatGPT App Integration

1. **Update `public/.well-known/openai-apps.json`:**
   - Set `homepage_url` to your deployed app URL
   - Ensure the file is accessible at `https://your-domain.com/.well-known/openai-apps.json`

2. **Deploy to HTTPS:**
   - The app must be served over HTTPS to work with ChatGPT Apps
   - Use Vercel, Netlify, or any hosting provider with HTTPS

3. **Register with OpenAI:**
   - Follow OpenAI's ChatGPT Apps documentation to register your app
   - Provide the URL to your `openai-apps.json` manifest

## Usage

### User Identification

1. Enter user details (User ID, Name, Email, Mobile)
2. Click "Identify User" to send user data to MoEngage
3. User attributes including AI detection flags are automatically set

### Event Tracking

The app includes several pre-configured tracking events:

- **Page View** - Tracks page loads
- **Button Click** - Generic button click tracking
- **Product View** - E-commerce product view tracking
- **Add to Cart** - Shopping cart events
- **Purchase** - Purchase/checkout events
- **Search** - Search query tracking
- **Custom Event** - Track any custom event with properties

### AI Detection

The app automatically detects:

- **AI Bots** - Known AI crawlers (GPTBot, ClaudeBot, etc.)
- **AI-Assisted Browsers** - Browsers with AI features (Arc, etc.)
- **GPT App Environment** - When running inside ChatGPT

Detection results are:
- Displayed in the UI
- Tracked as user attributes in MoEngage
- Used to enhance event properties

### Session Management

- **Destroy Session** - Ends the current session
- **Update User ID** - Changes the user identifier

## Tracking Events

All events are automatically enhanced with:

- `ai_platform` - "chatgpt" or "web"
- `is_ai_assisted` - Boolean flag
- `is_gpt_app` - Boolean flag
- `timestamp` - ISO timestamp

### Standard Events Tracked

1. `page_view` - Page load events
2. `user_identified` - User identification events
3. `button_click` - Button interactions
4. `product_view` - Product viewing
5. `add_to_cart` - Cart additions
6. `purchase` - Purchase completions
7. `search` - Search queries
8. `ai_detection_performed` - AI detection results
9. `chatgpt_app_initialized` - ChatGPT app initialization
10. `chatgpt_action` - Actions from ChatGPT
11. `gpt_app_session_start` - GPT app session start
12. `session_end` - Session termination
13. `app_loaded` - Application load event

## User Attributes

The following user attributes are automatically set:

- `ai_bot_detected` - Boolean
- `ai_assisted_browser` - Boolean
- `gpt_app_user` - Boolean
- `ai_assisted` - Boolean (when AI-assisted browser detected)
- `user_agent` - Browser user agent string
- `detection_timestamp` - When detection was performed

## AI Bot Detection

The app blocks tracking for known AI bots to prevent data pollution:

**Detected Bots:**
- GPTBot
- ChatGPT-User
- CCBot
- ClaudeBot
- PerplexityBot
- YouBot
- Google-Extended
- And more...

When a bot is detected:
- Events are logged but not sent to MoEngage
- User attributes are not set
- Prevents anonymous user creation

## React Hooks

### useMoEngage

Initializes and manages MoEngage SDK:

```typescript
const { isReady } = useMoEngage(config);
```

### useAIDetection

Performs AI detection and tracks results:

```typescript
const { detectionResults, isDetecting, refreshDetection, shouldBlockTracking } = useAIDetection();
```

### useTracking

Provides tracking utilities:

```typescript
const { track, identify, destroy, updateId, log } = useTracking(onLog);
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting

## Testing

### Local Testing

1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Check browser console for MoEngage SDK logs
4. Verify events in MoEngage dashboard

### ChatGPT Testing

1. Deploy app to HTTPS server
2. Register app with OpenAI
3. Test within ChatGPT interface
4. Verify GPT app detection works
5. Check events include `ai_platform: "chatgpt"`

## Troubleshooting

### MoEngage SDK Not Loading

- Check Data Center and App ID are correct
- Verify internet connection
- Check browser console for errors
- Ensure environment variables are set

### Events Not Tracking

- Verify MoEngage SDK is initialized (check UI status)
- Check if AI bot detection is blocking events
- Review browser console for errors
- Ensure user is identified (for some events)

### ChatGPT App Not Working

- Verify HTTPS is enabled
- Check `openai-apps.json` is accessible
- Ensure CSP domains are correct
- Verify ChatGPT Apps SDK is loaded

### Build Errors

- Ensure Node.js version is compatible
- Clear `.next` folder and rebuild
- Check TypeScript errors with `npm run lint`

## Development

### Adding New Components

1. Create component in `components/` directory
2. Use CSS Modules for styling
3. Import and use in `app/page.tsx`

### Adding New Tracking Events

1. Use the `track` function from `useTracking` hook
2. Add event properties as needed
3. Events are automatically enhanced with AI context

### Customizing AI Detection

1. Update `lib/ai-detection.ts`
2. Add new bot patterns or markers
3. Detection runs automatically on page load

## Security & Privacy

- All tracking respects user privacy
- No sensitive data is tracked by default
- User consent should be obtained before tracking
- GDPR/CCPA compliance should be implemented as needed

## Support

For issues or questions:

- **MoEngage Documentation:** https://developers.moengage.com/
- **ChatGPT Apps Documentation:** https://platform.openai.com/docs/guides/apps
- **Next.js Documentation:** https://nextjs.org/docs
- **MoEngage Support:** Contact your MoEngage account manager

## License

This is a sample application for demonstration purposes.

## Version History

- **v1.0.0** - Initial Next.js release with full MoEngage and ChatGPT Apps integration
