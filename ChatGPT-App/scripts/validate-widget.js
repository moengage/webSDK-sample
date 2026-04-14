#!/usr/bin/env node

/**
 * @file scripts/validate-widget.js
 * @description Validation script to ensure widget will work in ChatGPT sandbox.
 *
 * Run with: node scripts/validate-widget.js
 *
 * Checks:
 * - CSS is being inlined (not external <link> tags)
 * - No @import statements in widget HTML
 * - widget.css file exists and is not empty
 * - food-widget.html has {{INLINE_CSS}} placeholder
 * - No external stylesheet references
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const errors = [];
const warnings = [];

console.log("🔍 Validating widget for ChatGPT sandbox compatibility...\n");

// Check 1: Verify files exist
console.log("✓ Checking files...");
const htmlPath = "public/food-widget.html";
const cssPath = "public/widget.css";

if (!existsSync(htmlPath)) {
  errors.push(`❌ Missing: ${htmlPath}`);
} else {
  console.log(`  ✅ ${htmlPath} exists`);
}

if (!existsSync(cssPath)) {
  errors.push(`❌ Missing: ${cssPath}`);
} else {
  const cssSize = readFileSync(cssPath, "utf8").length;
  if (cssSize === 0) {
    errors.push(`❌ Empty: ${cssPath}`);
  } else {
    console.log(`  ✅ ${cssPath} exists (${cssSize} bytes)`);
  }
}

// Check 2: Verify HTML structure
console.log("\n✓ Checking HTML structure...");
const html = readFileSync(htmlPath, "utf8");

if (!html.includes("{{INLINE_CSS}}")) {
  errors.push(
    "❌ Missing {{INLINE_CSS}} placeholder in food-widget.html\n" +
    "   Add: <style type=\"text/css\">{{INLINE_CSS}}</style>"
  );
} else {
  console.log("  ✅ {{INLINE_CSS}} placeholder found");
}

if (html.includes('href="widget.css"') || html.includes('href="./widget.css"')) {
  errors.push(
    "❌ Found external stylesheet link in HTML\n" +
    "   Remove: <link rel=\"stylesheet\" href=\"widget.css\" />\n" +
    "   Use {{INLINE_CSS}} placeholder instead"
  );
} else {
  console.log("  ✅ No external stylesheet links");
}

if (html.includes("<link") && !html.includes("favicon")) {
  warnings.push("⚠️  Found <link> tag (non-favicon) - verify it's not a stylesheet");
} else {
  console.log("  ✅ No suspicious link tags");
}

// Check 3: Verify CSS has no @import for external stylesheets
console.log("\n✓ Checking CSS imports...");
const css = readFileSync(cssPath, "utf8");

if (css.includes("@import url")) {
  errors.push(
    "❌ Found @import url() in CSS - external stylesheets not allowed\n" +
    "   All CSS must be inlined or in public/widget.css"
  );
} else if (css.includes("@import")) {
  console.log("  ⚠️  @import found (local CSS likely OK, verify manually)");
} else {
  console.log("  ✅ No external @import statements");
}

// Check 4: MoEngage config placeholders
console.log("\n✓ Checking config placeholders...");
if (html.includes("PLACEHOLDER_APP_ID")) {
  console.log("  ✅ PLACEHOLDER_APP_ID found");
} else {
  warnings.push("⚠️  PLACEHOLDER_APP_ID not found - may have been injected already");
}

if (html.includes("PLACEHOLDER_DATA_CENTER")) {
  console.log("  ✅ PLACEHOLDER_DATA_CENTER found");
} else {
  warnings.push("⚠️  PLACEHOLDER_DATA_CENTER not found");
}

// Summary
console.log("\n" + "═".repeat(60));
if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ All checks passed! Widget is ChatGPT-safe.\n");
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log("\n❌ ERRORS (must fix):\n");
    errors.forEach((err, i) => console.log(`${i + 1}. ${err}\n`));
  }
  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS (review):\n");
    warnings.forEach((warn, i) => console.log(`${i + 1}. ${warn}\n`));
  }
  process.exit(errors.length > 0 ? 1 : 0);
}
