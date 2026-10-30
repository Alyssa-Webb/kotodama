import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { playKanaLesson } from './helpers';

const shot = (name: string, project: string) => `docs/screenshots/${project}-${name}.png`;
/** Lets entrance animations settle so screenshots show the finished frame. */
const settle = (page: import('@playwright/test').Page) => page.waitForTimeout(800);

test('golden path: first lesson, rewards, reviews, persistence', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`${e.message}\n${e.stack ?? ''}`));
  test.info().annotations.push({ type: 'errors', description: 'collected below' });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Wake your first spirit' })).toBeVisible();
  await settle(page);
  await page.screenshot({ path: shot('home', info.project.name) });

  await page.getByRole('link', { name: 'Start your first lesson' }).click();
  await playKanaLesson(page, shot('lesson', info.project.name)).catch((e: Error) => {
    throw new Error(`${e.message}\nPage errors:\n${errors.join('\n')}`);
  });
  await expect(page.getByText('XP', { exact: true })).toBeVisible();
  await expect(page.getByLabel('3 of 3 stars')).toBeVisible();
  await expect(page.getByText('Added to your reviews')).toBeVisible();
  await settle(page);
  await page.screenshot({ path: shot('results', info.project.name) });
  await page.getByRole('button', { name: 'Continue' }).click();

  // Yen earned, the next node is unlocked, the items are scheduled.
  await expect(page.getByLabel(/^1[5-9] yen|^[2-9]\d yen/)).toBeVisible();
  await page.goto('./#/collection');
  await expect(page.locator('.spirit')).toHaveCount(5);

  // Progress survives a reload.
  await page.reload();
  await page.goto('./#/path');
  await expect(page.getByRole('link', { name: 'Vowels あいうえお, completed' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'The K row かきくけこ' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('town, shop and import screens render', async ({ page }, info) => {
  await page.goto('./#/town');
  await expect(page.getByRole('img', { name: /Town map/ })).toBeVisible();
  await settle(page);
  await page.screenshot({ path: shot('town', info.project.name) });
  await page.goto('./#/shop');
  await expect(page.getByRole('button', { name: 'Buy Kotatsu for 60 yen' })).toBeDisabled();
  await settle(page);
  await page.screenshot({ path: shot('shop', info.project.name), fullPage: false });
  await page.goto('./#/packs');
  await expect(page.getByRole('heading', { name: 'Paste Lesson' })).toBeVisible();
  await settle(page);
  await page.screenshot({ path: shot('import', info.project.name) });
});

test('the ChatGPT loop: bad pack shows copyable errors; good pack installs; report copies', async ({
  page,
  context,
  browserName,
}) => {
  await page.goto('./#/packs');
  await page
    .getByPlaceholder(/schemaVersion/)
    .fill('```json\n{"schemaVersion":"1.0.0","pack":{"id":"x"}}\n```');
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.getByRole('heading', { name: /problem\(s\) found/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy errors for ChatGPT' })).toBeVisible();

  const starter = JSON.parse(readFileSync('content/packs/kotodama-starter.json', 'utf8'));
  // A "new" pack from ChatGPT: same content under a new pack ID and fresh item IDs.
  const text = JSON.stringify(starter)
    .replaceAll('"kotodama-starter"', '"e2e-pack"')
    .replaceAll('"First Steps"', '"E2E Pack"')
    .replace(/"([kwpgsd])\.([a-z0-9_-]+)"/g, '"$1.e2e-$2"');
  await page.getByPlaceholder(/schemaVersion/).fill(text);
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.getByLabel('Pack preview')).toContainText('E2E Pack');
  await expect(page.getByLabel('Pack preview')).toContainText('voice pending');
  await page.getByRole('button', { name: 'Install' }).click();
  await expect(page.getByText('Installed. Find it on the Path.')).toBeVisible();
  await page.goto('./#/path');
  await expect(page.getByText('E2E Pack · N5')).toBeVisible();

  await page.goto('./#/packs');
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy for ChatGPT' }).click();
  await expect(page.getByText(/Report copied|Copy failed/)).toBeVisible();
  await page.getByText('Preview', { exact: true }).click();
  await expect(page.locator('pre')).toContainText('# LEARNER REPORT');
});

test('backup and restore round-trip', async ({ page, browser }) => {
  await page.goto('./#/settings');
  await page.getByRole('button', { name: 'Casual' }).click();
  await page.goto('./#/packs');
  const [dl] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download backup' }).click(),
  ]);
  const path = await dl.path();
  const fresh = await browser.newContext();
  const p2 = await fresh.newPage();
  await p2.goto(page.url());
  await expect(p2.getByRole('heading', { name: 'Paste Lesson' })).toBeVisible();
  p2.on('dialog', (d) => void d.accept());
  await p2.locator('input[type=file][accept=".json,application/json"]').setInputFiles(path!);
  await expect(p2.getByText('Backup restored.')).toBeVisible();
  await p2.goto(page.url().replace('#/packs', '#/settings'));
  await expect(p2.getByRole('button', { name: 'Casual' })).toHaveAttribute('aria-pressed', 'true');
  await fresh.close();
});

test('accessibility: no serious axe violations on home and a lesson', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Wake your first spirit' })).toBeVisible();
  const home = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(
    home.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes[0]?.target}`),
  ).toEqual([]);
  await page.goto('./#/lesson/kotodama-starter/u01.n01');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  const lesson = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(
    lesson.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes[0]?.target}`),
  ).toEqual([]);
});

test('dark mode renders the game skin', async ({ page }, info) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Wake your first spirit' })).toBeVisible();
  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--c-bg').trim(),
  );
  expect(bg.toLowerCase()).not.toBe('#f6f1e7');
  await settle(page);
  await page.screenshot({ path: shot('home-dark', info.project.name) });
  await page.goto('./#/lesson/kotodama-starter/u01.n01');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await settle(page);
  await page.screenshot({ path: shot('teach-dark', info.project.name) });
});
