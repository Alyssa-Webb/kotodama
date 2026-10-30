/**
 * Road enemies for battle lessons: small mischievous spirits that garble words. Placeholder art
 * (Gemini replaces it through the gemini-art skill); the props and states are the contract.
 */
import './art.css';

export const ENEMY_KINDS = ['inkling', 'glitchling', 'kasa-obake'] as const;
export type EnemyKind = (typeof ENEMY_KINDS)[number];
export type EnemyState = 'idle' | 'hit' | 'attack' | 'defeat' | 'enter';

const TINT: Record<EnemyKind, string> = {
  inkling: 'var(--c-mountain-near)',
  glitchling: 'var(--c-secondary)',
  'kasa-obake': 'var(--c-accent)',
};

export function Enemy({
  kind,
  state = 'idle',
  size = 96,
}: {
  kind: EnemyKind;
  state?: EnemyState;
  size?: number;
}) {
  return (
    <div
      className={`enemy enemy-${kind} enemy-${state}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <ellipse cx="50" cy="92" rx="26" ry="5" fill="var(--c-shadow)" />
        <path
          d="M18 70c0-30 14-50 32-50s32 20 32 50c0 10-6 16-14 16-4 0-6-4-9-4s-5 4-9 4-6-4-9-4-5 4-9 4c-8 0-14-6-14-16Z"
          fill={TINT[kind]}
        />
        <path d="M26 74c4 6 44 6 48 0" stroke="var(--c-shadow)" strokeWidth="5" fill="none" />
        <ellipse cx="40" cy="38" rx="10" ry="6" fill="var(--c-coin-shine)" opacity=".25" />
        <circle cx="40" cy="52" r="6" fill="var(--c-surface)" />
        <circle cx="60" cy="52" r="6" fill="var(--c-surface)" />
        <circle cx="41" cy="53" r="3" fill="var(--c-ink)" />
        <circle cx="61" cy="53" r="3" fill="var(--c-ink)" />
        <path
          d="M42 66q8 5 16 0"
          stroke="var(--c-surface)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
