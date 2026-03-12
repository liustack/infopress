#!/usr/bin/env node

declare const __APP_VERSION__: string;

import { Command } from 'commander';
import { render } from './renderer.ts';

const program = new Command();

program
    .name('pagepress')
    .description('Render local Markdown and HTML files to PDF')
    .version(__APP_VERSION__)
    .requiredOption('-i, --input <path>', 'Input Markdown or HTML file path')
    .requiredOption('-o, --output <path>', 'Output PDF file path')
    .option('-t, --template <name>', 'PDF template (default, github, magazine)', 'default')
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
                template: options.template,
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
