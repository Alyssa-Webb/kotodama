import rawTokens from '../../../design/tokens.json';
import { ThemeTokensSchema, type ColorSet, type ThemeTokens } from '../../schema/theme';

export const tokens: ThemeTokens = ThemeTokensSchema.parse(rawTokens);

export type ThemePreference = 'system' | 'light' | 'dark';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function colorVars(set: ColorSet): string {
  return Object.entries(set)
    .map(([k, v]) => `--c-${kebab(k)}: ${v};`)
    .join(' ');
}

/** Builds the CSS custom properties for a token set (pure; exported for tests). */
export function themeCss(t: ThemeTokens): string {
  const scalar = [
    `--font-ui: ${t.fonts.ui};`,
    `--font-display: ${t.fonts.display};`,
    `--font-mono: ${t.fonts.mono};`,
    ...Object.entries(t.typeScale).map(([k, v]) => `--fs-${k}: ${v};`),
    ...Object.entries(t.spacing).map(([k, v]) => `--sp-${k}: ${v};`),
    ...Object.entries(t.radii).map(([k, v]) => `--r-${k}: ${v};`),
    `--dur-fast: ${t.motion.fast}ms;`,
    `--dur-base: ${t.motion.base}ms;`,
    `--dur-slow: ${t.motion.slow}ms;`,
    `--dur-celebrate: ${t.motion.celebrate}ms;`,
    `--ease: ${t.motion.easing};`,
  ].join(' ');
  const light = colorVars(t.colors.light);
  const dark = colorVars(t.colors.dark);
  return [
    `:root { ${scalar} ${light} color-scheme: light; }`,
    `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${dark} color-scheme: dark; } }`,
    `:root[data-theme="dark"] { ${dark} color-scheme: dark; }`,
    `:root[data-theme="light"] { ${light} color-scheme: light; }`,
  ].join('\n');
}

export function installTheme(t: ThemeTokens = tokens): void {
  let el = document.getElementById('koto-theme');
  if (!el) {
    el = document.createElement('style');
    el.id = 'koto-theme';
    document.head.prepend(el);
  }
  el.textContent = themeCss(t);
}

export function applyThemePreference(pref: ThemePreference): void {
  const root = document.documentElement;
  if (pref === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);
  const isDark =
    pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const bg = isDark ? tokens.colors.dark.bg : tokens.colors.light.bg;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', bg));
}
