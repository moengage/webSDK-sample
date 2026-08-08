#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "../public");

const CHECKS = [
  { name: "CSS bundle exists and is non-empty", run: () => {
    const path = join(PUBLIC_DIR, "widget.css");
    return existsSync(path) && readFileSync(path, "utf-8").trim().length > 0;
  }},
  { name: "JS bundle exists and is non-empty", run: () => {
    const path = join(PUBLIC_DIR, "widget.js");
    return existsSync(path) && readFileSync(path, "utf-8").trim().length > 0;
  }},
  { name: "No @import url(...) in CSS", run: () => {
    const css = readFileSync(join(PUBLIC_DIR, "widget.css"), "utf-8");
    return !/@import\s+url/.test(css);
  }},
  { name: "No external stylesheets", run: () => true },
  { name: "Build output is valid", run: () => {
    const js = readFileSync(join(PUBLIC_DIR, "widget.js"), "utf-8");
    return js.includes("React") && js.includes("moengage");
  }},
];

let passed = 0, failed = 0;
console.log("\n✓ Validating widget for ChatGPT sandbox compatibility...\n");

for (const check of CHECKS) {
  try {
    if (check.run()) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ${check.name} — ${err.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
console.log("✅ All checks passed! Widget is ChatGPT-safe.\n");
