/**
 * @file tools/search-food.js
 * @description MCP tool — Searches restaurants by name, cuisine, or dish.
 *
 * Searches both restaurant metadata (name, cuisine) and individual menu
 * item names. Returns all matching restaurants.
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { RESTAURANTS } from "../data/restaurants.js";
import { flattenMenu } from "../data/menus.js";
import { reply, TOOL_META } from "./helpers.js";

/**
 * Registers the `search_food` MCP tool.
 * Searches restaurants and menu items by name, cuisine, or dish.
 * Returns `action: "show_restaurants"` with matching results.
 */
export function register(server) {
  registerAppTool(
    server,
    "search_food",
    {
      title: "Search food",
      description:
        "Search for restaurants or food items by name, cuisine, or dish. Returns matching restaurants.",
      inputSchema: {
        query: z.string().min(1).describe("Search query for food or restaurant"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
      _meta: TOOL_META,
    },
    async (args) => {
      const query = (args?.query || "").toLowerCase();

      const byRestaurant = RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query)
      );

      const byMenuItem = RESTAURANTS.filter((r) => {
        if (byRestaurant.includes(r)) return false;
        return flattenMenu(r.id).some((item) =>
          item.name.toLowerCase().includes(query)
        );
      });

      const results = [...byRestaurant, ...byMenuItem];

      return reply(
        results.length
          ? `Found ${results.length} restaurant(s) matching "${args.query}".`
          : `No restaurants found for "${args.query}". Try browsing all restaurants.`,
        { action: "show_restaurants", restaurants: results }
      );
    }
  );
}
