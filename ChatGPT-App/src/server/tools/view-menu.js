/**
 * @file tools/view-menu.js
 * @description MCP tool — Shows a restaurant's full menu.
 *
 * Returns the restaurant object and its menu (recommended + sides sections).
 * The widget navigates to the menu view for that restaurant.
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { RESTAURANTS } from "../data/restaurants.js";
import { MENUS } from "../data/menus.js";
import { reply, TOOL_META } from "./helpers.js";

/**
 * Registers the `view_menu` MCP tool.
 * Displays a restaurant's full menu (recommended and sides sections).
 * Returns `action: "show_menu"` with restaurant and menu data.
 */
export function register(server) {
  registerAppTool(
    server,
    "view_menu",
    {
      title: "View restaurant menu",
      description:
        "Shows the full menu of a restaurant with item names, prices, and veg/non-veg indicators.",
      inputSchema: {
        restaurant_id: z.string().min(1).describe("Restaurant ID (e.g. r1, r2)"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
      _meta: TOOL_META,
    },
    async (args) => {
      const restaurant = RESTAURANTS.find((r) => r.id === args?.restaurant_id);
      const menu = MENUS[args?.restaurant_id];

      if (!restaurant || !menu) {
        return reply(`Restaurant ${args?.restaurant_id} not found.`);
      }

      return reply(`Here's the menu for ${restaurant.name}:`, {
        action: "show_menu",
        restaurant,
        menu,
      });
    }
  );
}
