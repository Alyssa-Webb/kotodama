import { expect, type Page } from '@playwright/test';

/** Kana → romaji for the starter Kana Gate (the e2e plays it like a learner who knows the answers). */
export const KANA: Record<string, string> = {
  あ: 'a',
  い: 'i',
  う: 'u',
  え: 'e',
  お: 'o',
  か: 'ka',
  き: 'ki',
  く: 'ku',
  け: 'ke',
  こ: 'ko',
};
const ROMAJI = Object.fromEntries(Object.entries(KANA).map(([k, v]) => [v, k]));

async function visibleText(page: Page, selector: string): Promise<string> {
  return ((await page.locator(selector).first().textContent()) ?? '').trim();
}

/** Answers the current Kana Gate question correctly. Returns false when no question is showing. */
export async function answerKanaQuestion(page: Page): Promise<boolean> {
  const card = page.locator('.question');
  if (!(await card.isVisible().catch(() => false))) return false;
  // Listening questions can't be read off the page any more (that gave the answer away), so
  // the e2e learner takes the ungraded "can't listen now" skip, like a player on a train.
  const skip = page.getByRole('button', { name: "Can't listen now? Skip" });
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
    return true;
  }
  const instruction = await visibleText(page, '.question .eyebrow');

  if (instruction === 'Match the pairs') {
    const left = page.locator('.match-grid .options').first().locator('button');
    const n = await left.count();
    for (let i = 0; i < n; i++) {
      const b = left.nth(i);
      const kana = ((await b.textContent()) ?? '').trim();
      await b.click();
      await page
        .locator('.match-grid .options')
        .nth(1)
        .getByRole('button', { name: KANA[kana]!, exact: true })
        .click();
    }
    // A correct match auto-advances; wait for the next question before reading the screen again.
    await expect(page.locator('.match-grid')).toBeHidden();
    return true;
  }
  if (instruction.startsWith('Write it')) {
    await page.getByRole('button', { name: /I wrote it on paper|Compare/ }).click();
    await page.getByRole('button', { name: 'I got it' }).click();
    return true;
  }
  if (instruction === 'Type what you hear') {
    const heard = await visibleText(page, '.question .big-ja');
    await page.getByLabel('Your answer').fill(heard);
    await page.getByRole('button', { name: 'Check' }).click();
    return true;
  }
  if (instruction === 'Type the sound in romaji') {
    const kana = await visibleText(page, '.prompt-ja');
    await page.getByLabel('Your answer').fill(KANA[kana]!);
    await page.getByRole('button', { name: 'Check' }).click();
    return true;
  }
  if (instruction === 'What sound is this?') {
    const kana = await visibleText(page, '.prompt-ja');
    await page
      .locator('.options .option')
      .filter({ hasText: new RegExp(`^\\d${KANA[kana]}$`) })
      .click();
    return true;
  }
  if (instruction === 'What did you hear?') {
    const heard = await visibleText(page, '.question .big-ja');
    await page
      .locator('.options .option')
      .filter({ hasText: new RegExp(`^\\d${heard}$`) })
      .click();
    return true;
  }
  throw new Error(`unhandled question: ${instruction} ${ROMAJI.a}`);
}

export async function continueIfFeedback(page: Page) {
  const cont = page.locator('.feedback').getByRole('button', { name: 'Continue' });
  if (await cont.isVisible().catch(() => false)) await cont.click();
}

/** Plays the open lesson to its results screen. */
export async function playKanaLesson(page: Page, screenshot?: string) {
  const start = page.getByRole('button', { name: 'Start lesson' });
  while (!(await start.isVisible().catch(() => false)))
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  await start.click();
  for (let i = 0; i < 40; i++) {
    if (
      await page
        .getByText('Complete', { exact: true })
        .isVisible()
        .catch(() => false)
    )
      break;
    if (i === 3 && screenshot) await page.screenshot({ path: screenshot });
    await answerKanaQuestion(page);
    await continueIfFeedback(page);
  }
  await expect(page.getByRole('heading', { name: 'Vowels あいうえお' })).toBeVisible();
}
