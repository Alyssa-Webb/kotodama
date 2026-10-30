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

/** Call from a user gesture (tap/click/key) so Safari allows sound for the rest of the session. */
export function unlockAudio() {
  const c = audioContext();
  if (c && c.state !== 'running') void c.resume();
}

export function installAudioUnlock() {
  const handler = () => {
    unlockAudio();
    if (ctx?.state === 'running') {
      window.removeEventListener('pointerdown', handler, true);
      window.removeEventListener('keydown', handler, true);
    }
  };
  window.addEventListener('pointerdown', handler, true);
  window.addEventListener('keydown', handler, true);
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

export type Sfx = 'correct' | 'wrong' | 'kiai' | 'complete' | 'tap' | 'coin' | 'fail';

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
  }
}
