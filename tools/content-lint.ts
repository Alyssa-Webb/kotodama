/**
 * content-lint: validates every lesson pack in content/packs (and any paths given as arguments)
 * with the same validatePack the app uses. Exits 1 on any error. Prints a voice coverage report.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Item } from '../src/schema/pack';
import { validatePack } from '../src/engine/pack/validate';
import { lineKey } from '../src/engine/pack/lines';
import { VoiceManifestSchema } from '../src/schema/pack';

const args = process.argv.slice(2);
const files = args.length
  ? args
  : readdirSync('content/packs')
      .filter((f) => f.endsWith('.json') || statSync(join('content/packs', f)).isDirectory())
      .map((f) => join('content/packs', f));

interface Loaded {
  file: string;
  json: unknown;
  voiced?: Set<string>;
}

const loaded: Loaded[] = files.map((file) => {
  const packFile = statSync(file).isDirectory() ? join(file, 'pack.json') : file;
  const json: unknown = JSON.parse(readFileSync(packFile, 'utf8'));
  const manifestFile = statSync(file).isDirectory()
    ? join(file, 'voice.json')
    : file.replace(/\.json$/, '.voice.json');
  let voiced: Set<string> | undefined;
  if (existsSync(manifestFile)) {
    const m = VoiceManifestSchema.parse(JSON.parse(readFileSync(manifestFile, 'utf8')));
    voiced = new Set(Object.keys(m.lines).map(lineKey));
  }
  return voiced ? { file: packFile, json, voiced } : { file: packFile, json };
});

// Items from every other pack count as known, so packs that "require" others validate.
const known = new Map<string, Item['kind']>();
const dialogues = new Set<string>();
const firstPass = loaded.map((l) => validatePack(l.json));
firstPass.forEach((r) => {
  r.pack?.items.forEach((i) => known.set(i.id, i.kind));
  r.pack?.dialogues?.forEach((d) => dialogues.add(d.id));
});

let failed = false;
for (const l of loaded) {
  const own = firstPass[loaded.indexOf(l)]?.pack;
  const others = new Map([...known].filter(([id]) => !own?.items.some((i) => i.id === id)));
  const ownDialogues = new Set(own?.dialogues?.map((d) => d.id));
  const r = validatePack(l.json, {
    knownItems: others,
    knownDialogues: new Set([...dialogues].filter((d) => !ownDialogues.has(d))),
    ...(l.voiced ? { voicedKeys: l.voiced } : {}),
  });
  const title = r.pack ? `${r.pack.pack.id} v${r.pack.pack.version}` : l.file;
  if (r.ok) {
    const s = r.stats!;
    console.log(
      `✔ ${title}: ${Object.entries(s.items)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ')}; ${s.units} units, ${s.nodes} nodes, ${s.exercises} exercises`,
    );
    console.log(
      `  voice: ${s.voicedLines}/${s.voiceLines} lines have audio${s.voicedLines < s.voiceLines ? ' (rest: device voice, "voice pending")' : ''}`,
    );
  } else {
    failed = true;
    console.log(`✘ ${title}: ${r.errors.length} error(s)`);
    r.errors.forEach((e) => console.log(`  error  ${e.path}: ${e.message}`));
  }
  r.warnings
    .filter((w) => w.path !== '(voice)')
    .forEach((w) => console.log(`  warn   ${w.path}: ${w.message}`));
}
if (!files.length) console.log('content-lint: no packs found');
process.exit(failed ? 1 : 0);
