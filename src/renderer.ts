import { chromium, Browser } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

type WaitUntilState = 'load' | 'domcontentloaded' | 'networkidle';

const WAIT_UNTIL_STATES = new Set<WaitUntilState>(['load', 'domcontentloaded', 'networkidle']);
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;

function normalizeWaitUntil(value?: string): WaitUntilState {
    if (!value) return 'networkidle';
    if (WAIT_UNTIL_STATES.has(value as WaitUntilState)) {
        return value as WaitUntilState;
    }
    throw new Error(`Invalid waitUntil: ${value}. Allowed: load, domcontentloaded, networkidle.`);
}

function normalizeTimeout(value?: number): number {
    if (value === undefined) return 30000;
    if (!Number.isFinite(value) || value < 0) {
        throw new Error('Invalid timeout. Use a non-negative number of milliseconds.');
    }
    return value;
}

function validateRange(name: string, value: number, min: number, max: number): void {
    if (!Number.isFinite(value)) {
        throw new Error(`${name} must be a finite number.`);
    }
    if (value < min || value > max) {
        throw new Error(`${name} must be between ${min} and ${max}. Received: ${value}.`);
    }
}

export interface Options {
    input: string;
    output: string;
    width?: number;
    height?: number;
    scale?: number;
    safe?: boolean;
    waitUntil?: string;
    timeout?: number;
}

export interface Result {
    pngPath: string;
    meta: {
        width: number;
        height: number;
        deviceScaleFactor: number;
        generatedAt: string;
    };
}

export async function render(options: Options): Promise<Result> {
    const width = options.width ?? DEFAULT_WIDTH;
    const height = options.height ?? DEFAULT_HEIGHT;
    const scale = options.scale ?? 2;
    const safeMode = options.safe ?? false;
    const waitUntil = normalizeWaitUntil(options.waitUntil);
    const timeout = normalizeTimeout(options.timeout);

    validateRange('Width', width, 1, 10000);
    validateRange('Height', height, 1, 10000);
    validateRange('Scale', scale, MIN_SCALE, MAX_SCALE);

    if (options.input.startsWith('http://') || options.input.startsWith('https://')) {
        throw new Error('Remote URL inputs are not supported. Please provide a local HTML file path.');
    }

    if (!options.input.endsWith('.html')) {
        throw new Error(`Unsupported input format: ${options.input}. Only HTML (.html) files are supported.`);
    }

    const inputPath = path.resolve(options.input);
    const htmlContent = fs.readFileSync(inputPath, 'utf-8');

    let browser: Browser | null = null;

    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width, height },
            deviceScaleFactor: scale,
            javaScriptEnabled: !safeMode,
        });
        if (safeMode) {
            await context.route('**/*', (route) => {
                const url = route.request().url();
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    return route.abort();
                }
                return route.continue();
            });
        }
        const page = await context.newPage();

        // Navigate to the input file URL first so relative asset paths (images, fonts, etc.) resolve correctly.
        await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'domcontentloaded', timeout });
        await page.setContent(htmlContent, { waitUntil, timeout });

        // Force body to match specified dimensions
        await page.addStyleTag({
            content: `
                html, body {
                    width: ${width}px;
                    height: ${height}px;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
            `
        });

        await page.waitForTimeout(500);

        const cardContainer = await page.$('#container');
        if (!cardContainer) {
            throw new Error('Missing #container element. PNG output requires a <div id="container"> wrapper.');
        }
        const box = await cardContainer.boundingBox();
        if (!box || box.width <= 0 || box.height <= 0) {
            throw new Error('Invalid #container size. Ensure it has a positive width and height.');
        }

        const outputPath = path.resolve(options.output);
        await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: { x: box.x, y: box.y, width: box.width, height: box.height },
        });

        return {
            pngPath: outputPath,
            meta: {
                width,
                height,
                deviceScaleFactor: scale,
                generatedAt: new Date().toISOString(),
            },
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
