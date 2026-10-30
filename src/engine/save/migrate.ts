/**
 * Save-file migrations. Each entry upgrades one version to the next; loading always ends at
 * SAVE_VERSION or fails with a readable error. v1 is the first version (no steps yet).
 */
import { SAVE_VERSION, SaveStateSchema, type SaveState } from '../../schema/save';

type Raw = Record<string, unknown>;
const MIGRATIONS: Record<number, (raw: Raw) => Raw> = {
  // v1 → v2: real yen (¥10 per old koban, asset 'koban' → 'yen'); hearts became HP (×20).
  1: (raw) => ({
    ...raw,
    saveVersion: 2,
    ledger: Array.isArray(raw.ledger)
      ? (raw.ledger as Record<string, unknown>[]).map((e) =>
          e.asset === 'koban'
            ? { ...e, asset: 'yen', amount: Number(e.amount) * 10 }
            : // hearts became HP: one old heart = 20 HP (5 hearts = the new 100 HP)
              e.asset === 'heart'
              ? { ...e, amount: Number(e.amount) * 20 }
              : e,
        )
      : raw.ledger,
  }),
};

export function migrateSave(
  input: unknown,
): { ok: true; save: SaveState } | { ok: false; error: string } {
  if (!input || typeof input !== 'object') return { ok: false, error: 'Not a save file' };
  let raw = input as Raw;
  let v = typeof raw.saveVersion === 'number' ? raw.saveVersion : NaN;
  if (!Number.isInteger(v)) return { ok: false, error: 'Missing saveVersion' };
  if (v > SAVE_VERSION)
    return {
      ok: false,
      error: `This save is from a newer Kotodama (v${v}); update the app first.`,
    };
  while (v < SAVE_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) return { ok: false, error: `No migration from save v${v}` };
    raw = step(raw);
    v++;
  }
  const r = SaveStateSchema.safeParse(raw);
  return r.success
    ? { ok: true, save: r.data }
    : {
        ok: false,
        error: r.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .slice(0, 5)
          .join('; '),
      };
}
