/**
 * @file tools/moengage.js
 * @description Unified MoEngage SDK tool — a single MCP tool that exposes
 * all MoEngage WebSDK capabilities to ChatGPT.
 *
 * Instead of registering 9 separate tools, we register one `moengage` tool
 * with an `action` parameter. This keeps the ChatGPT tool list clean and
 * makes it easy to add new SDK methods.
 *
 * Available actions:
 *   track_event        — Track a custom analytics event
 *   track_page_view    — Track a page view
 *   identify_user      — Identify user with ID + profile attributes
 *   set_user_attribute — Set a custom user attribute
 *   get_user_attribute — Retrieve user attribute(s)
 *   logout_user        — Destroy session and reset identity
 *   open_cards_inbox   — Open the Content Cards inbox UI
 *   get_cards_info     — Query card counts, categories, or fetch fresh cards
 *   sdk_control        — Enable/disable the SDK or data tracking
 *
 * Each action returns structuredContent with a `moe_*` action field that the
 * widget's handleToolResult() routes to the appropriate MoEngage SDK call.
 */

import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { reply, TOOL_META } from "./helpers.js";

/** All supported MoEngage actions. */
const ACTIONS = [
  "track_event",
  "track_page_view",
  "identify_user",
  "set_user_attribute",
  "get_user_attribute",
  "logout_user",
  "open_cards_inbox",
  "get_cards_info",
  "sdk_control",
];

/**
 * Registers the unified `moengage` MCP tool.
 * Dispatches to one of 9 MoEngage SDK operations (track_event, identify_user, etc).
 * Returns `action: "moe_*"` corresponding to the requested SDK operation.
 */
export function register(server) {
  registerAppTool(
    server,
    "moengage",
    {
      title: "MoEngage SDK",
      description: `Interact with the MoEngage Web SDK. Available actions:

- track_event: Track a custom event. Params: event_name (required), properties (optional object).
- track_page_view: Track a page view event. No params.
- identify_user: Identify a user. Params: user_id (required), first_name, last_name, email, phone, gender, birthday (all optional).
- set_user_attribute: Set a custom attribute. Params: attribute_name (required), attribute_value (required).
- get_user_attribute: Get an attribute. Params: attribute_name (optional, omit for all).
- logout_user: Logout current user and reset session. No params.
- open_cards_inbox: Open the Content Cards inbox. No params.
- get_cards_info: Query cards. Params: query (one of: unclicked_count, new_count, categories, fetch_cards).
- sdk_control: Enable/disable SDK. Params: sdk_action (one of: enable_sdk, disable_sdk, enable_data_tracking, disable_data_tracking).`,
      inputSchema: {
        action: z.enum(ACTIONS).describe("MoEngage SDK action to perform"),
        params: z
          .record(z.union([z.string(), z.number(), z.boolean(), z.record(z.union([z.string(), z.number(), z.boolean()]))]))
          .optional()
          .describe("Parameters for the action (varies by action)"),
      },
      annotations: { readOnlyHint: false, openWorldHint: false },
      _meta: TOOL_META,
    },
    async (args) => {
      const { action, params = {} } = args;

      switch (action) {
        case "track_event": {
          const eventName = params.event_name;
          if (!eventName) return reply("Error: event_name is required for track_event.");
          const properties = typeof params.properties === "object" ? params.properties : {};
          return reply(
            `Tracked event "${eventName}".`,
            { action: "moe_track_event", eventName, properties }
          );
        }

        case "track_page_view":
          return reply("Page view tracked.", { action: "moe_track_page_view" });

        case "identify_user": {
          const userId = params.user_id;
          if (!userId) return reply("Error: user_id is required for identify_user.");
          const attributes = {};
          for (const key of ["first_name", "last_name", "email", "phone", "gender", "birthday"]) {
            if (params[key]) attributes[key] = params[key];
          }
          const n = Object.keys(attributes).length;
          return reply(
            `User identified as "${userId}"${n > 0 ? ` with ${n} attributes` : ""}.`,
            { action: "moe_identify_user", userId, attributes }
          );
        }

        case "set_user_attribute": {
          const name = params.attribute_name;
          const value = params.attribute_value;
          if (!name) return reply("Error: attribute_name is required.");
          return reply(
            `Set "${name}" = "${value}".`,
            { action: "moe_set_attribute", attributeName: name, attributeValue: value }
          );
        }

        case "get_user_attribute":
          return reply(
            params.attribute_name
              ? `Retrieving "${params.attribute_name}".`
              : "Retrieving all user attributes.",
            { action: "moe_get_user_attribute", attributeName: params.attribute_name || null }
          );

        case "logout_user":
          return reply("User logged out.", { action: "moe_logout" });

        case "open_cards_inbox":
          return reply("Opening Content Cards inbox.", { action: "moe_get_cards" });

        case "get_cards_info": {
          const query = params.query || "unclicked_count";
          return reply(
            `Retrieving cards info: ${query}.`,
            { action: "moe_get_cards_info", query }
          );
        }

        case "sdk_control": {
          const sdkAction = params.sdk_action;
          if (!sdkAction) return reply("Error: sdk_action is required.");
          const labels = {
            enable_sdk: "SDK enabled",
            disable_sdk: "SDK disabled",
            enable_data_tracking: "Data tracking enabled",
            disable_data_tracking: "Data tracking disabled",
          };
          return reply(
            (labels[sdkAction] || sdkAction) + ".",
            { action: "moe_sdk_control", sdkAction }
          );
        }

        default:
          return reply(`Unknown action: ${action}`);
      }
    }
  );
}
