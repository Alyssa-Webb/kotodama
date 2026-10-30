import { expect, test } from '@playwright/test';

test('works offline after the first load (service worker precache)', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Kotodama', exact: true })).toBeVisible();
  const controlled = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
          once: true,
        });
        setTimeout(resolve, 5000);
      });
    }
    return !!reg.active;
  });
  expect(controlled).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('link', { name: 'Kotodama', exact: true })).toBeVisible();
  await page.goto('./#/path');
  await expect(page.getByText('First Steps · N5')).toBeVisible();
  await context.setOffline(false);
});
