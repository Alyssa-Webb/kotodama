/**
 * voice-audition: renders 10 sample lines in each candidate voice and style, opens a local page
 * to choose Akari's and Tetsu's voices by ear, and writes the choice to voices.json.
 */
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { audioQuery, engineVersion, speakers, synthesis } from './voice/engine';
import { clipName, DEFAULT_VOICES, type VoicesFile } from './voice/lib';

const SAMPLES = [
  'いらっしゃいませ。',
  'はじめまして。',
  'みずをください。',
  'コーヒーをひとつください。',
  'おいしいです。',
  'ありがとうございます。',
  'すみません、メニューをおねがいします。',
  'おかいけいをおねがいします。',
  'これはなんですか。',
  'ごちそうさまでした。',
];
const FEMALE = [
  '冥鳴ひまり',
  '四国めたん',
  '春日部つむぎ',
  '雨晴はう',
  '九州そら',
  'WhiteCUL',
  '小夜/SAYO',
  'もち子さん',
];
const MALE = ['青山龍星', '玄野武宏', '白上虎太郎', '剣崎雌雄', '麒ヶ島宗麟', '雀松朱司', 'No.7'];
const DIR = 'tools/.voice-cache/audition';

async function main() {
  if (!(await engineVersion())) {
    console.error(
      'VOICEVOX is not running. Open the VOICEVOX app (https://voicevox.hiroshiba.jp/), leave it open, then try again.',
    );
    process.exit(2);
  }
  mkdirSync(DIR, { recursive: true });
  const all = await speakers();
  const pick = (names: string[]) => all.filter((s) => names.includes(s.name));
  const groups = { akari: pick(FEMALE), tetsu: pick(MALE) };
  const rows: { guide: string; speaker: string; style: string; files: string[] }[] = [];
  for (const [guide, list] of Object.entries(groups)) {
    for (const sp of list) {
      for (const st of sp.styles.slice(0, 3)) {
        const files: string[] = [];
        for (const text of SAMPLES) {
          const name = clipName(text, sp.name, st.name, 1);
          const m4a = join(DIR, name);
          if (!existsSync(m4a)) {
            const wav = join(DIR, name.replace('.m4a', '.wav'));
            writeFileSync(wav, await synthesis(await audioQuery(text, st.id), st.id));
            execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', wav, m4a]);
          }
          files.push(name);
        }
        rows.push({ guide, speaker: sp.name, style: st.name, files });
        console.log(`rendered ${guide}: ${sp.name} / ${st.name}`);
      }
    }
  }
  const current: VoicesFile = existsSync('voices.json')
    ? (JSON.parse(readFileSync('voices.json', 'utf8')) as VoicesFile)
    : DEFAULT_VOICES;
  const page = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kotodama Voice Audition</title>
<style>body{font-family:-apple-system,"Hiragino Sans",sans-serif;max-width:860px;margin:2rem auto;padding:0 1rem;background:#f6f1e7;color:#1f1d1a}h2{margin-top:2rem}.v{background:#fffdf8;border:1px solid #ddd2bf;border-radius:14px;padding:1rem;margin:.6rem 0}.v.on{outline:3px solid #b03722}button{font:inherit;padding:.5rem 1rem;border-radius:10px;border:1px solid #ddd2bf;background:#fff;cursor:pointer;margin:.2rem}button.pick{background:#b03722;color:#fff;border:0}</style>
<h1>Choose Akari's and Tetsu's voices</h1><p>Play the samples, then press <b>Choose</b>. Your choice is saved to voices.json; run Voice Packs afterwards.</p>
${['akari', 'tetsu']
  .map(
    (g) =>
      `<h2>${g === 'akari' ? 'Akari (warm, kind, around 30)' : 'Tetsu (deep, soft, gravelly)'}</h2>${rows
        .filter((r) => r.guide === g)
        .map(
          (r) =>
            `<div class="v ${current[g as 'akari'].speaker === r.speaker && current[g as 'akari'].style === r.style ? 'on' : ''}"><b>${r.speaker}</b> · ${r.style}<br>${r.files.map((f, i) => `<button onclick="new Audio('/a/${f}').play()">${SAMPLES[i]}</button>`).join('')}<br><button class="pick" onclick="fetch('/choose',{method:'POST',body:JSON.stringify({guide:'${g}',speaker:'${r.speaker}',style:'${r.style}'})}).then(()=>location.reload())">Choose for ${g}</button></div>`,
        )
        .join('')}`,
  )
  .join('')}`;
  const server = createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/choose') {
      let body = '';
      req.on('data', (c: Buffer) => (body += c.toString()));
      req.on('end', () => {
        const { guide, speaker, style } = JSON.parse(body) as {
          guide: 'akari' | 'tetsu';
          speaker: string;
          style: string;
        };
        const v: VoicesFile = existsSync('voices.json')
          ? (JSON.parse(readFileSync('voices.json', 'utf8')) as VoicesFile)
          : { ...DEFAULT_VOICES };
        v[guide] = { speaker, style };
        writeFileSync('voices.json', JSON.stringify(v, null, 2) + '\n');
        console.log(`saved ${guide} = ${speaker} / ${style}`);
        res.end('ok');
      });
      return;
    }
    if (req.url?.startsWith('/a/')) {
      const f = join(DIR, req.url.slice(3).replace(/[^0-9a-f.m4]/g, ''));
      if (existsSync(f)) {
        res.setHeader('Content-Type', 'audio/mp4');
        res.end(readFileSync(f));
        return;
      }
      res.statusCode = 404;
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(page);
  });
  server.listen(4321, '127.0.0.1', () => {
    console.log('Audition page: http://127.0.0.1:4321  (close this window when done)');
    try {
      execFileSync('open', ['http://127.0.0.1:4321']);
    } catch {
      /* not on macOS */
    }
  });
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
