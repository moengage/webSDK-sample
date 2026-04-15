# MoEngage Explorer — ChatGPT App

A minimal, production-ready sample app integrating **MoEngage WebSDK into ChatGPT Apps** using the Model Context Protocol (MCP).

> **Latest**: ✅ Cleaned code, npm integration, fresh build — ready for production

Learn how to:
- Initialize MoEngage SDK from npm package at top level
- Expose SDK capabilities as ChatGPT-callable tools
- Track events, identify users, and display content cards
- Bridge ChatGPT and your app via MCP

---

## What's Included

✅ **Clean codebase** — Minimal comments, focused architecture  
✅ **npm integration** — MoEngage SDK from `@moengage/web-sdk` package  
✅ **Top-level init** — SDK initializes before React renders  
✅ **Memoized hooks** — No infinite loops, stable references  
✅ **Dynamic widget** — Fresh bundle on each request  
✅ **3 MCP tools** — User identify, event tracking, attribute setting  
✅ **Production ready** — Optimized (1.1MB JS, 4.0KB CSS)  

---

## Quick Start

### 1. Install & Configure

```bash
npm install
cp .env.example .env
# Edit .env with your MoEngage App ID and Data Center
```

### 2. Build

```bash
npm run build
# Output: public/widget.js (1.1MB) + public/widget.css (4.0KB)
```

### 3. Run

```bash
npm run dev
# Widget:  http://localhost:8788/widget
# Health:  http://localhost:8788/
# MCP:     http://localhost:8788/mcp
```

### 4. Test

Open http://localhost:8788/widget in your browser. You should see:
- ✅ Dashboard with example prompts
- ✅ Event log (app_opened tracked once)
- ✅ Ready for MCP tool calls

---

## How It Works

### Architecture

```
ChatGPT (asks user to call a tool)
    ↓
    ├─→ POST /mcp (MCP protocol)
    │   └─→ server.js → mcp-server.js → tool handlers
    │
    └─→ Returns: { action: 'moe_identify_user', userId: '...' }
        ↓
    Browser receives action
        ↓
    App.jsx → handleToolResult() → moe.identifyUser()
        ↓
    MoEngage SDK tracks event
```

### Key Flow

1. **index.jsx** — Initializes MoEngage SDK from npm package **before React renders**
   ```javascript
   import moengage from '@moengage/web-sdk';
   moengage.initialize({ appId, cluster, env: 'LIVE' });
   window.moengage = moengage; // Global reference
   ```

2. **useMoEngage.js** — Provides stable, memoized wrapper around SDK
   ```javascript
   return useMemo(() => ({
     trackEvent: (name, props) => window.moengage.trackEvent(name, props),
     identifyUser: (id, attrs) => window.moengage.identifyUser({ uid: id, ...attrs }),
     // ...
   }), []);
   ```

3. **App.jsx** — Dispatches tool results to SDK methods
   ```javascript
   const handleTool = useCallback((result) => {
     const { action, ...data } = result;
     actions[action]?.();  // moe_identify_user → moe.identifyUser()
   }, [moe]);
   ```

4. **server.js + mcp-server.js** — Registers 3 MCP tools
   - `moengage_identify_user` → `moe_identify_user`
   - `moengage_track_event` → `moe_track_event`
   - `moengage_set_attribute` → `moe_set_attribute`

---

## MCP Tools

| Tool | Input | Returns | SDK Call |
|------|-------|---------|----------|
| `moengage_identify_user` | user_id, name, email | `moe_identify_user` | `moe.identifyUser()` |
| `moengage_track_event` | event_name, properties | `moe_track_event` | `moe.trackEvent()` |
| `moengage_set_attribute` | name, value | `moe_set_attribute` | `moe.setAttribute()` |

---

## Configuration

### .env File

```bash
MOENGAGE_APP_ID=your_app_id_here
MOENGAGE_DATA_CENTER=DC_3  # DC_1 (US), DC_3 (EU), DC_4 (Asia)
PORT=8788
PUBLIC_URL=https://your-url.ngrok.io  # For ChatGPT exposure
```

### Env Variables

- `MOENGAGE_APP_ID` — From [MoEngage Dashboard](https://app.moengage.com)
- `MOENGAGE_DATA_CENTER` — Where your account is hosted
- `PORT` — Server port (default: 8788)
- `PUBLIC_URL` — For exposing to ChatGPT via ngrok

---

## Project Structure

```
moe-chat-gpt-app/
├── server.js                  # HTTP server (widget + MCP routes)
├── config.js                  # Env config + CSP domains
├── package.json               # Dependencies, build scripts
├── .env.example               # Configuration template
│
├── public/
│   ├── widget.js              # React + MoEngage SDK (esbuild output)
│   └── widget.css             # Component styles (esbuild output)
│
├── scripts/
│   └── validate-widget.js     # ChatGPT sandbox validation
│
└── src/
    ├── client/
    │   ├── index.jsx          # SDK initialization + React mount
    │   ├── hooks/
    │   │   ├── useMoEngage.js    # SDK wrapper hook
    │   │   └── useMCPBridge.js   # MCP postMessage bridge
    │   ├── components/
    │   │   ├── App.jsx           # Root + tool result dispatch
    │   │   ├── Dashboard.jsx     # Default view
    │   │   └── Header.jsx        # SDK status + user
    │   └── styles/
    │       ├── index.css         # esbuild entry
    │       └── *.css             # Component styles
    │
    └── server/
        ├── lib/
        │   ├── widget.js        # HTML builder (inlines CSS/JS)
        │   ├── mcp-server.js    # MCP tool registration
        │   └── api.js           # REST API for standalone mode
        └── tools/
            ├── helpers.js       # reply() + TOOL_META
            ├── identify-user.js # moengage_identify_user
            ├── track-event.js   # moengage_track_event
            └── set-attribute.js # moengage_set_attribute
```

---

## Commands

```bash
npm install           # Install dependencies
npm run build         # Build bundle + validate
npm run build:watch   # Watch for changes
npm run dev           # Start dev server with --watch
npm run validate      # Check ChatGPT compatibility
npm run start         # Run production server
```

---

## Key Design Decisions

✅ **SDK from npm** — `@moengage/web-sdk` bundled with app (not CDN)  
✅ **Top-level init** — SDK initialized in index.jsx before React renders  
✅ **Memoized wrapper** — useMoEngage returns stable object (prevents re-renders)  
✅ **Dynamic widget loading** — Fresh bundle on each request (no cache)  
✅ **CSS inlined** — ChatGPT sandbox requires inline styles  
✅ **Single responsibility** — Each tool file handles one action  
✅ **Minimal dependencies** — Only React, esbuild, @moengage/web-sdk  

---

## Testing in ChatGPT

### 1. Expose to Internet

```bash
npm install -g ngrok
npm run dev
ngrok http 8788
# Copy HTTPS URL
```

### 2. Create App in ChatGPT

- Settings → Apps & Integrations → Create New App
- Select "Connect with MCP"
- Enter: `https://your-ngrok-url/mcp`

### 3. Try Commands

```
"Identify me as alice123 with email alice@example.com"
"Track a purchase event with amount 99.99"
"Set my subscription to premium"
```

---

## Troubleshooting

### App ID Not Configured

```
[MoEngage] App ID not configured, skipping initialization
```

**Fix**: Set `MOENGAGE_APP_ID` in `.env` and restart server

### Tools Don't Appear in ChatGPT

**Fix**: Verify tools are registered
```bash
curl http://localhost:8788/mcp \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Should return 3 tools.

### Widget Not Updating

**Fix**: Check browser console for errors. Verify tool returns correct `action` name.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js 18+ (ESM) |
| Framework | React 19 |
| Bundler | esbuild |
| SDK | @moengage/web-sdk |
| Protocol | MCP |
| Styles | CSS (inlined) |

---

## Learn More

- [MoEngage WebSDK Docs](https://developers.moengage.com/web)
- [MCP Specification](https://modelcontextprotocol.io/)
- [ChatGPT Apps Guide](https://platform.openai.com/docs/guides/apps)

---

**Status**: Production-ready  
**Version**: 1.0.0
