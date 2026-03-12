import { describe, it, expect, afterEach } from 'vitest';
import { render } from '../src/renderer.ts';
import * as fs from 'fs';
import * as path from 'path';

const fixtures = path.resolve(__dirname, 'fixtures');
const outDir = path.resolve(__dirname, 'output');

function outPath(name: string): string {
    return path.join(outDir, name);
}

describe('render', () => {
    afterEach(() => {
        // Clean up output files
        if (fs.existsSync(outDir)) {
            for (const f of fs.readdirSync(outDir)) {
                fs.unlinkSync(path.join(outDir, f));
            }
            fs.rmdirSync(outDir);
        }
    });

    it('renders markdown to PDF with default template', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('basic-default.pdf');
        const result = await render({
            input: path.join(fixtures, 'basic.md'),
            output: out,
        });

        expect(result.pdfPath).toBe(out);
        expect(result.meta.template).toBe('default');
        expect(fs.existsSync(out)).toBe(true);
        expect(fs.statSync(out).size).toBeGreaterThan(0);
    });

    it('renders markdown to PDF with github template', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('basic-github.pdf');
        const result = await render({
            input: path.join(fixtures, 'basic.md'),
            output: out,
            template: 'github',
        });

        expect(result.meta.template).toBe('github');
        expect(fs.existsSync(out)).toBe(true);
    });

    it('renders markdown to PDF with magazine template', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('basic-magazine.pdf');
        const result = await render({
            input: path.join(fixtures, 'basic.md'),
            output: out,
            template: 'magazine',
        });

        expect(result.meta.template).toBe('magazine');
        expect(fs.existsSync(out)).toBe(true);
    });

    it('renders HTML to PDF', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('basic-html.pdf');
        const result = await render({
            input: path.join(fixtures, 'basic.html'),
            output: out,
        });

        expect(result.pdfPath).toBe(out);
        expect(fs.existsSync(out)).toBe(true);
    });

    it('renders markdown without frontmatter', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('no-frontmatter.pdf');
        const result = await render({
            input: path.join(fixtures, 'no-frontmatter.md'),
            output: out,
        });

        expect(result.meta.template).toBe('default');
        expect(fs.existsSync(out)).toBe(true);
    });

    it('renders markdown with mermaid diagrams', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('mermaid.pdf');
        const result = await render({
            input: path.join(fixtures, 'mermaid.md'),
            output: out,
        });

        expect(fs.existsSync(out)).toBe(true);
    });

    it('rejects remote URLs', async () => {
        await expect(
            render({ input: 'https://example.com', output: 'out.pdf' })
        ).rejects.toThrow(/Remote URL inputs are not supported/);
    });

    it('rejects unsupported file formats', async () => {
        await expect(
            render({ input: 'file.txt', output: 'out.pdf' })
        ).rejects.toThrow(/Unsupported input format/);
    });

    it('throws on unknown template', async () => {
        await expect(
            render({
                input: path.join(fixtures, 'basic.md'),
                output: 'out.pdf',
                template: 'nonexistent',
            })
        ).rejects.toThrow(/Unknown PDF template/);
    });

    it('result includes generatedAt timestamp', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('timestamp.pdf');
        const before = new Date().toISOString();
        const result = await render({
            input: path.join(fixtures, 'basic.md'),
            output: out,
        });
        const after = new Date().toISOString();

        expect(result.meta.generatedAt >= before).toBe(true);
        expect(result.meta.generatedAt <= after).toBe(true);
    });
});
