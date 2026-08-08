import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../../../config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getWidgetHtml() {
  const css = readFileSync(join(__dirname, "../../../public/widget.css"), "utf-8");
  const js = readFileSync(join(__dirname, "../../../public/widget.js"), "utf-8");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MoEngage Explorer</title>
    <style type="text/css">
${css}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <div id="moe_inbox"></div>

    <script type="text/javascript">
      window.__MOENGAGE_APP_ID__ = '${config.moengage.appId}';
      window.__MOENGAGE_DATA_CENTER__ = '${config.moengage.dataCenter}';
    </script>
    <script>
${js}
    </script>
  </body>
</html>`;
}
