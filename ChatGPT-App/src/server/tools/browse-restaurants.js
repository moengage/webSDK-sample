/**
 * @file tools/browse-restaurants.js
 * @description MCP tool — Lists all available restaurants with optional filtering.
 *
 * ChatGPT invokes this when a user wants to see food options.
 * The widget receives `action: "show_restaurants"` and renders the list.
 *
 * Filters: 'all' (default), 'pure-veg', 'fast-delivery', 'top-rated'
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { RESTAURANTS } from "../data/restaurants.js";
import { reply, TOOL_META } from "./helpers.js";

/**
 * Registers the `browse_restaurants` MCP tool.
 * Lists all available restaurants with optional filtering (veg, fast delivery, top-rated).
 * Returns `action: "show_restaurants"` to display the list in the widget.
 */
export function register(server) {
  registerAppTool(
    server,
    "browse_restaurants",
    {
      title: "Browse restaurants",
      description:
        "Shows all available restaurants with ratings, delivery times, and offers. Can filter by cuisine type or dietary preference.",
      inputSchema: {
        filter: z
          .string()
          .optional()
          .describe("Filter: 'all', 'pure-veg', 'fast-delivery', 'top-rated'"),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
      _meta: TOOL_META,
    },
    async (args) => {
      let restaurants = [...RESTAURANTS];
      const filter = args?.filter || "all";

      if (filter === "pure-veg")
        restaurants = restaurants.filter((r) => r.pureVeg);
      if (filter === "fast-delivery")
        restaurants.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      if (filter === "top-rated")
        restaurants.sort((a, b) => b.rating - a.rating);

      return reply(
        `Found ${restaurants.length} restaurants. Here are the options:`,
        { action: "show_restaurants", restaurants }
      );
    }
  );
}
