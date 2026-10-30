/** Lesson rewards from a session summary and the economy rules (pure). */
import type { Economy } from '../../schema/economy';
import type { NewEvent } from './ledger';

export interface LessonRewardInput {
  economy: Economy;
  completed: boolean;
  stars: number;
  xp: number;
  kiaiCorrect: number;
  totalQuestions: number;
  /** Due reviews outstanding when the lesson finished (halves koban). */
  reviewDebt: boolean;
  manekiActive: boolean;
  nodeKey: string;
}

export interface LessonReward {
  xp: number;
  koban: number;
  tokens: number;
  breakdown: string[];
  events: NewEvent[];
}

export function lessonReward(i: LessonRewardInput): LessonReward {
  if (!i.completed)
    return { xp: 0, koban: 0, tokens: 0, breakdown: ['Lesson failed: XP lost'], events: [] };
  const e = i.economy.earn;
  const breakdown: string[] = [`Lesson complete +${e.lessonComplete}`];
  let koban = e.lessonComplete;
  if (i.stars === 3) {
    koban += e.lessonThreeStarBonus;
    breakdown.push(`Three stars +${e.lessonThreeStarBonus}`);
  }
  // Kiai doubles koban for the share of answers given during Kiai.
  const kiaiShare = i.totalQuestions ? i.kiaiCorrect / i.totalQuestions : 0;
  if (kiaiShare > 0) {
    const bonus = Math.round(koban * kiaiShare * (i.economy.kiai.multiplier - 1));
    koban += bonus;
    if (bonus) breakdown.push(`Kiai! +${bonus}`);
  }
  if (i.manekiActive) {
    const bonus = Math.round(koban * i.economy.boosts.manekiKobanBonus);
    koban += bonus;
    breakdown.push(`Maneki-neko +${bonus}`);
  }
  if (i.reviewDebt) {
    const halved = Math.floor(koban * i.economy.penalties.reviewDebtKobanFactor);
    breakdown.push(`Review debt −${koban - halved}`);
    koban = halved;
  }
  const tokens = i.stars === 3 ? e.perfectLessonTokens : 0;
  const events: NewEvent[] = [
    { asset: 'xp', amount: i.xp, reason: 'lesson', ref: i.nodeKey },
    { asset: 'koban', amount: koban, reason: 'lesson', ref: i.nodeKey },
    { asset: 'token', amount: tokens, reason: 'perfect-lesson', ref: i.nodeKey },
  ];
  return { xp: i.xp, koban, tokens, breakdown, events };
}
