/** Pure helpers for the VOICEVOX pipeline (unit-tested without the engine). */
import { createHash } from 'node:crypto';
import { toReading } from '../../src/engine/text/furigana';
import { katakanaToHiragana } from '../../src/engine/text/kana';

export interface Mora {
  text: string;
}
export interface AccentPhrase {
  moras: Mora[];
  pause_mora?: Mora | null;
}
export interface AudioQuery {
  accent_phrases: AccentPhrase[];
  speedScale: number;
  [k: string]: unknown;
}

const strip = (s: string) => katakanaToHiragana(s).replace(/[\s、。！？!?,.「」…ー・]/g, '');

/** The kana VOICEVOX will actually say for a query (pauses excluded). */
export function queryKana(q: Pick<AudioQuery, 'accent_phrases'>): string {
  return q.accent_phrases.map((p) => p.moras.map((m) => m.text).join('')).join('');
}

/** True when the engine's moras match the reading given by the furigana. */
export function readingMatches(q: Pick<AudioQuery, 'accent_phrases'>, furigana: string): boolean {
  return strip(queryKana(q)) === strip(toReading(furigana));
}

/** Hiragana → katakana (VOICEVOX's AquesTalk-style kana input is katakana). */
export function toKatakana(s: string): string {
  return s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
}

/**
 * AquesTalk-style kana for /accent_phrases?is_kana=true: katakana, phrases split on punctuation
 * with "/", and an accent mark after the first mora of each phrase (a safe, flat-ish default).
 */
export function aquesKana(furigana: string): string {
  const reading = toKatakana(toReading(furigana));
  const phrases = reading
    .split(/[、。！？!?,.\s「」…]+/)
    .map((p) => p.replace(/[^ァ-ーー]/g, ''))
    .filter(Boolean);
  return phrases
    .map((p) => {
      const small = /^[ァ-ー][ャュョァィゥェォッー]?/.exec(p)?.[0] ?? p.slice(0, 1);
      return `${small}'${p.slice(small.length)}`;
    })
    .join('/');
}

export const SPEEDS = { normal: 1.0, slow: 0.75 } as const;

/** File name = hash(text, reading, voice, style, speed): nothing is rendered twice. */
export function clipName(text: string, voice: string, style: string, speed: number): string {
  const h = createHash('sha1')
    .update([text, toReading(text), voice, style, speed].join('\u0000'))
    .digest('hex');
  return `${h.slice(0, 20)}.m4a`;
}

export interface VoiceChoice {
  speaker: string;
  style: string;
}
export type VoicesFile = Record<'akari' | 'tetsu', VoiceChoice>;

export const DEFAULT_VOICES: VoicesFile = {
  akari: { speaker: '冥鳴ひまり', style: 'ノーマル' },
  tetsu: { speaker: '青山龍星', style: 'ノーマル' },
};

export interface Speaker {
  name: string;
  styles: { name: string; id: number }[];
}

/** Finds a style ID by speaker and style NAME (never hard-coded numbers); falls back to the first style. */
export function resolveStyle(
  speakers: Speaker[],
  choice: VoiceChoice,
): { id: number; style: string } | null {
  const sp = speakers.find((s) => s.name === choice.speaker);
  if (!sp || !sp.styles.length) return null;
  const st = sp.styles.find((s) => s.name === choice.style) ?? sp.styles[0]!;
  return { id: st.id, style: st.name };
}

export const credit = (speaker: string) => `VOICEVOX:${speaker}`;
