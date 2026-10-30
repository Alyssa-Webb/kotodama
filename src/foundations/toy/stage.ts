/**
 * The toy stage: two WebGL layers sharing one frame loop.
 * - back: the living world behind the training UI (z-index 0, under #root).
 * - front: the gate sequence, one-shot effects, purchase reveals and 3D item views (above the
 *   UI, below the 2D FX layer, pointer-events off except while a capsule waits for its tap).
 * Geometry and materials are plain three.js objects, so both renderers share them. Each layer
 * renders only while it has something to show; frame times feed the governor (quality.ts).
 * Loaded lazily (dynamic import) so three.js never delays the first paint.
 */
import * as THREE from 'three';
import type { ToyEffect } from '../../schema/theme';
import type { ToyScene } from '../../schema/toys';
import { toys } from '../world';
import { capsuleActor, effectActor, revealActor, type Actor, type FxSpace } from './effects';
import { startGate, type GateRun } from './gate';
import { itemModel } from './models';
import { environment, setPaletteMode, setPhysical, type PaletteMode } from './plastic';
import {
  TIERS,
  govern,
  guessTier,
  initialGovernor,
  loadQuality,
  measureBudget,
  storeQuality,
  type GovernorState,
  type Tier,
} from './quality';
import { buildWorld, type World } from './worlds';

interface Layer {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  w: number;
  h: number;
  dpr: number;
}

interface View {
  el: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  model: THREE.Object3D;
  spin: number;
}

function makeLayer(z: number): Layer | null {
  const canvas = document.createElement('canvas');
  canvas.className = `toy-canvas toy-canvas-${z > 0 ? 'front' : 'back'}`;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = `position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;pointer-events:none;z-index:${z};opacity:0;transition:opacity 320ms ease`;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
    });
  } catch {
    return null;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
  if (z <= 0) document.body.prepend(canvas);
  else document.body.appendChild(canvas);
  return { canvas, renderer, w: 0, h: 0, dpr: 0 };
}

function detectHints() {
  let gpu = '';
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    gpu = (ext && gl ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '') || '';
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    /* fingerprinting protections: fall back to core count */
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    gpu,
    cores: navigator.hardwareConcurrency || 4,
    memoryGb: nav.deviceMemory,
    mobile: /Mobi|Android|iPhone|iPad/.test(navigator.userAgent) || navigator.maxTouchPoints > 1,
  };
}

function currentMode(): PaletteMode {
  const t = document.documentElement.getAttribute('data-theme');
  if (t === 'dark' || t === 'light') return t;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export class Stage {
  private back: Layer;
  private front: Layer;
  private gov: GovernorState;
  private mode: 'auto' | Tier;
  private samples: number[] = [];
  private budgetSamples: number[] = [];
  private raf = 0;
  private last = 0;
  private clock = 0;
  private backWorld: { world: World; kind: ToyScene } | null = null;
  private gateWorld: World | null = null;
  private gateRun: GateRun | null = null;
  private gateResolve: (() => void) | null = null;
  private gateFading = false;
  private fx = new THREE.Scene();
  private fxCam = new THREE.PerspectiveCamera(30, 1, 1, 6000);
  private actors: { actor: Actor; t: number }[] = [];
  private views = new Map<HTMLElement, View>();
  private tapHandler: ((e: PointerEvent) => void) | null = null;
  private frameIndex = 0;
  private paletteMode: PaletteMode;

  private constructor(back: Layer, front: Layer) {
    this.back = back;
    this.front = front;
    const stored = loadQuality();
    const guess = guessTier(detectHints());
    this.mode = stored?.mode ?? 'auto';
    const tier = this.mode === 'auto' ? (stored?.tier ?? guess) : this.mode;
    this.gov = initialGovernor(tier, this.mode === 'auto' ? (stored?.ceiling ?? 3) : this.mode);
    setPhysical(TIERS[this.gov.tier].physical);
    this.paletteMode = currentMode();
    setPaletteMode(this.paletteMode);
    const env = environment(front.renderer);
    this.fx.environment = env;
    this.fx.add(new THREE.HemisphereLight('#fff8ee', '#b8a58a', 1.6));
    const key = new THREE.DirectionalLight('#ffffff', 2.4);
    key.position.set(-500, 900, 1200);
    this.fx.add(key);
    const rim = new THREE.DirectionalLight('#ffd9a0', 1.2);
    rim.position.set(600, 200, -400);
    this.fx.add(rim);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.kick();
    });
    window.addEventListener('resize', () => this.kick());
  }

  static create(): Stage | null {
    const back = makeLayer(0);
    if (!back) return null;
    const front = makeLayer(95);
    if (!front) {
      back.canvas.remove();
      return null;
    }
    return new Stage(back, front);
  }

  get tier(): Tier {
    return this.gov.tier;
  }
  private get settings() {
    return TIERS[this.gov.tier];
  }

  qualityInfo() {
    return { tier: this.gov.tier, scale: this.gov.scale, mode: this.mode, budget: this.gov.budget };
  }

  setQualityMode(mode: 'auto' | Tier) {
    this.mode = mode;
    const tier = mode === 'auto' ? this.gov.tier : mode;
    this.gov = { ...initialGovernor(tier, mode === 'auto' ? 3 : mode), budget: this.gov.budget };
    setPhysical(TIERS[tier].physical);
    this.persist();
    this.kick();
  }

  private persist() {
    storeQuality({ tier: this.gov.tier, ceiling: this.gov.ceiling, mode: this.mode });
  }

  // ---------- public scene API ----------

  setBackdrop(kind: ToyScene | null) {
    this.syncPalette();
    if (!kind) {
      this.back.canvas.style.opacity = '0';
      document.body.classList.remove('toy-backdrop');
      const old = this.backWorld;
      this.backWorld = null;
      window.setTimeout(() => {
        if (!this.backWorld && old) this.back.renderer.renderLists.dispose();
      }, 400);
      return;
    }
    if (this.backWorld?.kind !== kind) {
      const world = buildWorld(kind, { particles: this.settings.particles });
      world.gate.visible = false;
      world.scene.environment = environment(this.back.renderer);
      this.backWorld = { world, kind };
    }
    document.body.classList.add('toy-backdrop');
    this.back.canvas.style.opacity = '1';
    this.kick();
  }

  playGate(kind: ToyScene): Promise<void> {
    this.syncPalette();
    this.finishGate();
    const world = buildWorld(kind, { particles: this.settings.particles });
    world.scene.environment = environment(this.front.renderer);
    const speed = this.settings.fullSequences ? 1 : toys.gate.lowTierSpeed;
    this.gateWorld = world;
    this.gateRun = startGate(world, {
      duration: toys.gate.duration / speed,
      shaderFog: this.settings.shaderFog,
    });
    this.gateFading = false;
    this.front.canvas.style.transition = 'none';
    this.front.canvas.style.opacity = '1';
    // Any tap skips straight to the end (the canvas itself never blocks input).
    const skip = () => this.gateRun?.skip();
    window.addEventListener('pointerdown', skip, { once: true, capture: true });
    this.kick();
    return new Promise<void>((resolve) => {
      this.gateResolve = () => {
        window.removeEventListener('pointerdown', skip, true);
        resolve();
      };
    });
  }

  effect(effect: ToyEffect, x: number, y: number) {
    const actor = effectActor(effect, this.space(), x, y);
    if (actor) this.addActor(actor);
  }

  reveal(itemId: string, x: number, y: number): Promise<void> {
    return new Promise((resolve) => {
      const a = revealActor(this.space(), itemId, x, y);
      a.done = resolve;
      this.addActor(a);
    });
  }

  capsule(rarity: 'common' | 'rare' | 'legendary', onOpen: () => void): Promise<void> {
    return new Promise((resolve) => {
      const a = capsuleActor(this.space(), rarity, onOpen);
      a.done = () => {
        this.front.canvas.style.pointerEvents = 'none';
        if (this.tapHandler) this.front.canvas.removeEventListener('pointerdown', this.tapHandler);
        this.tapHandler = null;
        resolve();
      };
      this.front.canvas.style.pointerEvents = 'auto';
      this.tapHandler = () => a.onTap?.();
      this.front.canvas.addEventListener('pointerdown', this.tapHandler);
      this.addActor(a);
    });
  }

  addView(el: HTMLElement, itemId: string): () => void {
    this.syncPalette();
    const scene = new THREE.Scene();
    scene.environment = environment(this.front.renderer);
    scene.add(new THREE.HemisphereLight('#fff8ee', '#a89a86', 1.5));
    const key = new THREE.DirectionalLight('#ffffff', 2.2);
    key.position.set(-2, 4, 4);
    scene.add(key);
    const model = itemModel(itemId);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const pivot = new THREE.Group();
    pivot.add(model);
    scene.add(pivot);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
    const dist = (Math.max(size.x, size.y, size.z) / 2 / Math.tan((15 * Math.PI) / 180)) * 1.25;
    camera.position.set(0, dist * 0.25, dist);
    camera.lookAt(0, 0, 0);
    const v: View = { el, scene, camera, model: pivot, spin: Math.random() * Math.PI * 2 };
    this.views.set(el, v);
    this.front.canvas.style.transition = 'none';
    this.front.canvas.style.opacity = '1';
    this.kick();
    return () => {
      this.views.delete(el);
      this.kick();
    };
  }

  /** Spin a view's model faster for a moment (tap feedback). */
  nudgeView(el: HTMLElement) {
    const v = this.views.get(el);
    if (v) v.spin += Math.PI * 2;
  }

  // ---------- internals ----------

  private addActor(actor: Actor) {
    this.fx.add(actor.root);
    this.actors.push({ actor, t: 0 });
    this.front.canvas.style.transition = 'none';
    this.front.canvas.style.opacity = '1';
    this.kick();
  }

  private space(): FxSpace {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      width: w,
      height: h,
      particles: this.settings.particles,
      at: (x, y) => new THREE.Vector3(x - w / 2, h / 2 - y, 0),
    };
  }

  private syncPalette() {
    const m = currentMode();
    if (m !== this.paletteMode) {
      this.paletteMode = m;
      setPaletteMode(m);
      if (this.backWorld) this.backWorld = null; // rebuilt on next setBackdrop with new sky
    }
  }

  private finishGate() {
    if (this.gateRun) this.gateRun.dispose();
    this.gateRun = null;
    this.gateWorld = null;
    const r = this.gateResolve;
    this.gateResolve = null;
    r?.();
  }

  private kick() {
    if (!this.raf && document.visibilityState !== 'hidden') {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private size(layer: Layer) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.settings.dprCap) * this.gov.scale;
    if (w !== layer.w || h !== layer.h || Math.abs(dpr - layer.dpr) > 0.01) {
      layer.renderer.setPixelRatio(dpr);
      layer.renderer.setSize(w, h, false);
      layer.w = w;
      layer.h = h;
      layer.dpr = dpr;
    }
  }

  private frame = (now: number) => {
    this.raf = 0;
    const dtMs = Math.min(100, now - this.last);
    this.last = now;
    const dt = dtMs / 1000;
    this.clock += dt;
    this.frameIndex++;
    let busy = false;

    // Back layer: the living world. Low tiers render ambient motion at half rate.
    if (this.backWorld) {
      const half = this.gov.tier <= 1 && !this.gateRun;
      if (!half || this.frameIndex % 2 === 0) {
        this.size(this.back);
        const { world } = this.backWorld;
        world.update(this.clock);
        world.camera.aspect = this.back.w / this.back.h;
        world.camera.updateProjectionMatrix();
        world.camera.position.set(
          world.rest.pos.x + Math.sin(this.clock * 0.25) * 0.05,
          world.rest.pos.y + Math.sin(this.clock * 0.4) * 0.02,
          world.rest.pos.z,
        );
        world.camera.lookAt(world.rest.look);
        this.back.renderer.render(world.scene, world.camera);
      }
      busy = true;
    }

    // Front layer.
    const front = this.front;
    const hasFront = !!this.gateRun || this.actors.length > 0 || this.views.size > 0;
    if (hasFront) {
      this.size(front);
      const r = front.renderer;
      r.autoClear = false;
      r.setScissorTest(false);
      r.clear();
      if (this.gateRun && this.gateWorld) {
        const p = this.gateRun.update(dt);
        this.gateWorld.update(this.clock);
        this.gateWorld.camera.aspect = front.w / front.h;
        this.gateWorld.camera.updateProjectionMatrix();
        r.render(this.gateWorld.scene, this.gateWorld.camera);
        if (p >= 1 && !this.gateFading) {
          this.gateFading = true;
          front.canvas.style.transition = `opacity ${toys.gate.fadeOut}ms ease`;
          front.canvas.style.opacity = '0';
          const resolve = this.gateResolve;
          this.gateResolve = null;
          resolve?.();
          window.setTimeout(() => {
            if (this.gateFading) {
              this.gateRun?.dispose();
              this.gateRun = null;
              this.gateWorld = null;
              this.gateFading = false;
              if (this.actors.length || this.views.size) front.canvas.style.opacity = '1';
            }
          }, toys.gate.fadeOut + 30);
        }
      }
      this.renderViews(r, front, dt);
      if (this.actors.length) {
        const w = front.w;
        const h = front.h;
        this.fxCam.aspect = w / h;
        this.fxCam.position.set(0, 0, h / 2 / Math.tan((15 * Math.PI) / 180));
        this.fxCam.near = 10;
        this.fxCam.far = this.fxCam.position.z * 3;
        this.fxCam.lookAt(0, 0, 0);
        this.fxCam.updateProjectionMatrix();
        this.actors = this.actors.filter((a) => {
          a.t += dt;
          const alive = a.actor.update(a.t);
          if (!alive) {
            this.fx.remove(a.actor.root);
            a.actor.done?.();
          }
          return alive;
        });
        r.setScissorTest(false);
        r.setViewport(0, 0, w, h);
        r.render(this.fx, this.fxCam);
      }
      busy = true;
    } else if (front.canvas.style.opacity !== '0') {
      front.renderer.clear();
      front.canvas.style.opacity = '0';
    }

    if (busy) {
      this.sample(dtMs);
      this.raf = requestAnimationFrame(this.frame);
    }
  };

  private renderViews(r: THREE.WebGLRenderer, layer: Layer, dt: number) {
    if (!this.views.size) return;
    const clip = document.querySelector('.main')?.getBoundingClientRect() ?? {
      top: 0,
      bottom: layer.h,
    };
    const tabbar = document.querySelector('.tabbar')?.getBoundingClientRect();
    const bottom = Math.min(clip.bottom, tabbar ? tabbar.top : layer.h, layer.h);
    const top = Math.max(0, document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0);
    for (const v of this.views.values()) {
      if (!v.el.isConnected) {
        this.views.delete(v.el);
        continue;
      }
      const rect = v.el.getBoundingClientRect();
      if (rect.bottom < top || rect.top > bottom || rect.width < 2) continue;
      // Ease the spin back to a gentle idle turn after a nudge.
      const extra = v.spin;
      v.spin = extra * Math.exp(-dt * 3);
      v.model.rotation.y += dt * 0.6 + (extra - v.spin);
      v.model.position.y = Math.sin(this.clock * 2 + rect.left) * 0.03;
      const sTop = Math.max(rect.top, top);
      const sBottom = Math.min(rect.bottom, bottom);
      const y = layer.h - rect.bottom;
      r.setViewport(rect.left, y, rect.width, rect.height);
      r.setScissor(rect.left, layer.h - sBottom, rect.width, sBottom - sTop);
      r.setScissorTest(true);
      v.camera.aspect = rect.width / rect.height;
      v.camera.updateProjectionMatrix();
      r.render(v.scene, v.camera);
    }
    r.setScissorTest(false);
  }

  private sample(dtMs: number) {
    if (this.budgetSamples.length < 90) {
      this.budgetSamples.push(dtMs);
      if (this.budgetSamples.length === 90)
        this.gov = { ...this.gov, budget: measureBudget(this.budgetSamples) };
      return;
    }
    if (this.mode !== 'auto') return;
    this.samples.push(dtMs);
    if (this.samples.length < 60) return;
    const before = this.gov.tier;
    this.gov = govern(this.gov, this.samples);
    this.samples = [];
    if (this.gov.tier !== before) {
      setPhysical(TIERS[this.gov.tier].physical);
      this.persist();
    }
  }
}
