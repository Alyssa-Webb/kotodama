/** Learner Report: what ChatGPT needs to write the next pack (Markdown to paste, JSON to save). */
import type { Item } from '../schema/pack';
import type { SaveState } from '../schema/save';
import { balances } from './economy/ledger';
import type { PackIndex } from './pack/index';
import { itemJapanese } from './pack/index';
import { toSurface } from './text/furigana';
import { dueCards, weakestItems } from './game';
import { dojoRank } from './world';

export interface LearnerReport {
  generatedAt: string;
  level: string;
  stats: {
    lessons: number;
    streak: number;
    bestStreak: number;
    xp: number;
    itemsKnown: number;
    due: number;
  };
  ranks: Record<string, string>;
  known: Record<Item['kind'], { id: string; text: string; meaning: string }[]>;
  weak: { id: string; text: string; meaning: string; wrong: number; seen: number }[];
  recentMistakes: { exerciseId: string; itemId?: string; given: string; expected: string }[];
  installedPacks: { id: string; version: number }[];
  notes: string;
}

export const REPORT_INSTRUCTION =
  'You are my Kotodama lesson author. Using the prompt in your project instructions, write my next LessonPack. Here is my Learner Report:';

export function buildReport(
  save: SaveState,
  index: PackIndex,
  packs: { id: string; version: number }[],
  now: number,
): LearnerReport {
  const knownIds = [...new Set(Object.keys(save.cards).map((k) => k.split('#')[0]!))].filter(
    (id) => !save.archivedItems.includes(id),
  );
  const known: LearnerReport['known'] = {
    kana: [],
    word: [],
    phrase: [],
    pattern: [],
    sentence: [],
  };
  const row = (item: Item) => ({
    id: item.id,
    text: toSurface(itemJapanese(item)),
    meaning: item.meanings[0] ?? '',
  });
  for (const id of knownIds) {
    const item = index.item(id);
    if (item) known[item.kind].push(row(item));
  }
  const weak = weakestItems(save, 10)
    .map((id) => ({ item: index.item(id), st: save.itemStats[id] }))
    .filter((x) => x.item && x.st && x.st.wrong > 0)
    .map((x) => ({ ...row(x.item!), wrong: x.st!.wrong, seen: x.st!.seen }));
  const levels = packs
    .map((p) => index.paths.find((x) => x.pack.pack.id === p.id)?.pack.pack.level)
    .filter(Boolean) as string[];
  return {
    generatedAt: new Date(now).toISOString(),
    level: levels.sort().reverse().at(-1) ?? 'N5',
    stats: {
      lessons: save.lessonCount,
      streak: save.streak.current,
      bestStreak: save.streak.best,
      xp: balances(save.ledger).xp ?? 0,
      itemsKnown: knownIds.length,
      due: dueCards(save, now).length,
    },
    ranks: Object.fromEntries(Object.entries(save.elo).map(([k, v]) => [k, dojoRank(v)])),
    known,
    weak,
    recentMistakes: save.mistakes.slice(0, 15).map((m) => ({
      exerciseId: m.exerciseId,
      ...(m.itemId ? { itemId: m.itemId } : {}),
      given: m.given,
      expected: toSurface(m.expected),
    })),
    installedPacks: packs,
    notes: save.notes,
  };
}

export function reportMarkdown(r: LearnerReport): string {
  const list = (xs: { id: string; text: string; meaning: string }[]) =>
    xs.length ? xs.map((x) => `${x.id} (${x.text} = ${x.meaning})`).join(', ') : '(none)';
  return [
    REPORT_INSTRUCTION,
    '',
    '# LEARNER REPORT',
    `- Level: ${r.level}`,
    `- Lessons finished: ${r.stats.lessons} · Streak: ${r.stats.streak} days (best ${r.stats.bestStreak}) · Items known: ${r.stats.itemsKnown} · Reviews due: ${r.stats.due}`,
    `- Dojo ranks: ${Object.entries(r.ranks)
      .map(([k, v]) => `${k} ${v}`)
      .join(', ')}`,
    `- Installed pack IDs: ${r.installedPacks.map((p) => `${p.id} v${p.version}`).join(', ')}`,
    '',
    '## Known items (reference by ID, do not redefine)',
    ...(Object.keys(r.known) as Item['kind'][]).map((k) => `- ${k}: ${list(r.known[k])}`),
    '',
    '## Weak items (reuse these in new contexts)',
    r.weak.length
      ? r.weak
          .map((w) => `- ${w.id} (${w.text} = ${w.meaning}): wrong ${w.wrong} of ${w.seen}`)
          .join('\n')
      : '- (none yet)',
    '',
    '## Recent mistakes',
    r.recentMistakes.length
      ? r.recentMistakes
          .map(
            (m) => `- ${m.itemId ?? m.exerciseId}: answered "${m.given}", expected "${m.expected}"`,
          )
          .join('\n')
      : '- (none)',
    '',
    '## My notes',
    r.notes.trim() || '(none)',
    '',
    '# MY REQUEST',
    '(write what you want next here)',
  ].join('\n');
}
