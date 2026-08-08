import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { reply, TOOL_META } from "./helpers.js";

export function register(server) {
  registerAppTool(
    server,
    "moengage_set_attribute",
    {
      title: "Set User Attribute",
      description: "Set a user attribute in MoEngage",
      inputSchema: {
        attribute_name: z.string().describe("Attribute name (e.g., 'plan', 'tier')"),
        attribute_value: z.union([z.string(), z.number(), z.boolean()]).describe("Attribute value"),
      },
      _meta: TOOL_META,
    },
    async (args) => {
      const { attribute_name, attribute_value } = args || {};
      return reply(`Attribute set: ${attribute_name} = ${attribute_value}`, {
        action: "moe_set_attribute",
        attributeName: attribute_name,
        attributeValue: attribute_value,
      });
    }
  );
}
