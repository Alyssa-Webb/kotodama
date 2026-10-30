/**
 * Procedural toy models. Everything is built from rounded primitives at runtime: no model files
 * to download or cache, every shape shares the plastic material and palette, and the chunky
 * "molded toy" proportions stay consistent. Models are about 1 unit tall, centered on x/z, with
 * their base at y = 0; callers scale them.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { PaletteColor } from '../../schema/toys';
import { palette, plastic, plasticClone, type PlasticOptions } from './plastic';

const geos = new Map<string, THREE.BufferGeometry>();
function g<T extends THREE.BufferGeometry>(key: string, make: () => T): T {
  let hit = geos.get(key);
  if (!hit) geos.set(key, (hit = make()));
  return hit as T;
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}

const rbox = (w: number, h: number, d: number, r = 0.04) =>
  g(`rb${w},${h},${d},${r}`, () => new RoundedBoxGeometry(w, h, d, 3, r));
const cyl = (rt: number, rb: number, h: number, seg = 20) =>
  g(`cy${rt},${rb},${h},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
const sphere = (r: number, w = 20, h = 14) =>
  g(`sp${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h));
const P = (c: PaletteColor, o?: PlasticOptions) => plastic(c, o);

/** Tiny seeded RNG so procedural scatter is identical every run. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

/** Canvas texture with a glyph (seal faces, banners). */
const glyphs = new Map<string, THREE.CanvasTexture>();
export function glyphTexture(text: string, fg: string, bg: string | null, border = false) {
  const key = `${text}|${fg}|${bg}|${border}`;
  const hit = glyphs.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  if (bg) {
    x.fillStyle = bg;
    x.fillRect(0, 0, 128, 128);
  }
  if (border) {
    x.strokeStyle = fg;
    x.lineWidth = 10;
    x.strokeRect(10, 10, 108, 108);
  }
  x.fillStyle = fg;
  x.font = `900 ${text.length > 1 ? 52 : 84}px "Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, 64, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  glyphs.set(key, t);
  return t;
}

// ---------- scenery ----------

export function bambooStalk(height: number, seed: number): THREE.Group {
  const r = seeded(seed);
  const grp = new THREE.Group();
  const segs = Math.max(3, Math.round(height / 0.5));
  const segLen = height / segs;
  const radius = 0.055 + r() * 0.025;
  for (let i = 0; i < segs; i++) {
    const shade: PaletteColor = (i + seed) % 3 === 0 ? 'bambooDark' : 'bambooLight';
    grp.add(
      mesh(cyl(radius, radius * 1.05, segLen * 0.96, 12), P(shade), 0, segLen * (i + 0.5), 0),
    );
    grp.add(
      mesh(cyl(radius * 1.25, radius * 1.25, 0.035, 12), P('bambooDark'), 0, segLen * (i + 1), 0),
    );
  }
  const leafGeo = g('leaf', () => {
    const s = new THREE.SphereGeometry(0.5, 10, 6);
    s.scale(0.09, 0.02, 0.42);
    s.translate(0, 0, 0.2);
    return s;
  });
  const leaves = 4 + Math.floor(r() * 4);
  for (let i = 0; i < leaves; i++) {
    const leaf = mesh(leafGeo, P(i % 2 ? 'leaf' : 'leafDeep'), 0, height * (0.62 + r() * 0.36), 0);
    leaf.rotation.set(-0.5 - r() * 0.5, r() * Math.PI * 2, 0);
    grp.add(leaf);
  }
  grp.userData.sway = {
    phase: r() * Math.PI * 2,
    amount: 0.02 + r() * 0.025,
    speed: 0.7 + r() * 0.5,
  };
  return grp;
}

export function bush(seed: number, scale = 1): THREE.Group {
  const r = seeded(seed);
  const grp = new THREE.Group();
  const n = 5 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const s = (0.28 + r() * 0.24) * scale;
    const a = (i / n) * Math.PI * 2 + r();
    const m = mesh(
      sphere(1, 18, 12),
      P(i % 3 === 0 ? 'bushDeep' : i % 3 === 1 ? 'bush' : 'leaf'),
      Math.cos(a) * 0.3 * scale,
      s * 0.8 + r() * 0.2 * scale,
      Math.sin(a) * 0.22 * scale,
    );
    m.scale.setScalar(s);
    grp.add(m);
  }
  const top = mesh(sphere(1, 18, 12), P('bush'), 0, 0.62 * scale, 0);
  top.scale.setScalar(0.36 * scale);
  grp.add(top);
  return grp;
}

export function torii(): THREE.Group {
  const grp = new THREE.Group();
  const red = P('vermilion');
  for (const x of [-0.62, 0.62]) {
    grp.add(mesh(cyl(0.07, 0.085, 1.6), red, x, 0.8, 0));
    grp.add(mesh(cyl(0.11, 0.11, 0.12), P('ink'), x, 0.06, 0));
  }
  grp.add(mesh(rbox(1.5, 0.09, 0.11, 0.03), red, 0, 1.28, 0));
  grp.add(mesh(rbox(1.62, 0.1, 0.15, 0.03), red, 0, 1.55, 0));
  const top = mesh(rbox(1.9, 0.1, 0.2, 0.04), P('ink'), 0, 1.66, 0);
  grp.add(top);
  for (const s of [-1, 1]) {
    const tip = mesh(rbox(0.3, 0.09, 0.2, 0.04), P('ink'), s * 0.98, 1.7, 0);
    tip.rotation.z = s * 0.28;
    grp.add(tip);
  }
  grp.add(mesh(rbox(0.12, 0.2, 0.06, 0.02), P('ink'), 0, 1.42, 0.05));
  return grp;
}

export function stoneLantern(): THREE.Group {
  const grp = new THREE.Group();
  const st = P('stone');
  grp.add(mesh(cyl(0.2, 0.24, 0.12, 6), st, 0, 0.06, 0));
  grp.add(mesh(cyl(0.07, 0.09, 0.42, 12), st, 0, 0.33, 0));
  grp.add(mesh(cyl(0.18, 0.15, 0.08, 6), st, 0, 0.58, 0));
  grp.add(
    mesh(
      rbox(0.2, 0.18, 0.2, 0.02),
      P('lanternGlow', { emissive: 'lanternGlow', emissiveIntensity: 0.6, matte: true }),
      0,
      0.71,
      0,
    ),
  );
  const roof = mesh(cyl(0.02, 0.26, 0.16, 6), st, 0, 0.88, 0);
  grp.add(roof);
  grp.add(mesh(sphere(0.05), st, 0, 0.99, 0));
  return grp;
}

/** Paper chōchin. userData.glow is a private material so each lantern lights on its own. */
export function paperLantern(): THREE.Group {
  const grp = new THREE.Group();
  const glow = plasticClone('vermilion', {
    emissive: 'lanternGlow',
    emissiveIntensity: 0,
    matte: true,
  });
  const body = mesh(sphere(0.5, 22, 16), glow, 0, 0, 0);
  body.scale.set(0.42, 0.52, 0.42);
  grp.add(body);
  for (let i = -2; i <= 2; i++) {
    const rib = mesh(
      g('rib', () => new THREE.TorusGeometry(0.5, 0.012, 6, 28)),
      P('woodDark'),
      0,
      i * 0.08,
      0,
    );
    rib.rotation.x = Math.PI / 2;
    rib.scale.setScalar(0.42 * Math.cos(((i * 0.08) / 0.52) * 1.4));
    grp.add(rib);
  }
  grp.add(mesh(cyl(0.12, 0.12, 0.06), P('ink'), 0, 0.27, 0));
  grp.add(mesh(cyl(0.12, 0.12, 0.06), P('ink'), 0, -0.27, 0));
  grp.add(mesh(cyl(0.008, 0.008, 0.6, 4), P('ink'), 0, 0.6, 0));
  grp.userData.glow = glow;
  return grp;
}

let shoji: THREE.CanvasTexture | null = null;
function shojiTexture(): THREE.CanvasTexture {
  if (!shoji) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const x = c.getContext('2d')!;
    x.fillStyle = palette().paper;
    x.fillRect(0, 0, 256, 128);
    x.strokeStyle = palette().woodDark;
    x.lineWidth = 5;
    for (let i = 0; i <= 8; i++) {
      x.beginPath();
      x.moveTo(i * 32, 0);
      x.lineTo(i * 32, 128);
      x.stroke();
    }
    for (let j = 0; j <= 4; j++) {
      x.beginPath();
      x.moveTo(0, j * 32);
      x.lineTo(256, j * 32);
      x.stroke();
    }
    shoji = new THREE.CanvasTexture(c);
    shoji.colorSpace = THREE.SRGBColorSpace;
  }
  return shoji;
}

export function dojo(): THREE.Group {
  const grp = new THREE.Group();
  grp.add(mesh(rbox(3.3, 0.26, 2.3, 0.06), P('stone'), 0, 0.13, 0));
  grp.add(mesh(rbox(3.0, 0.1, 2.0, 0.03), P('wood'), 0, 0.31, 0));
  for (const x of [-1.4, 1.4])
    for (const z of [-0.9, 0.9]) grp.add(mesh(cyl(0.07, 0.07, 1.25), P('woodDark'), x, 0.95, z));
  const shoji = new THREE.MeshPhysicalMaterial({
    map: shojiTexture(),
    roughness: 0.85,
    emissive: new THREE.Color(palette().lanternGlow),
    emissiveIntensity: 0.12,
  });
  grp.add(mesh(rbox(2.8, 1.1, 0.06, 0.02), shoji, 0, 0.92, -0.9));
  for (const x of [-1.4, 1.4]) {
    const side = mesh(rbox(1.7, 1.1, 0.06, 0.02), shoji, x, 0.92, 0);
    side.rotation.y = Math.PI / 2;
    grp.add(side);
  }
  grp.add(mesh(rbox(3.1, 0.14, 2.1, 0.03), P('woodDark'), 0, 1.6, 0));
  const roof = mesh(cyl(0.35, 2.55, 0.85, 4), P('roof'), 0, 2.08, 0);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(1.15, 1, 0.82);
  grp.add(roof);
  grp.add(mesh(rbox(1.0, 0.12, 0.3, 0.05), P('roof'), 0, 2.55, 0));
  const banner = new THREE.Mesh(
    g('banner', () => new THREE.PlaneGeometry(0.42, 0.62)),
    new THREE.MeshBasicMaterial({ map: glyphTexture('道', palette().ink, palette().paper, false) }),
  );
  banner.position.set(0, 1.18, -0.86);
  grp.add(banner);
  for (let i = 0; i < 3; i++) {
    const step = mesh(
      rbox(0.5, 0.06, 0.32, 0.05),
      P('stone'),
      (i - 1) * 0.12,
      0.03,
      1.4 + i * 0.42,
    );
    step.rotation.y = (i - 1) * 0.3;
    grp.add(step);
  }
  return grp;
}

export function ground(radius: number): THREE.Group {
  const grp = new THREE.Group();
  const disc = mesh(
    g(`gr${radius}`, () => new THREE.CircleGeometry(radius, 48)),
    P('ground', { matte: true }),
    0,
    0,
    0,
  );
  disc.rotation.x = -Math.PI / 2;
  grp.add(disc);
  return grp;
}

// ---------- effect props ----------

export function hanko(): THREE.Group {
  const grp = new THREE.Group();
  const knob = new THREE.LatheGeometry(
    [
      [0, 0],
      [0.3, 0],
      [0.3, 0.12],
      [0.2, 0.2],
      [0.16, 0.5],
      [0.24, 0.72],
      [0.2, 0.86],
      [0, 0.9],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    24,
  );
  grp.add(
    mesh(
      g('hanko-knob', () => knob),
      P('wood'),
      0,
      0.12,
      0,
    ),
  );
  grp.add(mesh(cyl(0.32, 0.32, 0.12, 28), P('vermilion'), 0, 0.06, 0));
  return grp;
}

export function sealDecal(text = '正'): THREE.Mesh {
  const mat = new THREE.MeshBasicMaterial({
    map: glyphTexture(text, palette().vermilion, null, true),
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Mesh(
    g('seal', () => new THREE.PlaneGeometry(1, 1)),
    mat,
  );
}

export function koban(): THREE.Mesh {
  const geo = g('koban', () => {
    const c = new THREE.CylinderGeometry(0.5, 0.5, 0.09, 28);
    c.scale(0.68, 1, 1);
    c.rotateX(Math.PI / 2);
    return c;
  });
  return mesh(geo, P('gold', { metalness: 0.35, roughness: 0.22 }));
}

export function starGeometry(): THREE.BufferGeometry {
  return g('star', () => {
    const s = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.22 : 0.5;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      const fn = i ? 'lineTo' : 'moveTo';
      s[fn](Math.cos(a) * r, Math.sin(a) * r);
    }
    const e = new THREE.ExtrudeGeometry(s, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 4,
      curveSegments: 2,
    });
    e.center();
    return e;
  });
}

export function capsule(top: PaletteColor): { top: THREE.Group; bottom: THREE.Group } {
  const half = g(
    'capsule-half',
    () => new THREE.SphereGeometry(0.5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2),
  );
  const t = new THREE.Group();
  t.add(mesh(half, P(top, { opacity: 0.82 })));
  t.add(mesh(cyl(0.505, 0.505, 0.05, 28), P(top), 0, 0.02, 0));
  const b = new THREE.Group();
  const bm = mesh(half, P('white'));
  bm.rotation.x = Math.PI;
  b.add(bm);
  return { top: t, bottom: b };
}

export const shardGeometry = () => g('shard', () => new THREE.IcosahedronGeometry(0.5, 0));

export function bambooHalves(): [THREE.Mesh, THREE.Mesh] {
  const geo = g('bamboo-half', () => {
    const c = new THREE.CylinderGeometry(0.5, 0.5, 1, 14, 1, false, 0, Math.PI);
    c.rotateZ(Math.PI / 2);
    return c;
  });
  return [mesh(geo, plasticClone('bambooLight')), mesh(geo, plasticClone('bambooLight'))];
}

// ---------- shop items ----------

function kotatsu() {
  const grp = new THREE.Group();
  grp.add(mesh(rbox(1.1, 0.32, 1.1, 0.14), P('vermilion'), 0, 0.2, 0));
  grp.add(mesh(rbox(1.2, 0.08, 1.2, 0.03), P('wood'), 0, 0.42, 0));
  const mikan = mesh(sphere(0.12), P('gold', { roughness: 0.5 }), 0.2, 0.55, 0.1);
  grp.add(mikan, mesh(sphere(0.1), P('gold', { roughness: 0.5 }), -0.1, 0.54, -0.15));
  return grp;
}

function bowl(goldSeams: boolean) {
  const grp = new THREE.Group();
  const lathe = g(
    'bowl',
    () =>
      new THREE.LatheGeometry(
        [
          [0, 0],
          [0.18, 0],
          [0.2, 0.05],
          [0.42, 0.3],
          [0.52, 0.5],
          [0.48, 0.52],
          [0.38, 0.33],
          [0, 0.12],
        ].map(([x, y]) => new THREE.Vector2(x, y)),
        32,
      ),
  );
  grp.add(mesh(lathe, P('indigo', { side: THREE.DoubleSide })));
  if (goldSeams)
    for (let i = 0; i < 3; i++) {
      const seam = mesh(
        g('seam', () => new THREE.TorusGeometry(0.47, 0.018, 6, 40, Math.PI * 0.55)),
        P('gold', { metalness: 0.6, roughness: 0.2, emissive: 'gold', emissiveIntensity: 0.25 }),
        0,
        0.3,
        0,
      );
      seam.rotation.set(Math.PI / 2 + 0.5 - i * 0.4, 0, i * 2.1);
      grp.add(seam);
    }
  return grp;
}

function onigiri() {
  const grp = new THREE.Group();
  const geo = g('onigiri', () => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.5);
    s.quadraticCurveTo(0.08, 0.58, 0.16, 0.48);
    s.lineTo(0.48, -0.1);
    s.quadraticCurveTo(0.56, -0.3, 0.36, -0.32);
    s.lineTo(-0.36, -0.32);
    s.quadraticCurveTo(-0.56, -0.3, -0.48, -0.1);
    s.lineTo(-0.16, 0.48);
    s.quadraticCurveTo(-0.08, 0.58, 0, 0.5);
    const e = new THREE.ExtrudeGeometry(s, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSize: 0.1,
      bevelThickness: 0.1,
      bevelSegments: 5,
    });
    e.center();
    return e;
  });
  grp.add(mesh(geo, P('white'), 0, 0.45, 0));
  grp.add(mesh(rbox(0.42, 0.3, 0.46, 0.04), P('ink', { roughness: 0.6 }), 0, 0.22, 0));
  return grp;
}

function taiko() {
  const grp = new THREE.Group();
  const body = new THREE.LatheGeometry(
    [
      [0.36, 0],
      [0.46, 0.2],
      [0.48, 0.35],
      [0.46, 0.5],
      [0.36, 0.7],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    28,
  );
  grp.add(
    mesh(
      g('taiko', () => body),
      P('woodDark'),
      0,
      0.05,
      0,
    ),
  );
  grp.add(mesh(cyl(0.4, 0.4, 0.04, 28), P('paper'), 0, 0.77, 0));
  grp.add(mesh(cyl(0.4, 0.4, 0.04, 28), P('paper'), 0, 0.03, 0));
  const tomoe = new THREE.Mesh(
    g('tomoe', () => new THREE.CircleGeometry(0.3, 28)),
    new THREE.MeshBasicMaterial({
      map: glyphTexture('祭', palette().vermilion, palette().paper),
      transparent: false,
    }),
  );
  tomoe.rotation.x = -Math.PI / 2;
  tomoe.position.y = 0.795;
  grp.add(tomoe);
  for (const s of [-1, 1]) {
    const stick = mesh(cyl(0.025, 0.035, 0.6, 8), P('wood'), s * 0.22, 1.0, 0);
    stick.rotation.z = s * 0.8;
    grp.add(stick, mesh(sphere(0.05), P('wood'), s * 0.45, 1.2, 0));
  }
  return grp;
}

function maneki() {
  const grp = new THREE.Group();
  const w = P('white');
  const body = mesh(sphere(0.5), w, 0, 0.34, 0);
  body.scale.set(0.72, 0.68, 0.62);
  grp.add(body);
  grp.add(mesh(sphere(0.3), w, 0, 0.86, 0));
  for (const s of [-1, 1]) {
    const ear = mesh(
      g('ear', () => new THREE.ConeGeometry(0.1, 0.18, 12)),
      w,
      s * 0.17,
      1.12,
      0,
    );
    ear.rotation.z = -s * 0.3;
    grp.add(ear, mesh(sphere(0.045), P('ink'), s * 0.1, 0.9, 0.27));
  }
  grp.add(mesh(sphere(0.04), P('sakura'), 0, 0.82, 0.3));
  const paw = mesh(sphere(0.11), w, 0.3, 0.95, 0.1);
  paw.scale.set(1, 1.5, 1);
  grp.add(paw);
  grp.add(
    mesh(
      g('collar', () => new THREE.TorusGeometry(0.2, 0.035, 8, 24)),
      P('vermilion'),
      0,
      0.64,
      0.04,
    ),
  );
  grp.add(mesh(sphere(0.07), P('gold', { metalness: 0.4 }), 0, 0.58, 0.24));
  const coin = mesh(
    koban().geometry,
    P('gold', { metalness: 0.35, roughness: 0.22 }),
    -0.16,
    0.36,
    0.34,
  );
  coin.scale.setScalar(0.35);
  grp.add(coin);
  return grp;
}

function daruma() {
  const grp = new THREE.Group();
  const body = mesh(sphere(0.5, 28, 20), P('vermilion'), 0, 0.48, 0);
  body.scale.set(0.9, 0.98, 0.86);
  grp.add(body);
  const face = mesh(sphere(0.5, 24, 16), P('paper'), 0, 0.56, 0.2);
  face.scale.set(0.56, 0.48, 0.3);
  grp.add(face);
  for (const s of [-1, 1]) {
    grp.add(mesh(sphere(0.075), P('white'), s * 0.12, 0.6, 0.33));
    grp.add(mesh(sphere(0.04), P('ink'), s * 0.12, 0.6, 0.39));
  }
  grp.add(mesh(rbox(0.28, 0.06, 0.06, 0.03), P('gold'), 0, 0.3, 0.42));
  return grp;
}

function sunadokei() {
  const grp = new THREE.Group();
  for (const y of [0.04, 1.0]) grp.add(mesh(cyl(0.34, 0.34, 0.08, 24), P('woodDark'), 0, y, 0));
  for (const a of [0, 1, 2]) {
    const ang = (a / 3) * Math.PI * 2;
    grp.add(
      mesh(cyl(0.025, 0.025, 0.92, 8), P('wood'), Math.cos(ang) * 0.29, 0.52, Math.sin(ang) * 0.29),
    );
  }
  const glass = new THREE.LatheGeometry(
    [
      [0.01, 0.08],
      [0.24, 0.12],
      [0.24, 0.3],
      [0.04, 0.52],
      [0.24, 0.74],
      [0.24, 0.92],
      [0.01, 0.96],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    24,
  );
  grp.add(
    mesh(
      g('glass', () => glass),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.2,
        transparent: true,
        opacity: 0.35,
      }),
    ),
  );
  grp.add(
    mesh(
      g('sand', () => new THREE.ConeGeometry(0.2, 0.2, 20)),
      P('gold', { roughness: 0.7 }),
      0,
      0.2,
      0,
    ),
  );
  return grp;
}

function omamori(color: PaletteColor, glyph: string) {
  const grp = new THREE.Group();
  grp.add(mesh(rbox(0.56, 0.78, 0.14, 0.1), P(color), 0, 0.45, 0));
  const label = new THREE.Mesh(
    g('omamori-label', () => new THREE.PlaneGeometry(0.3, 0.42)),
    new THREE.MeshBasicMaterial({
      map: glyphTexture(glyph, palette().gold, palette().white),
      transparent: false,
    }),
  );
  label.position.set(0, 0.42, 0.075);
  grp.add(label);
  const knot = mesh(
    g('knot', () => new THREE.TorusKnotGeometry(0.06, 0.02, 32, 6)),
    P('gold'),
    0,
    0.92,
    0,
  );
  grp.add(knot);
  return grp;
}

function ema() {
  const grp = new THREE.Group();
  const geo = g('ema', () => {
    const s = new THREE.Shape();
    s.moveTo(-0.5, -0.32);
    s.lineTo(0.5, -0.32);
    s.lineTo(0.5, 0.16);
    s.lineTo(0, 0.4);
    s.lineTo(-0.5, 0.16);
    s.lineTo(-0.5, -0.32);
    const e = new THREE.ExtrudeGeometry(s, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSize: 0.04,
      bevelThickness: 0.03,
      bevelSegments: 3,
    });
    e.center();
    return e;
  });
  grp.add(mesh(geo, P('wood'), 0, 0.45, 0));
  const face = new THREE.Mesh(
    g('ema-face', () => new THREE.PlaneGeometry(0.5, 0.36)),
    new THREE.MeshBasicMaterial({ map: glyphTexture('願', palette().ink, palette().wood) }),
  );
  face.position.set(0, 0.42, 0.075);
  grp.add(face);
  grp.add(
    mesh(
      g('ema-cord', () => new THREE.TorusGeometry(0.12, 0.015, 6, 20, Math.PI)),
      P('vermilion'),
      0,
      0.85,
      0,
    ),
  );
  return grp;
}

function fude() {
  const grp = new THREE.Group();
  const brush = new THREE.Group();
  brush.add(mesh(cyl(0.05, 0.05, 0.9, 12), P('woodDark'), 0, 0.55, 0));
  brush.add(mesh(cyl(0.065, 0.065, 0.08, 12), P('gold'), 0, 0.12, 0));
  const tip = mesh(
    g('fude-tip', () => new THREE.ConeGeometry(0.07, 0.22, 14)),
    P('ink', { roughness: 0.6 }),
    0,
    0,
    0,
  );
  tip.rotation.x = Math.PI;
  brush.add(tip);
  brush.rotation.z = 0.5;
  brush.position.set(0.1, 0.12, 0);
  grp.add(brush);
  return grp;
}

function ear() {
  const grp = new THREE.Group();
  const outer = mesh(
    g('mimi', () => new THREE.TorusGeometry(0.28, 0.1, 12, 28, Math.PI * 1.5)),
    P('sakura'),
    0,
    0.5,
    0,
  );
  outer.rotation.z = -Math.PI / 4;
  grp.add(outer, mesh(sphere(0.12), P('sakura'), 0.02, 0.48, 0));
  return grp;
}

const ITEMS: Record<string, () => THREE.Group> = {
  kotatsu,
  kintsugi: () => bowl(true),
  chochin: () => {
    const l = paperLantern();
    (l.userData.glow as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.7;
    l.position.y = 0.5;
    const grp = new THREE.Group();
    grp.add(l);
    return grp;
  },
  onigiri,
  taiko,
  maneki,
  daruma,
  sunadokei,
  omamori: () => omamori('vermilion', '守'),
  ema,
  gakugyo: () => omamori('indigo', '学'),
  goukaku: () => omamori('matcha', '合'),
  mimi: ear,
  fude,
};

/** A shop item as a toy. Unknown ids (new items from data) fall back to an omamori. */
export function itemModel(id: string): THREE.Group {
  return (ITEMS[id] ?? (() => omamori('gold', '福')))();
}

export function hasItemModel(id: string): boolean {
  return id in ITEMS;
}
