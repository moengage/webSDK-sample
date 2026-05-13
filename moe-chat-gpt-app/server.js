// HTTP server for MoEngage ChatGPT App
// Routes: GET /, GET /widget, GET /serviceworker.js, /mcp (MCP protocol), /api/:action (REST API)

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "./config.js";
import { createMcpServer } from "./src/server/lib/mcp-server.js";
import { getWidgetHtml } from "./src/server/lib/widget.js";
import { parseBody, handleApiRequest } from "./src/server/lib/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, "public");

const MIME_TYPES = { ".js": "application/javascript", ".css": "text/css", ".html": "text/html" };
const { port, mcpPath } = config;

const respond = (res, status, data) =>
  res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(data));

const corsHeaders = () => ({ "Access-Control-Allow-Origin": "*", "Access-Control-Expose-Headers": "Mcp-Session-Id" });

const patchAcceptHeader = (req) => {
  const required = "application/json, text/event-stream";
  req.headers.accept = required;
  const idx = req.rawHeaders.findIndex((h) => h.toLowerCase() === "accept");
  if (idx !== -1) req.rawHeaders[idx + 1] = required;
  else req.rawHeaders.push("Accept", required);
};

const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);

const httpServer = createServer(async (req, res) => {
  if (!req.url) return void res.writeHead(400).end("Missing URL");

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      ...corsHeaders(),
      "Access-Control-Allow-Methods": "POST, GET, HEAD, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
    });
    return void res.end();
  }

  // GET / — Health check
  if (req.method === "GET" && url.pathname === "/") {
    return respond(res, 200, {
      name: "MoEngage Explorer — ChatGPT App",
      version: "1.0.0",
      status: "running",
      mcp: `http://localhost:${port}${mcpPath}`,
      moengage: config.moengage,
    });
  }

  if (req.method === "GET" && url.pathname === "/serviceworker.js") {
    res.writeHead(200, { "content-type": "application/javascript" }).end("// empty service worker");
    return;
  }

  if (req.method === "GET" && url.pathname === "/widget") {
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      ...corsHeaders(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    }).end(getWidgetHtml());
    return;
  }

  if (["GET", "HEAD"].includes(req.method) && ["/widget.js", "/widget.css"].includes(url.pathname)) {
    const filePath = join(PUBLIC_DIR, url.pathname);
    if (existsSync(filePath)) {
      const ext = url.pathname.slice(url.pathname.lastIndexOf("."));
      const mime = (MIME_TYPES[ext] || "application/octet-stream") + (ext !== ".css" ? "; charset=utf-8" : "");
      const content = readFileSync(filePath);
      res.writeHead(200, { "Content-Type": mime, "Content-Length": content.length, ...corsHeaders() });
      if (req.method === "GET") res.end(content);
      else res.end();
      return;
    }
  }

  if (url.pathname === mcpPath && MCP_METHODS.has(req.method)) {
    if (req.method === "GET") {
      return respond(res, 200, { status: "ready", transport: "streamablehttp", tools: 4 });
    }

    Object.assign(res.getHeaders?.() || {}, corsHeaders());
    patchAcceptHeader(req);

    try {
      const server = createMcpServer();
      const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });
      res.on("close", () => (transport.close(), server.close()));
      await server.connect(transport);
      await Promise.race([
        transport.handleRequest(req, res),
        new Promise((_, reject) => setTimeout(() => reject(new Error("MCP timeout")), 30000)),
      ]);
    } catch (err) {
      console.error("[MCP] Error:", err.message);
      if (!res.headersSent) res.writeHead(500).end("Internal server error");
    }
    return;
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/")) {
    const result = await handleApiRequest(url.pathname.slice(5), await parseBody(req));
    respond(res, result.error ? 400 : 200, result);
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(`
  MoEngage Explorer — ChatGPT App
  ──────────────────────────────────
  MCP Server:  http://localhost:${port}${mcpPath}
  Widget:      http://localhost:${port}/widget
  Health:      http://localhost:${port}/
  MoEngage:    ${config.moengage.appId} (${config.moengage.dataCenter})
  `);
});
