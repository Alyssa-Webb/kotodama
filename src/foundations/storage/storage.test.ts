import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import economyJson from '../../../design/economy.json';
import { EconomySchema } from '../../schema/economy';
import { newSave } from '../../engine/game';
import { migrateSave } from '../../engine/save/migrate';
import { dexieRepos } from './dexie';
import { memoryRepos, type Repos } from './repos';
import { starterPack } from '../world';

const economy = EconomySchema.parse(economyJson);

describe.each([
  ['memory', () => memoryRepos()],
  ['dexie', () => dexieRepos(`test-${Math.random()}`)],
] as [string, () => Repos][])('%s repos', (_name, make) => {
  it('round-trips the save and packs', async () => {
    const repos = make();
    expect(await repos.profile.load()).toBeUndefined();
    const save = newSave(1_000, 'UTC', 7, economy);
    await repos.profile.save(save);
    const loaded = migrateSave(await repos.profile.load());
    expect(loaded.ok && loaded.save).toEqual(save);
    await repos.packs.put({
      id: 'kotodama-starter',
      version: 1,
      enabled: true,
      source: 'starter',
      installedAt: 1,
      json: starterPack,
    });
    expect((await repos.packs.list()).map((p) => p.id)).toEqual(['kotodama-starter']);
    await repos.packs.remove('kotodama-starter');
    expect(await repos.packs.list()).toEqual([]);
  });
});

describe('migrateSave', () => {
  it('rejects junk and saves from the future with readable errors', () => {
    expect(migrateSave(null)).toMatchObject({ ok: false });
    expect(migrateSave({ saveVersion: 99 })).toMatchObject({
      ok: false,
      error: expect.stringMatching(/newer/),
    });
    expect(migrateSave({ saveVersion: 1, settings: {} })).toMatchObject({ ok: false });
  });
});
