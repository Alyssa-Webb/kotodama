/**
 * The three training worlds (bamboo grove, shrine, dojo) as toy dioramas. Built from a seed so
 * the gate's copy and the backdrop's copy are identical: the gate camera flies in and lands on
 * exactly the frame the backdrop shows, which is what makes the hand-off invisible.
 */
import * as THREE from 'three';
import type { ToyScene } from '../../schema/toys';
import {
  bambooStalk,
  bush,
  dojo,
  ground,
  paperLantern,
  seeded,
  stoneLantern,
  torii,
} from './models';
import { blobShadow, palette, paletteMode } from './plastic';

export interface CameraPose {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

export interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rest: CameraPose;
  lanterns: THREE.MeshPhysicalMaterial[];
  /** Ambient life: swaying bamboo, bobbing lanterns, drifting fireflies. */
  update(t: number): void;
  /** Gate-only props (bushes, fog) live here so the backdrop copy can skip them. */
  gate: THREE.Group;
}

function skyTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const x = c.getContext('2d')!;
  const grad = x.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, palette().skyTop);
  grad.addColorStop(0.75, palette().skyBottom);
  grad.addColorStop(1, palette().fog);
  x.fillStyle = grad;
  x.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function lights(scene: THREE.Scene) {
  const p = palette();
  const night = paletteMode() === 'dark';
  scene.add(new THREE.HemisphereLight(p.skyBottom, p.groundEdge, night ? 0.9 : 1.5));
  const key = new THREE.DirectionalLight(night ? '#b9c4ff' : '#fff1dc', night ? 1.1 : 2.4);
  key.position.set(-4, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(p.lanternGlow, night ? 1.2 : 0.8);
  rim.position.set(3, 3, -6);
  scene.add(rim);
}

/** Fireflies / pollen: one Points draw call. */
function motes(count: number, seed: number): THREE.Points {
  const r = seeded(seed);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (r() - 0.5) * 8;
    pos[i * 3 + 1] = 0.3 + r() * 2.6;
    pos[i * 3 + 2] = (r() - 0.5) * 6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: paletteMode() === 'dark' ? palette().lanternGlow : palette().white,
    size: paletteMode() === 'dark' ? 0.07 : 0.045,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

function lanternString(
  scene: THREE.Group,
  y: number,
  z: number,
  span: number,
  n: number,
  out: THREE.MeshPhysicalMaterial[],
) {
  for (let i = 0; i < n; i++) {
    const l = paperLantern();
    const x = -span / 2 + (span * i) / (n - 1);
    l.position.set(x, y - Math.sin((i / (n - 1)) * Math.PI) * 0.18, z);
    l.scale.setScalar(0.5);
    l.userData.bob = i;
    scene.add(l);
    out.push(l.userData.glow as THREE.MeshPhysicalMaterial);
  }
}

export function buildWorld(kind: ToyScene, opts: { particles: number }): World {
  const scene = new THREE.Scene();
  scene.background = skyTexture();
  scene.fog = new THREE.Fog(palette().fog, 7, 19);
  lights(scene);
  const root = new THREE.Group();
  scene.add(root);
  root.add(ground(16));
  const r = seeded(kind === 'grove' ? 11 : kind === 'shrine' ? 23 : 37);
  const stalks: THREE.Group[] = [];
  const lanterns: THREE.MeshPhysicalMaterial[] = [];
  const bobbing: THREE.Object3D[] = [];

  // Bamboo everywhere except a clearing down the middle (where the camera flies in).
  const density = kind === 'grove' ? 70 : kind === 'shrine' ? 46 : 34;
  for (let i = 0; i < density; i++) {
    const x = (r() - 0.5) * 16;
    const z = -9 + r() * 13;
    const clearing = Math.abs(x) < (kind === 'dojo' ? 2.4 : 1.5) + Math.max(0, z + 2) * 0.25;
    if (clearing && z > -6) continue;
    const s = bambooStalk(2.6 + r() * 2.6, i + 1);
    s.position.set(x, 0, z);
    root.add(s);
    stalks.push(s);
  }

  if (kind === 'dojo') {
    const d = dojo();
    d.position.set(0, 0, -2.6);
    root.add(d);
    const sh = blobShadow(4.6, 0.25);
    sh.position.set(0, 0.01, -2.4);
    root.add(sh);
    lanternString(root, 1.48, -1.45, 2.6, 5, lanterns);
  } else {
    const t = torii();
    t.position.set(0, 0, kind === 'shrine' ? -1.6 : -4.2);
    t.scale.setScalar(kind === 'shrine' ? 1.3 : 1.05);
    root.add(t);
    if (kind === 'shrine') {
      lanternString(root, 1.95, -1.55, 1.4, 3, lanterns);
      const t2 = torii();
      t2.position.set(0, 0, -4.6);
      root.add(t2);
    } else {
      lanternString(root, 2.4, -1.2, 3.2, 5, lanterns);
    }
  }
  for (const s of [-1, 1]) {
    for (let k = 0; k < (kind === 'shrine' ? 3 : 2); k++) {
      const l = stoneLantern();
      l.position.set(s * (1.15 + k * 0.1), 0, 0.8 - k * 1.6);
      l.scale.setScalar(0.85);
      root.add(l);
      const sh = blobShadow(0.7, 0.3);
      sh.position.set(l.position.x, 0.01, l.position.z);
      root.add(sh);
    }
  }
  // Soft bushes framing the clearing.
  for (let i = 0; i < 8; i++) {
    const b = bush(100 + i, 0.9 + r() * 0.5);
    const s = i % 2 ? 1 : -1;
    b.position.set(s * (2.0 + r() * 1.6), 0, 1.2 - i * 0.9);
    root.add(b);
  }
  root.traverse((o) => {
    if (o.userData.bob !== undefined) bobbing.push(o);
  });

  const fireflies = motes(Math.round(60 * opts.particles), 5);
  root.add(fireflies);

  // Gate props: a wall of bushes the camera pushes through.
  const gate = new THREE.Group();
  const wall: { obj: THREE.Group; side: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const side = i < 3 ? -1 : i > 3 ? 1 : i % 2 ? 1 : -1;
    const b = bush(300 + i, 1.5 + r() * 0.6);
    b.position.set((i - 3) * 0.75, -0.1, 7.2 + r() * 0.5);
    b.userData.home = b.position.clone();
    gate.add(b);
    wall.push({ obj: b, side });
  }
  for (let i = 0; i < 4; i++) {
    const b = bush(400 + i, 1.2);
    b.position.set((i - 1.5) * 1.3, 0.5 + r() * 0.4, 8.4);
    b.userData.home = b.position.clone();
    gate.add(b);
    wall.push({ obj: b, side: i < 2 ? -1 : 1 });
  }
  gate.userData.wall = wall;
  scene.add(gate);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 60);
  const rest: CameraPose = {
    pos: new THREE.Vector3(0, 1.35, 5.4),
    look: new THREE.Vector3(0, 1.2, -1),
  };
  camera.position.copy(rest.pos);
  camera.lookAt(rest.look);

  const motePos = fireflies.geometry.getAttribute('position') as THREE.BufferAttribute;
  const base = Float32Array.from(motePos.array as Float32Array);
  return {
    scene,
    camera,
    rest,
    lanterns,
    gate,
    update(t) {
      for (const s of stalks) {
        const w = s.userData.sway as { phase: number; amount: number; speed: number };
        s.rotation.z = Math.sin(t * w.speed + w.phase) * w.amount;
        s.rotation.x = Math.cos(t * w.speed * 0.8 + w.phase) * w.amount * 0.6;
      }
      for (const b of bobbing) b.rotation.z = Math.sin(t * 1.3 + (b.userData.bob as number)) * 0.06;
      const a = motePos.array as Float32Array;
      for (let i = 0; i < a.length; i += 3) {
        a[i] = base[i]! + Math.sin(t * 0.4 + i) * 0.25;
        a[i + 1] = base[i + 1]! + Math.sin(t * 0.7 + i * 0.3) * 0.15;
      }
      motePos.needsUpdate = true;
    },
  };
}
