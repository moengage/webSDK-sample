/**
 * @file tools/add-to-cart.js
 * @description MCP tool — Adds a food item to the user's cart.
 *
 * Looks up the item in the restaurant's menu, adds it to module-level
 * cart state, and returns the updated cart plus the specific item that
 * was added (for MoEngage event tracking in the widget).
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { RESTAURANTS } from "../data/restaurants.js";
import { flattenMenu } from "../data/menus.js";
import { addItem, getCart, getCartTotal } from "../state/cart.js";
import { reply, TOOL_META } from "./helpers.js";

/**
 * Registers the `add_to_cart` MCP tool.
 * Adds a menu item to the cart and returns the updated cart state.
 * Returns `action: "update_cart"` with the full cart and added item details.
 */
export function register(server) {
  registerAppTool(
    server,
    "add_to_cart",
    {
      title: "Add item to cart",
      description: "Adds a food item to the user's cart.",
      inputSchema: {
        restaurant_id: z.string().min(1),
        item_id: z.string().min(1).describe("Menu item ID"),
        item_name: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().optional().default(1),
      },
      annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      _meta: TOOL_META,
    },
    async (args) => {
      const restaurant = RESTAURANTS.find((r) => r.id === args.restaurant_id);
      const menuItem = flattenMenu(args.restaurant_id).find((m) => m.id === args.item_id);

      const itemName = menuItem?.name || args.item_name || args.item_id;
      const itemPrice = menuItem?.price || args.price || 0;

      addItem({
        id: args.item_id,
        name: itemName,
        price: itemPrice,
        qty: args.quantity || 1,
        emoji: menuItem?.emoji || "🍽️",
        veg: menuItem?.veg ?? true,
        restaurantId: args.restaurant_id,
        restaurantName: restaurant?.name || "Restaurant",
      });

      const total = getCartTotal();

      return reply(`Added ${itemName} to cart. Cart total: ₹${total}`, {
        action: "update_cart",
        cart: getCart(),
        cartTotal: total,
        addedItem: {
          item_id: args.item_id,
          item_name: itemName,
          price: itemPrice,
          quantity: args.quantity || 1,
          restaurant_id: args.restaurant_id,
          restaurant_name: restaurant?.name || "Restaurant",
        },
      });
    }
  );
}
