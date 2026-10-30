import Dexie, { type Table } from 'dexie';
import type { InstalledPack, Repos } from './repos';

interface ProfileRow {
  id: 'main';
  state: unknown;
  savedAt: number;
}
interface ArchiveRow {
  seq?: number;
  packId: string;
  at: number;
  pack: InstalledPack;
}
interface AudioRow {
  key: string;
  blob: Blob;
}

/** IndexedDB schema. Add a new db.version(n) block (never edit an old one) to migrate. */
class KotodamaDB extends Dexie {
  profile!: Table<ProfileRow, string>;
  packs!: Table<InstalledPack, string>;
  archive!: Table<ArchiveRow, number>;
  audio!: Table<AudioRow, string>;
  constructor(name: string) {
    super(name);
    this.version(1).stores({ profile: 'id', packs: 'id', archive: '++seq, packId', audio: 'key' });
  }
}

export function dexieRepos(name = 'kotodama'): Repos {
  const db = new KotodamaDB(name);
  return {
    profile: {
      load: async () => (await db.profile.get('main'))?.state,
      save: async (state) =>
        void (await db.profile.put({ id: 'main', state, savedAt: Date.now() })),
    },
    packs: {
      list: () => db.packs.toArray(),
      put: async (p) => void (await db.packs.put(p)),
      remove: async (id) => void (await db.packs.delete(id)),
      archive: async (pack, at) => void (await db.archive.add({ packId: pack.id, at, pack })),
    },
    audio: {
      put: async (key, blob) => void (await db.audio.put({ key, blob })),
      get: async (key) => (await db.audio.get(key))?.blob,
      removePrefix: async (prefix) =>
        void (await db.audio.where('key').startsWith(prefix).delete()),
    },
  };
}
