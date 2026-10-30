import { describe, expect, it } from 'vitest';
import { themeCss, tokens } from './theme';

describe('themeCss', () => {
  it('emits light vars on :root and dark vars for both dark-mode selectors', () => {
    const css = themeCss(tokens);
    expect(css).toContain(`--c-bg: ${tokens.colors.light.bg};`);
    expect(css).toContain(`--c-accent-soft: ${tokens.colors.light.accentSoft};`);
    expect(css).toContain(':root:not([data-theme="light"])');
    expect(css).toContain(`:root[data-theme="dark"] { --c-bg: ${tokens.colors.dark.bg};`);
    expect(css).toContain(`--dur-base: ${tokens.motion.base}ms;`);
  });
});
