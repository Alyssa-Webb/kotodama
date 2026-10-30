/**
 * Full-screen effects overlay: particle canvas, flashes, floating numbers and banner slams.
 * Screen shake is a class on <body>. Reduced-motion players get flashes and text only.
 */
import { useEffect, useRef, useState } from 'react';
import { onFx, type FxEvent } from './fx';
import { spawn, step, type Particle } from './particles';
import { prefersReducedMotion } from '../platform';
import './fx.css';

interface Floater {
  id: number;
  text: string;
  x: number;
  y: number;
  tone: string;
}

let nextId = 1;

export function FxLayer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);
  const [flash, setFlash] = useState<{ id: number; color: string } | null>(null);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [banner, setBanner] = useState<{
    id: number;
    text: string;
    sub?: string;
    tone: string;
  } | null>(null);

  useEffect(() => {
    const c = canvas.current!;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.current = step(ctx, particles.current);
      raf.current = particles.current.length ? requestAnimationFrame(loop) : 0;
    };

    const off = onFx((e: FxEvent) => {
      const reduced = prefersReducedMotion();
      switch (e.kind) {
        case 'burst':
          if (reduced || e.particles === 'none') return;
          particles.current.push(...spawn(e.particles, e.at.x, e.at.y, e.count));
          if (!raf.current) raf.current = requestAnimationFrame(loop);
          return;
        case 'flash':
          setFlash({ id: nextId++, color: e.color });
          return;
        case 'shake':
          if (reduced) return;
          document.body.classList.remove('fx-shake');
          void document.body.offsetWidth; // restart the animation
          document.body.classList.add('fx-shake');
          return;
        case 'text': {
          const f = { id: nextId++, text: e.text, x: e.at.x, y: e.at.y, tone: e.tone };
          setFloaters((fs) => [...fs.slice(-6), f]);
          window.setTimeout(() => setFloaters((fs) => fs.filter((x) => x.id !== f.id)), 1300);
          return;
        }
        case 'banner': {
          const b = { id: nextId++, text: e.text, tone: e.tone, ...(e.sub ? { sub: e.sub } : {}) };
          setBanner(b);
          window.setTimeout(() => setBanner((cur) => (cur?.id === b.id ? null : cur)), 1400);
          return;
        }
      }
    });
    return () => {
      off();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="fx-layer" aria-hidden="true">
      <canvas ref={canvas} className="fx-canvas" />
      {flash && (
        <div
          key={flash.id}
          className={`fx-flash fx-flash-${flash.color}`}
          onAnimationEnd={() => setFlash(null)}
        />
      )}
      {floaters.map((f) => (
        <span key={f.id} className={`fx-float fx-float-${f.tone}`} style={{ left: f.x, top: f.y }}>
          {f.text}
        </span>
      ))}
      {banner && (
        <div key={banner.id} className={`fx-banner fx-banner-${banner.tone}`}>
          <span className="fx-banner-text" lang="ja">
            {banner.text}
          </span>
          {banner.sub && <span className="fx-banner-sub">{banner.sub}</span>}
        </div>
      )}
    </div>
  );
}
