/**
 * @file config.js
 * @description Centralized configuration for the MoEngage Sample ChatGPT App.
 *
 * All environment variables and constants are defined here so that other
 * modules never read `process.env` directly. This makes it easy to change
 * defaults, add new config values, and understand what the app depends on.
 *
 * Environment variables are loaded by Node's --env-file flag (see package.json).
 */

export const config = {
  /** HTTP port the server listens on. */
  port: Number(process.env.PORT ?? 8787),

  /** Public URL of this server (for resource loading in ChatGPT sandbox). */
  publicUrl: process.env.PUBLIC_URL || `http://localhost:${Number(process.env.PORT ?? 8787)}`,

  /** Path where the MCP protocol endpoint is mounted. */
  mcpPath: "/mcp",

  /** MoEngage SDK configuration injected into the widget HTML at startup. */
  moengage: {
    // Mock App ID for demo/testing. Replace with your actual App ID from https://app.moengage.com
    appId: process.env.MOENGAGE_APP_ID || "moe_demo_app_12345abcdef",
    // Data center: DC_1 (US), DC_3 (Europe), DC_4 (Asia-Pacific), etc.
    dataCenter: process.env.MOENGAGE_DATA_CENTER || "DC_3",
    sdkUrl:
      process.env.MOENGAGE_SDK_URL ||
      "https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js",
  },

  /**
   * CSP (Content Security Policy) domains that ChatGPT must whitelist so
   * the widget iframe can reach MoEngage APIs and load assets.
   *
   * `connect` — domains the widget can make XHR/fetch calls to.
   * `resource` — domains the widget can load scripts/images from.
   *
   * Includes:
   *   - MoEngage CDNs (for SDK + analytics)
   *   - Public server URL (for widget.js bundle)
   */
  moengageCsp: {
    connect: [
      "https://cdn.moengage.com",
      "https://js.moengage.com",
      "https://sdk-01.moengage.com",
      "https://sdk-02.moengage.com",
      "https://sdk-03.moengage.com",
      "https://sdk-04.moengage.com",
      "https://sdk-05.moengage.com",
      "https://sdk-06.moengage.com",
      "https://sdk-100.moengage.com",
      "https://sdk-101.moengage.com",
      "https://api.moengage.com",
      "https://app-cdn.moengage.com",
      "https://image-ap1.moengage.com",
      "https://image-eu1.moengage.com",
      "https://sdk-beacon.moestaging.com",
      process.env.PUBLIC_URL ? new URL(process.env.PUBLIC_URL).origin : "http://localhost:8787",
    ],
    resource: [
      "https://cdn.moengage.com",
      "https://js.moengage.com",
      "https://app-cdn.moengage.com",
      "https://image-ap1.moengage.com",
      "https://image-eu1.moengage.com",
      "https://sdk-beacon.moestaging.com",
      process.env.PUBLIC_URL ? new URL(process.env.PUBLIC_URL).origin : "http://localhost:8787",
    ],
  },
};
