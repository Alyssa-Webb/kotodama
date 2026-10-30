/**
 * Voice player. Every Japanese line is spoken by pack audio when a voice manifest has it,
 * otherwise by the device's Japanese voice (Web Speech). Never blocks waiting for voices.
 * Speech is given the kana reading, so the device voice cannot misread kanji.
 */
import type { VoiceManifest } from '../../schema/pack';
import type { VoiceMode } from '../../schema/save';
import { lineKey } from '../../engine/pack/lines';
import { toReading } from '../../engine/text/furigana';
import { audioContext } from './sfx';

export type Guide = 'akari' | 'tetsu';

export interface VoiceSource {
  manifest?: VoiceManifest;
  loadBlob(file: string): Promise<Blob | undefined>;
}

const MAX_QUEUE = 3;
let jaVoices: SpeechSynthesisVoice[] = [];
const sources: VoiceSource[] = [];
const decoded = new Map<string, AudioBuffer>();
let current: AudioBufferSourceNode | null = null;
let queued = 0;

function refreshVoices() {
  if (typeof speechSynthesis === 'undefined') return;
  jaVoices = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja'));
}

export function initVoices() {
  if (typeof speechSynthesis === 'undefined') return;
  refreshVoices();
  speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

export function registerVoiceSources(list: VoiceSource[]) {
  sources.splice(0, sources.length, ...list);
  decoded.clear();
}

export const hasDeviceVoice = () => jaVoices.length > 0;

const FEMALE = /kyoko|o-ren|oren|haruka|nanami|ayumi|mizuki|female|女性/i;
const MALE = /otoya|hattori|ichiro|keita|male|男性/i;

function deviceVoice(guide: Guide): SpeechSynthesisVoice | undefined {
  const pref = guide === 'akari' ? FEMALE : MALE;
  return (
    jaVoices.find((v) => pref.test(v.name)) ?? jaVoices.find((v) => v.localService) ?? jaVoices[0]
  );
}

/** Which guide voices a line, from the Voice setting. */
export function pickGuide(
  mode: VoiceMode,
  opts: { lessonIndex: number; lineIndex: number; role?: 'teach' | 'quiz' | string },
): Guide {
  switch (mode) {
    case 'akari':
      return 'akari';
    case 'tetsu':
      return 'tetsu';
    case 'alternate-lesson':
      return opts.lessonIndex % 2 === 0 ? 'akari' : 'tetsu';
    case 'alternate-line':
      return opts.lineIndex % 2 === 0 ? 'akari' : 'tetsu';
    case 'duet':
      // Akari teaches and Tetsu quizzes; in dialogues the player is Akari, everyone else Tetsu.
      return opts.role === 'teach' || opts.role === 'player' ? 'akari' : 'tetsu';
  }
}

async function packClip(
  text: string,
  guide: Guide,
  slow: boolean,
): Promise<AudioBuffer | undefined> {
  const key = lineKey(text);
  for (const src of sources) {
    const entry = src.manifest?.lines[key];
    const clip = entry?.[guide] ?? (entry ? Object.values(entry)[0] : undefined);
    if (!clip) continue;
    const file = slow && clip.slow ? clip.slow : clip.normal;
    const cacheKey = `${file}`;
    const hit = decoded.get(cacheKey);
    if (hit) return hit;
    const blob = await src.loadBlob(file);
    const ac = audioContext();
    if (!blob || !ac) return undefined;
    const buf = await ac.decodeAudioData(await blob.arrayBuffer());
    decoded.set(cacheKey, buf);
    return buf;
  }
  return undefined;
}

export function stopVoice() {
  try {
    current?.stop();
  } catch {
    /* already stopped */
  }
  current = null;
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  queued = 0;
}

export interface SpeakOptions {
  guide: Guide;
  slow?: boolean;
}

/** Speaks a Japanese line (furigana markup allowed). Resolves when playback starts or fails. */
export async function speak(text: string, opts: SpeakOptions): Promise<'pack' | 'device' | 'none'> {
  if (!text) return 'none';
  stopVoice();
  try {
    const buf = await packClip(text, opts.guide, !!opts.slow);
    const ac = audioContext();
    if (buf && ac) {
      const node = ac.createBufferSource();
      node.buffer = buf;
      node.connect(ac.destination);
      node.start();
      current = node;
      return 'pack';
    }
  } catch {
    /* fall through to the device voice */
  }
  if (typeof speechSynthesis === 'undefined') return 'none';
  if (queued >= MAX_QUEUE) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(toReading(text).replace(/\{\{[^}]+\}\}/g, 'なになに'));
  u.lang = 'ja-JP';
  const v = deviceVoice(opts.guide);
  if (v) u.voice = v;
  u.rate = opts.slow ? 0.65 : 0.9;
  // Without a distinct male device voice, a lower pitch keeps Tetsu recognizable.
  u.pitch = opts.guide === 'tetsu' && !(v && MALE.test(v.name)) ? 0.7 : 1;
  u.onend = u.onerror = () => (queued = Math.max(0, queued - 1));
  queued++;
  speechSynthesis.speak(u);
  return 'device';
}

/** Preloads (decodes) a lesson's clips before it starts, so playback is instant. */
export async function preload(texts: string[], guide: Guide) {
  await Promise.all(texts.map((t) => packClip(t, guide, false).catch(() => undefined)));
}
