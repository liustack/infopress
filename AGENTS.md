# Project Overview (for AI Agent)

## Goal
Provide the `briefpress` CLI tool to render local HTML files into **PNG**. Remote URLs are not supported for security reasons.

## Technical Approach
- **Playwright + Chromium** as the rendering and export engine
- **PNG**: use Playwright screenshots clipped to the `#container` element

```bash
cd /path/to/briefpress
pnpm install
pnpm exec playwright install chromium
```

## Code Organization

```
src/
├── main.ts         # CLI entry
└── renderer.ts     # PDF rendering logic
```

## Skills Directory

```
skills/
└── briefpress/
    └── SKILL.md
```

The CLI is exposed via `dist/main.js`.

## CLI Usage

```bash
briefpress -i page.html -o output.png
```

## Operational Docs (`docs/`)

1. Operational docs use front-matter metadata (`summary`, `read_when`).
2. Before creating a new doc, run `pnpm docs:list` to review the existing index.
3. Before coding, check the `read_when` hints and read relevant docs as needed.
4. Existing docs: `commit`, `testing`.

## .gitignore must include
- `node_modules/`
- `dist/`
- `skills/**/outputs/`
- common logs/cache/system files
