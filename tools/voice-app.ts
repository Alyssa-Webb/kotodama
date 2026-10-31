/**
 * voice:app: voices the built-in content with VOICEVOX and ships it inside the app, so every
 * player hears real voices without importing anything:
 *
 * - every line of the starter pack, plus the app's own Japanese (food orders, prices, coin
 *   names, item names, greetings), in Akari's and Tetsu's voices at normal and slow speed;
 * - Koto's lines (world/koto.json, the checkout) in ずんだもん's voice.
 *
 * Output: public/voice/<hash>.mp3 and public/voice/manifest.json. The service worker caches
 * clips the first time they play, so they work offline afterwards. Needs the VOICEVOX app open.
 *
 *   npm run voice:app
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Mp3Encoder } from '@breezystack/lamejs';
import { validatePack } from '../src/engine/pack/validate';
import { collectVoiceLines, lineKey } from '../src/engine/pack/lines';
import { toReading } from '../src/engine/text/furigana';
import { yenFurigana, YEN_DENOMINATIONS } from '../src/engine/text/yen';
import type { VoiceManifest } from '../src/schema/pack';
import {
  accentPhrasesFromKana,
  audioQuery,
  engineVersion,
  speakers,
  synthesis,
} from './voice/engine';
import {
  aquesKana,
  clipName,
  credit,
  DEFAULT_VOICES,
  readingMatches,
  resolveStyle,
  SPEEDS,
  type VoiceChoice,
  type VoicesFile,
} from './voice/lib';

const CACHE = 'tools/.voice-cache';
const OUT = 'public/voice';
/** Koto, the chibi mascot: a cute, high, bouncy voice. Credit "VOICEVOX:ずんだもん". */
const KOTO: VoiceChoice = { speaker: 'ずんだもん', style: 'ノーマル' };

const read = (p: string) => JSON.parse(readFileSync(p, 'utf8')) as unknown;

/** The app's own Japanese outside lesson packs, voiced by the guides. */
function appLines(): string[] {
  const out: string[] = [
    'こんばんは！',
    'おはようございます！',
    'こんにちは！',
    'いらっしゃいませ！ご{注文|ちゅうもん}は？',
    'すみません…',
    'ありがとうございました！',
    'えっ？',
    '{水|みず}をください。',
    'いらっしゃいませ。',
  ];
  const meals = (read('world/meals.json') as { meals: { name: string; price: number }[] }).meals;
  for (const m of meals) {
    out.push(m.name, `${m.name}をください。`, `${m.name}がください。`);
    out.push(`${yenFurigana(m.price)}です。`, yenFurigana(m.price));
  }
  const shop = read('world/shop.json') as {
    consumables: { name: string }[];
    charms: { name: string }[];
  };
  for (const x of [...shop.consumables, ...shop.charms]) out.push(x.name);
  const parts = (read('world/avatar.json') as { parts: { name?: string }[] }).parts;
  for (const p of parts) if (p.name) out.push(p.name);
  const town = read('world/buildings.json') as { buildings: { product: { ja: string } }[] };
  for (const b of town.buildings) out.push(b.product.ja);
  const regions = read('world/regions.json') as { regions: { ja: string }[] };
  for (const r of regions.regions) out.push(r.ja);
  return out;
}

/** Koto's own lines: his shop, town and tour speech, and the checkout he runs. */
function kotoLines(): string[] {
  const koto = read('world/koto.json') as Record<string, unknown>;
  const out: string[] = ['ありがとうございます'];
  for (const v of Object.values(koto))
    if (Array.isArray(v)) for (const l of v as { ja?: string }[]) if (l.ja) out.push(l.ja);
  // Home: his time-of-day greetings and the lines a tap cycles through.
  const home = koto.home as Record<string, { ja?: string } | { ja?: string }[]> | undefined;
  for (const v of Object.values(home ?? {}))
    for (const l of Array.isArray(v) ? v : [v]) if (l.ja) out.push(l.ja);
  for (const d of YEN_DENOMINATIONS) out.push(yenFurigana(d));
  const shop = read('world/shop.json') as { consumables: { price: number }[] };
  const meals = (read('world/meals.json') as { meals: { price: number }[] }).meals;
  for (const x of [...shop.consumables, ...meals]) out.push(yenFurigana(x.price));
  return out;
}

/** 16-bit PCM WAV (as VOICEVOX returns it) → MP3 at 48 kbps mono. */
function wavToMp3(wav: Uint8Array): Uint8Array {
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  let off = 12;
  let rate = 24000;
  let data: Int16Array | null = null;
  while (off + 8 <= wav.byteLength) {
    const id = String.fromCharCode(...wav.subarray(off, off + 4));
    const size = view.getUint32(off + 4, true);
    if (id === 'fmt ') rate = view.getUint32(off + 12, true);
    if (id === 'data') {
      const copy = wav.slice(off + 8, off + 8 + size);
      data = new Int16Array(copy.buffer, 0, Math.floor(copy.byteLength / 2));
    }
    off += 8 + size + (size % 2);
  }
  if (!data) throw new Error('VOICEVOX returned audio without a data chunk');
  const enc = new Mp3Encoder(1, rate, 48);
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < data.length; i += 1152)
    chunks.push(enc.encodeBuffer(data.subarray(i, i + 1152)));
  chunks.push(enc.flush());
  const out = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0));
  let p = 0;
  for (const c of chunks) {
    out.set(c, p);
    p += c.length;
  }
  return out;
}

async function render(text: string, id: number, voice: string, style: string, speed: number) {
  const name = clipName(text, voice, style, speed).replace(/\.m4a$/, '.mp3');
  const cached = join(CACHE, name);
  if (!existsSync(cached)) {
    // Surface text first; if the engine misreads a kanji, rebuild from the furigana reading.
    let q = await audioQuery(text.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'), id);
    if (!readingMatches(q, text)) {
      q = await audioQuery(toReading(text), id);
      // Last resort: hand the engine the reading as AquesTalk kana. It rejects some spellings
      // (a long-vowel mark before the accent), and then the plain reading above stands.
      if (!readingMatches(q, text)) {
        try {
          q = { ...q, accent_phrases: await accentPhrasesFromKana(aquesKana(text), id) };
        } catch {
          console.warn(`\n  kept the plain reading for ${text}`);
        }
      }
    }
    q.speedScale = speed;
    writeFileSync(cached, wavToMp3(new Uint8Array(await synthesis(q, id))));
  }
  writeFileSync(join(OUT, name), readFileSync(cached));
  return name;
}

async function main() {
  const version = await engineVersion();
  if (!version) {
    console.error('VOICEVOX is not running. Open the VOICEVOX app, leave it open, then try again.');
    process.exit(2);
  }
  console.log(`VOICEVOX ${version}`);
  const voices: VoicesFile = existsSync('voices.json')
    ? (JSON.parse(readFileSync('voices.json', 'utf8')) as VoicesFile)
    : DEFAULT_VOICES;
  const sp = await speakers();
  const pick = (v: VoiceChoice) => {
    const r = resolveStyle(sp, v);
    if (!r) throw new Error(`Voice "${v.speaker}" is not installed in VOICEVOX.`);
    console.log(`  ${v.speaker} / ${r.style} (style ${r.id})`);
    return { ...r, speaker: v.speaker };
  };
  const guides = { akari: pick(voices.akari), tetsu: pick(voices.tetsu), koto: pick(KOTO) };

  const packs = readdirSync('content/packs').filter((f) => f.endsWith('.json'));
  const general = new Map<string, string>();
  for (const f of packs) {
    const res = validatePack(read(join('content/packs', f)));
    if (!res.ok || !res.pack) throw new Error(`${f} is invalid: run npm run content:lint`);
    for (const l of collectVoiceLines(res.pack)) general.set(l.key, l.text);
  }
  for (const t of appLines()) general.set(lineKey(t), t);
  const koto = new Map(kotoLines().map((t) => [lineKey(t), t]));

  mkdirSync(CACHE, { recursive: true });
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const manifest: VoiceManifest = {
    version: 1,
    credits: [credit(guides.akari.speaker), credit(guides.tetsu.speaker), credit(KOTO.speaker)],
    voices: {
      akari: { speaker: guides.akari.speaker, style: guides.akari.style },
      tetsu: { speaker: guides.tetsu.speaker, style: guides.tetsu.style },
      koto: { speaker: KOTO.speaker, style: guides.koto.style },
    },
    lines: {},
  };
  const total = general.size + koto.size;
  let done = 0;
  const tick = () => {
    if (++done % 10 === 0 || done === total) process.stdout.write(`\r  ${done}/${total} lines`);
  };
  for (const [key, text] of general) {
    const entry: VoiceManifest['lines'][string] = manifest.lines[key] ?? {};
    for (const g of ['akari', 'tetsu'] as const) {
      const v = guides[g];
      entry[g] = {
        normal: await render(text, v.id, v.speaker, v.style, SPEEDS.normal),
        slow: await render(text, v.id, v.speaker, v.style, SPEEDS.slow),
      };
    }
    manifest.lines[key] = entry;
    tick();
  }
  for (const [key, text] of koto) {
    const entry: VoiceManifest['lines'][string] = manifest.lines[key] ?? {};
    const v = guides.koto;
    entry.koto = { normal: await render(text, v.id, v.speaker, v.style, SPEEDS.normal) };
    manifest.lines[key] = entry;
    tick();
  }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest));
  const files = readdirSync(OUT).length - 1;
  console.log(`\n✔ ${files} clips for ${Object.keys(manifest.lines).length} lines in ${OUT}/`);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
