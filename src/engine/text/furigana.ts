/**
 * Furigana markup: {漢字|かんじ} marks a reading; {{slot}} marks a pattern slot.
 * parseFurigana never throws; malformed markup is reported in `errors`.
 */
import { hasKanji, isKanaOnly } from './kana';

export type FuriganaToken =
  | { kind: 'text'; text: string }
  | { kind: 'ruby'; base: string; reading: string }
  | { kind: 'slot'; name: string };

export interface ParsedFurigana {
  tokens: FuriganaToken[];
  errors: string[];
}

export function parseFurigana(input: string): ParsedFurigana {
  const tokens: FuriganaToken[] = [];
  const errors: string[] = [];
  let buf = '';
  const flush = () => {
    if (buf) tokens.push({ kind: 'text', text: buf });
    buf = '';
  };
  let i = 0;
  while (i < input.length) {
    const ch = input[i]!;
    if (ch === '{' && input[i + 1] === '{') {
      const end = input.indexOf('}}', i + 2);
      if (end < 0) {
        errors.push(`Unclosed slot "{{" at position ${i}`);
        buf += input.slice(i);
        break;
      }
      flush();
      const name = input.slice(i + 2, end).trim();
      if (!/^[a-zA-Z][\w-]*$/.test(name)) errors.push(`Bad slot name "{{${name}}}"`);
      tokens.push({ kind: 'slot', name });
      i = end + 2;
      continue;
    }
    if (ch === '{') {
      const end = input.indexOf('}', i + 1);
      const nextOpen = input.indexOf('{', i + 1);
      if (end < 0 || (nextOpen >= 0 && nextOpen < end)) {
        errors.push(`Unbalanced "{" at position ${i}`);
        buf += ch;
        i++;
        continue;
      }
      const inner = input.slice(i + 1, end);
      const bar = inner.indexOf('|');
      if (bar < 0) {
        errors.push(`Ruby "{${inner}}" is missing "|reading"`);
        buf += inner;
      } else {
        const base = inner.slice(0, bar);
        const reading = inner.slice(bar + 1);
        if (!base) errors.push(`Ruby "{${inner}}" has an empty base`);
        if (!reading) errors.push(`Ruby "{${inner}}" has an empty reading`);
        else if (!isKanaOnly(reading)) errors.push(`Reading "${reading}" must be kana only`);
        if (reading.includes('|')) errors.push(`Ruby "{${inner}}" has more than one "|"`);
        flush();
        tokens.push({ kind: 'ruby', base, reading });
      }
      i = end + 1;
      continue;
    }
    if (ch === '}') {
      errors.push(`Unbalanced "}" at position ${i}`);
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  flush();
  for (const t of tokens) {
    if (t.kind === 'text' && hasKanji(t.text)) {
      errors.push(`Kanji without furigana in "${t.text}" (write {漢字|かんじ})`);
    }
  }
  return { tokens, errors };
}

/** Surface text as a native reader sees it: 水をください */
export function toSurface(input: string): string {
  return parseFurigana(input)
    .tokens.map((t) => (t.kind === 'text' ? t.text : t.kind === 'ruby' ? t.base : `{{${t.name}}}`))
    .join('');
}

/** Kana-only reading: みずをください */
export function toReading(input: string): string {
  return parseFurigana(input)
    .tokens.map((t) =>
      t.kind === 'text' ? t.text : t.kind === 'ruby' ? t.reading : `{{${t.name}}}`,
    )
    .join('');
}

/** Replaces {{slot}} markers with furigana text (pattern filling). */
export function fillSlots(pattern: string, values: Record<string, string>): string {
  return pattern.replace(/\{\{\s*([a-zA-Z][\w-]*)\s*\}\}/g, (m, name: string) => values[name] ?? m);
}

export function slotNames(pattern: string): string[] {
  return [...pattern.matchAll(/\{\{\s*([a-zA-Z][\w-]*)\s*\}\}/g)].map((m) => m[1]!);
}
