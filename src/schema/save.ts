/**
 * The player's whole progress. Stored in IndexedDB and written as the backup file, so this
 * schema is versioned: bump SAVE_VERSION and add a migration in engine/save/migrate.ts.
 */
import { z } from 'zod';
import { DifficultySchema } from './economy';
import { AvatarSlotSchema } from './world';

export const SAVE_VERSION = 1;

export const ScriptLevelSchema = z.enum(['romaji', 'kana', 'furigana', 'kanji']);
export type ScriptLevel = z.infer<typeof ScriptLevelSchema>;

export const VoiceModeSchema = z.enum([
  'akari',
  'tetsu',
  'alternate-lesson',
  'alternate-line',
  'duet',
]);
export type VoiceMode = z.infer<typeof VoiceModeSchema>;

export const SettingsSchema = z.object({
  difficulty: DifficultySchema.default('hardcore'),
  dailyGoalXp: z.number().int().positive().default(100),
  scriptLevel: ScriptLevelSchema.default('furigana'),
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  voiceMode: VoiceModeSchema.default('alternate-lesson'),
  slowAudio: z.boolean().default(false),
  autoplayAudio: z.boolean().default(true),
  soundEffects: z.boolean().default(true),
  respectSilentSwitch: z.boolean().default(false),
  rolloverHour: z.number().int().min(0).max(23).default(4),
  installGuideDismissed: z.boolean().default(false),
  /** Game day until which difficulty is locked after a change. */
  difficultyLockedUntil: z.string().default(''),
});
export type Settings = z.infer<typeof SettingsSchema>;

/** FSRS card as stored: ts-fsrs fields with dates as epoch ms. */
export const StoredCardSchema = z.looseObject({
  dueAt: z.number(),
  lastReviewAt: z.number().nullable(),
  stability: z.number(),
  difficulty: z.number(),
  state: z.number().int(),
  reps: z.number().int(),
  lapses: z.number().int(),
});
export type StoredCard = z.infer<typeof StoredCardSchema>;

export const LedgerEventSchema = z.object({
  id: z.number().int(),
  at: z.number(),
  day: z.string(),
  /** koban | token | heart | xp | item:<consumable id> */
  asset: z.string(),
  amount: z.number(),
  reason: z.string(),
  ref: z.string().optional(),
});
export type LedgerEvent = z.infer<typeof LedgerEventSchema>;

export const MistakeSchema = z.object({
  at: z.number(),
  exerciseId: z.string(),
  itemId: z.string().optional(),
  given: z.string(),
  expected: z.string(),
});
export type Mistake = z.infer<typeof MistakeSchema>;

export const GhostSchema = z.object({ score: z.number().int(), times: z.array(z.number()) });

export const SaveStateSchema = z.object({
  saveVersion: z.literal(SAVE_VERSION),
  createdAt: z.number(),
  settings: SettingsSchema,
  cards: z.record(z.string(), StoredCardSchema),
  itemStats: z.record(
    z.string(),
    z.object({ seen: z.number().int(), correct: z.number().int(), wrong: z.number().int() }),
  ),
  nodes: z.record(
    z.string(),
    z.object({
      completedAt: z.number(),
      stars: z.number().int().min(0).max(3),
      bestXp: z.number().int(),
      plays: z.number().int(),
    }),
  ),
  ledger: z.array(LedgerEventSchema),
  streak: z.object({
    current: z.number().int().nonnegative(),
    best: z.number().int().nonnegative(),
    lastGoalDay: z.string().nullable(),
    lastProcessedDay: z.string().nullable(),
    broken: z
      .object({
        day: z.string(),
        length: z.number().int(),
        at: z.number(),
        trial: z.boolean().optional(),
      })
      .nullable(),
    missedDays: z.number().int().nonnegative(),
  }),
  daily: z.object({
    day: z.string(),
    xp: z.number().int(),
    lessons: z.number().int(),
    reviews: z.number().int(),
    chestClaimed: z.boolean(),
  }),
  hearts: z.object({ updatedAt: z.number(), dojoProgress: z.number().int() }),
  boosts: z.object({
    taikoUntil: z.number(),
    manekiLessons: z.number().int(),
    omamori: z.record(z.string(), z.number()),
  }),
  charms: z.object({ owned: z.array(z.string()), equipped: z.string().nullable() }),
  collection: z.object({ shopWords: z.array(z.string()) }),
  avatar: z.object({
    equipped: z.partialRecord(AvatarSlotSchema, z.string()),
    owned: z.array(z.string()),
  }),
  gacha: z.object({
    rngState: z.number().int(),
    pity: z.number().int(),
    owned: z.array(z.string()),
  }),
  bosses: z.record(
    z.string(),
    z.object({
      defeatedAt: z.number().optional(),
      lastAttemptDay: z.string().optional(),
      wins: z.number().int(),
    }),
  ),
  rush: z.record(z.string(), z.object({ best: z.number().int(), ghost: GhostSchema.optional() })),
  mistakes: z.array(MistakeSchema),
  elo: z.record(z.string(), z.number()),
  archivedItems: z.array(z.string()),
  notes: z.string(),
  lessonCount: z.number().int(),
  lastBackupAt: z.number().nullable(),
});
export type SaveState = z.infer<typeof SaveStateSchema>;

/** Backup file = the save plus installed packs (content and metadata). */
export const BackupSchema = z.object({
  kind: z.literal('kotodama-backup'),
  backupVersion: z.literal(1),
  exportedAt: z.number(),
  /** Validated and migrated by engine/save/migrate when restored. */
  save: z.unknown(),
  packs: z.array(
    z.object({
      id: z.string(),
      version: z.number(),
      enabled: z.boolean(),
      source: z.string(),
      installedAt: z.number(),
      json: z.unknown(),
    }),
  ),
});
export type Backup = z.infer<typeof BackupSchema>;
