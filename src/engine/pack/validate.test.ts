import { describe, expect, it } from 'vitest';
import starter from '../../../content/packs/kotodama-starter.json';
import { formatErrorsForChatGPT, validatePack } from './validate';
import { collectVoiceLines } from './lines';

const clone = () => structuredClone(starter) as typeof starter;
const messages = (input: unknown) =>
  validatePack(input)
    .errors.map((e) => e.message)
    .join('\n');

describe('validatePack', () => {
  it('accepts the starter pack with stats', () => {
    const r = validatePack(starter);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.stats?.items.kana).toBe(20);
    expect(r.stats?.voiceLines).toBeGreaterThan(50);
  });

  it('rejects shape errors with readable paths', () => {
    const r = validatePack({ schemaVersion: '1.0.0', pack: { id: 'x' } });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.path.startsWith('pack'))).toBe(true);
  });

  it('rejects misspelled fields (strict objects)', () => {
    const p = clone() as unknown as { items: Record<string, unknown>[] };
    p.items[10]!['meaning'] = ['oops'];
    expect(validatePack(p).ok).toBe(false);
  });

  it('flags kanji without furigana and non-kana readings', () => {
    const p = clone();
    const mizu = p.items.find((i) => i.id === 'w.mizu')!;
    mizu.text = '水';
    expect(messages(p)).toMatch(/without furigana/);
    mizu.text = '{水|mizu}';
    expect(messages(p)).toMatch(/kana only/);
  });

  it('flags tiles that do not join back to the text', () => {
    const p = clone();
    const s = p.items.find((i) => i.id === 's.mizu-o-kudasai') as { tiles: string[] };
    s.tiles = ['{水|みず}', 'が', 'ください', '。'];
    expect(messages(p)).toMatch(/Tiles join/);
  });

  it('flags unknown references, duplicates and double introductions', () => {
    const p = clone();
    const n = p.units[1]!.nodes[0]!;
    (n.exercises[0] as { item: string }).item = 'w.nope';
    n.exercises[1]!.id = n.exercises[2]!.id;
    (p.units[1]!.nodes[1]!.introduces as string[]).push('w.mizu');
    const m = messages(p);
    expect(m).toMatch(/Unknown item "w.nope"/);
    expect(m).toMatch(/Duplicate exercise ID/);
    expect(m).toMatch(/introduced more than once/);
  });

  it('enforces node rules', () => {
    const p = clone();
    p.units[1]!.nodes[0]!.exercises.splice(3);
    expect(messages(p)).toMatch(/10–15 exercises/);
    const q = clone();
    q.units[0]!.nodes[2]!.introduces = ['k.a'];
    expect(messages(q)).toMatch(
      /Checkpoint nodes introduce no new items|introduced more than once/,
    );
  });

  it('flags items used before they are introduced', () => {
    const p = clone();
    (p.units[1]!.nodes[0]!.exercises[0] as { item: string }).item = 's.okaikei';
    expect(messages(p)).toMatch(/used before the node/);
  });

  it('checks dialogues: choices only for the player, exactly one correct', () => {
    const p = clone();
    const line = p.dialogues[0]!.lines[1]!;
    line.choices!.forEach((c) => (c.correct = true));
    expect(messages(p)).toMatch(/Exactly one choice/);
    p.dialogues[0]!.lines[0] = {
      ...p.dialogues[0]!.lines[0]!,
      choices: line.choices,
    } as typeof line;
    expect(messages(p)).toMatch(/Only "player" lines/);
  });

  it('formats a paste-ready error list for ChatGPT', () => {
    const p = clone();
    const at = p.items.findIndex((i) => i.id === 'w.mizu');
    p.items[at]!.text = '水';
    const text = formatErrorsForChatGPT(validatePack(p), 'First Steps');
    expect(text).toMatch(/^Kotodama rejected the pack "First Steps"/);
    expect(text).toContain(`1. items[${at}]`);
  });

  it('collects voice lines including filled patterns and dialogue', () => {
    const keys = collectVoiceLines(validatePack(starter).pack!).map((l) => l.key);
    expect(keys).toContain('{水|みず}をください');
    expect(keys).toContain('いらっしゃいませ。');
    expect(new Set(keys).size).toBe(keys.length);
  });
});
