import type { Exercise, ExerciseType, Furigana, Role } from '../../schema/pack';
import type { PackIndex } from '../pack/index';
import type { Rng } from '../rng';

export type Facet = 'main' | 'understand' | 'produce';
export type Skill = 'kana' | 'vocabulary' | 'grammar' | 'listening';

/** What a piece of UI text is: Japanese (furigana markup) or English. */
export type Display = { ja: Furigana; hideFurigana?: boolean } | { en: string };

export interface Option {
  id: string;
  display: Display;
}

export interface Prompt {
  instruction: string;
  ja?: Furigana;
  /** Hide furigana on the prompt (reading questions must not give the answer away). */
  hideFurigana?: boolean;
  en?: string;
  /** Japanese text to play as the prompt (listen, dictation). Not shown. */
  audio?: Furigana;
  scene?: string;
}

export interface Target {
  itemId: string;
  facet: Facet;
}

export interface DialogueStep {
  speaker: Role;
  text: Furigana;
  en: string;
  choices?: { id: string; text: Furigana; correct: boolean; feedback: string }[];
}

export type QuestionBody =
  | { shape: 'choose'; options: Option[]; correctId: string; feedback?: Record<string, string> }
  | { shape: 'match'; left: Option[]; right: Option[]; pairs: Record<string, string> }
  | { shape: 'tiles'; tiles: { id: string; text: Furigana }[]; suffix: string; accepted: string[] }
  | { shape: 'type'; answerLang: 'ja' | 'en'; accepted: string[] }
  | { shape: 'trace'; glyph: string }
  | {
      shape: 'dialogue';
      dialogueId: string;
      title: string;
      setting: string;
      steps: DialogueStep[];
    };

export type Shape = QuestionBody['shape'];

export type Question = {
  exerciseId: string;
  type: ExerciseType;
  prompt: Prompt;
  targets: Target[];
  skill: Skill;
  /** The right answer, shown in feedback and in lesson review. */
  solution: Display;
  /** Short teaching line shown after answering (usage, literal meaning...). */
  note?: string;
} & QuestionBody;

export type Answer =
  | { kind: 'choose'; optionId: string }
  | { kind: 'match'; wrongAttempts: number }
  | { kind: 'tiles'; tileIds: string[] }
  | { kind: 'type'; text: string }
  | { kind: 'trace'; selfCorrect: boolean }
  | { kind: 'dialogue'; wrongChoices: number };

export interface GradeResult {
  correct: boolean;
  /** Accepted with a one-character slip. */
  typo: boolean;
  /** What the player gave, for lesson review. */
  given: string;
}

export interface PrepareContext {
  index: PackIndex;
  rng: Rng;
  /** True when an item may appear as a generated filler (introduced or already known). */
  isAvailable: (itemId: string) => boolean;
}

export interface ExercisePlugin<T extends ExerciseType = ExerciseType> {
  type: T;
  prepare(ex: Extract<Exercise, { type: T }>, ctx: PrepareContext): Question | null;
}
