import { expect, test } from '@playwright/test';

test('app shell loads with manifest and icons', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: /Kotodama/ })).toBeVisible();
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifest).toContain('manifest.webmanifest');
  const res = await page.request.get(`./${manifest!.replace(/^\/kotodama\//, '')}`);
  const json = (await res.json()) as { start_url: string; scope: string; display: string };
  expect(json.start_url).toBe('/kotodama/');
  expect(json.scope).toBe('/kotodama/');
  expect(json.display).toBe('standalone');
});
