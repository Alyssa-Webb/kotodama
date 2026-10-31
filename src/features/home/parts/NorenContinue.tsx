/**
 * The Continue control, drawn as a shop's noren curtain hanging under the Home scene: the next
 * lesson is written on the cloth, today's goal hangs as a paper lantern on the rod, and the round
 * hanko seal is the button. The whole curtain is one link.
 */
import { Link } from 'react-router';
import { Slot } from '../../../foundations/slots/Slot';
import { GoalLantern } from './GoalLantern';
import './parts.css';

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
      <span className="noren-rod" aria-hidden="true" />
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
        {p.cta}
      </span>
    </Link>
  );
}
