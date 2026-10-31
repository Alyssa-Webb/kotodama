import { describe, expect, it } from 'vitest';
import kotoJson from '../../../world/koto.json';
import manifestJson from '../../../public/voice/manifest.json';
import { KotoSchema } from '../../schema/koto';
import { parseFurigana } from '../../engine/text/furigana';

const koto = KotoSchema.parse(kotoJson);

describe("Koto's lines", () => {
  it('parse, and every Japanese line has valid furigana markup', () => {
    for (const l of [...koto.shop, ...koto.town, ...koto.tour])
      expect(() => parseFurigana(l.ja)).not.toThrow();
  });
  it('tours every main tab, each stop once, ending on a cheer', () => {
    const targets = koto.tour.map((t) => t.target);
    expect(new Set(targets).size).toBe(targets.length);
    for (const tab of ['#/town', '#/path', '#/reviews', '#/shop', '#/avatar'])
      expect(targets.some((t) => t.includes(tab))).toBe(true);
    expect(koto.tour.at(-1)?.pose).toBe('cheer');
  });
  it('wears the shopkeeper costume at the shop stop', () => {
    expect(koto.tour.find((t) => t.target.includes('#/shop'))?.outfit).toBe('shopkeeper');
  });
});

describe("Koto's home lines", () => {
  it('each one has his own VOICEVOX clip', () => {
    const manifest = manifestJson as { lines: Record<string, { koto?: unknown }> };
    const home = [koto.home.morning, koto.home.day, koto.home.evening, ...koto.home.lines];
    for (const l of home) expect(manifest.lines[l.ja]?.koto, l.ja).toBeDefined();
  });
});
