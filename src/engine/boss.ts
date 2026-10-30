/**
 * Boss battles: HP, phases that change the exercise style as HP drops, hearts, and a
 * once-per-day limit in Hardcore and Ironman.
 */
import type { Boss } from '../schema/world';
import type { Exercise } from '../schema/pack';

export interface BossState {
  hp: number;
  max: number;
  phase: number;
}

export const startBoss = (b: Boss): BossState => ({ hp: b.hp, max: b.hp, phase: 0 });

/** The active phase: the last one whose threshold is above the remaining HP share. */
export function phaseFor(b: Boss, hp: number): number {
  const share = hp / b.hp;
  let idx = 0;
  b.phases.forEach((p, i) => {
    if (share <= p.below) idx = i;
  });
  return idx;
}

/** A hit deals 1 damage, 2 with a combo of 5 or more. */
export function hit(b: Boss, s: BossState, combo: number): BossState {
  const hp = Math.max(0, s.hp - (combo >= 5 ? 2 : 1));
  return { ...s, hp, phase: phaseFor(b, hp) };
}

/** Orders a checkpoint's exercises into phase pools (falls back to everything when a phase pool is empty). */
export function phasePools(b: Boss, exercises: Exercise[]): Exercise[][] {
  return b.phases.map((p) => {
    const pool = exercises.filter((e) => p.types.includes(e.type));
    return pool.length ? pool : exercises;
  });
}

export function canChallenge(
  lastAttemptDay: string | undefined,
  today: string,
  oncePerDay: boolean,
): boolean {
  return !oncePerDay || lastAttemptDay !== today;
}
