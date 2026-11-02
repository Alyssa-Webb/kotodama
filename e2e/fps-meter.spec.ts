import { expect, test } from '@playwright/test';

test('the frame-rate meter appears only with ?fps, and reports real numbers', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Kotodama', exact: true })).toBeVisible();
  await expect(page.locator('.fps-meter')).toHaveCount(0);

  await page.goto('./?fps');
  await expect(page.locator('.fps-meter')).toHaveText(
    /^\d+ fps · low \d+ · worst \d+ ms · \d+% slow$/,
  );
});
