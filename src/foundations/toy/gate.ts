/**
 * The training-start sequence: the camera pushes into a wall of bushes, the bushes spring apart,
 * the fog burns off, lanterns light, and the camera lands on the backdrop's resting frame.
 *
 *   0.00–0.18  camera eases forward, bushes rustle
 *   0.12–0.55  bushes spring apart (overshoot, settle off-screen)
 *   0.10–0.80  fog dissolves (fbm noise threshold, not a plain fade)
 *   0.55–0.90  lanterns light in sequence
 *   0.00–1.00  camera dolly with ease-in-out, ending exactly on World.rest
 */
import * as THREE from 'three';
import type { World } from './worlds';
import { easeInOutCubic, easeOutCubic, span, spring } from './motion';
import { palette } from './plastic';

const FOG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Value-noise fbm: 4 octaves is plenty at fog scale and cheap on phone GPUs.
const FOG_FRAG = /* glsl */ `
uniform float uDissolve;
uniform float uTime;
uniform float uSeed;
uniform vec3 uColor;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
void main() {
  vec2 p = vUv * 3.0 + vec2(uSeed, uTime * 0.08);
  float n = fbm(p + fbm(p + uTime * 0.05));
  float edge = smoothstep(0.0, 0.55, 1.0 - length(vUv - 0.5) * 1.6);
  float a = smoothstep(uDissolve - 0.15, uDissolve + 0.15, n) * edge;
  gl_FragColor = vec4(uColor, a * 0.92);
}`;

export interface GateRun {
  /** Advance; returns progress 0–1. */
  update(dt: number): number;
  skip(): void;
  dispose(): void;
}

export function startGate(world: World, opts: { duration: number; shaderFog: boolean }): GateRun {
  const { camera, rest, gate, lanterns } = world;
  const wall = gate.userData.wall as { obj: THREE.Group; side: number }[];
  const startPos = new THREE.Vector3(0, 1.0, 10.2);
  const startLook = new THREE.Vector3(0, 1.05, 4);
  const look = new THREE.Vector3();

  const fogs: { mesh: THREE.Mesh; mat: THREE.Material; drift: number }[] = [];
  const color = new THREE.Color(palette().fog);
  const texFallback = opts.shaderFog ? null : softTexture();
  for (let i = 0; i < 6; i++) {
    const mat = opts.shaderFog
      ? new THREE.ShaderMaterial({
          vertexShader: FOG_VERT,
          fragmentShader: FOG_FRAG,
          uniforms: {
            uDissolve: { value: 0 },
            uTime: { value: 0 },
            uSeed: { value: i * 3.7 },
            uColor: { value: color },
          },
          transparent: true,
          depthWrite: false,
        })
      : new THREE.MeshBasicMaterial({
          map: texFallback,
          color,
          transparent: true,
          depthWrite: false,
        });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), mat);
    mesh.position.set(((i % 3) - 1) * 2.2, 1.2 + (i % 2) * 0.5, 8.6 - i * 1.1);
    gate.add(mesh);
    fogs.push({ mesh, mat, drift: i % 2 ? 1 : -1 });
  }
  lanterns.forEach((l) => (l.emissiveIntensity = 0));
  gate.visible = true;

  let elapsed = 0;
  const total = opts.duration / 1000;
  return {
    update(dt) {
      elapsed = Math.min(total, elapsed + dt);
      const t = elapsed / total;
      const dolly = easeInOutCubic(t);
      camera.position.lerpVectors(startPos, rest.pos, dolly);
      look.lerpVectors(startLook, rest.look, easeOutCubic(t));
      // Tiny handheld sway while moving: alive, not floaty.
      camera.position.y += Math.sin(t * Math.PI * 2) * 0.04 * (1 - t);
      camera.lookAt(look);
      const part = spring(span(t, 0.12, 0.6), 0.4);
      const rustle = Math.sin(elapsed * 40) * 0.03 * (1 - span(t, 0, 0.15));
      for (const { obj, side } of wall) {
        const home = obj.userData.home as THREE.Vector3;
        obj.position.set(
          home.x + side * part * 4.2 + rustle,
          home.y - part * 0.6,
          home.z + part * 0.8,
        );
        obj.rotation.z = -side * part * 0.35;
      }
      const dissolve = easeOutCubic(span(t, 0.1, 0.8));
      for (const f of fogs) {
        if (f.mat instanceof THREE.ShaderMaterial) {
          f.mat.uniforms.uDissolve!.value = dissolve * 1.25;
          f.mat.uniforms.uTime!.value = elapsed;
        } else (f.mat as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - dissolve);
        f.mesh.position.x += f.drift * dt * 1.2 * (0.3 + dissolve);
        f.mesh.lookAt(camera.position);
      }
      lanterns.forEach((l, i) => {
        const on = span(
          t,
          0.55 + (i / Math.max(1, lanterns.length)) * 0.3,
          0.62 + (i / Math.max(1, lanterns.length)) * 0.3,
        );
        l.emissiveIntensity = on * 1.1;
      });
      return t;
    },
    skip() {
      elapsed = total;
    },
    dispose() {
      for (const f of fogs) {
        gate.remove(f.mesh);
        f.mesh.geometry.dispose();
        f.mat.dispose();
      }
      gate.visible = false;
    },
  };
}

function softTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
