/**
 * Web Audio: one shared AudioContext unlocked on the first user gesture, plus synthesized
 * sound effects (no audio files to download). On iOS 17+, navigator.audioSession.type =
 * 'playback' lets sound play with the silent switch on, unless the player opts out.
 */
interface AudioSessionNavigator extends Navigator {
  audioSession?: { type: string };
}

let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEffects(on: boolean) {
  enabled = on;
}

export function setRespectSilentSwitch(respect: boolean) {
  const nav = navigator as AudioSessionNavigator;
  if (nav.audioSession) {
    try {
      nav.audioSession.type = respect ? 'ambient' : 'playback';
    } catch {
      /* unsupported value on this browser */
    }
  }
}

export function audioContext(): AudioContext | null {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/**
 * Call from a user gesture so iOS allows sound. iOS only counts touchend/click/keydown (not
 * pointerdown), and wants a sound started inside the gesture, so this also plays one silent
 * sample.
 */
export function unlockAudio() {
  const c = audioContext();
  if (!c) return;
  if (c.state !== 'running') void c.resume();
  const src = c.createBufferSource();
  src.buffer = c.createBuffer(1, 1, 22050);
  src.connect(c.destination);
  src.start(0);
}

/**
 * Keeps sound unlocked for the whole session. iOS suspends ("interrupts") the context when the
 * app goes to the background or a call comes in, so every gesture re-checks it (cheap) instead of
 * unlocking once and walking away.
 */
export function installAudioUnlock() {
  const handler = () => {
    if (ctx?.state !== 'running') unlockAudio();
  };
  for (const ev of ['touchend', 'click', 'keydown', 'pointerup'])
    window.addEventListener(ev, handler, { capture: true, passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && ctx && ctx.state !== 'running')
      void ctx.resume().catch(() => undefined);
  });
}

let noise: AudioBuffer | null = null;
/** One second of white noise, shared by the whooshes, the rip and the wind. */
function noiseBuffer(c: AudioContext): AudioBuffer {
  if (noise && noise.sampleRate === c.sampleRate) return noise;
  noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

/** A burst of filtered noise whose filter sweeps from `f0` to `f1` Hz: whooshes and rips. */
function sweep(
  start: number,
  dur: number,
  f0: number,
  f1: number,
  gain: number,
  type: BiquadFilterType = 'bandpass',
  q = 1.2,
) {
  const c = audioContext();
  if (!c) return;
  const t = c.currentTime + start;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  const f = c.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.02, dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

/**
 * Soft ambient wind for the bamboo scenes: looping noise through a low-pass filter whose cutoff
 * and level drift slowly. Returns a stop function (fades out).
 */
export function startAmbient(kind: 'wind' = 'wind'): () => void {
  const c = audioContext();
  if (!c || !enabled || kind !== 'wind') return () => undefined;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 520;
  f.Q.value = 0.7;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 1.2);
  // Gusts: slow oscillators nudge the cutoff and the level.
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.13;
  const lfoDepth = c.createGain();
  lfoDepth.gain.value = 260;
  lfo.connect(lfoDepth).connect(f.frequency);
  const gust = c.createOscillator();
  gust.frequency.value = 0.07;
  const gustDepth = c.createGain();
  gustDepth.gain.value = 0.018;
  gust.connect(gustDepth).connect(g.gain);
  src.connect(f).connect(g).connect(c.destination);
  src.start();
  lfo.start();
  gust.start();
  return () => {
    const t = c.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    for (const n of [src, lfo, gust]) n.stop(t + 0.65);
  };
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
  const c = audioContext();
  if (!c) return;
  const t = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export type Sfx =
  'correct' | 'wrong' | 'kiai' | 'complete' | 'tap' | 'coin' | 'fail' | 'slash' | 'rip' | 'hit';

/** Small synthesized cues: a soft two-note chime for correct, a low thud for wrong. */
export function playSfx(kind: Sfx) {
  if (!enabled) return;
  switch (kind) {
    case 'correct':
      tone(880, 0, 0.18, 'sine', 0.18);
      tone(1318.5, 0.08, 0.28, 'sine', 0.14);
      break;
    case 'wrong':
      tone(196, 0, 0.22, 'triangle', 0.18);
      tone(155.6, 0.09, 0.26, 'triangle', 0.14);
      break;
    case 'kiai':
      [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(f, i * 0.06, 0.25, 'square', 0.06));
      break;
    case 'complete':
      [523.3, 659.3, 784, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.09, 0.4, 'sine', 0.12));
      break;
    case 'coin':
      tone(1568, 0, 0.08, 'square', 0.05);
      tone(2093, 0.06, 0.18, 'square', 0.05);
      break;
    case 'fail':
      [392, 329.6, 261.6].forEach((f, i) => tone(f, i * 0.15, 0.35, 'triangle', 0.12));
      break;
    case 'tap':
      tone(1200, 0, 0.04, 'sine', 0.05);
      break;
    case 'slash':
      // A blade whoosh: a fast high-to-low noise sweep with a bright edge.
      sweep(0, 0.2, 5200, 900, 0.32, 'bandpass', 1.4);
      tone(2600, 0, 0.05, 'sine', 0.03);
      break;
    case 'rip':
      // Hedges tearing: a ragged mid-high rip, then a leafy rustle.
      sweep(0, 0.32, 3800, 1400, 0.3, 'bandpass', 0.8);
      sweep(0.05, 0.25, 2600, 700, 0.18, 'bandpass', 2);
      sweep(0.18, 0.55, 6000, 2500, 0.08, 'highpass', 0.7);
      break;
    case 'hit':
      // A body blow: a short low thump with a little crunch.
      tone(120, 0, 0.16, 'sine', 0.35);
      tone(70, 0.02, 0.2, 'sine', 0.25);
      sweep(0, 0.08, 1800, 600, 0.12, 'bandpass', 1);
      break;
  }
}
