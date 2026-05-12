/**
 * @file src/server/lib/mcp-server.js
 * @description MCP server factory — creates a fresh McpServer per HTTP request.
 *
 * Each POST to /mcp gets its own McpServer + StreamableHTTPServerTransport
 * (stateless pattern required by the MCP Apps protocol). The server is
 * configured with:
 *   - A widget resource (the food delivery UI rendered inside ChatGPT)
 *   - 7 food delivery tools (browse, search, menu, cart, order, track)
 *   - 1 unified MoEngage SDK tool (9 actions for analytics, user identity, cards, etc.)
 *
 * CSP domains are pulled from config.js so the ChatGPT iframe can reach
 * MoEngage APIs and load SDK assets.
 */

import {
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "../../../config.js";
import { widgetHtml } from "./widget.js";
import { WIDGET_URI } from "../tools/helpers.js";

// Food Delivery tools
import { register as browseRestaurants } from "../tools/browse-restaurants.js";
import { register as searchFood } from "../tools/search-food.js";
import { register as viewMenu } from "../tools/view-menu.js";
import { register as addToCart } from "../tools/add-to-cart.js";
import { register as viewCart } from "../tools/view-cart.js";
import { register as placeOrder } from "../tools/place-order.js";
import { register as trackOrder } from "../tools/track-order.js";

// MoEngage SDK tool (unified)
import { register as moengage } from "../tools/moengage.js";

const { connect, resource } = config.moengageCsp;

/**
 * Creates a new MCP server instance with all tools and the widget resource.
 * Called once per incoming MCP request to avoid session ID collisions.
 */
export function createMcpServer() {
  const server = new McpServer({
    name: "moe-sample-chatgpt-app",
    version: "2.0.0",
  });

  // Register the widget as an MCP resource (rendered as iframe in ChatGPT)
  registerAppResource(server, "food-widget", WIDGET_URI, {}, async () => ({
    contents: [
      {
        uri: WIDGET_URI,
        mimeType: RESOURCE_MIME_TYPE,
        text: widgetHtml,
        _meta: {
          ui: {
            prefersBorder: true,
            csp: { connectDomains: connect, resourceDomains: resource },
            "openai/widgetCSP": { connect_domains: connect, resource_domains: resource },
          },
        },
      },
    ],
  }));

  // Food Delivery tools (7)
  browseRestaurants(server);
  searchFood(server);
  viewMenu(server);
  addToCart(server);
  viewCart(server);
  placeOrder(server);
  trackOrder(server);

  // MoEngage SDK tool (1 unified, 9 actions)
  moengage(server);

  return server;
}
