import { expect, test, type Page } from '@playwright/test';

/** Gives the save some yen (a ledger entry) and reloads, like a player who has earned it. */
async function giveYen(page: Page, yen: number) {
  await page.evaluate(async (amount) => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('kotodama');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const rec = await new Promise<{ state: { ledger: Record<string, unknown>[] } }>((res) => {
      const q = db.transaction('profile').objectStore('profile').get('main');
      q.onsuccess = () => res(q.result as { state: { ledger: Record<string, unknown>[] } });
    });
    const ledger = rec.state.ledger;
    const last = ledger[ledger.length - 1]!;
    const id = Math.max(...ledger.map((e) => Number(e.id))) + 1;
    ledger.push({ id, at: last.at, day: last.day, asset: 'yen', amount, reason: 'test' });
    await new Promise<void>((res) => {
      const t = db.transaction('profile', 'readwrite');
      t.objectStore('profile').put(rec);
      t.oncomplete = () => res();
    });
  }, yen);
  await page.reload();
}

test('buying in the shop opens the coin counter on screen and completes', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Wake your first spirit' })).toBeVisible();
  await giveYen(page, 1000);
  await page.goto('./#/shop');

  // Scroll first: the bug this guards against put the sheet ~1,100px below a scrolled page.
  const buy = page.getByRole('button', { name: 'Buy Chōchin lantern for 80 yen' });
  await buy.scrollIntoViewIfNeeded();
  await buy.click();

  const sheet = page.getByRole('dialog', { name: 'Pay for Chōchin lantern' });
  await expect(sheet).toBeVisible();
  const box = await sheet.locator('.pay-card').boundingBox();
  const vh = page.viewportSize()!.height;
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(vh + 1);

  // Count out ¥80: a 50 and three 10s.
  await sheet.getByRole('button', { name: '50 yen', exact: true }).click();
  for (let i = 0; i < 3; i++)
    await sheet.getByRole('button', { name: '10 yen', exact: true }).click();
  await expect(sheet).toBeHidden();
  await expect(page.getByText('Bought!')).toBeVisible();
});
