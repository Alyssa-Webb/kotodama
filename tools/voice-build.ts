/**
 * voice-build: voices every Japanese line of a pack with VOICEVOX in both guides' voices, at
 * 1.0× and 0.75×, checks the engine's reading against the furigana, converts to AAC with macOS
 * afconvert, writes the voice manifest and bundles a .jlpack into content/outbox/.
 *
 *   npm run voice:build                 # every pack in content/inbox/ (and content/packs/)
 *   npm run voice:build -- path/to.json # one pack
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { zipSync, strToU8 } from 'fflate';
import { validatePack } from '../src/engine/pack/validate';
import { collectVoiceLines, lineKey } from '../src/engine/pack/lines';
import { toReading } from '../src/engine/text/furigana';
import type { LessonPack, VoiceManifest } from '../src/schema/pack';
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
  type VoicesFile,
} from './voice/lib';

const CACHE = 'tools/.voice-cache';
const OUTBOX = 'content/outbox';

async function main() {
  const version = await engineVersion();
  if (!version) {
    console.error(
      'VOICEVOX is not running. Open the VOICEVOX app (https://voicevox.hiroshiba.jp/), leave it open, then try again.',
    );
    process.exit(2);
  }
  console.log(`VOICEVOX ${version}`);
  const voices: VoicesFile = existsSync('voices.json')
    ? (JSON.parse(readFileSync('voices.json', 'utf8')) as VoicesFile)
    : DEFAULT_VOICES;
  const sp = await speakers();
  const ids = {} as Record<'akari' | 'tetsu', { id: number; style: string; speaker: string }>;
  for (const g of ['akari', 'tetsu'] as const) {
    const r = resolveStyle(sp, voices[g]);
    if (!r)
      throw new Error(
        `Voice "${voices[g].speaker}" not found in VOICEVOX. Install it or run Voice Audition.`,
      );
    ids[g] = { ...r, speaker: voices[g].speaker };
    console.log(`${g}: ${voices[g].speaker} / ${r.style} (style id ${r.id})`);
  }

  const args = process.argv.slice(2);
  const files = args.length
    ? args
    : [
        ...readdirSync('content/inbox')
          .filter((f) => f.endsWith('.json'))
          .map((f) => join('content/inbox', f)),
        ...readdirSync('content/packs')
          .filter((f) => f.endsWith('.json'))
          .map((f) => join('content/packs', f)),
      ];
  if (!files.length) console.log('Nothing to voice: put pack JSON files into content/inbox/.');
  mkdirSync(CACHE, { recursive: true });
  mkdirSync(OUTBOX, { recursive: true });

  for (const file of files) {
    const res = validatePack(JSON.parse(readFileSync(file, 'utf8')));
    if (!res.ok || !res.pack) {
      console.error(`✘ ${file}: invalid pack (run npm run content:lint -- ${file})`);
      res.errors.slice(0, 10).forEach((e) => console.error(`  ${e.path}: ${e.message}`));
      continue;
    }
    await voicePack(res.pack, ids);
  }
}

async function voicePack(
  pack: LessonPack,
  ids: Record<'akari' | 'tetsu', { id: number; style: string; speaker: string }>,
) {
  const lines = collectVoiceLines(pack);
  console.log(
    `\n${pack.pack.id} v${pack.pack.version}: ${lines.length} lines × 2 voices × 2 speeds`,
  );
  const manifest: VoiceManifest = {
    version: 1,
    credits: [credit(ids.akari.speaker), credit(ids.tetsu.speaker)],
    voices: {
      akari: { speaker: ids.akari.speaker, style: ids.akari.style },
      tetsu: { speaker: ids.tetsu.speaker, style: ids.tetsu.style },
    },
    lines: {},
  };
  const audio: Record<string, Uint8Array> = {};
  let fixed = 0;
  for (const [i, line] of lines.entries()) {
    const entry: VoiceManifest['lines'][string] = {};
    for (const g of ['akari', 'tetsu'] as const) {
      const v = ids[g];
      const clips: Record<string, string> = {};
      for (const [speedName, speed] of Object.entries(SPEEDS)) {
        const name = clipName(line.text, g, v.style, speed);
        const cached = join(CACHE, name);
        if (!existsSync(cached)) {
          // Surface text first; if the engine misreads a kanji, rebuild from the furigana reading.
          let q = await audioQuery(line.text.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'), v.id);
          if (!readingMatches(q, line.text)) {
            q = await audioQuery(toReading(line.text), v.id);
            if (!readingMatches(q, line.text))
              q = { ...q, accent_phrases: await accentPhrasesFromKana(aquesKana(line.text), v.id) };
            fixed++;
          }
          q.speedScale = speed;
          const wav = await synthesis(q, v.id);
          const wavPath = join(CACHE, name.replace('.m4a', '.wav'));
          writeFileSync(wavPath, wav);
          execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', wavPath, cached]);
        }
        clips[speedName] = name;
        audio[`audio/${name}`] = readFileSync(cached);
      }
      entry[g] = { normal: clips.normal!, slow: clips.slow! };
    }
    manifest.lines[lineKey(line.text)] = entry;
    if ((i + 1) % 10 === 0 || i === lines.length - 1)
      process.stdout.write(`\r  ${i + 1}/${lines.length} lines`);
  }
  console.log(`\n  ${fixed} line(s) re-read from furigana`);
  const zip = zipSync(
    {
      'pack.json': strToU8(JSON.stringify(pack)),
      'voice.json': strToU8(JSON.stringify(manifest)),
      ...audio,
    },
    { level: 0 },
  );
  const out = join(OUTBOX, `${pack.pack.id}-v${pack.pack.version}.jlpack`);
  writeFileSync(out, zip);
  console.log(`✔ ${out} (${(zip.byteLength / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
