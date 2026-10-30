/** Shared hooks for screens: derived game values with a ticking clock. */
import { useEffect, useState } from 'react';
import { useGame } from '../foundations/store/gameStore';
import { balances } from '../engine/economy/ledger';
import { dueCards, heartsNow, loseHearts, maxHearts, minutesToNextHeart } from '../engine/game';
import { economy } from '../foundations/world';
import type { SaveState } from '../schema/save';

/** Re-renders every `ms` (hearts refill, timers). */
export function useNow(ms = 30_000): number {
  const clock = useGame((s) => s.clock);
  const [now, setNow] = useState(() => clock.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(clock.now()), ms);
    return () => window.clearInterval(t);
  }, [clock, ms]);
  return now;
}

export function useSave(): SaveState {
  const save = useGame((s) => s.save);
  if (!save) throw new Error('save not loaded');
  return save;
}

export function useStats() {
  const save = useSave();
  const clock = useGame((s) => s.clock);
  const now = useNow();
  {
    const ctx = { now, timeZone: clock.timeZone(), economy };
    const b = balances(save.ledger);
    return {
      yen: b.yen ?? 0,
      tokens: b.token ?? 0,
      xp: b.xp ?? 0,
      hearts: heartsNow(save, ctx),
      maxHearts: maxHearts(save, economy),
      nextHeartMin: minutesToNextHeart(save, ctx),
      due: dueCards(save, now).length,
      streak: save.streak.current,
      goal: save.settings.dailyGoalXp,
      todayXp: save.daily.xp,
      inventory: (id: string) => b[`item:${id}`] ?? 0,
      now,
    };
  }
}

/** A per-session random seed (the engine itself never calls Math.random). */
export const freshSeed = () => crypto.getRandomValues(new Uint32Array(1))[0]!;

/**
 * Commits heart losses the moment they happen (not at the end of a session), so quitting a
 * lesson or closing the app can't undo them.
 */
export function commitHeartLoss(prevLost: number, nextLost: number, ref: string) {
  const n = nextLost - prevLost;
  if (n <= 0) return;
  const { save, ctx, commit } = useGame.getState();
  if (save) commit(loseHearts(save, ctx(), n, ref));
}
