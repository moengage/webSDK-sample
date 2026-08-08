import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { reply, TOOL_META } from "./helpers.js";

export function register(server) {
  registerAppTool(
    server,
    "moengage_identify_user",
    {
      title: "Identify User",
      description: "Identify a user in MoEngage with a unique ID and optional attributes",
      inputSchema: {
        user_id: z.string().describe("Unique user identifier"),
        first_name: z.string().optional().describe("User's first name"),
        last_name: z.string().optional().describe("User's last name"),
        email: z.string().optional().describe("User's email address"),
      },
      _meta: TOOL_META,
    },
    async (args) => {
      const { user_id, first_name, last_name, email } = args || {};
      const attrs = { u_fn: first_name, u_ln: last_name, u_em: email };
      Object.keys(attrs).forEach((k) => attrs[k] === undefined && delete attrs[k]);
      return reply(`Identifying user: ${user_id}${email ? ` (${email})` : ""}`, {
        action: "moe_identify_user",
        userId: user_id,
        attributes: attrs,
      });
    }
  );
}
