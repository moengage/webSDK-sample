import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppResource, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { config } from "../../../config.js";
import { getWidgetHtml } from "./widget.js";
import * as identifyUserTool from "../tools/identify-user.js";
import * as trackEventTool from "../tools/track-event.js";
import * as setAttributeTool from "../tools/set-attribute.js";
import { WIDGET_URI } from "../tools/helpers.js";

export function createMcpServer() {
  const server = new McpServer({ name: "moe-explorer", version: "1.0.0" });
  registerAppResource(server, "moe-widget", WIDGET_URI, {}, async () => ({
    contents: [
      {
        uri: WIDGET_URI,
        mimeType: RESOURCE_MIME_TYPE,
        text: getWidgetHtml(),
        _meta: {
          ui: {
            prefersBorder: true,
            csp: {
              connectDomains: config.moengageCsp.connect,
              resourceDomains: config.moengageCsp.resource,
            },
            "openai/widgetCSP": {
              connect_domains: config.moengageCsp.connect,
              resource_domains: config.moengageCsp.resource,
            },
          },
        },
      },
    ],
  }));

  // Register tools
  identifyUserTool.register(server);
  trackEventTool.register(server);
  setAttributeTool.register(server);

  return server;
}
