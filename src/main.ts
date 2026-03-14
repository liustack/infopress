#!/usr/bin/env node

declare const __APP_VERSION__: string;

import { Command } from 'commander';
import { render } from './renderer.ts';

const program = new Command();

program
    .name('pagepress')
    .description('Generate one-page visual reports, dashboards, and infographics from HTML')
    .version(__APP_VERSION__)
    .requiredOption('-i, --input <path>', 'Input HTML file path')
    .requiredOption('-o, --output <path>', 'Output PNG file path')
    .option('-w, --width <pixels>', 'Viewport width in pixels', '1200')
    .option('-h, --height <pixels>', 'Viewport height in pixels', '630')
    .option('--scale <number>', 'Device scale factor (1-4)', '2')
    .option('--wait-until <state>', 'Navigation waitUntil (load, domcontentloaded, networkidle)', 'networkidle')
    .option('--timeout <ms>', 'Navigation timeout in milliseconds', '30000')
    .option('--safe', 'Disable external network requests and JavaScript execution')
    .action(async (options) => {
        try {
            const timeout = Number.parseInt(options.timeout, 10);
            if (!Number.isFinite(timeout) || timeout < 0) {
                throw new Error('Invalid --timeout value. Use a non-negative integer in milliseconds.');
            }

            const result = await render({
                input: options.input,
                output: options.output,
                width: Number.parseInt(options.width, 10),
                height: Number.parseInt(options.height, 10),
                scale: Number.parseFloat(options.scale),
                waitUntil: options.waitUntil,
                timeout,
                safe: options.safe,
            });
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

program.parse();
