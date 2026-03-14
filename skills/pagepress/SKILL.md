---
name: pagepress
description: "Generate one-page visual reports, dashboards, and infographics from HTML as PNG images. Use when the user wants to create infographics, visual reports, data dashboards, cheat sheets, or any single-page visual content. Trigger phrases include 'infographic', 'visual report', 'dashboard image', 'cheat sheet', 'one-page summary', 'HTML to PNG', '生成信息图', '可视化报告'. Only local HTML file input is supported — remote URLs are not accepted."
---

# PagePress — Infographic Generator

CLI tool to generate one-page visual reports, dashboards, and infographics from local HTML files.

## Installation

```bash
npm install -g @liustack/pagepress@latest
npx playwright install chromium
```

> **Version check**: Before generating images, run `pagepress --version`. If the command is not found or the version is outdated, re-run the install command above.

## Decision Tree

When the user asks for a visual report or infographic, follow this flow:

1. **User has a `.html` file** → render directly
2. **User has no file, but wants an infographic** → write the HTML content first (into `$ASSETS_DIR`), then render it

> **Security**: Remote URL inputs are not supported. Only local `.html` files are accepted.

## Assets Directory

- Ask the user where generated images should be stored.
- Remember the answer as `$ASSETS_DIR` for the session.
- If the user does not reply or accepts the default, use `${workspaceRoot}/assets`.

## HTML Requirements

All HTML must include a `<div id="container">` element. PagePress clips the screenshot to this element's bounding box.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    html, body { margin: 0; padding: 0; }
    #container {
      width: 100%;
      height: 100%;
      /* your styles */
    }
  </style>
</head>
<body>
  <div id="container">
    <!-- content here -->
  </div>
</body>
</html>
```

## Options

```bash
pagepress -i input.html -o output.png [options]
```

- `-i, --input <path>` — input HTML file (remote URLs not supported)
- `-o, --output <path>` — output PNG path
- `-w, --width <pixels>` — viewport width (default: 1200)
- `-h, --height <pixels>` — viewport height (default: 630)
- `--scale <number>` — device scale factor, 1-4 (default: 2)
- `--safe` — disable external network requests and JavaScript execution
- `--wait-until <state>` — navigation waitUntil: `load`, `domcontentloaded`, `networkidle`
- `--timeout <ms>` — navigation timeout in milliseconds

### Common Sizes

| Use Case | Width | Height | Command |
|----------|-------|--------|---------|
| Social card / OG image | 1200 | 630 | `-w 1200 -h 630` (default) |
| Infographic | 1080 | 1920 | `-w 1080 -h 1920` |
| Dashboard | 1920 | 1080 | `-w 1920 -h 1080` |
| Poster | 1200 | 1500 | `-w 1200 -h 1500` |
| Cheat sheet | 1080 | 1350 | `-w 1080 -h 1350` |

### When to use `--safe`

Use `--safe` when rendering untrusted HTML files. It blocks all external network requests and disables JavaScript execution in the Chromium renderer.

## Temporary Files

> [!CAUTION]
> **NEVER scatter generated HTML files across the user's project.** All intermediate files must go into `$ASSETS_DIR` (the same directory where output PNGs are stored).

This matters because writing temp files elsewhere triggers permission prompts and clutters the project. Keep everything in one place:

1. **Write temp files to `$ASSETS_DIR`** — avoids permission prompts and keeps files co-located
2. **Clean up after render** — delete the temp file immediately after a successful `pagepress` run
3. **Keep only if asked** — if the user explicitly asks to keep the source file, leave it in `$ASSETS_DIR` and report its path

## Examples

```bash
# Default infographic
pagepress -i report.html -o report.png

# Tall infographic for social media
pagepress -i data-viz.html -o infographic.png -w 1080 -h 1920

# High-DPI dashboard screenshot
pagepress -i dashboard.html -o dashboard.png -w 1920 -h 1080 --scale 3

# Render untrusted content safely
pagepress -i untrusted.html -o output.png --safe
```
