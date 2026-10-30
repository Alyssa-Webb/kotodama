/**
 * Battle lessons: the lesson is a road of enemies. Each correct first-pass answer is a hit; an
 * enemy falls after `hitsPerEnemy` hits and the next one walks in. A wrong answer is the enemy's
 * attack (the heart loss the session already applies). Everything is derived from the session,
 * so the battle can never disagree with the lesson's grading.
 */
import type { SessionState } from './lesson/session';

export interface BattleView {
  /** 0-based index of the enemy currently on the road. */
  enemy: number;
  enemies: number;
  /** Remaining hits on the current enemy, and its maximum. */
  hp: number;
  maxHp: number;
  defeated: number;
  /** What the last answer did: a hit, a finishing blow, the enemy's attack, or nothing yet. */
  last: 'hit' | 'finish' | 'attacked' | 'none';
}

export function battleView(s: SessionState, hitsPerEnemy: number): BattleView {
  const per = Math.max(1, Math.round(hitsPerEnemy));
  // Every correct answer is a hit, retries included, so fixing a mistake still lands a blow.
  const hits = s.attempts.filter((a) => a.result.correct).length;
  const enemies = Math.max(1, Math.ceil(s.total / per));
  // The last enemy only has as much health as there are questions left for it.
  const size = (i: number) => Math.max(1, Math.min(per, s.total - i * per));
  let defeated = 0;
  let used = 0;
  while (defeated < enemies && hits - used >= size(defeated)) used += size(defeated++);
  const enemy = Math.min(enemies - 1, defeated);
  const maxHp = size(enemy);
  const onThis = defeated >= enemies ? maxHp : hits - used;
  const lastAttempt = s.attempts[s.attempts.length - 1];
  const last: BattleView['last'] = !lastAttempt
    ? 'none'
    : !lastAttempt.result.correct
      ? 'attacked'
      : hits === used && defeated > 0
        ? 'finish'
        : 'hit';
  return {
    enemy,
    enemies,
    hp: defeated >= enemies ? 0 : maxHp - onThis,
    maxHp,
    defeated,
    last,
  };
}
