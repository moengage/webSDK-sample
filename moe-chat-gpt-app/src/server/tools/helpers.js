export const WIDGET_URI = "ui://widget/moe-explorer.html";
export const TOOL_META = {
  "openai/outputTemplate": WIDGET_URI,
  "openai/widgetAccessible": true,
  "openai/resultCanProduceWidget": true,
};

export const reply = (text, action) => ({
  content: [{ type: "text", text }],
  structuredContent: action,
});
