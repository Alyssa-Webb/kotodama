import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ArtLedger } from '../../src/schema/library';

const ledger = ArtLedger.parse(JSON.parse(readFileSync('design/library/ledger.json', 'utf8')));

describe('art library ledger', () => {
  it('has unique ids', () => {
    const ids = ledger.entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points only at files that exist', () => {
    const missing = ledger.entries.flatMap((e) => e.files).filter((file) => !existsSync(file));
    expect(missing).toEqual([]);
  });

  it('backs every verdict with a quote or a source', () => {
    const unbacked = ledger.entries.filter((e) => !e.quote && !e.source).map((e) => e.id);
    expect(unbacked).toEqual([]);
  });

  it('refuses a verdict from anyone but the owners', () => {
    const entry = { id: 'x', verdict: 'approved', by: 'Claude', date: '2026-11-02', why: 'nice' };
    expect(ArtLedger.safeParse({ entries: [entry] }).success).toBe(false);
  });
});
