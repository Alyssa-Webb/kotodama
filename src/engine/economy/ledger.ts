/**
 * Event-sourced ledger: every yen, token, heart, XP and inventory change is an event, and
 * balances are a pure reduction of the event list, so they are always explainable.
 */
import type { LedgerEvent } from '../../schema/save';

export type Asset = 'yen' | 'token' | 'heart' | 'xp' | `item:${string}`;

export type Balances = Record<string, number>;

export function balances(ledger: readonly LedgerEvent[]): Balances {
  const out: Balances = {};
  for (const e of ledger) out[e.asset] = (out[e.asset] ?? 0) + e.amount;
  return out;
}

export const balanceOf = (ledger: readonly LedgerEvent[], asset: Asset): number =>
  balances(ledger)[asset] ?? 0;

export interface NewEvent {
  asset: Asset;
  amount: number;
  reason: string;
  ref?: string;
}

/** Appends events (ids continue from the last event). Zero-amount events are dropped. */
export function append(
  ledger: readonly LedgerEvent[],
  at: number,
  day: string,
  events: readonly NewEvent[],
): LedgerEvent[] {
  let id = ledger.length ? ledger[ledger.length - 1]!.id : 0;
  const added = events
    .filter((e) => e.amount !== 0)
    .map((e) => ({
      id: ++id,
      at,
      day,
      asset: e.asset,
      amount: e.amount,
      reason: e.reason,
      ...(e.ref ? { ref: e.ref } : {}),
    }));
  return [...ledger, ...added];
}

/** Total earned (positive amounts) of an asset for a given game day. */
export function earnedOn(ledger: readonly LedgerEvent[], asset: Asset, day: string): number {
  return ledger
    .filter((e) => e.asset === asset && e.day === day && e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);
}
