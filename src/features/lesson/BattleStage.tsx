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
import './battle.css';

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
      <div className="battle-road" />
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
      {fx && (
        <span
          key={fx.id}
          className={`battle-fx battle-fx-${fx.kind}`}
          onAnimationEnd={() => setFx(null)}
        >
          {fx.kind !== 'impact' && (
            <svg viewBox="0 0 100 100" className="battle-arc">
              <path d="M18 80 Q 30 18 86 22" pathLength={1} />
              {fx.kind === 'finisher' && <path d="M14 30 Q 70 34 84 86" pathLength={1} />}
            </svg>
          )}
          <span className="battle-dmg">
            {fx.kind === 'impact' ? '−1 ♥' : fx.kind === 'finisher' ? 'KO!' : '−1'}
          </span>
        </span>
      )}
      <div className="battle-hero">
        <AvatarActor mood={hero} facing="back" size={70} reaction={state.attempts.length} />
      </div>
      <span className="battle-count">
        {Math.min(view.defeated, view.enemies)}/{view.enemies}
      </span>
    </div>
  );
}
