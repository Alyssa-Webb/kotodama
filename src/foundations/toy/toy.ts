/**
 * Public, import-cheap API for the toy stage. three.js and the stage load on first use (and are
 * pre-warmed when the browser is idle), so screens can call these freely. Every call degrades
 * gracefully: no WebGL, a lost context or reduced motion simply resolves at once and the 2D UI
 * carries the moment on its own.
 */
import type { ToyEffect } from '../../schema/theme';
import type { ToyScene } from '../../schema/toys';
import { prefersReducedMotion } from '../platform';
import type { Point } from '../fx/fx';
import type { Tier } from './quality';
import type { Stage } from './stage';

let loading: Promise<Stage | null> | null = null;
let stage: Stage | null = null;
let disabled = false;

function canUse(): boolean {
  return !disabled && typeof window !== 'undefined' && typeof document !== 'undefined';
}

function load(): Promise<Stage | null> {
  if (!canUse()) return Promise.resolve(null);
  loading ??= import('./stage').then((m) => (stage = m.Stage.create())).catch(() => null);
  return loading;
}

/** Loads the stage while the browser is idle so the first training starts without a hitch. */
export function prewarmToys() {
  if (!canUse()) return;
  const idle =
    (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ??
    ((cb: () => void) => window.setTimeout(cb, 600));
  idle(() => void load());
}

/** Turns the whole 3D layer off (tests, or a player who prefers the flat UI). */
export function setToysEnabled(on: boolean) {
  disabled = !on;
  if (!on) stage?.setBackdrop(null);
}

const motionOk = () => !prefersReducedMotion();

export const toy = {
  effect(effect: ToyEffect, at: Point) {
    if (effect === 'none' || !motionOk()) return;
    if (stage) stage.effect(effect, at.x, at.y);
    else void load().then((s) => s?.effect(effect, at.x, at.y));
  },

  /** Plays the training-start sequence; resolves when the UI should make its entrance. */
  async gate(kind: ToyScene): Promise<void> {
    if (!motionOk()) return;
    const s = await load();
    if (!s) return;
    await s.playGate(kind);
  },

  backdrop(kind: ToyScene | null) {
    if (!kind) {
      stage?.setBackdrop(null);
      return;
    }
    void load().then((s) => s?.setBackdrop(kind));
  },

  async reveal(itemId: string, from: Point): Promise<void> {
    if (!motionOk()) return;
    const s = await load();
    if (s) await s.reveal(itemId, from.x, from.y);
  },

  /** Capsule drop → wait for a tap (or a moment) → open. `onOpen` fires on the pop. */
  async capsule(rarity: 'common' | 'rare' | 'legendary', onOpen: () => void): Promise<void> {
    const s = motionOk() ? await load() : null;
    if (!s) {
      onOpen();
      return;
    }
    await s.capsule(rarity, onOpen);
  },

  /** Renders a live, slowly turning 3D item inside `el`. Returns the cleanup. */
  view(el: HTMLElement, itemId: string): () => void {
    let off: (() => void) | null = null;
    let cancelled = false;
    void load().then((s) => {
      if (s && !cancelled) off = s.addView(el, itemId);
    });
    return () => {
      cancelled = true;
      off?.();
    };
  },

  nudge(el: HTMLElement) {
    stage?.nudgeView(el);
  },

  async quality(): Promise<{ tier: Tier; scale: number; mode: 'auto' | Tier } | null> {
    const s = await load();
    return s ? s.qualityInfo() : null;
  },

  async setQuality(mode: 'auto' | Tier) {
    const s = await load();
    s?.setQualityMode(mode);
  },
};
