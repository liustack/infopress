# PagePress

Generate one-page visual reports, dashboards, and infographics from HTML — powered by Playwright + Chromium.

中文说明请见：[README.zh-CN.md](README.zh-CN.md)

## Features

- HTML → PNG screenshot pipeline
- Custom viewport dimensions (`--width`, `--height`)
- High-DPI output via `--scale` (up to 4x)
- Local HTML file input only (`.html`)
- Deterministic output via Playwright + Chromium

## Installation

```bash
npm install -g @liustack/pagepress
npx playwright install chromium
```

Or run with `npx`:

```bash
npx @liustack/pagepress [options]
```

## Usage

```bash
# Generate infographic (default 1200×630 @2x)
pagepress -i report.html -o report.png

# Custom dimensions for a tall infographic
pagepress -i report.html -o report.png -w 1080 -h 1920

# High-DPI poster
pagepress -i poster.html -o poster.png -w 1200 -h 1500 --scale 3
```

## HTML Requirements

Your HTML must include a `<div id="container">` — PagePress clips the screenshot to this element's bounding box.

```html
<body>
  <div id="container">
    <!-- your content here -->
  </div>
</body>
```

## Options

- `-i, --input <path>` input HTML file path
- `-o, --output <path>` output PNG file path
- `-w, --width <pixels>` viewport width (default: 1200)
- `-h, --height <pixels>` viewport height (default: 630)
- `--scale <number>` device scale factor, 1-4 (default: 2)
- `--wait-until <state>` `load | domcontentloaded | networkidle`
- `--timeout <ms>` timeout in milliseconds
- `--safe` disable external network requests and JavaScript execution

## AI Agent Skill

- [pagepress/SKILL.md](skills/pagepress/SKILL.md)

## License

MIT
