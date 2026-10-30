/**
 * The app's single game store (Zustand). Holds the SaveState, installed packs and the derived
 * pack index; every change goes through `commit`, which persists to IndexedDB (debounced).
 */
import { create } from 'zustand';
import type { Clock } from '../../engine/clock';
import { newSave, settleDay, type Ctx, type SettleNotice } from '../../engine/game';
import { createScheduler, type Scheduler } from '../../engine/memory/scheduler';
import { PackIndex } from '../../engine/pack/index';
import { migrateSave } from '../../engine/save/migrate';
import {
  LessonPackSchema,
  type Item,
  type LessonPack,
  type VoiceManifest,
} from '../../schema/pack';
import { BackupSchema, type Backup, type SaveState } from '../../schema/save';
import { registerVoiceSources } from '../audio/voice';
import { requestPersistentStorage } from '../platform';
import type { InstalledPack, PackSource, Repos } from '../storage/repos';
import { economy, shop, starterPack } from '../world';

export const realClock: Clock = {
  now: () => Date.now(),
  timeZone: () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

/** Words the player learns by buying shop items (each shop item's Japanese name). */
export const SHOP_WORDS_PACK = 'shop-words';
export function shopWordItem(id: string): Item | undefined {
  const c = shop.consumables.find((x) => x.id === id);
  return c
    ? {
        id: `w.shop-${c.id}`,
        kind: 'word',
        text: c.name,
        pos: 'noun',
        meanings: [c.en.toLowerCase()],
      }
    : undefined;
}

function shopWordsPack(save: SaveState): LessonPack | null {
  const items = save.collection.shopWords.map(shopWordItem).filter((x): x is Item => !!x);
  if (!items.length) return null;
  return {
    schemaVersion: '1.0.0',
    pack: {
      id: SHOP_WORDS_PACK,
      title: 'Shop words',
      version: 1,
      level: 'N5',
      description: 'Names of things you bought.',
    },
    items,
    units: [
      {
        id: 'shop',
        title: 'Shop words',
        nodes: [
          {
            id: 'shop.n00',
            kind: 'lesson',
            title: 'Shop words',
            introduces: items.map((i) => i.id),
            exercises: [
              { id: 'shop.e00', type: 'match', items: items.slice(0, 6).map((i) => i.id) },
            ],
          },
        ],
      },
    ],
  };
}

interface GameState {
  ready: boolean;
  error: string | null;
  repos: Repos | null;
  clock: Clock;
  scheduler: Scheduler | null;
  save: SaveState | null;
  packs: InstalledPack[];
  index: PackIndex;
  notices: SettleNotice[];
  init(repos: Repos, clock?: Clock): Promise<void>;
  ctx(): Ctx;
  commit(next: SaveState): void;
  settle(): void;
  dismissNotices(): void;
  installPack(
    json: LessonPack,
    source: PackSource,
    voice?: { manifest: VoiceManifest; files: Record<string, Blob> },
  ): Promise<{ updated: boolean; archived: string[] }>;
  removePack(id: string): Promise<void>;
  setPackEnabled(id: string, enabled: boolean): Promise<void>;
  exportBackup(): Backup;
  restoreBackup(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }>;
  flush(): Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;
let persistAsked = false;

function buildIndex(packs: InstalledPack[], save: SaveState | null): PackIndex {
  const enabled = packs.filter((p) => p.enabled).map((p) => p.json);
  const sw = save ? shopWordsPack(save) : null;
  return new PackIndex(sw ? [...enabled, sw] : enabled);
}

function wireVoices(repos: Repos, packs: InstalledPack[]) {
  registerVoiceSources(
    packs
      .filter((p) => p.enabled && p.voice)
      .map((p) => ({
        ...(p.voice ? { manifest: p.voice } : {}),
        loadBlob: (file: string) => repos.audio.get(`${p.id}/${file}`),
      })),
  );
}

export const useGame = create<GameState>((set, get) => ({
  ready: false,
  error: null,
  repos: null,
  clock: realClock,
  scheduler: null,
  save: null,
  packs: [],
  index: new PackIndex([]),
  notices: [],

  ctx: () => ({ now: get().clock.now(), timeZone: get().clock.timeZone(), economy }),

  async init(repos, clock = realClock) {
    try {
      const scheduler = await createScheduler();
      let packs = await repos.packs.list();
      const starter = packs.find((p) => p.id === starterPack.pack.id);
      if (!starter || starter.version < starterPack.pack.version) {
        const entry: InstalledPack = {
          id: starterPack.pack.id,
          version: starterPack.pack.version,
          enabled: starter?.enabled ?? true,
          source: 'starter',
          installedAt: clock.now(),
          json: starterPack,
        };
        await repos.packs.put(entry);
        packs = [...packs.filter((p) => p.id !== entry.id), entry];
      }
      const raw = await repos.profile.load();
      let save: SaveState;
      if (raw === undefined) {
        const seed = crypto.getRandomValues(new Uint32Array(1))[0]!;
        save = newSave(clock.now(), clock.timeZone(), seed, economy);
      } else {
        const m = migrateSave(raw);
        if (!m.ok) throw new Error(`Could not read your saved progress: ${m.error}`);
        save = m.save;
      }
      const settled = settleDay(save, { now: clock.now(), timeZone: clock.timeZone(), economy });
      wireVoices(repos, packs);
      set({
        repos,
        clock,
        scheduler,
        packs,
        save: settled.save,
        index: buildIndex(packs, settled.save),
        notices: settled.notices.filter((n) => n.kind !== 'new-day'),
        ready: true,
        error: null,
      });
      if (raw === undefined || settled.save !== save) await repos.profile.save(settled.save);
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e), ready: false });
    }
  },

  commit(next) {
    const prev = get().save;
    const shopWordsChanged = prev?.collection.shopWords.length !== next.collection.shopWords.length;
    set(shopWordsChanged ? { save: next, index: buildIndex(get().packs, next) } : { save: next });
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void get().flush(), 250);
    if (!persistAsked && next.lessonCount > 0) {
      persistAsked = true;
      void requestPersistentStorage();
    }
  },

  async flush() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = undefined;
    const { repos, save } = get();
    if (repos && save) await repos.profile.save(save);
  },

  settle() {
    const { save } = get();
    if (!save) return;
    const r = settleDay(save, get().ctx());
    if (r.save !== save) get().commit(r.save);
    const shown = r.notices.filter((n) => n.kind !== 'new-day');
    if (shown.length) set({ notices: [...get().notices, ...shown] });
  },

  dismissNotices: () => set({ notices: [] }),

  async installPack(json, source, voice) {
    const { repos, packs, save } = get();
    if (!repos || !save) throw new Error('not ready');
    const existing = packs.find((p) => p.id === json.pack.id);
    let archived: string[] = [];
    if (existing) {
      await repos.packs.archive(existing, get().clock.now());
      const keep = new Set(json.items.map((i) => i.id));
      archived = existing.json.items.map((i) => i.id).filter((id) => !keep.has(id));
    }
    if (voice) {
      await repos.audio.removePrefix(`${json.pack.id}/`);
      for (const [file, blob] of Object.entries(voice.files))
        await repos.audio.put(`${json.pack.id}/${file}`, blob);
    }
    const entry: InstalledPack = {
      id: json.pack.id,
      version: json.pack.version,
      enabled: true,
      source,
      installedAt: get().clock.now(),
      json,
      ...(voice
        ? { voice: voice.manifest }
        : existing?.voice && existing.version === json.pack.version
          ? { voice: existing.voice }
          : {}),
    };
    await repos.packs.put(entry);
    const next = [...packs.filter((p) => p.id !== entry.id), entry];
    // Progress is keyed by item ID, so it carries over; removed items are archived, never deleted.
    const nextSave = archived.length
      ? { ...save, archivedItems: [...new Set([...save.archivedItems, ...archived])] }
      : save;
    wireVoices(repos, next);
    set({ packs: next, index: buildIndex(next, nextSave) });
    if (nextSave !== save) get().commit(nextSave);
    return { updated: !!existing, archived };
  },

  async removePack(id) {
    const { repos, packs, save } = get();
    const p = packs.find((x) => x.id === id);
    if (!repos || !p || !save) return;
    await repos.packs.archive(p, get().clock.now());
    await repos.packs.remove(id);
    const next = packs.filter((x) => x.id !== id);
    const archived = p.json.items.map((i) => i.id);
    const nextSave = { ...save, archivedItems: [...new Set([...save.archivedItems, ...archived])] };
    wireVoices(repos, next);
    set({ packs: next, index: buildIndex(next, nextSave) });
    get().commit(nextSave);
  },

  async setPackEnabled(id, enabled) {
    const { repos, packs } = get();
    const p = packs.find((x) => x.id === id);
    if (!repos || !p) return;
    const entry = { ...p, enabled };
    await repos.packs.put(entry);
    const next = packs.map((x) => (x.id === id ? entry : x));
    wireVoices(repos, next);
    set({ packs: next, index: buildIndex(next, get().save) });
  },

  exportBackup() {
    const { save, packs, clock } = get();
    if (!save) throw new Error('not ready');
    return {
      kind: 'kotodama-backup',
      backupVersion: 1,
      exportedAt: clock.now(),
      save: { ...save, lastBackupAt: clock.now() },
      packs: packs
        .filter((p) => p.source !== 'starter')
        .map((p) => ({
          id: p.id,
          version: p.version,
          enabled: p.enabled,
          source: p.source,
          installedAt: p.installedAt,
          json: p.json,
        })),
    };
  },

  async restoreBackup(raw) {
    const { repos } = get();
    if (!repos) return { ok: false, error: 'not ready' };
    const parsed = BackupSchema.safeParse(raw);
    if (!parsed.success) {
      const m = migrateSave((raw as { save?: unknown } | null)?.save);
      return { ok: false, error: m.ok ? 'This is not a Kotodama backup file.' : m.error };
    }
    const { save, packs } = parsed.data;
    for (const p of packs) {
      const json = LessonPackSchema.safeParse(p.json);
      if (!json.success) return { ok: false, error: `Pack "${p.id}" in the backup is invalid.` };
      await repos.packs.put({
        id: p.id,
        version: p.version,
        enabled: p.enabled,
        source: p.source as PackSource,
        installedAt: p.installedAt,
        json: json.data,
      });
    }
    await repos.profile.save(save);
    const all = await repos.packs.list();
    wireVoices(repos, all);
    set({ packs: all, save, index: buildIndex(all, save) });
    get().settle();
    return { ok: true };
  },
}));

/** Marks the save as backed up now (called after the file is handed to the player). */
export function markBackedUp() {
  const { save, clock, commit } = useGame.getState();
  if (save) commit({ ...save, lastBackupAt: clock.now() });
}
