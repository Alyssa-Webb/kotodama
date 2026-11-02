/**
 * Renders art with no manual screenshots: one contact sheet with phone and desktop, light and dark, plus a frame strip of its animations.
 *
 * One component:  npm run art:sheet -- --name station --module src/features/town/buildings/Station.tsx --export Station --prop lit=true --css src/features/town/buildings/buildings.css
 * Add --width 117 to show art at its real size in CSS pixels. Small art then appears at phone-screen sharpness.
 * A whole screen: npm run art:sheet -- --name town --route town
 *
 * Writes art-sheets/<name>.png and <name>.json. Exits 1 if art leaves its viewBox or an animation isn't composited.
 * Animations are paused and stepped, so sheets repeat exactly. It can't step JS-driven motion or measure real frame rate.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { webkit, type Browser, type Page } from '@playwright/test';
import { createServer } from 'vite';

const PORT = 5199;
const STEPS = [0, 25, 50, 75, 100];
const TOLERANCE = 1;
const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  desktop: { width: 1280, height: 860 },
} as const;
const THEMES = ['light', 'dark'] as const;

const { values: opts } = parseArgs({
  options: {
    name: { type: 'string' },
    module: { type: 'string' },
    export: { type: 'string' },
    prop: { type: 'string', multiple: true },
    css: { type: 'string', multiple: true },
    route: { type: 'string' },
    width: { type: 'string' },
  },
});
if (!opts.name || (!opts.module && !opts.route)) {
  console.error(
    'Usage: npm run art:sheet -- --name <name> (--module <path> [--export <name>] | --route <screen>)',
  );
  process.exit(2);
}
const name = opts.name;

function urlFor(theme: string): string {
  const base = `http://localhost:${PORT}/kotodama/`;
  if (opts.route) return `${base}#/${opts.route === 'home' ? '' : opts.route}`;
  const params = new URLSearchParams({ module: `/kotodama/${opts.module}`, theme });
  if (opts.export) params.set('export', opts.export);
  if (opts.width) params.set('width', opts.width);
  for (const prop of opts.prop ?? []) params.append('prop', prop);
  for (const css of opts.css ?? []) params.append('css', `/kotodama/${css}`);
  return `${base}tools/art/harness.html?${params}`;
}

/** Pauses every animation at a share of the longest one's single cycle, including infinite loops. */
async function stepTo(page: Page, percent: number): Promise<number> {
  return page.evaluate(async (share) => {
    const animations = document.getAnimations();
    const ends = animations.map((a) => {
      const timing = a.effect?.getComputedTiming();
      return Number(timing?.delay ?? 0) + Number(timing?.duration ?? 0);
    });
    const longest = Math.max(0, ...ends);
    for (const a of animations) {
      a.pause();
      a.currentTime = (longest * share) / 100;
    }
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    return animations.length;
  }, percent);
}

/**
 * Lists shapes cut off by their SVG's edge. Measures each shape, because WebKit's getBBox on a root
 * <svg> leaves out art past the canvas. Skips SVGs with visible overflow and shapes cropped on purpose.
 */
async function findClipped(page: Page, tolerance: number): Promise<string[]> {
  return page.evaluate((margin) => {
    const shapes = 'path,rect,circle,ellipse,line,polygon,polyline,text,image,use';
    const unused = 'defs,clipPath,mask,symbol,pattern,marker,[clip-path],[mask]';
    const found: string[] = [];
    for (const svg of document.querySelectorAll<SVGSVGElement>('svg[viewBox]')) {
      if (getComputedStyle(svg).overflow === 'visible') continue;
      const frame = svg.getBoundingClientRect();
      if (frame.width === 0 || frame.height === 0) continue;
      let past = 0;
      for (const shape of svg.querySelectorAll(shapes)) {
        if (shape.closest(unused)) continue;
        const box = shape.getBoundingClientRect();
        if (box.width === 0 && box.height === 0) continue;
        if (
          box.left < frame.left - margin ||
          box.top < frame.top - margin ||
          box.right > frame.right + margin ||
          box.bottom > frame.bottom + margin
        ) {
          past++;
        }
      }
      if (past > 0) {
        const label =
          svg.id || svg.getAttribute('class') || svg.getAttribute('aria-label') || 'svg';
        found.push(
          `${label}: ${past} shape(s) past the edge of its ${svg.getAttribute('viewBox')} canvas`,
        );
      }
    }
    return found;
  }, tolerance);
}

/** Catches what the static gate can't read: animations set from code. */
async function findNonComposited(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const allowed = new Set(['transform', 'opacity', 'translate', 'rotate', 'scale']);
    const meta = new Set(['offset', 'computedOffset', 'easing', 'composite']);
    const found = new Set<string>();
    for (const animation of document.getAnimations()) {
      const effect = animation.effect;
      if (!(effect instanceof KeyframeEffect)) continue;
      for (const frame of effect.getKeyframes()) {
        for (const prop of Object.keys(frame)) {
          if (!allowed.has(prop) && !meta.has(prop)) found.add(prop);
        }
      }
    }
    return [...found];
  });
}

const issues = new Set<string>();

interface Shot {
  group: string;
  label: string;
  png: Buffer;
}

async function capture(page: Page): Promise<Buffer> {
  const root = opts.route ? null : await page.$('#art-root');
  const box = await root?.boundingBox();
  // A component is clipped to itself so it fills its cell; a screen keeps its whole viewport.
  return box && box.width > 0 && box.height > 0
    ? page.screenshot({ clip: box })
    : page.screenshot();
}

async function open(browser: Browser, viewport: { width: number; height: number }, theme: string) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    colorScheme: theme === 'dark' ? 'dark' : 'light',
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  // React reports a fragment drawn outside an <svg> only here, and then nothing renders.
  page.on('console', (message) => {
    // Vite's own note while it rebuilds its dependency cache on a first run isn't about the art.
    if (message.type() === 'error' && !message.text().includes('Outdated Optimize Dep')) {
      issues.add(`Console error: ${message.text().slice(0, 160)}`);
    }
  });
  page.on('pageerror', (error) => issues.add(`Page error: ${error.message.slice(0, 160)}`));
  await page.goto(urlFor(theme));
  if (!opts.route) {
    await page.waitForFunction(() => window.artReady || window.artError, undefined, {
      timeout: 60_000,
    });
    const failed = await page.evaluate(() => window.artError);
    if (failed) throw new Error(failed);
  }
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  // Lets effects start their animations before they're listed.
  await page.waitForTimeout(400);
  return { context, page };
}

function sheetHtml(shots: Shot[], issues: string[]): string {
  const groups = [...new Set(shots.map((s) => s.group))];
  const sections = groups
    .map((group) => {
      const cells = shots
        .filter((s) => s.group === group)
        .map(
          (s) =>
            `<figure><img src="data:image/png;base64,${s.png.toString('base64')}"><figcaption>${s.label}</figcaption></figure>`,
        )
        .join('');
      return `<h2>${group}</h2><div class="row">${cells}</div>`;
    })
    .join('');
  const notes = issues.length
    ? `<ul class="issues">${issues.map((i) => `<li>${i.replace(/</g, '&lt;')}</li>`).join('')}</ul>`
    : '<p class="ok">No clipping or non-composited animation found.</p>';
  return `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 24px; background: #77757a; color: #fff; font: 16px system-ui; width: 1500px; }
    h1 { margin: 0 0 8px; font-size: 24px; } h2 { margin: 20px 0 8px; font-size: 16px; }
    .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
    figure { margin: 0; } img { display: block; max-width: 280px; height: auto; }
    figcaption { padding-top: 4px; font-size: 13px; }
    .issues { margin: 0; padding-left: 20px; } .ok { margin: 0; }
  </style><h1>${name}</h1>${notes}${sections}`;
}

const server = await createServer({
  server: { port: PORT, strictPort: true },
  logLevel: 'silent',
});
await server.listen();
const browser = await webkit.launch();
const shots: Shot[] = [];
let animationCount = 0;
let svgCount = 0;

try {
  for (const [viewName, viewport] of Object.entries(VIEWPORTS)) {
    for (const theme of THEMES) {
      const { context, page } = await open(browser, viewport, theme);
      await stepTo(page, 100);
      svgCount = await page.locator('svg[viewBox]').count();
      shots.push({ group: 'Finished', label: `${viewName}, ${theme}`, png: await capture(page) });
      for (const clipped of await findClipped(page, TOLERANCE))
        issues.add(`Off-canvas: ${clipped}`);
      if (viewName === 'phone' && theme === 'light') {
        for (const prop of await findNonComposited(page)) {
          issues.add(`Not composited: an animation changes "${prop}"`);
        }
        for (const percent of STEPS) {
          animationCount = await stepTo(page, percent);
          if (animationCount === 0) break;
          shots.push({ group: 'Animation frames', label: `${percent}%`, png: await capture(page) });
          for (const clipped of await findClipped(page, TOLERANCE)) {
            issues.add(`Off-canvas at ${percent}%: ${clipped}`);
          }
        }
      }
      await context.close();
    }
  }

  const list = [...issues];
  const sheet = await browser.newPage({ viewport: { width: 1548, height: 800 } });
  await sheet.setContent(sheetHtml(shots, list));
  await sheet.evaluate(() => Promise.all([...document.images].map((img) => img.decode())));
  mkdirSync('art-sheets', { recursive: true });
  await sheet.screenshot({ path: `art-sheets/${name}.png`, fullPage: true });
  writeFileSync(
    `art-sheets/${name}.json`,
    `${JSON.stringify({ name, svgs: svgCount, animations: animationCount, issues: list }, null, 2)}\n`,
  );
  console.log(
    `art-sheets/${name}.png, ${shots.length} shots, ${svgCount} SVGs checked, ${animationCount} animations`,
  );
  for (const issue of list) console.log(`  ${issue}`);
  console.log(list.length ? `${list.length} flagged` : 'Clean');
  process.exitCode = list.length ? 1 : 0;
} finally {
  await browser.close();
  await server.close();
}
