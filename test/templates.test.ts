import { describe, it, expect } from 'vitest';
import { getTemplate, pdfTemplates } from '../src/templates.ts';

describe('templates', () => {
    it('returns all three templates', () => {
        expect(Object.keys(pdfTemplates)).toEqual(['default', 'github', 'magazine']);
    });

    it('getTemplate returns correct template by name', () => {
        const t = getTemplate('default');
        expect(t.name).toBe('default');
        expect(t.file).toBe('default.html');
    });

    it('getTemplate returns github template', () => {
        const t = getTemplate('github');
        expect(t.name).toBe('github');
        expect(t.file).toBe('github.html');
    });

    it('getTemplate returns magazine template', () => {
        const t = getTemplate('magazine');
        expect(t.name).toBe('magazine');
        expect(t.file).toBe('magazine.html');
    });

    it('throws on unknown template name', () => {
        expect(() => getTemplate('nonexistent')).toThrowError(/Unknown PDF template: nonexistent/);
    });

    it('each template has required fields', () => {
        for (const [key, t] of Object.entries(pdfTemplates)) {
            expect(t.name).toBe(key);
            expect(t.description).toBeTruthy();
            expect(t.file).toMatch(/\.html$/);
        }
    });
});
