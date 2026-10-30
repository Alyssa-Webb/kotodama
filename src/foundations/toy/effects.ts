/**
 * One-shot toy effects in screen space: 1 world unit = 1 CSS pixel on the z = 0 plane, so an
 * effect fired at an element's center lands exactly on it, with real perspective depth around it.
 * Each actor owns its objects and reports when it is finished; the stage disposes nothing shared.
 */
import * as THREE from 'three';
import type { ToyEffect } from '../../schema/theme';
import {
  bambooHalves,
  capsule,
  hanko,
  itemModel,
  koban,
  paperLantern,
  sealDecal,
  seeded,
  shardGeometry,
  starGeometry,
} from './models';
import { palette, plastic, plasticClone } from './plastic';
import { easeInCubic, easeOutCubic, span, spring, squash } from './motion';

export interface Actor {
  /** Advance to `t` seconds since start; return false when finished. */
  update(t: number): boolean;
  root: THREE.Object3D;
  /** Optional: wait for a tap (capsule). */
  onTap?(): void;
  done?: () => void;
}

export interface FxSpace {
  /** Screen px → world position on the z = 0 plane. */
  at(x: number, y: number): THREE.Vector3;
  width: number;
  height: number;
  particles: number;
}

const GRAVITY = 2600; // px/s²

/** The hanko seal slams onto the answer and leaves its red impression. */
function stamp(sp: FxSpace, x: number, y: number): Actor {
  const root = new THREE.Group();
  const p = sp.at(x, y);
  const h = hanko();
  h.scale.setScalar(70);
  h.rotation.x = Math.PI / 2; // face toward the screen
  const decal = sealDecal();
  decal.scale.setScalar(64);
  decal.position.set(p.x, p.y, 1);
  const decalMat = decal.material as THREE.MeshBasicMaterial;
  decalMat.opacity = 0;
  root.add(h, decal);
  return {
    root,
    update(t) {
      const down = 0.11;
      if (t < down) {
        const k = easeInCubic(t / down);
        h.position.set(p.x + 30 * (1 - k), p.y + 40 * (1 - k), 420 * (1 - k) + 6);
        h.rotation.z = -0.5 * (1 - k);
      } else {
        const s = squash((t - down) / 0.35, 0.45);
        h.scale.set(70 * s.xz, 70 * s.y, 70 * s.xz);
        const lift = easeOutCubic(span(t, 0.2, 0.55));
        h.position.set(p.x, p.y + lift * 30, 6 + lift * 520);
        h.rotation.z = lift * 0.6;
        decalMat.opacity = Math.min(1, (t - down) * 14) * (1 - span(t, 0.9, 1.25));
        const pop = 1 + 0.25 * (1 - spring((t - down) / 0.4, 0.5));
        decal.scale.setScalar(64 * pop);
      }
      return t < 1.25;
    },
  };
}

/** A bamboo segment snaps in two and tumbles away: firm, not punishing. */
function crack(sp: FxSpace, x: number, y: number): Actor {
  const root = new THREE.Group();
  const p = sp.at(x, y);
  const halves = bambooHalves();
  halves.forEach((m, i) => {
    m.scale.set(150, 34, 34);
    m.rotation.x = i ? Math.PI : 0;
    m.position.set(p.x, p.y, 40);
    root.add(m);
  });
  return {
    root,
    update(t) {
      const appear = spring(t / 0.25, 0.3);
      halves.forEach((m, i) => {
        const s = i ? 1 : -1;
        const fall = Math.max(0, t - 0.22);
        m.position.set(p.x + s * fall * 160, p.y - 0.25 * GRAVITY * fall * fall, 40 + fall * 60);
        m.rotation.z = s * fall * 3;
        m.scale.set(150 * appear, 34 * appear, 34 * appear);
        (m.material as THREE.MeshPhysicalMaterial).opacity = 1 - span(t, 0.55, 0.85);
      });
      return t < 0.85;
    },
  };
}

/** Paper lanterns drop in on strings across the top and light up one by one. */
function lanterns(sp: FxSpace): Actor {
  const root = new THREE.Group();
  const n = 5;
  const ls = Array.from({ length: n }, (_, i) => {
    const l = paperLantern();
    l.scale.setScalar(Math.min(70, sp.width / 7));
    root.add(l);
    return { l, x: (sp.width * (i + 0.5)) / n, delay: i * 0.06 };
  });
  return {
    root,
    update(t) {
      for (const { l, x, delay } of ls) {
        const k = spring((t - delay) / 0.6, 0.5);
        const exit = easeInCubic(span(t, 1.3, 1.7));
        const p = sp.at(x, -80 + k * 150 - exit * 260);
        l.position.set(p.x, p.y, 0);
        l.rotation.z = Math.sin((t - delay) * 7) * 0.25 * Math.exp(-(t - delay) * 2);
        (l.userData.glow as THREE.MeshPhysicalMaterial).emissiveIntensity =
          span(t, 0.25 + delay * 2, 0.4 + delay * 2) * 1.2;
      }
      return t < 1.7;
    },
  };
}

/** Hanabi: additive point bursts with gravity and fade, one draw call per burst. */
function hanabi(sp: FxSpace): Actor {
  const root = new THREE.Group();
  const r = seeded(Math.floor(performance.now()));
  const colors = [
    palette().gold,
    palette().vermilion,
    palette().sakura,
    palette().white,
    palette().matcha,
  ];
  const bursts = Array.from({ length: 3 }, (_, b) => {
    const count = Math.round(140 * sp.particles);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const c = sp.at(
      sp.width * (0.25 + 0.25 * b + (r() - 0.5) * 0.1),
      sp.height * (0.2 + r() * 0.15),
    );
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const e = Math.acos(2 * r() - 1);
      const s = 380 + r() * 160;
      vel[i * 3] = Math.cos(a) * Math.sin(e) * s;
      vel[i * 3 + 1] = Math.sin(a) * Math.sin(e) * s;
      vel[i * 3 + 2] = Math.cos(e) * s * 0.4;
      pos[i * 3] = c.x;
      pos[i * 3 + 1] = c.y;
      pos[i * 3 + 2] = 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: colors[(b * 2 + 1) % colors.length]!,
      size: 9,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.visible = false;
    root.add(pts);
    return { pts, mat, base: c, vel, delay: b * 0.28 };
  });
  return {
    root,
    update(t) {
      let alive = false;
      for (const b of bursts) {
        const lt = t - b.delay;
        if (lt < 0) {
          alive = true;
          continue;
        }
        b.pts.visible = true;
        const a = b.pts.geometry.getAttribute('position') as THREE.BufferAttribute;
        const arr = a.array as Float32Array;
        const drag = (1 - Math.exp(-2.2 * lt)) / 2.2;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i] = b.base.x + b.vel[i]! * drag;
          arr[i + 1] = b.base.y + b.vel[i + 1]! * drag - 0.5 * 260 * lt * lt;
          arr[i + 2] = b.vel[i + 2]! * drag;
        }
        a.needsUpdate = true;
        b.mat.opacity = 1 - span(lt, 0.7, 1.4);
        b.mat.size = 9 * (1 - span(lt, 0.4, 1.4) * 0.6);
        if (lt < 1.4) alive = true;
      }
      return alive;
    },
  };
}

/** Koban coins burst from a point, spin, bounce once off the bottom of the screen and fade. */
function coins(sp: FxSpace, x: number, y: number): Actor {
  const count = Math.round(22 * sp.particles);
  const coin = koban();
  const mat = plasticClone('gold', { metalness: 0.35, roughness: 0.22 });
  const inst = new THREE.InstancedMesh(coin.geometry, mat, count);
  inst.frustumCulled = false;
  const r = seeded(Math.floor(x * 7 + y));
  const p = sp.at(x, y);
  const floor = sp.at(0, sp.height + 20).y;
  const parts = Array.from({ length: count }, () => ({
    vx: (r() - 0.5) * 900,
    vy: 500 + r() * 700,
    vz: r() * 300,
    spin: (r() - 0.5) * 20,
    delay: r() * 0.12,
  }));
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  return {
    root: inst,
    update(t) {
      parts.forEach((c, i) => {
        const lt = Math.max(0, t - c.delay);
        let py = p.y + c.vy * lt - 0.5 * GRAVITY * lt * lt;
        if (py < floor) py = floor + (floor - py) * 0.25;
        pos.set(p.x + c.vx * lt, py, c.vz * lt);
        e.set(c.spin * lt, c.spin * lt * 0.6, 0);
        q.setFromEuler(e);
        const s = 34 * spring(lt / 0.2, 0.4);
        scl.set(s, s, s);
        m.compose(pos, q, scl);
        inst.setMatrixAt(i, m);
      });
      inst.instanceMatrix.needsUpdate = true;
      mat.opacity = 1 - span(t, 1.0, 1.4);
      return t < 1.4;
    },
  };
}

/** Chunky plastic shards explode outward (boss defeat). */
function shatter(sp: FxSpace, x: number, y: number): Actor {
  const count = Math.round(40 * sp.particles);
  const mat = plasticClone('ink');
  const inst = new THREE.InstancedMesh(shardGeometry(), mat, count);
  inst.frustumCulled = false;
  const r = seeded(Math.floor(x + y * 3));
  const p = sp.at(x, y);
  const parts = Array.from({ length: count }, () => {
    const a = r() * Math.PI * 2;
    const s = 300 + r() * 900;
    return {
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s + 300,
      vz: (r() - 0.3) * 600,
      size: 14 + r() * 26,
      spin: (r() - 0.5) * 16,
    };
  });
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  return {
    root: inst,
    update(t) {
      parts.forEach((c, i) => {
        pos.set(p.x + c.vx * t, p.y + c.vy * t - 0.5 * GRAVITY * t * t, c.vz * t);
        e.set(c.spin * t, c.spin * t * 0.7, c.spin * t * 0.3);
        q.setFromEuler(e);
        scl.setScalar(c.size * (1 - span(t, 0.6, 1.1)));
        m.compose(pos, q, scl);
        inst.setMatrixAt(i, m);
      });
      inst.instanceMatrix.needsUpdate = true;
      return t < 1.1;
    },
  };
}

/** A chunky gold star pops onto a results star. */
function star(sp: FxSpace, x: number, y: number): Actor {
  const mesh = new THREE.Mesh(
    starGeometry(),
    plastic('gold', { metalness: 0.25, roughness: 0.2, emissive: 'gold', emissiveIntensity: 0.15 }),
  );
  const p = sp.at(x, y);
  return {
    root: mesh,
    update(t) {
      const k = spring(t / 0.55, 0.55);
      mesh.position.set(p.x, p.y + (1 - k) * 60, 30);
      mesh.scale.setScalar(58 * k * (1 - span(t, 0.9, 1.1)));
      mesh.rotation.y = (1 - easeOutCubic(t / 0.6)) * Math.PI * 2;
      return t < 1.1;
    },
  };
}

export function effectActor(effect: ToyEffect, sp: FxSpace, x: number, y: number): Actor | null {
  switch (effect) {
    case 'stamp':
      return stamp(sp, x, y);
    case 'crack':
      return crack(sp, x, y);
    case 'lanterns':
      return lanterns(sp);
    case 'hanabi':
      return hanabi(sp);
    case 'coins':
      return coins(sp, x, y);
    case 'shatter':
      return shatter(sp, x, y);
    case 'stars':
      return star(sp, x, y);
    case 'none':
      return null;
  }
}

/** Purchase: the item leaps out of its card, spins under a spotlight glint, and settles back. */
export function revealActor(sp: FxSpace, itemId: string, x: number, y: number): Actor {
  const root = new THREE.Group();
  const model = itemModel(itemId);
  root.add(model);
  const from = sp.at(x, y);
  const center = sp.at(sp.width / 2, sp.height * 0.42);
  const size = Math.min(sp.width, sp.height) * 0.34;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.03, 8, 48),
    plasticClone('gold', { emissive: 'gold', emissiveIntensity: 0.8 }),
  );
  root.add(ring);
  return {
    root,
    update(t) {
      const up = spring(t / 0.55, 0.45);
      const back = easeInCubic(span(t, 1.15, 1.45));
      model.position.set(
        from.x + (center.x - from.x) * up * (1 - back),
        from.y + (center.y - from.y) * up * (1 - back) - size * 0.4,
        120 * up * (1 - back),
      );
      model.scale.setScalar(size * (0.3 + 0.7 * up) * (1 - back * 0.8));
      model.rotation.y = t * 5 * (1 - span(t, 0.3, 1.0)) + Math.sin(t * 2) * 0.3;
      const rk = span(t, 0.2, 0.9);
      ring.position.set(model.position.x, model.position.y + size * 0.45, model.position.z - 20);
      ring.scale.setScalar(size * (0.4 + rk * 0.9));
      (ring.material as THREE.MeshPhysicalMaterial).opacity = (1 - rk) * (t > 0.2 ? 1 : 0);
      return t < 1.45;
    },
  };
}

/**
 * Gachapon: a capsule drops and bounces, wobbles with anticipation, then (on tap, or by itself
 * after a moment) pops open in a burst of rarity-colored light.
 */
export function capsuleActor(
  sp: FxSpace,
  rarity: 'common' | 'rare' | 'legendary',
  onOpen: () => void,
): Actor {
  const root = new THREE.Group();
  const tint = rarity === 'legendary' ? 'gold' : rarity === 'rare' ? 'indigo' : 'vermilion';
  const { top, bottom } = capsule(tint);
  const cap = new THREE.Group();
  cap.add(top, bottom);
  root.add(cap);
  const size = Math.min(sp.width, sp.height) * 0.3;
  const c = sp.at(sp.width / 2, sp.height * 0.45);
  const floorY = c.y - size * 0.1;
  const beams = new THREE.Group();
  const beamMat = new THREE.MeshBasicMaterial({
    color: palette()[tint],
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const beamCount = rarity === 'legendary' ? 14 : rarity === 'rare' ? 10 : 6;
  for (let i = 0; i < beamCount; i++) {
    const b = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1), beamMat);
    b.geometry.translate(0, 0.5, 0);
    b.rotation.z = (i / beamCount) * Math.PI * 2;
    beams.add(b);
  }
  beams.position.set(c.x, floorY + size * 0.5, -40);
  root.add(beams);
  let openedAt = -1;
  let now = 0;
  const actor: Actor = {
    root,
    onTap() {
      if (openedAt < 0 && now > 0.7) {
        openedAt = now;
        onOpen();
      }
    },
    update(t) {
      now = t;
      if (openedAt < 0 && t > 3.2) {
        openedAt = t;
        onOpen();
      }
      const drop = Math.min(1, t / 0.45);
      const bounce =
        t < 0.45 ? 0 : Math.abs(Math.sin((t - 0.45) * 9)) * Math.exp(-(t - 0.45) * 6) * size * 0.5;
      const y = t < 0.45 ? floorY + (1 - easeInCubic(drop)) * sp.height : floorY + bounce;
      cap.position.set(c.x, y + size * 0.5, 0);
      cap.scale.setScalar(size);
      // Anticipation wobble while waiting for the tap.
      const wob = openedAt < 0 ? Math.sin(t * 14) * 0.12 * span(t, 0.8, 1.0) : 0;
      cap.rotation.z = wob;
      if (openedAt >= 0) {
        const o = t - openedAt;
        const k = easeOutCubic(o / 0.5);
        top.position.set(0, k * 0.9, k * 0.4);
        top.rotation.x = -k * 1.2;
        bottom.position.set(0, -k * 0.5, 0);
        bottom.rotation.x = k * 0.5;
        (top.children[0] as THREE.Mesh).visible = true;
        beamMat.opacity = Math.sin(span(o, 0, 1.3) * Math.PI) * 0.75;
        beams.scale.setScalar(size * (1 + o * 1.4));
        beams.rotation.z = o * 0.8;
        cap.scale.setScalar(size * (1 - span(o, 0.6, 1.0) * 0.7));
        return o < 1.3;
      }
      return true;
    },
  };
  return actor;
}
