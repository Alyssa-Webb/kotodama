import { describe, expect, it } from 'vitest';
import { strToU8, zipSync } from 'fflate';
import { fixedClock } from '../../engine/clock';
import { memoryRepos } from '../storage/repos';
import { readJlpack } from '../importer';
import { starterPack } from '../world';
import { useGame } from './gameStore';

const T0 = Date.parse('2026-03-02T10:00:00Z');

describe('game store', () => {
  it('disabling a pack archives its items; enabling brings them back', async () => {
    await useGame.getState().init(memoryRepos(), fixedClock(T0));
    const id = starterPack.pack.id;
    await useGame.getState().setPackEnabled(id, false);
    expect(useGame.getState().save!.archivedItems).toContain('w.mizu');
    await useGame.getState().setPackEnabled(id, true);
    expect(useGame.getState().save!.archivedItems).not.toContain('w.mizu');
  });

  it('a backup with an invalid pack is rejected without writing anything', async () => {
    const repos = memoryRepos();
    await useGame.getState().init(repos, fixedClock(T0));
    const good = useGame.getState().exportBackup();
    const bad = {
      ...good,
      packs: [
        {
          id: 'x',
          version: 1,
          enabled: true,
          source: 'paste',
          installedAt: 0,
          json: { nope: true },
        },
      ],
    };
    const before = await repos.packs.list();
    const r = await useGame.getState().restoreBackup(bad);
    expect(r.ok).toBe(false);
    expect(await repos.packs.list()).toEqual(before);
  });

  it('zip bombs are refused before inflating', () => {
    const big = new Uint8Array(61 * 1024 * 1024); // compresses to a few KB
    const zip = zipSync({ 'pack.json': strToU8('{}'), 'audio/a.m4a': big }, { level: 9 });
    expect(zip.byteLength).toBeLessThan(1024 * 1024);
    expect(() => readJlpack(zip)).toThrow(/more than 60 MB/);
  });
});
