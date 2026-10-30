/** Storage behind interfaces: Dexie in the app, in-memory in tests. */
import type { LessonPack, VoiceManifest } from '../../schema/pack';

export type PackSource = 'starter' | 'paste' | 'file' | 'url';

export interface InstalledPack {
  id: string;
  version: number;
  enabled: boolean;
  source: PackSource;
  installedAt: number;
  json: LessonPack;
  voice?: VoiceManifest;
}

export interface ProfileRepo {
  load(): Promise<unknown>;
  save(state: unknown): Promise<void>;
}

export interface PackRepo {
  list(): Promise<InstalledPack[]>;
  put(pack: InstalledPack): Promise<void>;
  remove(id: string): Promise<void>;
  /** Keeps the replaced version of a pack (items removed by an update stay recoverable). */
  archive(pack: InstalledPack, at: number): Promise<void>;
}

export interface AudioRepo {
  put(key: string, blob: Blob): Promise<void>;
  get(key: string): Promise<Blob | undefined>;
  removePrefix(prefix: string): Promise<void>;
}

export interface Repos {
  profile: ProfileRepo;
  packs: PackRepo;
  audio: AudioRepo;
}

export function memoryRepos(): Repos {
  let profile: unknown;
  const packs = new Map<string, InstalledPack>();
  const archive: { pack: InstalledPack; at: number }[] = [];
  const audio = new Map<string, Blob>();
  return {
    profile: {
      load: async () => (profile === undefined ? undefined : structuredClone(profile)),
      save: async (s) => void (profile = structuredClone(s)),
    },
    packs: {
      list: async () => [...packs.values()].map((p) => structuredClone(p)),
      put: async (p) => void packs.set(p.id, structuredClone(p)),
      remove: async (id) => void packs.delete(id),
      archive: async (pack, at) => void archive.push({ pack, at }),
    },
    audio: {
      put: async (k, b) => void audio.set(k, b),
      get: async (k) => audio.get(k),
      removePrefix: async (prefix) =>
        [...audio.keys()].filter((k) => k.startsWith(prefix)).forEach((k) => audio.delete(k)),
    },
  };
}
