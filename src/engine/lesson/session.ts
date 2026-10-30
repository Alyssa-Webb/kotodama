/**
 * Lesson session reducer (pure). Drives the queue, combo, Kiai meter, hearts and XP, and
 * collects first-attempt outcomes for the scheduler. Missed questions come back once at the end.
 */
import type { Economy } from '../../schema/economy';
import type { GradeResult, Question, Target } from '../exercises/types';

export interface SessionConfig {
  /** HP available at the start (null = no HP, e.g. Casual). */
  hearts: number | null;
  /** HP a mistake costs (story-scaled; default 1). */
  damage?: number;
  economy: Pick<Economy, 'xp' | 'kiai' | 'stars'>;
  /** XP multiplier from boosts (taiko drum, study charm). */
  xpMultiplier: number;
  /** Re-ask missed questions at the end of the lesson (true for lessons, false for rush/boss). */
  requeueMistakes: boolean;
}

export interface Attempt {
  question: Question;
  result: GradeResult;
  ms: number;
  hints: number;
  /** True when this was a retry of a missed question. */
  retry: boolean;
  duringKiai: boolean;
}

export interface SessionState {
  queue: Question[];
  position: number;
  total: number;
  attempts: Attempt[];
  hearts: number | null;
  heartsLost: number;
  combo: number;
  maxCombo: number;
  kiaiCharge: number;
  kiaiLeft: number;
  kiaiTriggers: number;
  xp: number;
  status: 'playing' | 'failed' | 'complete';
  retried: string[];
}

export function startSession(questions: Question[], config: SessionConfig): SessionState {
  return {
    queue: questions,
    position: 0,
    total: questions.length,
    attempts: [],
    hearts: config.hearts,
    heartsLost: 0,
    combo: 0,
    maxCombo: 0,
    kiaiCharge: 0,
    kiaiLeft: 0,
    kiaiTriggers: 0,
    xp: 0,
    status: questions.length ? 'playing' : 'complete',
    retried: [],
  };
}

export const currentQuestion = (s: SessionState): Question | undefined =>
  s.status === 'playing' ? s.queue[s.position] : undefined;

/** Progress for the bar: first-pass questions answered / total. */
export const progress = (s: SessionState): number =>
  s.total ? Math.min(1, s.attempts.filter((a) => !a.retry).length / s.total) : 1;

export function answer(
  s: SessionState,
  config: SessionConfig,
  result: GradeResult,
  ms: number,
  hints = 0,
): SessionState {
  const q = currentQuestion(s);
  if (!q) return s;
  const retry =
    s.retried.includes(q.exerciseId) &&
    s.attempts.some((a) => a.question.exerciseId === q.exerciseId);
  const duringKiai = s.kiaiLeft > 0;
  const { xp: X, kiai } = config.economy;
  let { combo, maxCombo, kiaiCharge, kiaiLeft, kiaiTriggers, xp, hearts, heartsLost } = s;
  const queue = [...s.queue];
  const retried = [...s.retried];

  if (result.correct) {
    combo++;
    maxCombo = Math.max(maxCombo, combo);
    if (!retry) {
      let gain = X.perCorrect;
      if (combo % X.comboBonusEvery === 0) gain += X.comboBonusXp;
      if (duringKiai) gain *= kiai.multiplier;
      xp += Math.round(gain * config.xpMultiplier);
    }
    if (kiaiLeft === 0) {
      kiaiCharge++;
      if (kiaiCharge >= kiai.fillAt) {
        kiaiCharge = 0;
        kiaiLeft = kiai.answers + 1; // +1: this answer triggers it, the next N earn the bonus
        kiaiTriggers++;
      }
    }
  } else {
    combo = 0;
    kiaiCharge = 0;
    if (hearts !== null) {
      const hit = Math.min(hearts, Math.max(1, config.damage ?? 1));
      hearts -= hit;
      heartsLost += hit;
    }
    if (config.requeueMistakes && !retried.includes(q.exerciseId)) {
      retried.push(q.exerciseId);
      queue.push(q);
    }
  }
  if (kiaiLeft > 0) kiaiLeft--;

  const attempts = [...s.attempts, { question: q, result, ms, hints, retry, duringKiai }];
  const position = s.position + 1;
  let status: SessionState['status'] = 'playing';
  // Only a mistake can end the lesson; a correct answer at 0 hearts never fails it.
  if (!result.correct && hearts !== null && hearts <= 0) status = 'failed';
  else if (position >= queue.length) status = 'complete';

  return {
    ...s,
    queue,
    position,
    attempts,
    hearts,
    heartsLost,
    combo,
    maxCombo,
    kiaiCharge,
    kiaiLeft,
    kiaiTriggers,
    xp,
    status,
    retried,
  };
}

/**
 * "Can't listen now": drops the current question without grading it. No heart, combo, XP or
 * review rating changes, and the lesson total shrinks so progress stays honest.
 */
export function skip(s: SessionState): SessionState {
  const q = currentQuestion(s);
  if (!q) return s;
  const queue = s.queue.filter((_, i) => i !== s.position);
  const firstPass = !s.retried.includes(q.exerciseId);
  return {
    ...s,
    queue,
    total: firstPass ? Math.max(0, s.total - 1) : s.total,
    status: s.position >= queue.length ? 'complete' : 'playing',
  };
}

/** True while the Kiai bonus applies to the next answer. */
export const kiaiActive = (s: SessionState): boolean => s.kiaiLeft > 0;

export interface SessionSummary {
  firstPassCorrect: number;
  mistakes: Attempt[];
  stars: 0 | 1 | 2 | 3;
  accuracy: number;
  kiaiCorrect: number;
  xp: number;
  /** One outcome per scheduled card: the first attempt decides the rating. */
  outcomes: {
    target: Target;
    correct: boolean;
    typo: boolean;
    hints: number;
    ms: number;
    shape: Question['shape'];
    skill: Question['skill'];
  }[];
}

export function summarize(s: SessionState, config: SessionConfig): SessionSummary {
  const first = s.attempts.filter((a) => !a.retry);
  const mistakes = first.filter((a) => !a.result.correct);
  const { threeStarMaxMistakes, twoStarMaxMistakes } = config.economy.stars;
  const stars: SessionSummary['stars'] =
    s.status !== 'complete'
      ? 0
      : mistakes.length <= threeStarMaxMistakes
        ? 3
        : mistakes.length <= twoStarMaxMistakes
          ? 2
          : 1;
  const outcomes: SessionSummary['outcomes'] = [];
  const seen = new Set<string>();
  for (const a of first)
    for (const t of a.question.targets) {
      const key = `${t.itemId}#${t.facet}`;
      if (seen.has(key)) continue;
      seen.add(key);
      outcomes.push({
        target: t,
        correct: a.result.correct,
        typo: a.result.typo,
        hints: a.hints,
        ms: a.ms,
        shape: a.question.shape,
        skill: a.question.skill,
      });
    }
  return {
    firstPassCorrect: first.length - mistakes.length,
    mistakes,
    stars,
    accuracy: first.length ? (first.length - mistakes.length) / first.length : 1,
    kiaiCorrect: first.filter((a) => a.duringKiai && a.result.correct).length,
    xp: s.status === 'failed' ? 0 : s.xp,
    outcomes,
  };
}
