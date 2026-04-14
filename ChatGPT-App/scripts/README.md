# Scripts

Utility scripts for maintaining widget quality and ChatGPT compatibility.

## validate-widget.js

**Purpose:** Ensures widget will work in ChatGPT sandbox without MIME type errors.

**Run:**
```bash
npm run validate
```

**What it checks:**
- ✅ CSS is inlined (not external `<link>` tags)
- ✅ No `@import url()` statements (external stylesheets)
- ✅ `food-widget.html` has `{{INLINE_CSS}}` placeholder
- ✅ `public/widget.css` exists and is not empty
- ✅ No suspicious external stylesheet references
- ✅ MoEngage config placeholders are present

**Exit codes:**
- `0` — All checks passed, safe for ChatGPT
- `1` — Errors found, fix before deploying

**When it runs:**
- Automatically after `npm run build`
- Manually: `npm run validate`
- On every server start (validation in `lib/widget.js`)

## Why This Matters

ChatGPT's sandbox rewrites external stylesheet MIME types to `application/xml`, causing:
```
Refused to apply style from '...' because its MIME type ('application/xml') 
is not a supported stylesheet MIME type
```

**Solution:** All CSS must be inlined at build time via `{{INLINE_CSS}}` placeholder.

## Preventing Regressions

1. **Never** use `<link rel="stylesheet">` in `public/food-widget.html`
2. **Always** use `npm run build` (includes validation)
3. **Always** run `npm run validate` before deploying to ChatGPT
4. The validation script prevents broken deploys automatically ✅
