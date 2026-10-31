import { expect, test } from '@playwright/test';

test('Home is one screen: the region scene, one way forward, reminders only when needed', async ({
  page,
}, info) => {
  await page.goto('./');
  const scene = page.getByRole('region', { name: 'Today' });
  await expect(scene).toBeVisible();
  // A new player's first lesson is in the Dojo, so Home shows the Dojo.
  await expect(scene.getByText('The Dojo', { exact: true })).toBeVisible();

  const start = page.getByRole('link', { name: 'Start your first lesson: Vowels' });
  await expect(start).toBeVisible();
  await expect(page.getByRole('link', { name: 'Arcade' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Spirits/ })).toBeVisible();

  // At most three reminders, each with something to do.
  const nudges = page.getByRole('list', { name: 'Needs you' }).getByRole('listitem');
  expect(await nudges.count()).toBeLessThanOrEqual(3);

  if (info.project.name === 'iphone') {
    // A new player sees all of Home above the tab bar without scrolling.
    const more = await page.getByRole('navigation', { name: 'More to play' }).boundingBox();
    const tabs = await page.locator('.tab').first().boundingBox();
    expect(more && tabs && more.y + more.height <= tabs.y).toBe(true);
  }

  await start.click();
  await expect(page).toHaveURL(/#\/lesson\//);
});
