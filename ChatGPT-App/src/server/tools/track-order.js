/**
 * @file tools/track-order.js
 * @description MCP tool — Tracks the status of a placed order.
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { findOrder } from "../state/cart.js";
import { reply, TOOL_META } from "./helpers.js";

/**
 * Registers the `track_order` MCP tool.
 * Shows the status of a placed order by ID (or returns the most recent order if none specified).
 * Returns `action: "show_order"` with order tracking status.
 */
export function register(server) {
  registerAppTool(
    server,
    "track_order",
    {
      title: "Track order",
      description: "Track the status of a placed order by order ID.",
      inputSchema: {
        order_id: z.string().optional().describe("Order ID to track"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
      _meta: TOOL_META,
    },
    async (args) => {
      const order = findOrder(args?.order_id);

      if (!order) {
        return reply("No orders found. Place an order first!");
      }

      return reply(
        `Order ${order.orderId}: ${order.status}. Estimated delivery: ${order.estimatedDelivery}`,
        { action: "show_order", order }
      );
    }
  );
}
