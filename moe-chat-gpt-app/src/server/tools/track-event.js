import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { reply, TOOL_META } from "./helpers.js";

export function register(server) {
  registerAppTool(
    server,
    "moengage_track_event",
    {
      title: "Track Event",
      description: "Track a custom analytics event with optional properties",
      inputSchema: {
        event_name: z.string().describe("Event name (e.g., 'purchase', 'button_clicked')"),
        properties: z.record(z.any()).optional().describe("Optional event properties"),
      },
      _meta: TOOL_META,
    },
    async (args) => {
      const { event_name, properties = {} } = args || {};
      return reply(
        `Event tracked: ${event_name}${Object.keys(properties).length ? " with properties" : ""}`,
        { action: "moe_track_event", eventName: event_name, properties }
      );
    }
  );
}
