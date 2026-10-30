/**
 * Save-file migrations. Each entry upgrades one version to the next; loading always ends at
 * SAVE_VERSION or fails with a readable error. v1 is the first version (no steps yet).
 */
import { SAVE_VERSION, SaveStateSchema, type SaveState } from '../../schema/save';

type Raw = Record<string, unknown>;
const MIGRATIONS: Record<number, (raw: Raw) => Raw> = {
  // 1: (raw) => ({ ...raw, saveVersion: 2, newField: default }),
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
