/**
 * A living ukiyo-e landscape used behind the home hero and lessons: a sky that follows the theme
 * (sun by day, moon and stars by night), Mt. Fuji, a pagoda and torii, drifting clouds, swaying
 * lanterns that light up as the town wakes, and ambient petals or fireflies. Placeholder art in
 * code until ChatGPT's illustrated scenes arrive as data.
 */
import { useEffect, useRef } from 'react';
import { spawn, step, type Particle } from '../fx/particles';
import { prefersReducedMotion } from '../platform';
import './art.css';

interface SceneProps {
  /** 0..1: how awake the town is (lanterns lit, warmth). */
  awake?: number;
  height?: number | string;
  ambient?: 'petals' | 'fireflies' | 'none';
  className?: string;
}

function Ambient({ kind }: { kind: 'petals' | 'fireflies' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let ps: Particle[] = [];
    let raf = 0;
    let frame = 0;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const loop = () => {
      const r = c.getBoundingClientRect();
      if (frame++ % (kind === 'petals' ? 26 : 18) === 0 && ps.length < 26) {
        if (kind === 'petals')
          ps.push(
            ...spawn('petals', 0, 0, 1).map((p) => ({
              ...p,
              x: Math.random() * r.width * 0.9,
              y: -10,
            })),
          );
        else
          ps.push(
            ...spawn(
              'embers',
              r.width * Math.random(),
              r.height * (0.45 + Math.random() * 0.5),
              1,
            ).map((p) => ({
              ...p,
              vy: -0.25 - Math.random() * 0.3,
              vx: (Math.random() - 0.5) * 0.5,
              max: 180,
              color: getComputedStyle(document.documentElement).getPropertyValue('--c-firefly'),
            })),
          );
      }
      ctx.clearRect(0, 0, r.width, r.height);
      ps = step(ctx, ps);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [kind]);
  return <canvas ref={ref} className="scene-ambient" aria-hidden="true" />;
}

export function Scene({ awake = 0.5, height = 220, ambient = 'petals', className }: SceneProps) {
  const lanterns = 7;
  const lit = Math.round(awake * lanterns);
  return (
    <div className={`scene ${className ?? ''}`} style={{ height }} aria-hidden="true">
      <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice" className="scene-svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--c-sky-top)" />
            <stop offset=".55" stopColor="var(--c-sky-mid)" />
            <stop offset="1" stopColor="var(--c-sky-bottom)" />
          </linearGradient>
          <radialGradient id="orb" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="var(--c-glow)" stopOpacity=".95" />
            <stop offset=".35" stopColor="var(--c-glow)" stopOpacity=".5" />
            <stop offset="1" stopColor="var(--c-glow)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--c-mountain-far)" stopOpacity=".55" />
            <stop offset="1" stopColor="var(--c-mountain-near)" />
          </linearGradient>
          <filter id="paper" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect width="400" height="220" fill="url(#sky)" />
        {/* stars (night theme only) */}
        <g className="only-dark">
          {Array.from({ length: 34 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 97) % 400}
              cy={(i * 53) % 110}
              r={i % 5 === 0 ? 1.3 : 0.7}
              fill="var(--c-firefly)"
              className="twinkle"
              style={{ animationDelay: `${(i % 7) * 0.4}s` }}
            />
          ))}
        </g>
        {/* sun by day, moon by night */}
        <circle cx="300" cy="62" r="60" fill="url(#orb)" />
        <circle cx="300" cy="62" r="20" fill="var(--c-glow)" className="only-light" />
        <g className="only-dark">
          <circle cx="300" cy="62" r="18" fill="var(--c-firefly)" />
          <circle cx="292" cy="56" r="3" fill="var(--c-glow)" opacity=".5" />
          <circle cx="306" cy="70" r="2" fill="var(--c-glow)" opacity=".5" />
        </g>
        {/* clouds */}
        <g className="drift" fill="var(--c-panel)" opacity=".55">
          <path d="M20 70c6-10 22-10 28-2 6-6 18-4 20 4H20Z" />
          <path d="M150 40c5-8 18-8 23-2 5-5 15-3 16 3h-39Z" />
        </g>
        <g className="drift drift-slow" fill="var(--c-panel)" opacity=".4">
          <path d="M330 100c6-9 21-9 27-2 6-6 17-4 19 4h-46Z" />
        </g>
        {/* Mt. Fuji */}
        <path d="M40 160 140 70c6-5 12-5 18 0l100 90Z" fill="var(--c-mountain-far)" />
        <path
          d="m118 90 22-20c6-5 12-5 18 0l22 20c-6 4-10-2-14 3-4-5-8 2-12-2-4 4-8-3-12 2-5-5-8 1-12-1Z"
          fill="var(--c-panel)"
          opacity=".92"
        />
        {/* far ridge */}
        <path
          d="M0 170c40-22 70-26 110-16 30-18 70-22 110-6 40-20 90-24 180 0v72H0Z"
          fill="var(--c-mountain-far)"
          opacity=".75"
        />
        {/* pagoda */}
        <g fill="var(--c-mountain-near)" transform="translate(58 104)">
          <rect x="10" y="30" width="4" height="40" />
          {[0, 14, 28, 42].map((y, i) => (
            <g key={y} transform={`translate(0 ${y})`}>
              <path d={`M${-8 + i} 6 Q12 ${-2 + i} ${32 - i} 6 L${26 - i} 9 L${-2 + i} 9 Z`} />
              <rect x={2 + i} y="9" width={20 - i * 2} height="6" />
            </g>
          ))}
          <rect x="11" y="-10" width="2" height="12" />
        </g>
        {/* near hills + water */}
        <path
          d="M0 185c50-14 100-12 140-4 50-12 110-14 160-2 40-8 70-6 100 0v41H0Z"
          fill="var(--c-mountain-near)"
        />
        <rect y="200" width="400" height="20" fill="url(#water)" />
        <g className="shimmer" stroke="var(--c-glow)" strokeOpacity=".35" strokeWidth="1">
          <path d="M260 206h40M280 212h28M240 216h24" />
        </g>
        {/* torii */}
        <g transform="translate(318 140)" fill="var(--c-lacquer)">
          <path d="M-6 0q34 -8 68 0v5q-34 -6 -68 0Z" />
          <rect x="0" y="9" width="56" height="4" />
          <rect x="7" y="4" width="5" height="52" />
          <rect x="44" y="4" width="5" height="52" />
          <rect x="25" y="5" width="6" height="8" />
        </g>
        {/* lantern string */}
        <path
          d="M0 22 Q100 48 200 30 T400 26"
          stroke="var(--c-ink)"
          strokeOpacity=".5"
          strokeWidth=".8"
          fill="none"
        />
        {Array.from({ length: lanterns }, (_, i) => {
          const x = 30 + i * 55;
          const y = 26 + Math.sin(i * 1.3) * 8 + (i < 4 ? i * 3 : (6 - i) * 3);
          const on = i < lit;
          return (
            <g
              key={i}
              className="sway"
              style={{ transformOrigin: `${x}px ${y - 4}px`, animationDelay: `${i * 0.35}s` }}
            >
              <line
                x1={x}
                y1={y - 6}
                x2={x}
                y2={y}
                stroke="var(--c-ink)"
                strokeOpacity=".6"
                strokeWidth=".7"
              />
              {on && <circle cx={x} cy={y + 8} r="13" fill="url(#orb)" className="lantern-glow" />}
              <rect x={x - 3.5} y={y - 1} width="7" height="2" fill="var(--c-ink)" />
              <ellipse
                cx={x}
                cy={y + 8}
                rx="6"
                ry="7.5"
                fill={on ? 'var(--c-accent)' : 'var(--c-fog)'}
              />
              <path
                d={`M${x - 6} ${y + 8}h12M${x} ${y}v15`}
                stroke="var(--c-ink)"
                strokeOpacity=".25"
                strokeWidth=".6"
              />
              <rect x={x - 3.5} y={y + 15} width="7" height="2" fill="var(--c-ink)" />
            </g>
          );
        })}
        <rect width="400" height="220" filter="url(#paper)" />
      </svg>
      {ambient !== 'none' && <Ambient kind={ambient} />}
    </div>
  );
}
