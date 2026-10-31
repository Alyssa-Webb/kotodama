/**
 * The battle road above every lesson question: your avatar, seen from behind, walks the road and
 * meets enemies. A correct answer is a strike that drains the enemy's health; a wrong answer is
 * the enemy's attack. When an enemy falls, the avatar walks on and the next one appears. The
 * numbers come from engine/battle (derived from the lesson session itself).
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { battleView } from '../../engine/battle';
import type { SessionState } from '../../engine/lesson/session';
import { Enemy, ENEMY_KINDS, type EnemyKind, type EnemyState } from '../../foundations/art/Enemy';
import { momentsConfig } from '../../foundations/world';
import { haptic } from '../../foundations/haptics/haptics';
import { playSfx, startAmbient } from '../../foundations/audio/sfx';
import { AvatarActor, type ActorMood } from '../avatar/AvatarActor';
import { BattleFx } from './BattleFx';
import './battle.css';

const STONE_LIP = 'color-mix(in srgb, var(--c-border) 52%, var(--c-hud-bg))';
const DARK_GRASS = 'color-mix(in srgb, var(--c-success) 52%, var(--c-hud-bg))';
const BRIGHT_GRASS = 'color-mix(in srgb, var(--c-success) 68%, var(--c-coin-shine))';
const RUT_STROKE = 'color-mix(in srgb, var(--c-gold) 46%, var(--c-hud-bg))';
const WOOD_SHADE = 'color-mix(in srgb, var(--c-panel-edge) 54%, var(--c-hud-bg))';

/**
 * Perspective scale levels around the horizon vanishing point (248, 44).
 * Each step scales by r = 1.52; animating the parent group from scale(1) to scale(1.52^2 = 2.3104)
 * advances every band (A/B) by two steps so the road surface and roadside props flow and grow
 * continuously toward the viewer without ever snapping.
 */
const PERSPECTIVE_LEVELS: ReadonlyArray<{ scale: number; variant: 'a' | 'b' }> = [
  { scale: 0.1873, variant: 'a' },
  { scale: 0.2848, variant: 'b' },
  { scale: 0.4328, variant: 'a' },
  { scale: 0.6579, variant: 'b' },
  { scale: 1, variant: 'a' },
  { scale: 1.52, variant: 'b' },
  { scale: 2.3104, variant: 'a' },
  { scale: 3.5118, variant: 'b' },
];

/**
 * One perspective band of the road surface (dy = 25..38 from the vanishing point):
 * road-edge curb stones, wheel ruts, transverse trail markings, stepping stones and petals.
 */
function RoadPerspectiveBand({ variant }: { variant: 'a' | 'b' }) {
  return (
    <g>
      {/* Perspective wheel ruts & trail markings flowing down the lane */}
      <path
        d="M -39.5 26 L -54.7 36 M -5.7 26 L -7.9 36"
        stroke={RUT_STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.52"
      />
      <path
        d="M -38.2 26.5 L -53.2 36 M -4.8 26.5 L -6.9 36"
        stroke="var(--c-coin-shine)"
        strokeWidth="0.65"
        strokeLinecap="round"
        fill="none"
        opacity="0.38"
      />
      {/* Transverse earth-step contour across the trail */}
      <path
        d="M -52 31.2 Q -26 32.6 -6 31"
        stroke={RUT_STROKE}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity="0.34"
      />

      {/* Left road edge curb stones (m = -2.10) & right road edge curb stones (m = +0.36) */}
      <g>
        <ellipse
          cx="-58.8"
          cy="28.9"
          rx="4.4"
          ry="1.55"
          transform="rotate(-22 -58.8 28.9)"
          fill={STONE_LIP}
        />
        <ellipse
          cx="-58.8"
          cy="28"
          rx="4.4"
          ry="1.45"
          transform="rotate(-22 -58.8 28)"
          fill="var(--c-border)"
        />
        <ellipse
          cx="-60.1"
          cy="27.5"
          rx="1.9"
          ry="0.55"
          transform="rotate(-22 -60.1 27.5)"
          fill="var(--c-coin-shine)"
          opacity="0.65"
        />

        <ellipse
          cx="-72.5"
          cy="35.5"
          rx="5.2"
          ry="1.8"
          transform="rotate(-22 -72.5 35.5)"
          fill={STONE_LIP}
        />
        <ellipse
          cx="-72.5"
          cy="34.5"
          rx="5.2"
          ry="1.65"
          transform="rotate(-22 -72.5 34.5)"
          fill="var(--c-surface-alt)"
        />
        <ellipse cx="-74.2" cy="34" rx="2.3" ry="0.85" fill="var(--c-success)" />

        <ellipse
          cx="9.9"
          cy="28.3"
          rx="3.8"
          ry="1.35"
          transform="rotate(14 9.9 28.3)"
          fill={STONE_LIP}
        />
        <ellipse
          cx="9.9"
          cy="27.5"
          rx="3.8"
          ry="1.25"
          transform="rotate(14 9.9 27.5)"
          fill="var(--c-border)"
        />
        <ellipse
          cx="8.8"
          cy="27.1"
          rx="1.6"
          ry="0.48"
          transform="rotate(14 8.8 27.1)"
          fill="var(--c-coin-shine)"
          opacity="0.6"
        />

        <ellipse
          cx="12.3"
          cy="35"
          rx="4.6"
          ry="1.6"
          transform="rotate(14 12.3 35)"
          fill={STONE_LIP}
        />
        <ellipse
          cx="12.3"
          cy="34.1"
          rx="4.6"
          ry="1.5"
          transform="rotate(14 12.3 34.1)"
          fill="var(--c-surface-alt)"
        />
        <ellipse cx="13.6" cy="33.6" rx="2.1" ry="0.8" fill="var(--c-success)" />
      </g>

      {variant === 'a' ? (
        <g>
          {/* Stepping stone (left-center lane) */}
          <ellipse cx="-34" cy="29.4" rx="5.5" ry="1.9" fill={STONE_LIP} />
          <ellipse cx="-34" cy="28.5" rx="5.5" ry="1.75" fill="var(--c-border)" />
          <ellipse
            cx="-35.8"
            cy="28"
            rx="2.4"
            ry="0.65"
            fill="var(--c-coin-shine)"
            opacity="0.72"
          />

          {/* Stepping stone (right-center lane) */}
          <ellipse cx="-17" cy="35.3" rx="6.4" ry="2.2" fill={STONE_LIP} />
          <ellipse cx="-17" cy="34.2" rx="6.4" ry="2.05" fill="var(--c-surface-alt)" />
          <ellipse
            cx="-19.2"
            cy="33.6"
            rx="2.8"
            ry="0.75"
            fill="var(--c-coin-shine)"
            opacity="0.7"
          />

          {/* Road pebbles & fallen sakura petals */}
          <ellipse cx="-21" cy="27.4" rx="1.6" ry="0.85" fill={STONE_LIP} opacity="0.8" />
          <ellipse cx="-46" cy="33.8" rx="2" ry="1.05" fill={STONE_LIP} opacity="0.8" />
          <ellipse cx="-5.5" cy="31.6" rx="1.7" ry="0.9" fill={STONE_LIP} opacity="0.75" />
          <ellipse
            cx="-28"
            cy="32"
            rx="1.6"
            ry="0.85"
            transform="rotate(-18 -28 32)"
            fill="var(--c-petal)"
            opacity="0.88"
          />
          <ellipse
            cx="-11"
            cy="28.6"
            rx="1.4"
            ry="0.75"
            transform="rotate(22 -11 28.6)"
            fill="var(--c-petal)"
            opacity="0.85"
          />
        </g>
      ) : (
        <g>
          {/* Stepping stone (right-center lane) */}
          <ellipse cx="-13.5" cy="29.1" rx="5.1" ry="1.75" fill={STONE_LIP} />
          <ellipse cx="-13.5" cy="28.2" rx="5.1" ry="1.65" fill="var(--c-surface-alt)" />
          <ellipse
            cx="-15.2"
            cy="27.7"
            rx="2.2"
            ry="0.6"
            fill="var(--c-coin-shine)"
            opacity="0.7"
          />

          {/* Stepping stone (left-center lane) */}
          <ellipse cx="-44" cy="34.9" rx="6.8" ry="2.3" fill={STONE_LIP} />
          <ellipse cx="-44" cy="33.8" rx="6.8" ry="2.15" fill="var(--c-border)" />
          <ellipse
            cx="-46.3"
            cy="33.2"
            rx="2.9"
            ry="0.8"
            fill="var(--c-coin-shine)"
            opacity="0.75"
          />

          {/* Road pebbles & fallen sakura petals */}
          <ellipse cx="-30.5" cy="27.6" rx="1.7" ry="0.9" fill={STONE_LIP} opacity="0.8" />
          <ellipse cx="-24.5" cy="35.6" rx="2.1" ry="1.1" fill={STONE_LIP} opacity="0.8" />
          <ellipse cx="-55" cy="30.8" rx="1.8" ry="0.95" fill={STONE_LIP} opacity="0.75" />
          <ellipse
            cx="-36"
            cy="30.4"
            rx="1.5"
            ry="0.8"
            transform="rotate(16 -36 30.4)"
            fill="var(--c-petal)"
            opacity="0.88"
          />
          <ellipse
            cx="-19"
            cy="32.8"
            rx="1.7"
            ry="0.9"
            transform="rotate(-14 -19 32.8)"
            fill="var(--c-petal)"
            opacity="0.85"
          />
        </g>
      )}
    </g>
  );
}

/**
 * One perspective band of roadside props on either side of the trail (dy = 25..38 from (248, 44)):
 * chibi bushes, grass tufts, wildflowers, mossy boulders, wooden trail posts & stone lanterns
 * that pass by on both verges and grow in scale as they near the viewer.
 */
function VergePerspectiveBand({ variant }: { variant: 'a' | 'b' }) {
  return variant === 'a' ? (
    <g>
      {/* Left roadside near-edge: chunky grass tuft & sakura wildflower */}
      <g transform="translate(-71 28.5)">
        <path
          d="M 0 1.2 C -1.8 -2.8 -4.4 -4 -5.2 -3 C -3.8 -1.2 -2.5 0.4 -1.6 1.6 C -2 -3.2 -0.2 -5.8 1 -5.8 C 2 -5.8 2.8 -3.2 2.4 1.6 C 3.6 -0.2 5.4 -2 6.6 -3.2 C 5.8 -4.4 3.2 -2.8 1.4 1.2 Z"
          fill={DARK_GRASS}
        />
        <path
          d="M 0 0 C -1.8 -4 -4.4 -5.2 -5.2 -4.2 C -3.8 -2.4 -2.5 -0.8 -1.6 0.4 C -2 -4.4 -0.2 -7 1 -7 C 2 -7 2.8 -4.4 2.4 0.4 C 3.6 -1.4 5.4 -3.2 6.6 -4.4 C 5.8 -5.6 3.2 -4 1.4 0 Z"
          fill="var(--c-success)"
        />
        <circle cx="0.8" cy="-5.2" r="0.8" fill={BRIGHT_GRASS} />
        <circle cx="-4.8" cy="-0.4" r="2.2" fill="var(--c-lacquer)" opacity="0.55" />
        <circle cx="-4.8" cy="-1.2" r="2.2" fill="var(--c-petal)" />
        <circle cx="-4.8" cy="-1.2" r="0.9" fill="var(--c-glow)" />
      </g>

      {/* Left roadside outer verge: mossy chibi boulder & shrub mound */}
      <g transform="translate(-112 34)">
        <ellipse cx="0" cy="1.4" rx="7.2" ry="3.6" fill="var(--c-hud-bg)" opacity="0.45" />
        <ellipse cx="0" cy="0.4" rx="6.8" ry="3.3" fill={STONE_LIP} />
        <ellipse cx="0" cy="-0.8" rx="6.4" ry="3.1" fill="var(--c-fog)" />
        <path d="M -4.8 -1.4 C -2.8 -4 2.2 -4 4.6 -1.6 Z" fill="var(--c-success)" />
        <ellipse
          cx="-2.4"
          cy="-2"
          rx="2.5"
          ry="0.95"
          transform="rotate(-14 -2.4 -2)"
          fill="var(--c-coin-shine)"
          opacity="0.65"
        />
      </g>

      {/* Right roadside near-edge: grass tuft & camellia bloom */}
      <g transform="translate(20.5 29)">
        <path
          d="M 0 1.2 C -1.6 -2.6 -4 -3.8 -4.8 -2.8 C -3.5 -1 -2.2 0.4 -1.4 1.5 C -1.8 -3 -0.2 -5.4 0.9 -5.4 C 1.8 -5.4 2.6 -3 2.2 1.5 C 3.4 -0.2 5 -1.8 6.2 -3 C 5.4 -4.2 3 -2.6 1.2 1.2 Z"
          fill={DARK_GRASS}
        />
        <path
          d="M 0 0 C -1.6 -3.8 -4 -5 -4.8 -4 C -3.5 -2.2 -2.2 -0.8 -1.4 0.3 C -1.8 -4.2 -0.2 -6.6 0.9 -6.6 C 1.8 -6.6 2.6 -4.2 2.2 0.3 C 3.4 -1.4 5 -3 6.2 -4.2 C 5.4 -5.4 3 -3.8 1.2 0 Z"
          fill="var(--c-success)"
        />
        <circle cx="5.2" cy="-0.5" r="2.1" fill="var(--c-lacquer)" />
        <circle cx="5.2" cy="-1.3" r="2.1" fill="var(--c-accent)" />
        <circle cx="5.2" cy="-1.3" r="0.85" fill="var(--c-glow)" />
      </g>

      {/* Right roadside outer verge: rounded chibi bush cluster & blossom */}
      <g transform="translate(46 34.5)">
        <path
          d="M -7.5 1.4 C -7.8 -3.4 -4.2 -6.2 0 -6 C 4.2 -6.2 7.8 -3.4 7.5 1.4 Z"
          fill={DARK_GRASS}
        />
        <path
          d="M -7.5 0 C -7.8 -4.8 -4.2 -7.6 0 -7.4 C 4.2 -7.6 7.8 -4.8 7.5 0 Z"
          fill="var(--c-success)"
        />
        <ellipse
          cx="-2.6"
          cy="-4.6"
          rx="2.8"
          ry="1.1"
          transform="rotate(-15 -2.6 -4.6)"
          fill={BRIGHT_GRASS}
          opacity="0.75"
        />
        <circle cx="4.2" cy="-2.2" r="1.9" fill="var(--c-petal)" />
        <circle cx="4.2" cy="-2.2" r="0.8" fill="var(--c-glow)" />
      </g>
    </g>
  ) : (
    <g>
      {/* Left roadside near-edge: wooden trail guidepost & grass tuft */}
      <g transform="translate(-85 33.2)">
        <ellipse cx="0" cy="1.2" rx="4.2" ry="1.6" fill="var(--c-hud-bg)" opacity="0.4" />
        <rect x="-1.8" y="-9.5" width="3.6" height="10.5" rx="1.2" fill={WOOD_SHADE} />
        <rect x="-1.8" y="-10.2" width="3" height="10.5" rx="1" fill="var(--c-panel-edge)" />
        <path d="M -2.8 -9.2 L 0 -11.6 L 2.8 -9.2 Z" fill={WOOD_SHADE} />
        <path d="M -2.6 -9.8 L 0 -12.1 L 2.6 -9.8 Z" fill="var(--c-gold-soft)" />
        <rect x="-0.8" y="-7.5" width="1.4" height="4.2" rx="0.5" fill="var(--c-glow)" />
        <path
          d="M -4.8 0.8 C -5.8 -2 -4.2 -3.8 -2.4 -1.2 C -1.8 -3.5 0.2 -3.8 0.8 -1 C 2.2 -3.2 4.2 -2.4 3.4 0.8 Z"
          fill="var(--c-success)"
        />
      </g>

      {/* Left roadside outer verge: lush chibi bush mound & twin wildflowers */}
      <g transform="translate(-100 28.8)">
        <path
          d="M -8 1.3 C -8.4 -3.6 -4.5 -6.6 0 -6.4 C 4.5 -6.6 8.4 -3.6 8 1.3 Z"
          fill={DARK_GRASS}
        />
        <path
          d="M -8 0 C -8.4 -4.8 -4.5 -7.8 0 -7.6 C 4.5 -7.8 8.4 -4.8 8 0 Z"
          fill="var(--c-success)"
        />
        <ellipse
          cx="-2.8"
          cy="-4.8"
          rx="3"
          ry="1.15"
          transform="rotate(-16 -2.8 -4.8)"
          fill={BRIGHT_GRASS}
          opacity="0.75"
        />
        <circle cx="-4.2" cy="-1.8" r="2" fill="var(--c-petal)" />
        <circle cx="-4.2" cy="-1.8" r="0.85" fill="var(--c-glow)" />
        <circle cx="3.8" cy="-2.8" r="1.7" fill="var(--c-accent)" />
        <circle cx="3.8" cy="-2.8" r="0.7" fill="var(--c-coin-shine)" />
      </g>

      {/* Right roadside near-edge: mossy stone lantern (toro) passing by */}
      <g transform="translate(24 33.8)">
        <ellipse cx="0" cy="1.2" rx="4.8" ry="1.8" fill="var(--c-hud-bg)" opacity="0.45" />
        <rect x="-2" y="-5.5" width="4" height="6.5" rx="1" fill={STONE_LIP} />
        <rect x="-2" y="-6.2" width="3.5" height="6.2" rx="1" fill="var(--c-fog)" />
        <rect x="-3.4" y="-7.4" width="6.8" height="1.8" rx="0.8" fill={STONE_LIP} />
        <rect x="-3.4" y="-7.9" width="6.8" height="1.6" rx="0.8" fill="var(--c-border)" />
        <rect x="-2.6" y="-11.8" width="5.2" height="4.2" rx="0.9" fill={STONE_LIP} />
        <rect x="-2.6" y="-12.3" width="5.2" height="4" rx="0.9" fill="var(--c-surface-alt)" />
        <rect x="-1.4" y="-11.3" width="2.8" height="2.3" rx="0.5" fill="var(--c-glow)" />
        <path d="M -4.8 -11.8 C -2.8 -14.8 2.8 -14.8 4.8 -11.8 Z" fill={STONE_LIP} />
        <path d="M -4.5 -12.4 C -2.5 -15.2 2.5 -15.2 4.5 -12.4 Z" fill="var(--c-fog)" />
        <path d="M -2.4 -13.6 C -1 -14.8 1.2 -14.8 2.4 -13.6 Z" fill="var(--c-success)" />
        <circle cx="0" cy="-15.2" r="1.1" fill="var(--c-border)" />
      </g>

      {/* Right roadside outer verge: mossy stone & grass tuft */}
      <g transform="translate(42 28.6)">
        <ellipse cx="0" cy="1.1" rx="5.4" ry="2.6" fill={STONE_LIP} />
        <ellipse cx="0" cy="0" rx="5.1" ry="2.4" fill="var(--c-fog)" />
        <ellipse
          cx="-1.8"
          cy="-0.8"
          rx="2.1"
          ry="0.75"
          transform="rotate(-14 -1.8 -0.8)"
          fill="var(--c-coin-shine)"
          opacity="0.6"
        />
        <path
          d="M 3.5 0.6 C 2.4 -2.6 0.6 -3.6 0 -2.6 C 1 -1.2 2 0 2.6 0.8 C 2.4 -2.8 3.6 -4.8 4.5 -4.8 C 5.2 -4.8 5.8 -2.8 5.4 0.8 Z"
          fill="var(--c-success)"
        />
      </g>
    </g>
  );
}

export function BattleStage({
  state,
  foes = ENEMY_KINDS,
}: {
  state: SessionState;
  /** The region's enemy roster, met in order. */
  foes?: readonly EnemyKind[];
}) {
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

  // The bamboo path has a soft wind under the whole battle.
  useEffect(() => startAmbient('wind'), []);

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
        playSfx('hit');
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
        playSfx('slash');
        setFoe('hit');
        haptic('thud');
      });
      later(620, () => setFoe('idle'));
    } else if (view.last === 'finish') {
      setHero('strike');
      later(160, () => {
        setFx({ id, kind: 'finisher' });
        playSfx('slash');
        window.setTimeout(() => playSfx('hit'), 90);
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
          <g transform="translate(216 24)">
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
          <g transform="translate(200 40)">
            <rect x="3" y="12" width="6" height="8" rx="1.5" fill={STONE_LIP} />
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
            <path d="M0 6.5 L6 2 L12 6.5 Z" fill={STONE_LIP} />
          </g>
          <g transform="translate(268 35)">
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

      {/* Woodland ground & perspective dirt road with flowing stones, markings and edges */}
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
              <path d="M 222.8 56 L 12.8 156 L 288.3 156 L 252.3 56 Z" />
            </clipPath>
          </defs>

          {/* Woodland grass hills flanking the road */}
          <path
            d="M 0 60 Q 110 52 238 56 Q 330 52 400 60 V 156 H 0 Z"
            fill="url(#battle-grass-grad)"
          />
          {/* Subtle shaded hillside contours on the verges */}
          <path
            d="M 0 88 Q 74 82 162 94 L 84 134 L 0 124 Z M 272 88 Q 338 80 400 90 V 126 Q 336 116 280 118 Z"
            fill="color-mix(in srgb, var(--c-success) 42%, var(--c-hud-bg))"
            opacity="0.45"
          />

          {/* Outer grassy lip & recessed earth bank along the perspective trail */}
          <path
            d="M 218.5 56 L 2 156 L 298 156 L 256.5 56 Z"
            fill="color-mix(in srgb, var(--c-gold) 48%, var(--c-hud-bg))"
          />
          {/* Main perspective dirt road */}
          <path d="M 222.8 56 L 12.8 156 L 288.3 156 L 252.3 56 Z" fill="url(#battle-dirt-grad)" />
          {/* Warm packed-earth center ribbon */}
          <path
            d="M 230.5 56 L 62 156 L 242 156 L 246 56 Z"
            fill="color-mix(in srgb, var(--c-gold-soft) 55%, var(--c-panel-edge))"
            opacity="0.55"
          />
          {/* Subtle clearing ring where the enemy stands on the upper-mid path */}
          <ellipse
            cx="228"
            cy="88"
            rx="34"
            ry="8.5"
            fill="color-mix(in srgb, var(--c-gold-soft) 65%, var(--c-panel-edge))"
            opacity="0.5"
          />

          {/* Perspective-flowing road surface: stones, markings, ruts & curb edges */}
          <g clipPath="url(#battle-road-clip)">
            <g transform="translate(248 44)">
              <g className="battle-road-scroll">
                {PERSPECTIVE_LEVELS.map(({ scale, variant }) => (
                  <g key={scale} transform={`scale(${scale})`}>
                    <RoadPerspectiveBand variant={variant} />
                  </g>
                ))}
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Roadside props on either side of the trail that pass by and grow as they near */}
      <div className="battle-verge">
        <svg viewBox="0 0 400 156" preserveAspectRatio="none" className="battle-verge-svg">
          <defs>
            <clipPath id="battle-verge-clip">
              <rect x="0" y="56" width="400" height="100" />
            </clipPath>
          </defs>
          <g clipPath="url(#battle-verge-clip)">
            <g transform="translate(248 44)">
              <g className="battle-verge-scroll">
                {PERSPECTIVE_LEVELS.map(({ scale, variant }) => (
                  <g key={scale} transform={`scale(${scale})`}>
                    <VergePerspectiveBand variant={variant} />
                  </g>
                ))}
              </g>
            </g>
          </g>
        </svg>
      </div>

      {!(allDown && foe !== 'defeat') && (
        <div className="battle-foe">
          <div className="battle-hp" style={{ '--hp': hp / maxHp } as CSSProperties}>
            {Array.from({ length: maxHp }, (_, i) => (
              <span key={i} className={i < hp ? 'on' : ''} />
            ))}
          </div>
          <Enemy key={shown} kind={foes[shown % foes.length]!} state={foe} size={64} />
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

        {/* Bottom-right foreground framing foliage */}
        <g className="battle-fg-br" style={{ transformOrigin: '400px 156px' }}>
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
