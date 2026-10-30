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

let jaVoices: SpeechSynthesisVoice[] = [];
const sources: VoiceSource[] = [];
const decoded = new Map<string, AudioBuffer>();
let current: AudioBufferSourceNode | null = null;

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

let generation = 0;
let last: { text: string; at: number } | null = null;
// Chrome garbage-collects a speaking utterance unless something holds it (onend never fires).
let speaking: SpeechSynthesisUtterance | null = null;

export function stopVoice() {
  generation++;
  try {
    current?.stop();
  } catch {
    /* already stopped */
  }
  current = null;
  if (
    typeof speechSynthesis !== 'undefined' &&
    (speechSynthesis.speaking || speechSynthesis.pending)
  )
    speechSynthesis.cancel();
  speaking = null;
}

export interface SpeakOptions {
  guide: Guide;
  slow?: boolean;
}

/**
 * Device-voice pacing. Speech engines rush short items, so single kana and short words get a
 * slower rate and a sentence ending (。), which makes the voice finish the sound instead of
 * clipping it.
 */
export function speechPlan(reading: string, slow: boolean): { text: string; rate: number } {
  const len = [...reading.replace(/[\s。、！？!?.,]/g, '')].length;
  const base = len <= 2 ? 0.62 : len <= 6 ? 0.72 : 0.8;
  const text = /[。！？!?]$/.test(reading) ? reading : `${reading}。`;
  return { text, rate: slow ? base * 0.72 : base };
}

/** Speaks a Japanese line (furigana markup allowed). Resolves when playback starts or fails. */
export async function speak(text: string, opts: SpeakOptions): Promise<'pack' | 'device' | 'none'> {
  if (!text) return 'none';
  // The same line asked for twice in a burst (re-render, double tap) plays once.
  const now = performance.now();
  if (last && last.text === text && now - last.at < 450) return 'none';
  last = { text, at: now };
  stopVoice();
  const mine = generation;
  try {
    const buf = await packClip(text, opts.guide, !!opts.slow);
    // A newer line started while this one was loading: drop this one instead of overlapping.
    if (mine !== generation) return 'none';
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
  if (typeof speechSynthesis === 'undefined' || mine !== generation) return 'none';
  const plan = speechPlan(toReading(text).replace(/\{\{[^}]+\}\}/g, 'なになに'), !!opts.slow);
  const u = new SpeechSynthesisUtterance(plan.text);
  u.lang = 'ja-JP';
  const v = deviceVoice(opts.guide);
  if (v) u.voice = v;
  u.rate = plan.rate;
  // Without a distinct male device voice, a lower pitch keeps Tetsu recognizable.
  u.pitch = opts.guide === 'tetsu' && !(v && MALE.test(v.name)) ? 0.75 : 1;
  u.onend = u.onerror = () => {
    if (speaking === u) speaking = null;
  };
  speaking = u;
  // Safari and Chrome drop or delay an utterance queued in the same tick as cancel().
  window.setTimeout(() => {
    if (mine !== generation) return;
    speechSynthesis.resume();
    speechSynthesis.speak(u);
  }, 40);
  return 'device';
}

/** Preloads (decodes) a lesson's clips before it starts, so playback is instant. */
export async function preload(texts: string[], guide: Guide) {
  await Promise.all(texts.map((t) => packClip(t, guide, false).catch(() => undefined)));
}
