/**
 * The management desk: one place on Home that gathers everything the player should know today,
 * the day's status, the town's waiting income, and a list of notifications, each with the action
 * that resolves it. Data only; HomeScreen decides how the desk looks.
 */
import { useGame } from '../../foundations/store/gameStore';
import { economy } from '../../foundations/world';
import { useNow, useStats } from '../hooks';
import { collectAllTown, useBusinesses, useDistrictStates } from '../town/useTown';

export type DeskTone = 'urgent' | 'reward' | 'info';

export interface DeskNote {
  id: string;
  tone: DeskTone;
  /** One short English line ("3 spirits are fading"). */
  text: string;
  /** Where tapping it goes (a route), if anywhere. */
  to?: string;
  /** Or what tapping it does right here (collect income, dismiss). */
  act?: () => void;
  /** Label for the control ("Review", "Collect", "Eat", "OK"). */
  cta?: string;
}

const NOTICE_TEXT: Record<string, (n?: number) => string> = {
  'streak-frozen': (n) =>
    `Your kotatsu kept your streak warm through ${n} missed day${n === 1 ? '' : 's'}.`,
  'streak-lost': () => 'Your streak went cold. Kintsugi can mend it within 48 hours.',
  'yen-spoiled': (n) => `${n} yen spoiled while you were away (Hardcore).`,
  'hearts-refilled': () => 'A new day: your HP is full again.',
};

export interface Desk {
  status: {
    todayXp: number;
    goal: number;
    /** 0..100 */
    goalPct: number;
    goalMet: boolean;
    streak: number;
    hp: number | null;
    maxHp: number | null;
    yen: number;
    koban: number;
    reviewsDue: number;
  };
  town: {
    /** Yen waiting across every open business. */
    pending: number;
    /** Combined yen per hour of all businesses. */
    perHour: number;
    /** Open businesses / all districts. */
    open: number;
    total: number;
    /** Banks every business's waiting yen; returns how much was collected. */
    collectAll: () => number;
  };
  /** Most important first. */
  notes: DeskNote[];
}

export function useDesk(): Desk {
  const s = useStats();
  // A five-second tick keeps the town's waiting yen visibly fresh on the desk.
  const now = useNow(5000);
  const states = useDistrictStates(now);
  const { list } = useBusinesses(states, now);
  const commit = useGame((g) => g.commit);
  const gctx = useGame((g) => g.ctx);
  const notices = useGame((g) => g.notices);
  const dismiss = useGame((g) => g.dismissNotices);

  const pending = list.reduce((a, b) => a + b.pending, 0);
  const collectAll = () => {
    const r = collectAllTown(useGame.getState().save!, gctx(), list);
    if (r.yen > 0) commit(r.save);
    return r.yen;
  };
  const goalPct = Math.min(100, Math.round((s.todayXp / Math.max(1, s.goal)) * 100));
  const lowHp = s.hearts !== null && s.maxHearts !== null && s.hearts < s.maxHearts;

  const notes: DeskNote[] = [];
  for (const [i, n] of notices.entries()) {
    const text = NOTICE_TEXT[n.kind]?.(n.amount);
    if (text)
      notes.push({
        id: `notice-${i}`,
        tone: n.kind === 'streak-lost' || n.kind === 'yen-spoiled' ? 'urgent' : 'info',
        text,
        act: dismiss,
        cta: 'OK',
        ...(n.kind === 'streak-lost' ? { to: '/shop' } : {}),
      });
  }
  if (s.hearts !== null && s.hearts <= 0)
    notes.push({
      id: 'hp-out',
      tone: 'urgent',
      text: 'Out of HP: eat before your next battle.',
      to: '/food',
      cta: 'Eat',
    });
  else if (lowHp && s.maxHearts !== null && s.hearts !== null && s.hearts < s.maxHearts / 2)
    notes.push({
      id: 'hp-low',
      tone: 'urgent',
      text: `HP ${s.hearts}/${s.maxHearts}: a meal will heal you.`,
      to: '/food',
      cta: 'Eat',
    });
  if (s.due > 0)
    notes.push({
      id: 'reviews',
      tone: 'urgent',
      text: `${s.due} spirit${s.due === 1 ? ' is' : 's are'} fading: review in the Dojo.`,
      to: '/dojo',
      cta: 'Review',
    });
  if (s.streak > 0 && s.todayXp === 0)
    notes.push({
      id: 'streak',
      tone: 'urgent',
      text: `Keep your ${s.streak}-day streak: one lesson today.`,
      to: '/path',
      cta: 'Play',
    });
  if (pending > 0)
    notes.push({
      id: 'town',
      tone: 'reward',
      text: `¥${pending.toLocaleString('en-US')} is waiting in town.`,
      act: () => void collectAll(),
      cta: 'Collect',
    });
  if (s.tokens >= economy.gachapon.cost)
    notes.push({
      id: 'koban',
      tone: 'reward',
      text: `${s.tokens} koban: spin the gachapon.`,
      to: '/shop',
      cta: 'Spin',
    });
  if (goalPct >= 100)
    notes.push({ id: 'goal', tone: 'reward', text: "Today's goal is met. Well done!" });

  return {
    status: {
      todayXp: s.todayXp,
      goal: s.goal,
      goalPct,
      goalMet: goalPct >= 100,
      streak: s.streak,
      hp: s.hearts,
      maxHp: s.maxHearts,
      yen: s.yen,
      koban: s.tokens,
      reviewsDue: s.due,
    },
    town: {
      pending,
      perHour: list.reduce((a, b) => a + b.rate, 0),
      open: states.filter((d) => d.restored).length,
      total: states.length,
      collectAll,
    },
    notes,
  };
}
