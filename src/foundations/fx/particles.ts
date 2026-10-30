/**
 * A small canvas particle system. Each kind has its own spawn rule and drawing; colors come
 * from theme CSS variables at spawn time so particles follow light/dark themes.
 */
import type { ParticlesKind } from '../../schema/theme';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  kind: Exclude<ParticlesKind, 'none'>;
  gravity: number;
  drag: number;
}

const css = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#c8402c';

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function spawn(
  kind: Exclude<ParticlesKind, 'none'>,
  x: number,
  y: number,
  count?: number,
): Particle[] {
  const palette = {
    sparks: [css('--c-glow'), css('--c-gold'), css('--c-accent')],
    ink: [css('--c-ink'), css('--c-danger')],
    confetti: [
      css('--c-accent'),
      css('--c-gold'),
      css('--c-secondary'),
      css('--c-petal'),
      css('--c-success'),
    ],
    embers: [css('--c-glow'), css('--c-accent'), css('--c-gold')],
    coins: [css('--c-gold'), css('--c-glow')],
    shards: [css('--c-danger'), css('--c-accent')],
    petals: [css('--c-petal')],
  }[kind];
  const n =
    count ??
    { sparks: 26, ink: 16, confetti: 90, embers: 40, coins: 18, shards: 12, petals: 24 }[kind];
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const base = {
      x,
      y,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.3, 0.3),
      color: palette[i % palette.length]!,
      kind,
      drag: 0.985,
    };
    switch (kind) {
      case 'sparks': {
        const s = rand(3, 9);
        out.push({
          ...base,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          max: rand(28, 48),
          size: rand(2, 4),
          gravity: 0.08,
        });
        break;
      }
      case 'ink': {
        const s = rand(2, 7);
        out.push({
          ...base,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 1,
          life: 0,
          max: rand(30, 55),
          size: rand(4, 12),
          gravity: 0.25,
          drag: 0.94,
        });
        break;
      }
      case 'confetti':
        out.push({
          ...base,
          x: rand(0, window.innerWidth),
          y: rand(-60, -10),
          vx: rand(-1.5, 1.5),
          vy: rand(2, 5),
          life: 0,
          max: rand(120, 200),
          size: rand(5, 10),
          vr: rand(-0.25, 0.25),
          gravity: 0.03,
        });
        break;
      case 'embers':
        out.push({
          ...base,
          x: x + rand(-120, 120),
          y: y + rand(-20, 60),
          vx: rand(-0.8, 0.8),
          vy: rand(-4, -1.5),
          life: 0,
          max: rand(50, 90),
          size: rand(2, 5),
          gravity: -0.02,
        });
        break;
      case 'coins': {
        const s = rand(4, 9);
        out.push({
          ...base,
          vx: Math.cos(a) * s * 0.6,
          vy: -Math.abs(Math.sin(a) * s) - 3,
          life: 0,
          max: rand(55, 80),
          size: rand(7, 11),
          gravity: 0.32,
        });
        break;
      }
      case 'shards': {
        const s = rand(3, 7);
        out.push({
          ...base,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 2,
          life: 0,
          max: rand(35, 60),
          size: rand(5, 9),
          gravity: 0.3,
          vr: rand(-0.4, 0.4),
        });
        break;
      }
      case 'petals':
        out.push({
          ...base,
          x: rand(0, window.innerWidth),
          y: rand(-40, 0),
          vx: rand(0.3, 1.4),
          vy: rand(0.6, 1.6),
          life: 0,
          max: rand(260, 420),
          size: rand(5, 8),
          gravity: 0,
          drag: 1,
        });
        break;
    }
  }
  return out;
}

/** Advances and draws one frame; returns the particles still alive. */
export function step(ctx: CanvasRenderingContext2D, ps: Particle[]): Particle[] {
  const alive: Particle[] = [];
  const shine = ps.some((p) => p.kind === 'coins') ? css('--c-coin-shine') : '';
  for (const p of ps) {
    p.life++;
    if (p.life > p.max) continue;
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    if (p.kind === 'petals' || p.kind === 'confetti')
      p.vx += Math.sin((p.life + p.size * 10) / 18) * 0.05;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    const t = p.life / p.max;
    const alpha = p.kind === 'petals' ? Math.min(1, (1 - t) * 3) : 1 - t * t;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    switch (p.kind) {
      case 'sparks': {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        const r = p.size * (1 - t * 0.6);
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const ang = (k * Math.PI) / 2;
          ctx.lineTo(Math.cos(ang) * r * 2.2, Math.sin(ang) * r * 2.2);
          ctx.lineTo(Math.cos(ang + Math.PI / 4) * r * 0.5, Math.sin(ang + Math.PI / 4) * r * 0.5);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'ink':
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * (1 + t * 0.4), p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'confetti':
        ctx.scale(1, Math.abs(Math.cos(p.life / 6)));
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        break;
      case 'embers':
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'coins': {
        // A spinning yen: an oval whose width follows the spin.
        const w = Math.abs(Math.cos(p.life / 4)) * p.size + 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, w, p.size * 1.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha *= 0.6;
        ctx.strokeStyle = shine;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        break;
      }
      case 'shards':
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.8, p.size * 0.6);
        ctx.lineTo(-p.size * 0.6, p.size * 0.4);
        ctx.closePath();
        ctx.fill();
        break;
      case 'petals':
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size, -p.size * 0.2, 0, p.size);
        ctx.quadraticCurveTo(-p.size, -p.size * 0.2, 0, -p.size);
        ctx.fill();
        break;
    }
    ctx.restore();
    alive.push(p);
  }
  return alive;
}
