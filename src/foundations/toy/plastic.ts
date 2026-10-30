/**
 * The shared "lacquer toy" plastic: saturated base color, glossy clearcoat, soft roughness and a
 * procedural studio environment for reflections (RoomEnvironment: no texture download). Every
 * model paints with palette names from design/toys.json, so light/dark and future art direction
 * swap colors in place without recompiling a single shader.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { PaletteColor, ToyPalette } from '../../schema/toys';
import { toys } from '../world';

export type PaletteMode = 'light' | 'dark';

interface Entry {
  mat: THREE.MeshPhysicalMaterial;
  color: PaletteColor;
  emissive: PaletteColor | undefined;
}

const cache = new Map<string, Entry>();
let mode: PaletteMode = 'light';
let physical = true;

export function palette(): ToyPalette {
  return toys.palette[mode];
}

export function paletteColor(c: PaletteColor): THREE.Color {
  return new THREE.Color(palette()[c]);
}

export interface PlasticOptions {
  emissive?: PaletteColor;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  opacity?: number;
  /** Paper, glass: lets light through and skips the clearcoat. */
  matte?: boolean;
  side?: THREE.Side;
}

export function plastic(c: PaletteColor, o: PlasticOptions = {}): THREE.MeshPhysicalMaterial {
  const key = `${c}|${JSON.stringify(o)}`;
  const hit = cache.get(key);
  if (hit) return hit.mat;
  const p = toys.plastic;
  const mat = new THREE.MeshPhysicalMaterial({
    color: palette()[c],
    roughness: o.roughness ?? (o.matte ? 0.8 : p.roughness),
    metalness: o.metalness ?? 0,
    clearcoat: physical && !o.matte ? p.clearcoat : 0,
    clearcoatRoughness: p.clearcoatRoughness,
    envMapIntensity: p.envIntensity,
    side: o.side ?? THREE.FrontSide,
  });
  if (o.emissive) {
    mat.emissive.set(palette()[o.emissive]);
    mat.emissiveIntensity = o.emissiveIntensity ?? 1;
  }
  if (o.opacity !== undefined) {
    mat.transparent = true;
    mat.opacity = o.opacity;
    mat.depthWrite = o.opacity > 0.9;
  }
  cache.set(key, { mat, color: c, emissive: o.emissive });
  return mat;
}

/** A private copy for effects that animate opacity or emissive per instance. */
export function plasticClone(c: PaletteColor, o: PlasticOptions = {}): THREE.MeshPhysicalMaterial {
  const m = plastic(c, o).clone();
  m.transparent = true;
  return m;
}

export function setPaletteMode(m: PaletteMode) {
  if (m === mode) return;
  mode = m;
  for (const e of cache.values()) {
    e.mat.color.set(palette()[e.color]);
    if (e.emissive) e.mat.emissive.set(palette()[e.emissive]);
  }
}

export function paletteMode(): PaletteMode {
  return mode;
}

/**
 * Physical clearcoat on high tiers, plain standard shading below. Crossing clearcoat 0 makes
 * three.js pick a cheaper shader program, so this is the tier switch for every material.
 */
export function setPhysical(on: boolean) {
  if (on === physical) return;
  physical = on;
  for (const e of cache.values()) {
    if (e.mat.roughness < 0.75) e.mat.clearcoat = on ? toys.plastic.clearcoat : 0;
  }
}

let env: THREE.Texture | null = null;
/** Studio reflections generated once on the GPU (about 2 ms), shared by every scene. */
export function environment(renderer: THREE.WebGLRenderer): THREE.Texture {
  if (env) return env;
  const pmrem = new THREE.PMREMGenerator(renderer);
  env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return env;
}

/** Soft round contact shadow (a gradient texture, cheaper and cuter than shadow maps). */
let shadowTex: THREE.CanvasTexture | null = null;
export function blobShadow(size = 1, strength = 0.32): THREE.Mesh {
  if (!shadowTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.45)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    shadowTex = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: strength,
      depthWrite: false,
      color: 0x000000,
    }),
  );
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = -1;
  return m;
}
