# ChatGPT-App — Food Delivery with MoEngage Integration

A production-ready **ChatGPT App** using the Model Context Protocol (MCP) with **MoEngage WebSDK** integration for analytics and engagement tracking.

**Features:**
- ✅ Restaurant browsing with filters and search
- ✅ Menu viewing and food item selection
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Real-time MoEngage event tracking
- ✅ Works in ChatGPT and as standalone website
- ✅ ChatGPT sandbox-safe (inlined CSS/JS)

---

## ⚡ Quick Start (2 minutes)

```bash
npm install
npm run build
npm run dev
```

Then open **http://localhost:8787/widget** in your browser.

**Pre-configured with:**
- ✅ Mock MoEngage credentials (demo mode)
- ✅ Test restaurant & menu data
- ✅ Ready to explore immediately

To use real MoEngage credentials, update `.env` with your App ID.

### Key Features
- **Dual-Mode**: Works in ChatGPT (MCP) and standalone browser
- **MCP Integration**: Full Model Context Protocol with 12 tools
- **REST API**: Standalone mode uses `/api/*` endpoints
- **MoEngage Analytics**: 11+ tracked events for user behavior
- **Persistent Cart**: Server-side cart state across requests
- **ChatGPT Safe**: Inlined CSS/JS for sandbox compatibility
- **Bridge Architecture**: MCP tools directly call MoEngage SDK methods

## MoEngage WebSDK Integration

The app integrates **MoEngage WebSDK** for real-time analytics, user identification, and engagement features. The SDK runs in the widget and tracks every user interaction.

### How MoEngage is Integrated

**1. SDK Initialization** (happens automatically)
```javascript
// src/client/hooks/useMoEngage.js
moengage.initialize({
  appId: 'moe_demo_app_12345abcdef',      // Mock ID for demo. Replace with your App ID
  env: 'LIVE',
  cluster: 'DC_3',                        // Data center (DC_1=US, DC_3=EU, DC_4=Asia)
});
```

> **💡 Replace `moe_demo_app_12345abcdef` with your actual MoEngage App ID from https://app.moengage.com**

**2. Event Tracking (Client-Side)**
```javascript
// Tracked automatically when user performs actions:
moe.trackEvent('restaurant_viewed', {
  restaurant_id: 'r1',
  restaurant_name: 'Chai & Co',
  rating: 4.5,
});
```

**3. Server-Side MCP Integration (Tools Can Call MoEngage)**
```javascript
// src/server/tools/moengage.js
// ChatGPT can call MoEngage methods via MCP:
// "Identify this user as john_doe"
// → MCP tool calls identifyUser
// → Response sent to widget via postMessage
// → Widget executes: Moengage.add_unique_user_id('john_doe')
```

### MoEngage Events Tracked

| Event | When | Data |
|-------|------|------|
| `app_opened` | Widget loads | `source: 'moe_widget'` |
| `restaurant_viewed` | User opens restaurant menu | `restaurant_id`, `rating`, `cuisine`, `delivery_time` |
| `search_performed` | User searches for food | `query` |
| `category_selected` | User clicks a category | `category: 'Burgers'` |
| `filter_applied` | User applies filter | `filter: 'top-rated'` |
| `item_added_to_cart` | Item added to cart | `item_id`, `item_name`, `price`, `quantity` |
| `item_removed_from_cart` | Item removed | `item_id`, `item_name` |
| `item_quantity_changed` | Quantity updated | `quantity` |
| `cart_viewed` | User opens cart | `items_count`, `total` |
| `order_placed` | Order placed | `order_id`, `total`, `items_count` |

---

## How It Works

This app uses **MCP (Model Context Protocol)** to connect to ChatGPT. MCP does **not** crawl your website — instead, you define **tools** (like API endpoints) that ChatGPT can call. ChatGPT reads your tool descriptions, decides which to call based on the user's prompt, and your server returns the data.

```
User: "Show me Chai & Co menu"
  → ChatGPT picks the view_menu tool with { restaurant_id: "r6" }
  → Your MCP server looks up Chai & Co in the data
  → Returns text (for chat) + structuredContent (for the widget)
  → Widget receives the data via postMessage bridge and navigates to the menu view
```

## Hybrid Mode (ChatGPT + Standalone)

This app works in **two modes** using the same codebase:

### Mode 1: ChatGPT (MCP)
- Widget runs as iframe inside ChatGPT
- All tool calls go through MCP Bridge (`useMCPBridge.js`)
- Communicates via `postMessage` JSON-RPC
- URL: ChatGPT chat interface

### Mode 2: Standalone Website
- Widget runs directly in browser
- Automatic fallback to HTTP API if no ChatGPT parent
- Tool calls use `fetch()` to `/api/*` endpoints
- URL: `http://localhost:8787/widget`

**The same `handleToolResult` function processes responses identically in both modes**, so the UI and state management don't need to know which mode is active.

```javascript
// In useMCPBridge.js:
if (standaloneModeRef.current) {
  // Standalone: use fetch API
  const res = await fetch(`/api/${endpoint}`, { method: 'POST', body: JSON.stringify(args) });
  onToolResultRef.current(data);
} else {
  // ChatGPT: use MCP bridge
  const response = await rpcRequest('tools/call', { name, arguments: args });
  onToolResultRef.current(response);
}
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    ChatGPT                       │
│  ┌───────────────────────────────────────────┐  │
│  │  Widget (iframe)                          │  │
│  │  ┌─────────────────┐ ┌────────────────┐   │  │
│  │  │  Food Delivery   │ │ MoEngage SDK   │   │  │
│  │  │  UI (HTML/CSS)   │ │ (Tracking)     │   │  │
│  │  └────────┬─────────┘ └───────┬────────┘   │  │
│  │           │ MCP Apps Bridge    │            │  │
│  │           │ (postMessage)      │            │  │
│  └───────────┼────────────────────┼────────────┘  │
│              │                    │                │
└──────────────┼────────────────────┼────────────────┘
               │                    │
      ┌────────▼─────────┐  ┌──────▼───────────┐
      │  MCP Server       │  │  MoEngage Cloud   │
      │  (Node.js)        │  │  (Analytics)      │
      │                   │  └──────────────────┘
      │  src/server/tools/│
      │  ├─ browse-restaurants.js
      │  ├─ search-food.js
      │  ├─ view-menu.js
      │  ├─ add-to-cart.js
      │  ├─ view-cart.js
      │  ├─ place-order.js
      │  └─ track-order.js
      │                   │
      │  src/server/data/ │
      │  ├─ restaurants.js│
      │  └─ menus.js      │
      │                   │
      │  src/server/state/│
      │  └─ cart.js       │
      └───────────────────┘
```

### The MCP Bridge (How ChatGPT Controls the Widget)

The widget runs inside ChatGPT as an iframe. When ChatGPT calls an MCP tool:

1. **Tool handler** runs on the server and returns `structuredContent` with an `action` field
2. **ChatGPT** sends the result to the widget via `ui/notifications/tool-result` (postMessage)
3. **Widget's `handleToolResult`** reads the `action` and navigates the UI accordingly:

| Action | Triggered By | Widget Effect |
|--------|-------------|---------------|
| `show_restaurants` | `browse_restaurants`, `search_food` | Goes to home, renders restaurant list |
| `show_menu` | `view_menu` | Opens the restaurant's menu page |
| `update_cart` | `add_to_cart` | Updates cart badges and current view |
| `show_cart` | `view_cart` | Navigates to cart view |
| `show_order` | `place_order`, `track_order` | Shows order confirmation/tracking |

---

## How MCP Connects & Calls MoEngage

The app has a special MCP tool (`moengage` tool in `src/server/tools/moengage.js`) that allows ChatGPT to invoke MoEngage SDK methods directly. This creates a bridge between ChatGPT commands and user analytics.

### Complete Flow: ChatGPT → MCP → MoEngage

```
┌─────────────────────────────────────────────────────────┐
│ ChatGPT User: "Identify this user as john_doe"          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ ChatGPT AI decides:  │
          │ Call moengage tool   │
          │ with action=         │
          │  'identify_user'     │
          └────────┬─────────────┘
                   │
                   ▼ (JSON-RPC over HTTP)
      ┌────────────────────────────────┐
      │  POST /mcp                     │
      │  {                             │
      │   "method": "tools/call",      │
      │   "params": {                  │
      │     "name": "moengage",        │
      │     "arguments": {             │
      │       "action": "identify_user"│
      │       "userId": "john_doe"     │
      │     }                          │
      │   }                            │
      │  }                             │
      └────────┬─────────────────────┘
               │
               ▼ (Server-side)
      ┌────────────────────────────────┐
      │ src/server/tools/moengage.js   │
      │ ├─ Receives action             │
      │ ├─ Routes to correct handler   │
      │ ├─ Returns structuredContent   │
      │   with moe_* action            │
      └────────┬─────────────────────┘
               │
               ▼ (postMessage)
      ┌────────────────────────────────┐
      │ ChatGPT sends to widget:       │
      │ {                              │
      │  "method":                     │
      │   "ui/notifications/tool-result"│
      │  "params": {                   │
      │   "action": "moe_identify_user"│
      │   "userId": "john_doe"         │
      │  }                             │
      │ }                              │
      └────────┬─────────────────────┘
               │
               ▼ (Widget processes)
      ┌────────────────────────────────┐
      │ App.jsx handleToolResult():    │
      │ Matches "moe_identify_user"    │
      │ Calls:                         │
      │ moe.identifyUser('john_doe')   │
      │                                │
      │ MoEngage SDK executes:         │
      │ Moengage.add_unique_user_id()  │
      └────────────────────────────────┘
                   │
                   ▼
      ┌────────────────────────────────┐
      │ MoEngage Cloud                 │
      │ User identified & tracked      │
      └────────────────────────────────┘
```

### Example: The 5 MoEngage MCP Tools

| MCP Tool | ChatGPT Command | MoEngage Action | Result |
|----------|-----------------|-----------------|---------|
| `moengage` with `identify_user` | "Set user ID to john" | `add_unique_user_id('john')` | User identified in MoEngage |
| `moengage` with `set_attribute` | "Mark user as VIP" | `setUserAttribute('is_vip', true)` | Custom attribute set |
| `moengage` with `track_event` | "Track that user searched" | `track_event('search_performed', {query})` | Event logged |
| `moengage` with `logout` | "Logout the user" | `logoutUser()` | Session destroyed |
| `moengage` with `get_cards` | "Show user content cards" | Opens Content Cards inbox | Cards displayed |

### How the Moengage Tool Works (Server-Side)

```javascript
// src/server/tools/moengage.js
export function register(server) {
  registerAppTool(server, {
    name: 'moengage',
    description: 'Invoke MoEngage SDK methods',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['identify_user', 'set_attribute', 'track_event', 'logout', 'get_cards']
        },
        userId: { type: 'string' },
        attributeName: { type: 'string' },
        attributeValue: {},
        eventName: { type: 'string' },
        properties: { type: 'object' }
      }
    },
    handler: async ({ action, userId, attributeName, attributeValue, eventName, properties }) => {
      // Server doesn't execute MoEngage itself (it's client-side SDK)
      // Instead, it returns a structuredContent with a moe_* action
      // The widget receives this and executes the actual SDK method
      
      return {
        text: `MoEngage action: ${action}`,
        structuredContent: {
          action: `moe_${action}`,
          userId,
          attributeName,
          attributeValue,
          eventName,
          properties
        }
      };
    }
  });
}
```

### How the Widget Processes MoEngage Actions (Client-Side)

```javascript
// src/client/components/App.jsx handleToolResult()
const handleToolResult = (result) => {
  const { action, ...data } = result.structuredContent;
  
  switch (action) {
    case 'moe_identify_user':
      // Execute MoEngage SDK method
      moe.identifyUser(data.userId, data.attributes);
      break;
      
    case 'moe_set_attribute':
      // Execute MoEngage SDK method
      moe.setAttribute(data.attributeName, data.attributeValue);
      break;
      
    case 'moe_track_event':
      // Execute MoEngage SDK method
      moe.trackEvent(data.eventName, data.properties);
      break;
      
    case 'moe_logout':
      // Execute MoEngage SDK method
      moe.logout();
      break;
      
    case 'moe_get_cards':
      // Execute MoEngage SDK method
      moe.openCardsInbox();
      break;
  }
};
```

### Key Points

1. **MCP tools don't execute MoEngage directly** — the server doesn't have the SDK
2. **Server returns actions** — `moe_identify_user`, `moe_set_attribute`, etc.
3. **Widget executes SDK methods** — only the client (browser) has MoEngage SDK loaded
4. **MoEngage tracks everything** — events, user IDs, attributes all go to cloud analytics
5. **Works in both modes** — ChatGPT mode (via postMessage) and standalone (via fetch API)

---

## Project Structure

```
ChatGPT-App/
├── server.js                      # HTTP server + MCP wiring (entry point)
├── config.js                      # Environment variables and constants
│
├── src/
│   ├── server/                    # Backend (Node.js)
│   │   ├── lib/
│   │   │   ├── mcp-server.js      # MCP server factory
│   │   │   ├── widget.js          # Widget HTML + CSS/JS inlining
│   │   │   └── api.js             # REST API handlers (standalone mode)
│   │   ├── data/
│   │   │   ├── restaurants.js     # Restaurant data
│   │   │   └── menus.js           # Menu data
│   │   ├── state/
│   │   │   └── cart.js            # Cart and order state
│   │   └── tools/
│   │       ├── helpers.js         # Shared tool helpers
│   │       ├── browse-restaurants.js
│   │       ├── search-food.js
│   │       ├── view-menu.js
│   │       ├── add-to-cart.js
│   │       ├── view-cart.js
│   │       ├── place-order.js
│   │       ├── track-order.js
│   │       └── moengage.js        # MoEngage SDK tool
│   │
│   └── client/                    # Frontend (React + bundled by esbuild)
│       ├── index.jsx              # React entry point
│       ├── components/            # React components
│       │   ├── App.jsx
│       │   ├── Home.jsx
│       │   ├── Menu.jsx
│       │   ├── Cart.jsx
│       │   ├── OrderConfirmation.jsx
│       │   ├── Header.jsx
│       │   ├── FloatingCart.jsx
│       │   ├── MenuItem.jsx
│       │   ├── RestaurantCard.jsx
│       │   └── common/
│       │       └── VegBadge.jsx
│       ├── hooks/
│       │   ├── useCart.js
│       │   ├── useMCPBridge.js    # MCP Apps Bridge (postMessage)
│       │   └── useMoEngage.js     # MoEngage SDK integration
│       ├── constants/
│       │   └── restaurants.js     # Client-side restaurant data
│       ├── styles/
│       │   ├── index.css
│       │   ├── variables.css
│       │   ├── base.css
│       │   ├── common/            # Common CSS (badges, buttons, etc.)
│       │   └── components/        # Component styles
│       └── utils/
│           └── menuUtils.js
│
├── public/
│   ├── food-widget.html           # Widget HTML template
│   ├── widget.js                  # Bundled React app (esbuild output)
│   └── widget.css                 # Bundled styles (esbuild output)
│
├── scripts/
│   └── validate-widget.js         # ChatGPT sandbox validator
│
├── package.json
├── .env.example
├── CLAUDE.md
├── MOENGAGE_INTEGRATION.md
└── README.md
```

### Folder Organization

- **`src/server/`** — Backend business logic (MCP tools, data, state)
- **`src/client/`** — Frontend React application (bundled by esbuild)
- **`public/`** — Static output (esbuild bundles + widget HTML template)
- **`scripts/`** — Build and validation utilities

## MCP Tools

| Tool | Purpose | Read-only |
|------|---------|-----------|
| `browse_restaurants` | List restaurants with optional filter (all, pure-veg, fast-delivery, top-rated) | Yes |
| `search_food` | Search by restaurant name, cuisine, or dish name | Yes |
| `view_menu` | Show a restaurant's full menu | Yes |
| `add_to_cart` | Add a food item to the cart | No |
| `view_cart` | Show current cart contents | Yes |
| `place_order` | Place an order for cart items | No |
| `track_order` | Track order status by order ID | Yes |

## Complete Setup Guide

### Prerequisites
- **Node.js 18+** — Runtime for the server
- **MoEngage Account** — For WebSDK App ID and data center
- **ChatGPT Business/Enterprise** — With Developer Mode access (for MCP integration)
- **ngrok** (optional) — To expose local server to ChatGPT
- **Git** — For version control

---

### Step 1: Clone & Install (Using Mock Data)

```bash
# Clone the repository
git clone <repo-url>
cd ChatGPT-App

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

---

### Step 2: Configure Environment (Optional)

**Already configured with mock data!** The `.env.example` includes:

```bash
# .env (already has mock data)
MOENGAGE_APP_ID=moe_demo_app_12345abcdef     # Mock data for testing
MOENGAGE_DATA_CENTER=DC_3                    # Europe region
PORT=8787
```

**To use real MoEngage credentials:**

1. Sign up at https://app.moengage.com (free tier available)
2. Get your App ID from Settings → App Management
3. Update `.env`:

```bash
MOENGAGE_APP_ID=your_actual_app_id_here
MOENGAGE_DATA_CENTER=DC_3                    # DC_1=US, DC_3=EU, DC_4=Asia-Pacific
PORT=8787
```

**Variable Descriptions:**
- `MOENGAGE_APP_ID` — App ID from MoEngage dashboard (or use mock: `moe_demo_app_12345abcdef`)
- `MOENGAGE_DATA_CENTER` — Server region (DC_1=US, DC_3=EU, DC_4=Asia)
- `PORT` — Development server port (default: 8787)

---

### Step 3: Build the Widget Bundle

The React app must be bundled before running:

```bash
npm run build
```

This:
1. Bundles React + all components with **esbuild**
2. Generates `public/widget.js` and `public/widget.css`
3. Validates ChatGPT sandbox compatibility
4. Verifies CSS/JS inlining works

**Output:**
```
✅ All checks passed! Widget is ChatGPT-safe.
```

---

### Step 4: Start the Server

**Development mode** (auto-reload on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server starts at:
- **Health check**: http://localhost:8787/
- **Standalone widget**: http://localhost:8787/widget
- **MCP endpoint**: http://localhost:8787/mcp
- **REST API**: http://localhost:8787/api/*

**Expected output:**
```
✅ Widget HTML: CSS inlined (15041 bytes)
✅ Widget HTML: JS inlined (1145000+ bytes)

  MoEngage Sample ChatGPT App — Food Delivery
  ──────────────────────────────────────────
  MCP Server:  http://localhost:8787/mcp
  Widget:      http://localhost:8787/widget
  Health:      http://localhost:8787/
  MoEngage:    moe_demo_app_12345abcdef (DC_3)
  Status:      ✅ Ready to demo with mock data
```

---

### Step 5: Test Locally (Standalone Mode)

Open your browser and go to:
```
http://localhost:8787/widget
```

You should see:
- ✅ Food delivery app interface
- ✅ Restaurant list with filters
- ✅ Search functionality
- ✅ Cart management
- ✅ Orders
- ✅ MoEngage events logged (open DevTools → Console)

**Test actions:**
```
1. Click "Browse Restaurants" → restaurants load
2. Click a restaurant → menu opens
3. Add items to cart → cart updates
4. View cart → shows items
5. Place order → confirmation screen
6. Check browser console → MoEngage events appear
```

---

### Step 6: Expose to ChatGPT (with ngrok)

ChatGPT needs to access your local server via HTTPS. Use **ngrok**:

```bash
# Install ngrok (if not already installed)
# https://ngrok.com/download

# Start ngrok on port 8787
ngrok http 8787
```

**Output:**
```
Session Status                online
Account                       your-account@email.com
Version                       3.0.0
Region                        us-cal
Forwarding                    https://abcd-1234-5678-9012.ngrok.io -> http://localhost:8787
```

**Save the forwarding URL** — you'll need it for ChatGPT setup.

---

### Step 7: Enable ChatGPT Developer Mode

1. **Go to ChatGPT Settings**: https://chatgpt.com/account/developer-settings
2. **Check if Developer Mode is available** in your workspace
   - If not, ask your ChatGPT admin to enable it
   - Required permission: "Connected Data Developer mode"

---

### Step 8: Create MCP Connector in ChatGPT

1. **Settings → Apps & Integrations → Create New App**
2. **Select**: "Connect using MCP"
3. **Enter MCP Server URL**:
   ```
   https://abcd-1234-5678-9012.ngrok.io/mcp
   ```
4. **Name**: "Foodie - Food Delivery App"
5. **Description**: "Browse restaurants, view menus, add to cart, place orders"
6. **Click**: "Create"

ChatGPT will now have access to all 7 food delivery tools.

---

### Step 9: Test MCP Tools in ChatGPT

In ChatGPT chat, try:

```
Show me all restaurants
Browse restaurants with top-rated filter
Show me the menu for "Pizza Paradise"
Add "Margherita Pizza" to my cart
What's in my cart?
Place my order
```

ChatGPT will:
1. ✅ Recognize the request
2. ✅ Call the appropriate MCP tool
3. ✅ Get the food widget loaded in chat
4. ✅ Display the result (restaurant list, menu, cart, etc.)
5. ✅ Track event in MoEngage
6. ✅ Update app state server-side

---

### Step 10: Test MCP Inspector (Optional)

Verify MCP server is working correctly:

```bash
npx @modelcontextprotocol/inspector@latest \
  --server-url http://localhost:8787/mcp \
  --transport http
```

This opens an interactive tool explorer where you can:
- View all registered tools
- See tool descriptions and schemas
- Test calling tools with sample arguments
- Debug request/response payloads

---

### Step 11: Monitor Events in MoEngage Dashboard

1. **Go to**: https://app.moengage.com → Analytics → Events
2. **Filter by** your app
3. **See real-time events**:
   - `app_opened` → Widget loaded
   - `restaurant_viewed` → Menu opened
   - `item_added_to_cart` → Item added
   - `order_placed` → Order confirmed

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Auto-reload server on changes
npm run build            # Rebuild React bundle + validate

# Production
npm start                # Run production server

# Testing
npm run validate         # Check ChatGPT sandbox compatibility
curl http://localhost:8787/       # Health check
curl http://localhost:8787/widget # View widget
curl -X POST http://localhost:8787/api/browse-restaurants \
  -H "Content-Type: application/json" \
  -d '{"filter":"all"}'           # Test REST API
```

---

## Troubleshooting

### ❌ "Widget is not ChatGPT-safe"
```
Solution: npm run validate
Check for external <link> or <script> tags in public/food-widget.html
All CSS/JS must be inlined (using {{INLINE_CSS}} and {{INLINE_JS}} placeholders)
```

### ❌ "Port 8787 already in use"
```
# Find and kill process on port 8787
lsof -ti:8787 | xargs kill -9
npm run dev
```

### ❌ "MoEngage events not tracking"
```
Solution: Check browser console for errors
1. Verify MOENGAGE_APP_ID is correct in .env
2. Check MoEngage cloud dashboard for events
3. Ensure app loads https://cdn.moengage.com SDK
```

### ❌ "MCP tools not appearing in ChatGPT"
```
Solution: Verify MCP server is responding
curl http://localhost:8787/mcp
Should return: {"status":"ready","transport":"streamablehttp","tools":8}

If not:
1. Check ngrok forwarding URL is correct
2. Verify server.js is running (npm run dev)
3. Restart ChatGPT chat session
```

---

## MoEngage Events Tracked

| Event | Trigger |
|-------|---------|
| `app_opened` | Widget loads |
| `Restaurant_clicked` | User clicks a restaurant card |
| `restaurant_viewed` | Restaurant menu opens |
| `search_performed` | User searches for food |
| `category_selected` | User clicks a category |
| `filter_applied` | User applies a filter |
| `item_added_to_cart` | Item added to cart |
| `item_removed_from_cart` | Item removed from cart |
| `item_quantity_changed` | Quantity updated |
| `cart_viewed` | Cart view opened |
| `order_placed` | Order placed |
| `order_confirmation_viewed` | Confirmation screen shown |

## Tech Stack

- **MCP Server**: Node.js + `@modelcontextprotocol/sdk` + `@modelcontextprotocol/ext-apps`
- **Widget UI**: Vanilla HTML/CSS/JS (no build step)
- **Schema Validation**: Zod
- **Analytics**: MoEngage WebSDK
- **Protocol**: MCP over Streamable HTTP

---

## Tech Stack

- **Runtime**: Node.js 18+ with ES modules
- **MCP**: `@modelcontextprotocol/sdk` & `@modelcontextprotocol/ext-apps`
- **Frontend**: React 19 + Vanilla CSS
- **Bundler**: esbuild (for ChatGPT sandbox compatibility)
- **Analytics**: MoEngage WebSDK
- **Schema**: Zod for validation

## Commands

```bash
npm install      # Install dependencies
npm run build    # Bundle React + validate ChatGPT compatibility
npm run dev      # Start with auto-reload on file changes
npm start        # Production server
npm run validate # Check ChatGPT sandbox compatibility
```

---

**Version:** 2.0.0 | **Status:** ✅ Production Ready
