# PagePress

A CLI toolkit for AI agents to render local Markdown and HTML files into high-quality PDF documents.

中文说明请见：[README.zh-CN.md](README.zh-CN.md)

## Features

- PDF-only command surface (`pagepress`)
- Local file input only (`.md` / `.html`)
- Built-in Markdown templates: `default`, `github`, `magazine`
- Built-in Mermaid rendering for Markdown code blocks
- Deterministic output via Playwright + Chromium print engine

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
# Markdown to PDF
pagepress -i document.md -o output.pdf --template default

# Local HTML to PDF
pagepress -i page.html -o output.pdf
```

## Templates

- `default` - Clean minimalist style
- `github` - GitHub style
- `magazine` - magazine layout

## Options

- `-i, --input <path>` input Markdown or HTML file path
- `-o, --output <path>` output PDF file path
- `-t, --template <name>` template for Markdown input (default: `default`)
- `--wait-until <state>` `load | domcontentloaded | networkidle`
- `--timeout <ms>` timeout in milliseconds
- `--safe` disable external network requests and JavaScript execution

## AI Agent Skill

- [pagepress/SKILL.md](skills/pagepress/SKILL.md)

## License

MIT
