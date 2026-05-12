/**
 * @file tools/helpers.js
 * @description Shared constants and helpers used by all MCP tool files.
 *
 * Every tool returns a `reply()` response that includes:
 *   - `content`: Text shown in ChatGPT's chat (human-readable summary)
 *   - `structuredContent`: JSON data sent to the widget via postMessage
 *
 * The widget resource URI and tool metadata are shared constants so tools
 * don't duplicate the same string.
 */

/** URI of the widget resource registered in the MCP server. */
export const WIDGET_URI = "ui://widget/food-delivery.html";

/** Standard _meta attached to every tool, pointing to the widget. */
export const TOOL_META = { ui: { resourceUri: WIDGET_URI } };

/**
 * Build a tool response with text content and structured data.
 * @param {string} message — Human-readable text for ChatGPT chat
 * @param {object} data — Structured data routed to the widget's handleToolResult()
 */
export function reply(message, data = {}) {
  return {
    content: message ? [{ type: "text", text: message }] : [],
    structuredContent: data,
  };
}
