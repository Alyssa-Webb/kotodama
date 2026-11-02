/** Pure checks behind `npm run art:gate`: what a brief allows, and what an art run's diff breaks. */

export interface Finding {
  rule: 'outside-brief' | 'raw-color' | 'non-composited';
  file: string;
  line?: number;
  detail: string;
}

/** The properties browsers can animate without layout or paint. */
const COMPOSITED = new Set(['transform', 'opacity', 'translate', 'rotate', 'scale']);
/** Allowed inside @keyframes because they change timing, not what gets animated. */
const KEYFRAME_TIMING = new Set(['animation-timing-function', 'animation-composition']);

const NAMED_COLORS =
  'white|black|red|blue|green|yellow|orange|purple|pink|brown|gray|grey|gold|silver|navy|teal';
const RAW_COLOR_PATTERNS = [
  // A hex color, but not an SVG reference such as url(#fade) or href="#fade", or an HTML entity.
  /(?<![\w&])(?<!url\(['"]?)(?<!href=\{?['"])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/i,
  /\b(?:rgb|rgba|hsl|hsla)\(/i,
  new RegExp(
    `\\b(?:fill|stroke|stopColor|stop-color|color|background|background-color)\\s*[=:]\\s*\\{?['"]?(?:${NAMED_COLORS})\\b`,
    'i',
  ),
];

/** Reads the backticked paths under "## Files you may change". Text after "(" only qualifies a path. */
export function parseAllowlist(brief: string): string[] {
  const section = /^## Files you may change[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(
    brief.replace(/\r/g, ''),
  );
  if (!section?.[1]) return [];
  const paths: string[] = [];
  for (const line of section[1].split('\n')) {
    if (!/^\s*[-*]/.test(line)) continue;
    const beforeNote = line.split('(')[0] ?? '';
    for (const match of beforeNote.matchAll(/`([^`]+)`/g)) {
      if (match[1]) paths.push(match[1]);
    }
  }
  return paths;
}

function allowedBy(file: string, pattern: string): boolean {
  if (pattern.endsWith('/')) return file.startsWith(pattern);
  const regex = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\0')
    .replace(/\*/g, '[^/]*')
    .replace(/\0/g, '.*');
  return new RegExp(`^${regex}$`).test(file);
}

export function findOutsideBrief(changed: string[], allowlist: string[]): Finding[] {
  return changed
    .filter((file) => !allowlist.some((pattern) => allowedBy(file, pattern)))
    .map((file) => ({
      rule: 'outside-brief' as const,
      file,
      detail: 'not listed under "Files you may change"',
    }));
}

function isWholeLineComment(line: string): boolean {
  const text = line.trim();
  return /^(\/\/|\/\*|\*|\{\/\*)/.test(text);
}

/** Checks only added lines, so older art doesn't fail a run that never touched it. */
export function findRawColors(
  file: string,
  added: ReadonlyArray<{ line: number; text: string }>,
): Finding[] {
  const findings: Finding[] = [];
  for (const { line, text } of added) {
    if (isWholeLineComment(text)) continue;
    const match = RAW_COLOR_PATTERNS.map((pattern) => pattern.exec(text)).find(Boolean);
    if (match) {
      findings.push({
        rule: 'raw-color',
        file,
        line,
        detail: `"${match[0]}" bypasses the theme: use var(--c-*)`,
      });
    }
  }
  return findings;
}

function lineAt(source: string, index: number): number {
  return source.slice(0, index).split('\n').length;
}

/** Checks @keyframes blocks and transitions that touch added lines. */
export function findNonComposited(
  file: string,
  source: string,
  addedLines: ReadonlySet<number>,
): Finding[] {
  const text = source.replace(/\r/g, '');
  const findings: Finding[] = [];

  for (const start of text.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    let depth = 1;
    let end = start.index + start[0].length;
    while (depth > 0 && end < text.length) {
      if (text[end] === '{') depth++;
      if (text[end] === '}') depth--;
      end++;
    }
    const firstLine = lineAt(text, start.index);
    const lastLine = lineAt(text, end);
    const touched = [...addedLines].some((n) => n >= firstLine && n <= lastLine);
    if (!touched) continue;
    const body = text.slice(start.index + start[0].length, end);
    for (const decl of body.matchAll(/([-\w]+)\s*:\s*[^;{}]+/g)) {
      const prop = decl[1]?.toLowerCase() ?? '';
      if (COMPOSITED.has(prop) || KEYFRAME_TIMING.has(prop)) continue;
      findings.push({
        rule: 'non-composited',
        file,
        line: lineAt(text, start.index + start[0].length + decl.index),
        detail: `@keyframes ${start[1]} animates "${prop}"`,
      });
    }
  }

  for (const match of text.matchAll(/\btransition(?:-property)?\s*:\s*['"`]?([^;'"`}\n]+)/g)) {
    const line = lineAt(text, match.index);
    if (!addedLines.has(line)) continue;
    // Commas inside cubic-bezier() aren't separators between transitions.
    const parts = (match[1] ?? '').replace(/\([^)]*\)/g, '').split(',');
    for (const part of parts) {
      const prop = part.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
      if (!prop || prop === 'none' || COMPOSITED.has(prop)) continue;
      findings.push({ rule: 'non-composited', file, line, detail: `transition on "${prop}"` });
    }
  }
  return findings;
}

/** Added line numbers per file, from `git diff -U0`. */
export function parseAddedLines(diff: string): Map<string, Array<{ line: number; text: string }>> {
  const files = new Map<string, Array<{ line: number; text: string }>>();
  let current: Array<{ line: number; text: string }> | undefined;
  let next = 0;
  for (const raw of diff.replace(/\r/g, '').split('\n')) {
    const fileMatch = /^\+\+\+ (?:b\/)?(.+)$/.exec(raw);
    if (fileMatch?.[1]) {
      current = [];
      files.set(fileMatch[1], current);
      continue;
    }
    const hunk = /^@@ -\S+ \+(\d+)/.exec(raw);
    if (hunk?.[1]) {
      next = Number(hunk[1]);
      continue;
    }
    if (current && raw.startsWith('+')) {
      current.push({ line: next, text: raw.slice(1) });
      next++;
    }
  }
  return files;
}
