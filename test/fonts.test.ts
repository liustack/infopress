import { describe, it, expect } from 'vitest';
import { getFontCSS } from '../src/fonts.ts';

describe('fonts', () => {
    it('returns empty string for default template', () => {
        expect(getFontCSS('default')).toBe('');
    });

    it('returns empty string for github template', () => {
        expect(getFontCSS('github')).toBe('');
    });

    it('returns font CSS for magazine template', () => {
        const css = getFontCSS('magazine');
        expect(css).toBeTruthy();
        expect(css).toContain('@font-face');
        expect(css).toContain('base64');
    });

    it('returns empty string for unknown template', () => {
        expect(getFontCSS('unknown')).toBe('');
    });
});
