/**
 * @file server.js
 * @description HTTP server for the MoEngage Sample ChatGPT App.
 *
 * This file is intentionally thin — it only handles HTTP routing.
 * Business logic lives elsewhere:
 *   config.js              → Environment variables and constants
 *   src/server/lib/mcp-server.js → MCP server factory (tools + widget resource)
 *   src/server/lib/widget.js     → Widget HTML loading and template injection
 *   src/server/tools/      → One file per MCP tool
 *   src/server/data/       → Static restaurant and menu data
 *   src/server/state/      → Mutable cart and order state
 *
 * Routes:
 *   GET  /                → Health check (JSON)
 *   GET  /widget          → Standalone widget preview (HTML)
 *   GET  /serviceworker.js → Empty service worker (prevents 404 on HTTPS)
 *   *    /mcp             → MCP protocol endpoint (POST/GET/DELETE)
 */

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "./config.js";
import { createMcpServer } from "./src/server/lib/mcp-server.js";
import { widgetHtml } from "./src/server/lib/widget.js";
import { parseBody, handleApiRequest } from "./src/server/lib/api.js";

// Get absolute base directory (for reliable file path resolution)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, "public");

/** MIME types for serving static files from public/ */
const MIME_TYPES = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
};

const { port, mcpPath } = config;

// ── Response Helpers ────────────────────────────

/** Send a JSON response. */
function json(res, status, data) {
  res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(data));
}

/** Set CORS headers required by the MCP transport. */
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
}

/**
 * Patch the Accept header on incoming requests.
 * ChatGPT sometimes omits the header that the MCP SDK requires
 * (`application/json, text/event-stream`), so we inject it.
 */
function patchAcceptHeader(req) {
  const required = "application/json, text/event-stream";
  req.headers["accept"] = required;
  const idx = req.rawHeaders.findIndex((h) => h.toLowerCase() === "accept");
  if (idx !== -1) {
    req.rawHeaders[idx + 1] = required;
  } else {
    req.rawHeaders.push("Accept", required);
  }
}

// ── Routes ──────────────────────────────────────

const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);

const httpServer = createServer(async (req, res) => {
  if (!req.url) return void res.writeHead(400).end("Missing URL");

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, HEAD, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    return void res.end();
  }

  // GET / — Health check
  if (req.method === "GET" && url.pathname === "/") {
    return json(res, 200, {
      name: "MoEngage Sample ChatGPT App — Food Delivery",
      version: "2.0.0",
      status: "running",
      mcp: `http://localhost:${port}${mcpPath}`,
      moengage: {
        appId: config.moengage.appId,
        dataCenter: config.moengage.dataCenter,
      },
    });
  }

  // GET /serviceworker.js — Prevents 404 when SDK tries to register SW on HTTPS
  if (req.method === "GET" && url.pathname === "/serviceworker.js") {
    res.writeHead(200, { "content-type": "application/javascript" }).end("// empty service worker");
    return;
  }

  // GET /widget — Standalone widget preview
  if (req.method === "GET" && url.pathname === "/widget") {
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "ngrok-skip-browser-warning": "true",
    }).end(widgetHtml);
    return;
  }

  // GET/HEAD /widget.js, /widget.css — Serve built React bundle and styles (with CORS)
  if ((req.method === "GET" || req.method === "HEAD") && (url.pathname === "/widget.js" || url.pathname === "/widget.css")) {
    const filePath = join(PUBLIC_DIR, url.pathname);
    if (existsSync(filePath)) {
      const ext = url.pathname.slice(url.pathname.lastIndexOf("."));
      let mime = MIME_TYPES[ext] || "application/octet-stream";
      // Add charset for text types
      if (mime.startsWith("text/") || mime === "application/javascript") {
        mime += "; charset=utf-8";
      }
      const content = readFileSync(filePath);
      res.writeHead(200, {
        "Content-Type": mime,
        "Content-Length": content.length,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, no-cache, must-revalidate",
      });
      // For HEAD requests, don't send body
      if (req.method === "GET") {
        res.end(content);
      } else {
        res.end();
      }
      return;
    }
  }

  // POST|GET|DELETE /mcp — MCP protocol endpoint
  if (url.pathname === mcpPath && req.method && MCP_METHODS.has(req.method)) {
    // GET /mcp returns health check (for testing)
    if (req.method === "GET") {
      return json(res, 200, {
        status: "ready",
        transport: "streamablehttp",
        mcp_version: "1.0",
        tools: 8,
      });
    }

    // POST/DELETE use StreamableHTTPServerTransport for real MCP
    setCors(res);
    patchAcceptHeader(req);

    try {
      const server = createMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      res.on("close", () => {
        transport.close();
        server.close();
      });

      await server.connect(transport);

      // Wrap handleRequest with a promise that times out after 30 seconds
      await Promise.race([
        transport.handleRequest(req, res),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("MCP request timeout")), 30000)
        ),
      ]);
    } catch (err) {
      console.error("[MCP] Error:", err);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }
    return;
  }

  // POST /api/:action — REST API for standalone website mode
  if (req.method === "POST" && url.pathname.startsWith("/api/")) {
    const action = url.pathname.slice(5); // strip /api/
    const body = await parseBody(req);
    const result = await handleApiRequest(action, body);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(result.error ? 400 : 200).end(JSON.stringify(result));
    return;
  }

  // 404 — Log and respond
  console.warn(`[404] ${req.method} ${req.url}`);
  res.writeHead(404).end("Not Found");
});

// ── Start ───────────────────────────────────────

httpServer.listen(port, () => {
  console.log(`
  MoEngage Sample ChatGPT App — Food Delivery
  ──────────────────────────────────────────
  MCP Server:  http://localhost:${port}/mcp
  Widget:      http://localhost:${port}/widget
  Health:      http://localhost:${port}/
  MoEngage:    ${config.moengage.appId} (${config.moengage.dataCenter})
  `);
});
