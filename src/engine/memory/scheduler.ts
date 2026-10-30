/**
 * FSRS-6 scheduling via ts-fsrs. Cards are stored as plain JSON (dates as epoch ms).
 * Each phrase, pattern and sentence has two cards (understand / produce); kana and words have one.
 */
import { DefaultScheduler, Rating } from 'ts-fsrs';
import type { StoredCard } from '../../schema/save';
import type { Facet, Shape } from '../exercises/types';

export const DESIRED_RETENTION = 0.9;

export type Grade = 'again' | 'hard' | 'good' | 'easy';
const RATING = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
} as const;

export const cardId = (itemId: string, facet: Facet) => `${itemId}#${facet}`;
export const itemOfCard = (id: string) => id.split('#')[0]!;

/** Response-time bands (ms) per question shape: faster than `fast` is easy, slower than `slow` is hard. */
const TIME_BANDS: Record<Shape, { fast: number; slow: number }> = {
  choose: { fast: 2500, slow: 10_000 },
  match: { fast: 6000, slow: 25_000 },
  tiles: { fast: 5000, slow: 25_000 },
  type: { fast: 5000, slow: 25_000 },
  trace: { fast: 4000, slow: 30_000 },
  dialogue: { fast: 15_000, slow: 90_000 },
};

/** Turns an answer into an FSRS grade from correctness, hints and response time. */
export function gradeFor(o: {
  correct: boolean;
  typo: boolean;
  hints: number;
  ms: number;
  shape: Shape;
}): Grade {
  if (!o.correct) return 'again';
  if (o.typo || o.hints > 0) return 'hard';
  const band = TIME_BANDS[o.shape];
  if (o.ms > band.slow) return 'hard';
  if (o.ms < band.fast) return 'easy';
  return 'good';
}

type FsrsScheduler = Awaited<ReturnType<typeof DefaultScheduler>>;
type Card = ReturnType<FsrsScheduler['newCard']>;

function toCard(s: StoredCard): Card {
  return {
    ...s,
    dueAt: new Date(s.dueAt),
    lastReviewAt: s.lastReviewAt === null ? null : new Date(s.lastReviewAt),
  } as unknown as Card;
}

function fromCard(c: Card): StoredCard {
  const raw = c as unknown as Record<string, unknown> & { dueAt: Date; lastReviewAt: Date | null };
  return {
    ...raw,
    stability: Number(raw.stability),
    difficulty: Number(raw.difficulty),
    state: Number(raw.state),
    reps: Number(raw.reps),
    lapses: Number(raw.lapses),
    dueAt: raw.dueAt.getTime(),
    lastReviewAt: raw.lastReviewAt ? raw.lastReviewAt.getTime() : null,
  };
}

export interface Scheduler {
  newCard(now: number): StoredCard;
  review(card: StoredCard | undefined, grade: Grade, now: number): StoredCard;
  /** Estimated probability of recall right now (0..1); 1 for cards never reviewed. */
  retrievability(card: StoredCard, now: number): number;
}

export async function createScheduler(): Promise<Scheduler> {
  const s: FsrsScheduler = await DefaultScheduler({
    version: 'FSRS-6',
    desiredRetention: DESIRED_RETENTION,
    enableFuzz: false,
  });
  const newCard = (now: number) => fromCard(s.newCard({ now: new Date(now) }));
  return {
    newCard,
    review(card, grade, now) {
      const c = toCard(card ?? newCard(now));
      return fromCard(s.review({ card: c, grade: RATING[grade], now: new Date(now) }).card);
    },
    retrievability(card, now) {
      if (card.lastReviewAt === null || card.stability <= 0) return 1;
      const days = Math.max(0, (now - card.lastReviewAt) / 86_400_000);
      return s.model.forgettingCurve(toCard(card), days);
    },
  };
}

export const isDue = (c: StoredCard, now: number) => c.dueAt <= now;
