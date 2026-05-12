/**
 * @file tools/view-cart.js
 * @description MCP tool — Shows all items in the user's cart.
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { getCart, getCartTotal, getCartItemCount } from "../state/cart.js";
import { reply, TOOL_META } from "./helpers.js";

/**
 * Registers the `view_cart` MCP tool.
 * Displays all items in the current cart with quantities and total.
 * Returns `action: "show_cart"` with full cart state.
 */
export function register(server) {
  registerAppTool(
    server,
    "view_cart",
    {
      title: "View cart",
      description: "Shows all items in the user's cart with quantities and total.",
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
      _meta: TOOL_META,
    },
    async () => {
      const cart = getCart();
      const total = getCartTotal();

      return reply(
        cart.length
          ? `Your cart has ${getCartItemCount()} item(s). Total: ₹${total}`
          : "Your cart is empty. Browse restaurants to add items!",
        { action: "show_cart", cart, cartTotal: total }
      );
    }
  );
}
