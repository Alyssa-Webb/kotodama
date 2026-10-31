/**
 * The Continue control, drawn as a shop's noren curtain hanging under the Home scene: the next
 * lesson is written on the cloth, today's goal hangs as a paper lantern on the rod, and the round
 * hanko seal is the button. The whole curtain is one link.
 */
import { Link } from 'react-router';
import { Slot } from '../../../foundations/slots/Slot';
import { GoalLantern } from './GoalLantern';
import './noren.css';

export interface NorenContinueProps {
  to: string;
  /** Full accessible name, e.g. "Start your first lesson: Vowels あいうえお". */
  label: string;
  /** "Next lesson", "Boss ahead", "All caught up". */
  eyebrow: string;
  title: string;
  /** Short word on the seal: "Start", "Continue", "Add a pack". */
  cta: string;
  /** 0..100, or null to hide the goal (nothing left to play). */
  goalPct: number | null;
  goalText: string;
  /** Fires the streak animation slot when the day's goal is met. */
  goalFire?: string | null;
}

export function NorenContinue(p: NorenContinueProps) {
  return (
    <Link className="next-card home-continue noren" to={p.to} aria-label={p.label}>
      <span className="noren-rod" aria-hidden="true">
        <span className="noren-rod-bar" />
        <span className="noren-rod-shine" />
        <span className="noren-rod-cap noren-rod-cap-l" />
        <span className="noren-rod-cap noren-rod-cap-r" />
      </span>

      <span className="noren-curtain" aria-hidden="true">
        <span className="noren-doorway-back" />
        <span className="noren-panel noren-panel-1">
          <svg className="noren-crest" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="9.5"
              fill="none"
              stroke="var(--c-hud-ink)"
              strokeWidth="2"
              opacity="0.9"
            />
            <circle cx="12" cy="7.9" r="2.2" fill="var(--c-hud-ink)" opacity="0.9" />
            <circle cx="8.4" cy="14.1" r="2.2" fill="var(--c-hud-ink)" opacity="0.9" />
            <circle cx="15.6" cy="14.1" r="2.2" fill="var(--c-hud-ink)" opacity="0.9" />
          </svg>
        </span>
        <span className="noren-panel noren-panel-2">
          <span className="noren-panel-shine" />
        </span>
        <span className="noren-panel noren-panel-3">
          <span className="noren-panel-shine" />
        </span>
      </span>

      <span className="noren-cloth">
        <span className="eyebrow">{p.eyebrow}</span>
        <span className="home-continue-title">{p.title}</span>
        {p.goalPct !== null && (
          <span className="noren-goal-text" aria-hidden="true">
            {p.goalText}
          </span>
        )}
      </span>

      {p.goalPct !== null && (
        <Slot slot="streak.extend" fire={p.goalFire ?? null} className="noren-lantern">
          <GoalLantern pct={p.goalPct} />
        </Slot>
      )}

      <span className="noren-seal" aria-hidden="true">
        <svg className="noren-seal-art" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M32 4.5 C41.5 4 50.2 7.8 55.4 15 C60 21.4 60.8 29.8 59.8 37.5 C58.8 45.4 54 52.8 46.6 56.8 C39.6 60.6 30.2 61 22.2 58.4 C14.2 55.8 7.6 49.4 5 41 C2.6 33 3.8 23.4 9 16 C14.4 8.4 22.8 4.9 32 4.5 Z"
            transform="translate(0 3.4)"
            fill="var(--noren-seal-lip)"
          />
          <path
            d="M32 4.5 C41.5 4 50.2 7.8 55.4 15 C60 21.4 60.8 29.8 59.8 37.5 C58.8 45.4 54 52.8 46.6 56.8 C39.6 60.6 30.2 61 22.2 58.4 C14.2 55.8 7.6 49.4 5 41 C2.6 33 3.8 23.4 9 16 C14.4 8.4 22.8 4.9 32 4.5 Z"
            fill="var(--noren-seal-fill)"
          />
          <path
            d="M32 8.8 C45 8.5 55.2 18.8 55.2 32 C55.2 45.2 44.8 55.2 31.8 55.2 C18.8 55.2 8.8 45 8.8 32 C8.8 19.2 19 9.1 32 8.8 Z"
            fill="none"
            stroke="var(--c-hud-ink)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeDasharray="34 4 48 3.5 64 4"
            opacity="0.46"
          />
          <ellipse
            cx="21.5"
            cy="15.5"
            rx="8.5"
            ry="3.4"
            transform="rotate(-24 21.5 15.5)"
            fill="var(--c-hud-ink)"
            opacity="0.38"
          />
        </svg>
        <span className="noren-seal-label">{p.cta}</span>
      </span>
    </Link>
  );
}
