# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — Start the production server (port 8787, configurable via `PORT` env var)
- `npm run dev` — Start with `--watch` for auto-restart on changes
- `npm run build` — Build widget bundle + validate ChatGPT compatibility
- `npm run validate` — Check widget for MIME type / sandbox issues
- `npx @modelcontextprotocol/inspector@latest --server-url http://localhost:8787/mcp --transport http` — Test MCP tools

No tests, linter, or build step configured.

## ⚠️  Critical: ChatGPT Sandbox MIME Type Prevention

**Problem:** ChatGPT's sandbox rewrites external stylesheet MIME types to `application/xml`, causing:
```
Refused to apply style from '...' because its MIME type ('application/xml') 
is not a supported stylesheet MIME type
```

**Solution:** CSS **MUST be inlined** in the HTML `<style>` tag at runtime.

### Rules (Do NOT Break These)

1. **NEVER** use `<link rel="stylesheet" href="...">` in `public/food-widget.html`
2. **ALWAYS** use `{{INLINE_CSS}}` placeholder: `<style type="text/css">{{INLINE_CSS}}</style>`
3. **ALWAYS** run `npm run build` (auto-validates)
4. **ALWAYS** run `npm run validate` before deploying to ChatGPT

### How It Works

- `lib/widget.js` reads `public/widget.css` at startup
- Replaces `{{INLINE_CSS}}` placeholder with actual CSS content
- Server sends single HTML with styles embedded (no external requests)
- ChatGPT sandbox cannot rewrite inlined styles

### If You Add New Styles

1. Add to `widget/styles/` folders
2. Run `npm run build` (bundles into `public/widget.css`)
3. Restart server (`npm run dev`)
4. Validator runs automatically ✅

### Validation Script

```bash
npm run validate
```

Output:
- ✅ All checks passed = Safe for ChatGPT
- ❌ Errors found = Fix before deploying

## Architecture

This is a ChatGPT App using MCP (Model Context Protocol) with MoEngage WebSDK integration. The server exposes 12 tools that ChatGPT can call, plus a widget (HTML iframe) that ChatGPT embeds in the chat.

### Directory Layout

```
server.js          → HTTP server + MCP wiring only
data/              → Static data (restaurants, menus) — single source of truth
tools/             → One file per MCP tool, each exports register(server)
state/cart.js      → Mutable cart/order state shared across requests
public/            → Widget HTML (iframe, must stay as single file)
```

### Tools (12 total)

**Food Delivery (7):** `browse_restaurants`, `search_food`, `view_menu`, `add_to_cart`, `view_cart`, `place_order`, `track_order`

**MoEngage SDK (5):** `moengage_track_event`, `moengage_identify_user`, `moengage_set_user_attribute`, `moengage_logout_user`, `moengage_get_cards`

### Key Patterns

- **Stateless MCP**: Each POST to `/mcp` creates a fresh `McpServer` + `StreamableHTTPServerTransport`. Cart/order state is module-level in `state/cart.js` and persists across requests.
- **Accept header fix**: The MCP SDK requires `Accept: application/json, text/event-stream` but ChatGPT may omit it. server.js patches `req.headers` and `req.rawHeaders` before passing to the transport.
- **Tool → Widget bridge**: Each tool returns `structuredContent` with an `action` field. The widget's `handleToolResult` uses this to navigate views or call MoEngage SDK methods.
- **MoEngage tools**: These return structuredContent with `moe_*` actions. The widget handles them by calling the corresponding MoEngage SDK methods (track_event, add_unique_user_id, add_user_attribute, destroy_session, etc.).
- **Template injection**: server.js replaces `__MOENGAGE_APP_ID__`, `__MOENGAGE_DATA_CENTER__`, `__MOENGAGE_SDK_URL__` in the widget HTML at startup.
- **Data duplication**: Restaurant/menu data exists in both `data/` (server) and `food-widget.html` (widget). The widget is an iframe and cannot import server modules. Keep them in sync manually.

### Adding a New Tool

1. Create `tools/my-tool.js` — export `register(server)` that calls `registerAppTool`
2. Import data from `data/` and state from `state/cart.js`
3. Use `reply()` from `tools/_helpers.js` with an `action` field in structuredContent
4. Import and call `register` in `server.js`'s `createFoodServer()`
5. Add a corresponding handler in the widget's `handleToolResult` switch

### Adding a New MoEngage Tool

Same as above, but the tool returns a `moe_*` action in structuredContent, and the widget handler calls the appropriate MoEngage SDK method (e.g., `Moengage.track_event()`, `Moengage.add_user_attribute()`).

### Environment Variables

- `MOENGAGE_APP_ID` — MoEngage WebSDK App ID
- `MOENGAGE_DATA_CENTER` — MoEngage data center (e.g., DATA_CENTER_01)
- `MOENGAGE_SDK_URL` — SDK JavaScript URL (defaults to production CDN)
- `PORT` — Server port (default: 8787)

### Dependencies

`@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps`, `zod` — no dev dependencies.

### Documentation

See `MOENGAGE_INTEGRATION.md` for the full MoEngage integration guide, all tool references, event tracking details, and client setup instructions.
