# PagePress

从 HTML 生成单页可视化报告、仪表盘和信息图 — 基于 Playwright + Chromium。

## 特性

- HTML → PNG 截图管线
- 自定义视口尺寸（`--width`、`--height`）
- 高 DPI 输出，支持最高 4 倍缩放（`--scale`）
- 仅支持本地 HTML 文件输入（`.html`）
- 基于 Playwright + Chromium 的稳定渲染引擎

## 安装

```bash
npm install -g @liustack/pagepress
npx playwright install chromium
```

或使用 `npx`：

```bash
npx @liustack/pagepress [options]
```

## 用法

```bash
# 生成信息图（默认 1200×630 @2x）
pagepress -i report.html -o report.png

# 自定义尺寸的长信息图
pagepress -i report.html -o report.png -w 1080 -h 1920

# 高 DPI 海报
pagepress -i poster.html -o poster.png -w 1200 -h 1500 --scale 3
```

## HTML 要求

HTML 中必须包含 `<div id="container">` — PagePress 会根据该元素的边界框裁剪截图。

```html
<body>
  <div id="container">
    <!-- 你的内容 -->
  </div>
</body>
```

## 参数

- `-i, --input <path>` 输入 HTML 路径
- `-o, --output <path>` 输出 PNG 路径
- `-w, --width <pixels>` 视口宽度（默认: 1200）
- `-h, --height <pixels>` 视口高度（默认: 630）
- `--scale <number>` 设备缩放因子，1-4（默认: 2）
- `--wait-until <state>` `load | domcontentloaded | networkidle`
- `--timeout <ms>` 超时时间（毫秒）
- `--safe` 禁用外部网络请求和 JavaScript 执行

## AI Agent Skill

- [pagepress/SKILL.md](skills/pagepress/SKILL.md)

## License

MIT
