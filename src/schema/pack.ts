/**
 * Lesson pack schema: a 1:1 Zod translation of the TypeScript format spec in the plan's
 * "ChatGPT lesson prompt" (AUTHORING.md). This file is the single source of truth for the
 * app, content-lint and the generated lesson-pack.schema.json.
 * Objects are strict so a misspelled field ("distractor") is an error, not silently ignored.
 */
import { z } from 'zod';

/** Japanese text where every kanji run is written {漢字|かんじ}. Deep checks live in validatePack. */
export const FuriganaSchema = z.string().min(1);

export const ID_PREFIXES = {
  k: 'kana',
  w: 'word',
  p: 'phrase',
  g: 'pattern',
  s: 'sentence',
  d: 'dialogue',
} as const;
export const IdSchema = z
  .string()
  .regex(
    /^[kwpgsd]\.[a-z0-9][a-z0-9_-]*$/,
    'IDs are a prefix (k. w. p. g. s. d.) plus a lowercase slug',
  );

export const RegisterSchema = z.enum(['casual', 'polite', 'formal']);
export const RoleSchema = z.enum(['narrator', 'teacher', 'friend', 'clerk', 'player']);
export const LevelSchema = z.enum(['N5', 'N4', 'N3', 'N2', 'N1']);

const base = {
  id: IdSchema,
  meanings: z.array(z.string().min(1)).min(1),
  romaji: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
};

export const ExampleSchema = z.strictObject({ text: FuriganaSchema, en: z.string().min(1) });

export const KanaSchema = z.strictObject({
  ...base,
  kind: z.literal('kana'),
  text: z.string().min(1),
});

export const WordSchema = z.strictObject({
  ...base,
  kind: z.literal('word'),
  text: FuriganaSchema,
  pos: z.enum(['noun', 'verb', 'i-adj', 'na-adj', 'adverb', 'counter', 'other']),
  forms: z.record(z.string(), FuriganaSchema).optional(),
  example: ExampleSchema.optional(),
});

export const PhraseSchema = z.strictObject({
  ...base,
  kind: z.literal('phrase'),
  text: FuriganaSchema,
  register: RegisterSchema,
  usage: z.string().min(1),
  literal: z.string().optional(),
  variants: z.array(z.strictObject({ text: FuriganaSchema, register: RegisterSchema })).optional(),
  accept: z.array(FuriganaSchema).optional(),
  tiles: z.array(FuriganaSchema).min(1).optional(),
});

export const PatternSchema = z.strictObject({
  ...base,
  kind: z.literal('pattern'),
  pattern: FuriganaSchema,
  slots: z.record(z.string(), z.array(IdSchema).min(1)),
  meaningPattern: z.string().min(1),
  examples: z.array(ExampleSchema),
});

export const SentenceSchema = z.strictObject({
  ...base,
  kind: z.literal('sentence'),
  text: FuriganaSchema,
  register: RegisterSchema,
  tiles: z.array(FuriganaSchema).min(1),
  accept: z.array(FuriganaSchema).optional(),
});

export const ItemSchema = z.discriminatedUnion('kind', [
  KanaSchema,
  WordSchema,
  PhraseSchema,
  PatternSchema,
  SentenceSchema,
]);

export const DialogueChoiceSchema = z.strictObject({
  text: FuriganaSchema,
  correct: z.boolean(),
  feedback: z.string(),
});

export const DialogueLineSchema = z.strictObject({
  speaker: RoleSchema,
  text: FuriganaSchema,
  en: z.string(),
  choices: z.array(DialogueChoiceSchema).min(2).optional(),
});

export const DialogueSchema = z.strictObject({
  id: IdSchema,
  title: z.string().min(1),
  setting: z.string(),
  lines: z.array(DialogueLineSchema).min(1),
});

const ex = <K extends string, T extends z.ZodRawShape>(type: K, shape: T) =>
  z.strictObject({ id: z.string().min(1), type: z.literal(type), ...shape });

const direction = z.enum(['toJapanese', 'toEnglish']);

export const ExerciseSchema = z.discriminatedUnion('type', [
  ex('choice', {
    item: IdSchema,
    ask: z.enum(['meaning', 'reading', 'japanese']),
    distractors: z.array(IdSchema).min(1),
  }),
  ex('match', { items: z.array(IdSchema).min(4).max(6) }),
  ex('listen', { item: IdSchema, distractors: z.array(IdSchema).min(1) }),
  ex('dictation', { item: IdSchema }),
  ex('tiles', { item: IdSchema, extraTiles: z.array(FuriganaSchema).optional() }),
  ex('type', { item: IdSchema, ask: z.enum(['japanese', 'meaning']) }),
  ex('fill', {
    text: FuriganaSchema,
    answer: FuriganaSchema,
    options: z.array(FuriganaSchema).min(2),
    en: z.string(),
  }),
  ex('trace', { item: IdSchema }),
  ex('situation', {
    scene: z.string().min(1),
    answer: IdSchema,
    distractors: z.array(IdSchema).min(1),
  }),
  ex('translate', { item: IdSchema, direction }),
  ex('register', { item: IdSchema, from: RegisterSchema, to: RegisterSchema }),
  ex('pattern', { item: IdSchema, direction }),
  ex('conjugate', { item: IdSchema, form: z.string().min(1) }),
  ex('reply', { dialogue: IdSchema }),
]);

export const TeachSchema = z.union([
  z.strictObject({ item: IdSchema }),
  z.strictObject({ note: z.strictObject({ title: z.string(), body: z.string() }) }),
]);

export const NodeSchema = z.strictObject({
  id: z.string().min(1),
  kind: z.enum(['lesson', 'story', 'checkpoint']),
  title: z.string().min(1),
  introduces: z.array(IdSchema),
  teach: z.array(TeachSchema).optional(),
  exercises: z.array(ExerciseSchema).min(1),
});

export const UnitSchema = z.strictObject({
  id: z.string().min(1),
  title: z.string().min(1),
  nodes: z.array(NodeSchema).min(1),
});

export const PackMetaSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'pack id: lowercase letters, digits and hyphens'),
  title: z.string().min(1),
  version: z.number().int().positive(),
  level: LevelSchema,
  description: z.string(),
  requires: z.array(z.string()).optional(),
  district: z.string().optional(),
});

export const LessonPackSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  pack: PackMetaSchema,
  items: z.array(ItemSchema),
  dialogues: z.array(DialogueSchema).optional(),
  units: z.array(UnitSchema).min(1),
});

export type Furigana = string;
export type Id = z.infer<typeof IdSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type ItemKind = Item['kind'];
export type Kana = z.infer<typeof KanaSchema>;
export type Word = z.infer<typeof WordSchema>;
export type Phrase = z.infer<typeof PhraseSchema>;
export type Pattern = z.infer<typeof PatternSchema>;
export type Sentence = z.infer<typeof SentenceSchema>;
export type Dialogue = z.infer<typeof DialogueSchema>;
export type DialogueLine = z.infer<typeof DialogueLineSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseType = Exercise['type'];
export type ExerciseOf<T extends ExerciseType> = Extract<Exercise, { type: T }>;
export type LessonNode = z.infer<typeof NodeSchema>;
export type Unit = z.infer<typeof UnitSchema>;
export type PackMeta = z.infer<typeof PackMetaSchema>;
export type LessonPack = z.infer<typeof LessonPackSchema>;

/**
 * Optional voice manifest added by voice-build (never written by ChatGPT). Maps a line key
 * (see engine/voice/lineKey) to audio file names inside the .jlpack, per voice and speed.
 */
export const VoiceManifestSchema = z.strictObject({
  version: z.literal(1),
  credits: z.array(z.string()),
  voices: z.record(z.string(), z.strictObject({ speaker: z.string(), style: z.string() })),
  lines: z.record(
    z.string(),
    z.record(z.string(), z.strictObject({ normal: z.string(), slow: z.string().optional() })),
  ),
});
export type VoiceManifest = z.infer<typeof VoiceManifestSchema>;
