/**
 * @file src/server/lib/widget.js
 * @description Loads widget HTML and injects config + inlined CSS + JS bundle.
 *
 * ⚠️  CRITICAL: CSS & JS MUST BE INLINED FOR CHATGPT SANDBOX
 *
 * The widget runs inside a ChatGPT sandbox iframe which:
 * - Rewrites external stylesheet MIME types to application/xml
 * - Blocks cross-origin scripts due to strict CORS enforcement
 * - Restricts external resource loading via CSP
 *
 * SOLUTION: Both CSS and JavaScript are inlined into the HTML at startup.
 * This eliminates all cross-origin requests and guarantees sandbox compatibility.
 *
 * RULES:
 * 1. NEVER use <link rel="stylesheet"> in food-widget.html
 * 2. NEVER use <script src="..."> for widget.js - inline it instead
 * 3. ALWAYS use {{INLINE_CSS}} and {{INLINE_JS}} placeholders
 * 4. If error occurs, check public/widget.css and public/widget.js exist
 *
 * Template variables replaced:
 *   PLACEHOLDER_APP_ID        → config.moengage.appId
 *   PLACEHOLDER_DATA_CENTER   → config.moengage.dataCenter
 *   {{INLINE_CSS}}            → widget.css contents (inlined in <style>)
 *   {{INLINE_JS}}             → widget.js contents (inlined in <script>)
 *   __MOENGAGE_SDK_URL__      → config.moengage.sdkUrl
 */

import { readFileSync } from "node:fs";
import { config } from "../../../config.js";

const raw = readFileSync("public/food-widget.html", "utf8");
const css = readFileSync("public/widget.css", "utf8");
const js = readFileSync("public/widget.js", "utf8");

// ── Validation ──────────────────────────────────────────────────────────────
if (!raw.includes("{{INLINE_CSS}}")) {
  throw new Error(
    "❌ CRITICAL: food-widget.html missing {{INLINE_CSS}} placeholder.\n" +
    "   CSS must be inlined to work in ChatGPT sandbox.\n" +
    "   Add: <style type=\"text/css\">{{INLINE_CSS}}</style>"
  );
}

if (!raw.includes("{{INLINE_JS}}")) {
  throw new Error(
    "❌ CRITICAL: food-widget.html missing {{INLINE_JS}} placeholder.\n" +
    "   JavaScript must be inlined to work in ChatGPT sandbox.\n" +
    "   Add: <script>{{INLINE_JS}}</script>"
  );
}

if (!css || css.length === 0) {
  throw new Error(
    "❌ CRITICAL: public/widget.css is empty or missing.\n" +
    "   Run: npm run build"
  );
}

if (!js || js.length === 0) {
  throw new Error(
    "❌ CRITICAL: public/widget.js is empty or missing.\n" +
    "   Run: npm run build"
  );
}

// ── Injection ───────────────────────────────────────────────────────────────
export const widgetHtml = raw
  .replace(/{{INLINE_CSS}}/g, css)
  .replace(/{{INLINE_JS}}/g, js)
  .replace(/PLACEHOLDER_APP_ID/g, config.moengage.appId)
  .replace(/PLACEHOLDER_DATA_CENTER/g, config.moengage.dataCenter)
  .replace(/__MOENGAGE_SDK_URL__/g, config.moengage.sdkUrl);

// Log success at startup
console.log(`✅ Widget HTML: CSS inlined (${css.length} bytes)`);
console.log(`✅ Widget HTML: JS inlined (${js.length} bytes)`);
