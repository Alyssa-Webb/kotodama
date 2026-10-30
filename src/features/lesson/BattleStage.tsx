/**
 * The battle road above every lesson question: your avatar, seen from behind, walks the road and
 * meets enemies. A correct answer is a strike that drains the enemy's health; a wrong answer is
 * the enemy's attack. When an enemy falls, the avatar walks on and the next one appears. The
 * numbers come from engine/battle (derived from the lesson session itself).
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { battleView } from '../../engine/battle';
import type { SessionState } from '../../engine/lesson/session';
import { Enemy, ENEMY_KINDS, type EnemyState } from '../../foundations/art/Enemy';
import { momentsConfig } from '../../foundations/world';
import { haptic } from '../../foundations/haptics/haptics';
import { AvatarActor, type ActorMood } from '../avatar/AvatarActor';
import { BattleFx } from './BattleFx';
import './battle.css';

/** One 80px vertical tile of stones, ruts and pebbles inside the winding road clip. */
function RoadScrollTile({ yOffset }: { yOffset: number }) {
  return (
    <g transform={`translate(0 ${yOffset})`}>
      {/* Worn dirt ruts & wheel tracks curving along the road */}
      <path
        d="M232 62 C214 78 182 96 138 118 M258 64 C264 82 256 102 236 124"
        stroke="color-mix(in srgb, var(--c-gold) 48%, var(--c-hud-bg))"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray="10 14"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M196 82 C164 100 118 118 76 136 M252 84 C248 104 234 122 218 138"
        stroke="var(--c-coin-shine)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 16"
        fill="none"
        opacity="0.35"
      />

      {/* Flat mossy stepping stones with darker bottom shade bands & top highlights */}
      <g>
        <ellipse cx="238" cy="69.5" rx="9" ry="3.2" fill="var(--c-ink-muted)" />
        <ellipse cx="238" cy="68" rx="9" ry="3" fill="var(--c-border)" />
        <ellipse cx="235" cy="67.2" rx="4" ry="1.2" fill="var(--c-coin-shine)" opacity="0.7" />

        <ellipse cx="212" cy="87" rx="12" ry="4.2" fill="var(--c-ink-muted)" />
        <ellipse cx="212" cy="85" rx="12" ry="3.8" fill="var(--c-border)" />
        <ellipse cx="208" cy="84" rx="5.5" ry="1.5" fill="var(--c-coin-shine)" opacity="0.7" />

        <ellipse cx="256" cy="99" rx="11" ry="3.8" fill="var(--c-ink-muted)" />
        <ellipse cx="256" cy="97.2" rx="11" ry="3.5" fill="var(--c-surface-alt)" />

        <ellipse cx="166" cy="113" rx="15" ry="5.2" fill="var(--c-ink-muted)" />
        <ellipse cx="166" cy="110.8" rx="15" ry="4.8" fill="var(--c-border)" />
        <ellipse cx="161" cy="109.5" rx="6.5" ry="1.8" fill="var(--c-coin-shine)" opacity="0.75" />

        <ellipse cx="224" cy="126" rx="14" ry="4.8" fill="var(--c-ink-muted)" />
        <ellipse cx="224" cy="124" rx="14" ry="4.4" fill="var(--c-surface-alt)" />

        <ellipse cx="104" cy="134" rx="17" ry="5.8" fill="var(--c-ink-muted)" />
        <ellipse cx="104" cy="131.5" rx="17" ry="5.2" fill="var(--c-border)" />
        <ellipse cx="98" cy="130" rx="7" ry="2" fill="var(--c-coin-shine)" opacity="0.75" />
      </g>

      {/* Scattered road pebbles & fallen sakura petals */}
      <g fill="var(--c-ink-muted)" opacity="0.75">
        <ellipse cx="226" cy="76" rx="3.2" ry="1.8" />
        <ellipse cx="266" cy="82" rx="3.8" ry="2" />
        <ellipse cx="188" cy="98" rx="4.2" ry="2.2" />
        <ellipse cx="242" cy="112" rx="4.5" ry="2.4" />
        <ellipse cx="136" cy="122" rx="5" ry="2.5" />
        <ellipse cx="192" cy="135" rx="5.5" ry="2.6" />
        <ellipse cx="68" cy="138" rx="4.8" ry="2.4" />
      </g>
      <g fill="var(--c-petal)" opacity="0.85">
        <ellipse cx="246" cy="79" rx="3" ry="1.6" transform="rotate(-18 246 79)" />
        <ellipse cx="176" cy="104" rx="3.6" ry="1.8" transform="rotate(24 176 104)" />
        <ellipse cx="212" cy="118" rx="3.8" ry="1.9" transform="rotate(-15 212 118)" />
        <ellipse cx="128" cy="129" rx="4.2" ry="2.1" transform="rotate(12 128 129)" />
      </g>
    </g>
  );
}

/** One 70px vertical tile of woodland verges: grass tufts, wildflowers, mossy stones & pebbles. */
function VergeScrollTile({ yOffset }: { yOffset: number }) {
  const darkGrass = 'color-mix(in srgb, var(--c-success) 52%, var(--c-hud-bg))';
  const brightGrass = 'color-mix(in srgb, var(--c-success) 68%, var(--c-coin-shine))';

  return (
    <g transform={`translate(0 ${yOffset})`}>
      {/* Left verge: mossy stones, grass tufts & sakura wildflowers */}
      <g>
        {/* Mossy roadside stone */}
        <ellipse cx="148" cy="24" rx="10" ry="5.5" fill="var(--c-hud-bg)" opacity="0.45" />
        <ellipse cx="148" cy="22" rx="9.5" ry="5" fill="var(--c-ink-muted)" />
        <ellipse cx="148" cy="20.5" rx="9" ry="4.5" fill="var(--c-fog)" />
        <ellipse cx="145" cy="19.2" rx="4" ry="1.6" fill="var(--c-coin-shine)" opacity="0.65" />

        {/* Chunky 3-blade grass tuft (upper-left verge) */}
        <path
          d="M114 34 C110 25 104 22 102 24 C105 28 108 32 110 35 C109 24 113 18 116 18 C118 18 120 24 119 35 C122 31 126 27 129 24 C127 21 121 25 117 34 Z"
          fill={darkGrass}
        />
        <path
          d="M114 32 C110 23 104 20 102 22 C105 26 108 30 110 33 C109 22 113 16 116 16 C118 16 120 22 119 33 C122 29 126 25 129 22 C127 19 121 23 117 32 Z"
          fill="var(--c-success)"
        />
        <circle cx="116" cy="19" r="1.5" fill={brightGrass} />

        {/* Wild sakura flower cluster */}
        <circle cx="92" cy="29" r="4.8" fill="var(--c-lacquer)" opacity="0.5" />
        <circle cx="92" cy="27.5" r="4.8" fill="var(--c-petal)" />
        <circle cx="92" cy="27.5" r="2" fill="var(--c-glow)" />
        <circle cx="82" cy="34" r="3.4" fill="var(--c-petal)" />
        <circle cx="82" cy="34" r="1.4" fill="var(--c-coin-shine)" />

        {/* Chunky grass tuft + camellia bloom (lower-left verge) */}
        <path
          d="M54 58 C49 47 42 43 39 46 C43 50 47 55 49 59 C48 46 53 39 56 39 C59 39 62 46 60 59 C64 54 69 49 72 46 C70 42 63 47 58 58 Z"
          fill={darkGrass}
        />
        <path
          d="M54 56 C49 45 42 41 39 44 C43 48 47 53 49 57 C48 44 53 37 56 37 C59 37 62 44 60 57 C64 52 69 47 72 44 C70 40 63 45 58 56 Z"
          fill="var(--c-success)"
        />
        <circle cx="68" cy="54" r="4.5" fill="var(--c-lacquer)" />
        <circle cx="68" cy="52.5" r="4.5" fill="var(--c-accent)" />
        <circle cx="68" cy="52.5" r="1.8" fill="var(--c-glow)" />

        {/* Verge pebbles */}
        <ellipse cx="132" cy="44" rx="4" ry="2.2" fill="var(--c-ink-muted)" />
        <ellipse cx="32" cy="64" rx="5" ry="2.6" fill="var(--c-fog)" />
      </g>

      {/* Right verge: mossy border boulders, grass tufts & wildflowers */}
      <g>
        {/* Chunky grass tuft (upper-right verge) */}
        <path
          d="M306 28 C302 19 296 16 294 18 C297 22 300 26 302 29 C301 18 305 12 308 12 C310 12 312 18 311 29 C314 25 318 21 321 18 C319 15 313 19 309 28 Z"
          fill={darkGrass}
        />
        <path
          d="M306 26 C302 17 296 14 294 16 C297 20 300 24 302 27 C301 16 305 10 308 10 C310 10 312 16 311 27 C314 23 318 19 321 16 C319 13 313 17 309 26 Z"
          fill="var(--c-success)"
        />
        <circle cx="322" cy="24" r="4.2" fill="var(--c-petal)" />
        <circle cx="322" cy="24" r="1.8" fill="var(--c-glow)" />

        {/* Mossy roadside boulder */}
        <ellipse cx="296" cy="49" rx="12" ry="6.5" fill="var(--c-hud-bg)" opacity="0.45" />
        <ellipse cx="296" cy="47" rx="11.5" ry="6" fill="var(--c-ink-muted)" />
        <ellipse cx="296" cy="45" rx="11" ry="5.5" fill="var(--c-fog)" />
        <path d="M287 44 C290 40 298 40 302 43 Z" fill="var(--c-success)" />
        <ellipse cx="292" cy="43" rx="4.5" ry="1.8" fill="var(--c-coin-shine)" opacity="0.6" />

        {/* Chunky grass tuft & flowers (lower-right verge) */}
        <path
          d="M336 64 C331 53 324 49 321 52 C325 56 329 61 331 65 C330 52 335 45 338 45 C341 45 344 52 342 65 C346 60 351 55 354 52 C352 48 345 53 340 64 Z"
          fill={darkGrass}
        />
        <path
          d="M336 62 C331 51 324 47 321 50 C325 54 329 59 331 63 C330 50 335 43 338 43 C341 43 344 50 342 63 C346 58 351 53 354 50 C352 46 345 51 340 62 Z"
          fill="var(--c-success)"
        />
        <circle cx="316" cy="60" r="4.8" fill="var(--c-petal)" />
        <circle cx="316" cy="60" r="2" fill="var(--c-glow)" />
        <circle cx="356" cy="58" r="3.8" fill="var(--c-accent)" />
        <circle cx="356" cy="58" r="1.5" fill="var(--c-coin-shine)" />
      </g>
    </g>
  );
}

export function BattleStage({ state }: { state: SessionState }) {
  const view = battleView(state, momentsConfig.battle.hitsPerEnemy);
  const [hero, setHero] = useState<ActorMood>('walk');
  const [foe, setFoe] = useState<EnemyState>('enter');
  const [shown, setShown] = useState(view.enemy);
  const [walking, setWalking] = useState(true);
  const seen = useRef(state.attempts.length);
  const root = useRef<HTMLDivElement>(null);
  // One-shot attack effects, keyed so each answer replays them.
  const [fx, setFx] = useState<{ id: number; kind: 'slash' | 'finisher' | 'impact' } | null>(null);

  // The first enemy appears as the avatar walks up the road.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setWalking(false);
      setHero('idle');
      setFoe('idle');
    }, 900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (state.attempts.length === seen.current) return;
    seen.current = state.attempts.length;
    const timers: number[] = [];
    const later = (ms: number, f: () => void) => timers.push(window.setTimeout(f, ms));
    const id = state.attempts.length;
    if (view.last === 'attacked') {
      setFoe('attack');
      // The enemy's blow lands as its lunge peaks.
      later(220, () => {
        setFx({ id, kind: 'impact' });
        root.current?.animate(
          [
            { transform: 'translate(0, 0)' },
            { transform: 'translate(-5px, 2px)' },
            { transform: 'translate(4px, -2px)' },
            { transform: 'translate(-3px, 1px)' },
            { transform: 'translate(0, 0)' },
          ],
          { duration: 380, easing: 'ease-out' },
        );
        setHero('worried');
        haptic('double');
      });
      later(560, () => setFoe('idle'));
    } else if (view.last === 'hit') {
      setHero('strike');
      later(160, () => {
        setFx({ id, kind: 'slash' });
        setFoe('hit');
        haptic('thud');
      });
      later(620, () => setFoe('idle'));
    } else if (view.last === 'finish') {
      setHero('strike');
      later(160, () => {
        setFx({ id, kind: 'finisher' });
        setFoe('defeat');
        haptic('heartbeat');
      });
      // Walk on to the next enemy.
      later(820, () => {
        if (view.defeated >= view.enemies) {
          setHero('cheer');
          return;
        }
        setWalking(true);
        setHero('walk');
        setShown(view.enemy);
        setFoe('enter');
      });
      later(1700, () => {
        setWalking(false);
        setHero('idle');
        setFoe('idle');
      });
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
    // reacts once per answer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.attempts.length]);

  const allDown = view.defeated >= view.enemies;
  const current = shown === view.enemy;
  const hp = current ? view.hp : 0;
  const maxHp = current ? view.maxHp : 1;
  return (
    <div ref={root} className={`battle ${walking ? 'battle-walking' : ''}`} aria-hidden="true">
      {/* Parallax sky, distant mountains, cedar & bamboo groves, shrine torii & lanterns */}
      <svg viewBox="0 0 400 156" preserveAspectRatio="xMidYMid slice" className="battle-backdrop">
        <defs>
          <linearGradient id="battle-sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--c-sky-top)" />
            <stop offset="0.52" stopColor="var(--c-sky-mid)" />
            <stop offset="1" stopColor="var(--c-sky-bottom)" />
          </linearGradient>
          <radialGradient id="battle-orb-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--c-glow)" stopOpacity="0.9" />
            <stop offset="0.45" stopColor="var(--c-glow)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--c-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft sky base */}
        <rect width="400" height="90" fill="url(#battle-sky-grad)" />

        {/* Night stars (dark theme) */}
        <g className="only-dark" fill="var(--c-firefly)">
          <circle cx="34" cy="14" r="1.2" className="battle-star" />
          <circle cx="78" cy="24" r="0.9" className="battle-star battle-star-delay" />
          <circle cx="128" cy="11" r="1.3" className="battle-star" />
          <circle cx="174" cy="20" r="0.9" className="battle-star battle-star-delay" />
          <circle cx="222" cy="12" r="1.1" className="battle-star" />
          <circle cx="304" cy="15" r="1.3" className="battle-star battle-star-delay" />
          <circle cx="358" cy="22" r="1" className="battle-star" />
        </g>

        {/* Sun by day / Moon by night */}
        <circle cx="292" cy="28" r="32" fill="url(#battle-orb-glow)" />
        <circle cx="292" cy="28" r="12" fill="var(--c-glow)" className="only-light" />
        <g className="only-dark">
          <circle cx="292" cy="28" r="11" fill="var(--c-firefly)" />
          <circle cx="288" cy="25" r="2.2" fill="var(--c-glow)" opacity="0.5" />
        </g>

        {/* Soft drifting clouds */}
        <g className="battle-clouds" fill="var(--c-panel)" opacity="0.55">
          <path d="M42 30 C47 22 61 22 66 28 C71 23 82 25 84 32 H42 Z" />
          <path d="M168 19 C172 13 184 13 188 18 C193 14 202 15 204 21 H168 Z" />
          <path d="M322 25 C326 19 338 19 342 24 C346 20 355 21 357 27 H322 Z" />
        </g>

        {/* Parallax Layer 1: Far mountains, Mt. Fuji peak & distant ridge pagoda */}
        <g className="battle-parallax-far">
          {/* Mt. Fuji silhouette in the distance */}
          <path d="M68 68 L132 18 C137 14 143 14 148 18 L212 68 Z" fill="var(--c-mountain-far)" />
          <path
            d="M115 31 L132 18 C137 14 143 14 148 18 L165 31 C160 33 156 29 152 33 C148 29 144 33 140 30 C136 33 132 29 128 33 C124 29 120 33 115 31 Z"
            fill="var(--c-panel)"
            opacity="0.9"
          />
          {/* Rolling far mountain range */}
          <path
            d="M-20 70 C30 42 75 40 120 52 C165 36 215 38 260 50 C310 32 365 34 420 56 V84 H-20 Z"
            fill="var(--c-mountain-far)"
            opacity="0.82"
          />
          {/* Distant hillside pagoda silhouette */}
          <g fill="var(--c-mountain-near)" opacity="0.75" transform="translate(82 34) scale(0.75)">
            <rect x="9" y="-6" width="2" height="8" />
            <path d="M-2 4 Q10 -1 22 4 L19 7 H1 Z" />
            <path d="M-4 11 Q10 6 24 11 L21 14 H-1 Z" />
            <path d="M-6 18 Q10 13 26 18 L23 21 H-3 Z" />
            <rect x="4" y="4" width="12" height="22" />
          </g>
        </g>

        {/* Parallax Layer 2: Midground woodland hills, cedar & bamboo groves, distant torii & lanterns */}
        <g className="battle-parallax-mid">
          {/* Midground forested hills */}
          <path
            d="M-20 74 C40 48 104 46 168 58 C216 50 258 52 302 58 C348 44 388 46 420 62 V88 H-20 Z"
            fill="var(--c-mountain-near)"
          />

          {/* Left cedar (sugi) & bamboo grove silhouettes */}
          <g fill="color-mix(in srgb, var(--c-mountain-near) 75%, var(--c-hud-bg))">
            <path d="M18 14 L6 36 H12 L3 54 H10 L0 70 H36 L26 54 H33 L24 36 H30 Z" />
            <path d="M48 20 L38 39 H43 L35 55 H41 L33 70 H63 L55 55 H61 L53 39 H58 Z" />
            <path d="M76 26 L68 42 H72 L65 56 H70 L63 70 H89 L82 56 H87 L80 42 H84 Z" />
          </g>
          {/* Left swaying bamboo stalks & feathery leaves */}
          <g
            className="battle-bamboo-sway"
            style={{ transformOrigin: '132px 68px' }}
            stroke="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
            fill="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
          >
            <path
              d="M116 68 Q114 40 120 14 M130 68 Q131 42 127 18 M144 68 Q146 44 140 22"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M113 36 H119 M115 24 H121 M127 42 H133 M142 38 H148"
              stroke="var(--c-coin-shine)"
              strokeWidth="1.2"
              opacity="0.55"
            />
            <ellipse
              cx="125"
              cy="16"
              rx="7"
              ry="2.2"
              transform="rotate(-22 125 16)"
              stroke="none"
            />
            <ellipse cx="113" cy="21" rx="6.5" ry="2" transform="rotate(18 113 21)" stroke="none" />
            <ellipse
              cx="136"
              cy="22"
              rx="6.5"
              ry="2"
              transform="rotate(-18 136 22)"
              stroke="none"
            />
            <ellipse cx="147" cy="28" rx="6" ry="1.8" transform="rotate(24 147 28)" stroke="none" />
          </g>

          {/* Right cedar & bamboo grove silhouettes */}
          <g fill="color-mix(in srgb, var(--c-mountain-near) 75%, var(--c-hud-bg))">
            <path d="M342 22 L332 40 H337 L329 56 H335 L327 70 H357 L349 56 H355 L347 40 H352 Z" />
            <path d="M372 12 L359 34 H365 L355 52 H362 L352 70 H392 L382 52 H389 L379 34 H385 Z" />
          </g>
          <g
            className="battle-bamboo-sway"
            style={{ transformOrigin: '306px 68px' }}
            stroke="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
            fill="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
          >
            <path
              d="M294 68 Q292 44 298 20 M308 68 Q310 40 304 14 M320 68 Q322 46 317 24"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M291 40 H297 M305 32 H311 M318 42 H324"
              stroke="var(--c-coin-shine)"
              strokeWidth="1.2"
              opacity="0.55"
            />
            <ellipse
              cx="300"
              cy="18"
              rx="6.5"
              ry="2"
              transform="rotate(-20 300 18)"
              stroke="none"
            />
            <ellipse cx="312" cy="16" rx="7" ry="2.2" transform="rotate(22 312 16)" stroke="none" />
            <ellipse cx="324" cy="26" rx="6" ry="1.8" transform="rotate(18 324 26)" stroke="none" />
          </g>

          {/* Distant vermilion Torii gate straddling the upper path entrance */}
          <g transform="translate(226 26)">
            <circle cx="22" cy="22" r="24" fill="url(#battle-orb-glow)" opacity="0.65" />
            {/* Pillars */}
            <rect x="8" y="8" width="4.5" height="28" rx="1.5" fill="var(--c-lacquer)" />
            <rect x="8" y="8" width="3.5" height="28" rx="1.2" fill="var(--c-accent)" />
            <rect x="31.5" y="8" width="4.5" height="28" rx="1.5" fill="var(--c-lacquer)" />
            <rect x="31.5" y="8" width="3.5" height="28" rx="1.2" fill="var(--c-accent)" />
            <rect x="6.5" y="31" width="7.5" height="5" rx="1.5" fill="var(--c-hud-bg)" />
            <rect x="30" y="31" width="7.5" height="5" rx="1.5" fill="var(--c-hud-bg)" />
            {/* Lower tie beam (nuki) */}
            <rect x="3" y="13" width="38" height="3.5" rx="1.5" fill="var(--c-lacquer)" />
            <rect x="3" y="12" width="38" height="3" rx="1.5" fill="var(--c-accent)" />
            {/* Curved top lintel (kasagi) */}
            <path d="M-2 5 Q22 0 46 5 L44 9.5 Q22 5.5 0 9.5 Z" fill="var(--c-lacquer)" />
            <path d="M-2 3.5 Q22 -1.5 46 3.5 L44 7.5 Q22 3.5 0 7.5 Z" fill="var(--c-accent)" />
            {/* Golden額束 (gakuzuka) tablet */}
            <rect x="19.5" y="6" width="5" height="6.5" rx="1" fill="var(--c-hud-bg)" />
            <rect x="20.5" y="7" width="3" height="4.5" rx="0.6" fill="var(--c-glow)" />
          </g>

          {/* Distant stone lantern (left of torii) & hanging chochin lantern (right of torii) */}
          <g transform="translate(208 42)">
            <rect x="3" y="12" width="6" height="8" rx="1.5" fill="var(--c-ink-muted)" />
            <rect x="2" y="6" width="8" height="6" rx="1.5" fill="var(--c-border)" />
            <circle
              cx="6"
              cy="9"
              r="8"
              fill="url(#battle-orb-glow)"
              className="battle-lantern-glow"
            />
            <rect
              x="4"
              y="7.5"
              width="4"
              height="3"
              rx="1"
              fill="var(--c-glow)"
              className="battle-lantern-glow"
            />
            <path d="M0 6.5 L6 2 L12 6.5 Z" fill="var(--c-ink-muted)" />
          </g>
          <g transform="translate(274 36)">
            <path
              d="M8 24 V4 L0 4"
              stroke="var(--c-hud-bg)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle
              cx="0"
              cy="11"
              r="10"
              fill="url(#battle-orb-glow)"
              className="battle-lantern-glow"
            />
            <ellipse cx="0" cy="11.5" rx="4.5" ry="5.5" fill="var(--c-lacquer)" />
            <ellipse cx="0" cy="10.5" rx="4.5" ry="5" fill="var(--c-accent)" />
            <ellipse
              cx="0"
              cy="10.5"
              rx="2.4"
              ry="3"
              fill="var(--c-glow)"
              className="battle-lantern-glow"
            />
          </g>
        </g>
      </svg>

      {/* Woodland ground & winding dirt path with scrolling stones, ruts and pebbles */}
      <div className="battle-road">
        <svg viewBox="0 0 400 156" preserveAspectRatio="none" className="battle-road-svg">
          <defs>
            <linearGradient id="battle-grass-grad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--c-success) 52%, var(--c-mountain-near))"
              />
              <stop
                offset="0.45"
                stopColor="color-mix(in srgb, var(--c-success) 74%, var(--c-hud-bg))"
              />
              <stop
                offset="1"
                stopColor="color-mix(in srgb, var(--c-success) 60%, var(--c-hud-bg))"
              />
            </linearGradient>
            <linearGradient id="battle-dirt-grad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0"
                stopColor="color-mix(in srgb, var(--c-panel-edge) 58%, var(--c-mountain-near))"
              />
              <stop
                offset="0.48"
                stopColor="color-mix(in srgb, var(--c-panel-edge) 76%, var(--c-surface-alt))"
              />
              <stop
                offset="1"
                stopColor="color-mix(in srgb, var(--c-panel-edge) 84%, var(--c-panel))"
              />
            </linearGradient>
            <clipPath id="battle-road-clip">
              <path d="M 236 56 C 226 70, 206 80, 184 92 C 142 114, 58 126, 16 156 L 288 156 C 270 136, 278 122, 284 102 C 290 84, 272 72, 260 56 Z" />
            </clipPath>
          </defs>

          {/* Woodland grass hills flanking the road */}
          <path
            d="M 0 60 Q 110 50 248 56 Q 330 52 400 60 V 156 H 0 Z"
            fill="url(#battle-grass-grad)"
          />
          {/* Subtle shaded hillside contours on the verges */}
          <path
            d="M 0 88 Q 78 82 174 96 L 96 132 L 0 124 Z M 282 88 Q 342 80 400 90 V 126 Q 336 116 280 118 Z"
            fill="color-mix(in srgb, var(--c-success) 42%, var(--c-hud-bg))"
            opacity="0.45"
          />

          {/* Outer grassy lip & recessed earth bank along the winding path */}
          <path
            d="M 231 56 C 220 70, 198 80, 174 92 C 130 114, 46 126, 4 156 L 300 156 C 282 136, 288 122, 294 102 C 300 84, 280 72, 265 56 Z"
            fill="color-mix(in srgb, var(--c-gold) 48%, var(--c-hud-bg))"
          />
          {/* Main winding perspective dirt road */}
          <path
            d="M 236 56 C 226 70, 206 80, 184 92 C 142 114, 58 126, 16 156 L 288 156 C 270 136, 278 122, 284 102 C 290 84, 272 72, 260 56 Z"
            fill="url(#battle-dirt-grad)"
          />
          {/* Warm packed-earth center ribbon */}
          <path
            d="M 242 56 C 234 70, 218 82, 198 94 C 162 116, 92 128, 56 156 L 254 156 C 242 136, 254 120, 264 100 C 272 82, 262 70, 254 56 Z"
            fill="color-mix(in srgb, var(--c-gold-soft) 55%, var(--c-panel-edge))"
            opacity="0.55"
          />
          {/* Subtle clearing ring where the enemy stands on the upper-mid path */}
          <ellipse
            cx="240"
            cy="88"
            rx="34"
            ry="8.5"
            fill="color-mix(in srgb, var(--c-gold-soft) 65%, var(--c-panel-edge))"
            opacity="0.5"
          />

          {/* Scrolling stones, ruts, pebbles & fallen petals clipped to the winding road */}
          <g clipPath="url(#battle-road-clip)">
            <g className="battle-road-scroll">
              <RoadScrollTile yOffset={-80} />
              <RoadScrollTile yOffset={0} />
              <RoadScrollTile yOffset={80} />
            </g>
          </g>
        </svg>
      </div>

      {/* Scrolling woodland verges: grass tufts, wildflowers, mossy rocks & pebbles */}
      <div className="battle-verge">
        <svg viewBox="0 0 400 210" preserveAspectRatio="none" className="battle-verge-svg">
          <VergeScrollTile yOffset={0} />
          <VergeScrollTile yOffset={70} />
          <VergeScrollTile yOffset={140} />
        </svg>
      </div>

      {!(allDown && foe !== 'defeat') && (
        <div className="battle-foe">
          <div className="battle-hp" style={{ '--hp': hp / maxHp } as CSSProperties}>
            {Array.from({ length: maxHp }, (_, i) => (
              <span key={i} className={i < hp ? 'on' : ''} />
            ))}
          </div>
          <Enemy
            key={shown}
            kind={ENEMY_KINDS[shown % ENEMY_KINDS.length]!}
            state={foe}
            size={64}
          />
        </div>
      )}
      {fx && <BattleFx fx={fx} onDone={() => setFx(null)} />}
      <div className="battle-hero">
        <AvatarActor mood={hero} facing="back" size={70} reaction={state.attempts.length} />
      </div>

      {/* Ambient floating woodland particles (fireflies & drifting sakura petals) */}
      <div className="battle-particles">
        <span className="battle-mote battle-mote-1" />
        <span className="battle-mote battle-mote-2" />
        <span className="battle-mote battle-mote-3" />
        <span className="battle-petal battle-petal-1" />
        <span className="battle-petal battle-petal-2" />
        <span className="battle-petal battle-petal-3" />
      </div>

      {/* Foreground framing leaves at the edges & mossy roadside lantern */}
      <svg viewBox="0 0 400 156" preserveAspectRatio="none" className="battle-fg">
        {/* Top-left canopy branch & bamboo leaves */}
        <g className="battle-fg-tl" style={{ transformOrigin: '0px 0px' }}>
          <path d="M-6 -4 C18 2 38 14 54 28 C34 28 14 22 -6 14 Z" fill="var(--c-hud-bg)" />
          <path
            d="M-6 -6 C18 0 38 12 54 25 C34 25 14 19 -6 11 Z"
            fill="color-mix(in srgb, var(--c-success) 62%, var(--c-hud-bg))"
          />
          <path d="M-4 8 C12 14 24 26 30 40 C16 36 4 26 -4 18 Z" fill="var(--c-success)" />
          <circle cx="38" cy="20" r="4" fill="var(--c-petal)" />
          <circle cx="38" cy="20" r="1.6" fill="var(--c-glow)" />
        </g>

        {/* Bottom-left foreground framing bush & fern leaves */}
        <g className="battle-fg-bl" style={{ transformOrigin: '0px 156px' }}>
          <path
            d="M-8 158 C-8 124 12 106 36 106 C38 118 32 130 22 136 C36 132 48 140 52 158 Z"
            fill="var(--c-hud-bg)"
          />
          <path
            d="M-8 158 C-8 126 10 109 34 109 C36 120 30 131 20 137 C34 133 46 141 50 158 Z"
            fill="color-mix(in srgb, var(--c-success) 56%, var(--c-hud-bg))"
          />
          <path
            d="M-4 158 C-2 136 10 122 26 120 C26 130 20 139 12 144 C24 141 34 146 38 158 Z"
            fill="var(--c-success)"
          />
          <ellipse
            cx="14"
            cy="124"
            rx="6"
            ry="2.2"
            transform="rotate(-28 14 124)"
            fill="var(--c-coin-shine)"
            opacity="0.5"
          />
          <circle cx="26" cy="142" r="4.5" fill="var(--c-accent)" />
          <circle cx="26" cy="142" r="1.8" fill="var(--c-glow)" />
        </g>

        {/* Top-right canopy leaves */}
        <g className="battle-fg-tr" style={{ transformOrigin: '400px 0px' }}>
          <path d="M406 -4 C382 2 362 14 346 28 C366 28 386 22 406 14 Z" fill="var(--c-hud-bg)" />
          <path
            d="M406 -6 C382 0 362 12 346 25 C366 25 386 19 406 11 Z"
            fill="color-mix(in srgb, var(--c-success) 62%, var(--c-hud-bg))"
          />
          <path d="M404 8 C388 14 376 26 370 40 C384 36 396 26 404 18 Z" fill="var(--c-success)" />
        </g>

        {/* Bottom-right foreground framing foliage & mossy stone lantern */}
        <g className="battle-fg-br" style={{ transformOrigin: '400px 156px' }}>
          {/* Mossy stone lantern (toro) on the right verge */}
          <g transform="translate(352 104)">
            <rect x="9" y="28" width="10" height="22" rx="3" fill="var(--c-hud-bg)" />
            <rect x="9" y="26" width="10" height="20" rx="3" fill="var(--c-ink-muted)" />
            <rect x="5" y="23" width="18" height="5" rx="2.5" fill="var(--c-fog)" />
            <rect x="7" y="12" width="14" height="12" rx="2.5" fill="var(--c-hud-bg)" />
            <rect x="7" y="11" width="14" height="11" rx="2.5" fill="var(--c-border)" />
            <rect
              x="10"
              y="13.5"
              width="8"
              height="6.5"
              rx="1.5"
              fill="var(--c-glow)"
              className="battle-lantern-glow"
            />
            <path d="M1 12 C6 4 22 4 27 12 Z" fill="var(--c-hud-bg)" />
            <path d="M2 10.5 C7 3 21 3 26 10.5 Z" fill="var(--c-ink-muted)" />
            <path d="M6 7 C10 4 16 4 20 7 Z" fill="var(--c-success)" />
            <circle cx="14" cy="3" r="3" fill="var(--c-fog)" />
          </g>
          {/* Framing foreground bush leaves */}
          <path
            d="M408 158 C408 124 388 108 364 110 C364 122 370 132 378 138 C364 134 350 142 346 158 Z"
            fill="var(--c-hud-bg)"
          />
          <path
            d="M408 158 C408 126 390 111 366 113 C366 124 372 133 380 139 C366 135 352 143 348 158 Z"
            fill="color-mix(in srgb, var(--c-success) 56%, var(--c-hud-bg))"
          />
          <path
            d="M404 158 C402 136 390 124 374 122 C374 132 380 140 388 145 C376 142 366 147 362 158 Z"
            fill="var(--c-success)"
          />
          <circle cx="376" cy="144" r="4.2" fill="var(--c-petal)" />
          <circle cx="376" cy="144" r="1.7" fill="var(--c-glow)" />
        </g>
      </svg>

      <span className="battle-count">
        {Math.min(view.defeated, view.enemies)}/{view.enemies}
      </span>
    </div>
  );
}
