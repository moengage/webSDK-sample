/**
 * @file tools/place-order.js
 * @description MCP tool — Places an order for all items in the cart.
 *
 * Creates an order record, clears the cart, and returns the order
 * confirmation which the widget renders as a tracking view.
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { createOrder } from "../state/cart.js";
import { reply, TOOL_META } from "./helpers.js";

/**
 * Registers the `place_order` MCP tool.
 * Creates an order for all items in the cart and returns confirmation with tracking info.
 * Returns `action: "show_order"` with the new order details.
 */
export function register(server) {
  registerAppTool(
    server,
    "place_order",
    {
      title: "Place order",
      description:
        "Places an order for all items in the cart. Returns order confirmation with tracking.",
      inputSchema: {
        items: z
          .array(z.object({ id: z.string(), name: z.string(), qty: z.number(), price: z.number() }))
          .optional(),
        restaurant: z.string().optional(),
        total: z.number().optional(),
      },
      annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      _meta: TOOL_META,
    },
    async (args) => {
      const order = createOrder({
        restaurant: args?.restaurant,
        items: args?.items,
        total: args?.total,
      });

      return reply(
        `Order ${order.orderId} placed! Your food from ${order.restaurant} will arrive in ${order.estimatedDelivery}. Total: ₹${order.total}`,
        { action: "show_order", order }
      );
    }
  );
}
