/** A side destination drawn as an omamori charm: Arcade and Spirits, which the tab bar doesn't reach. */
import { Link } from 'react-router';
import './parts.css';

export function Omamori({
  to,
  kind,
  label,
}: {
  to: string;
  kind: 'arcade' | 'spirits';
  label: string;
}) {
  return (
    <Link className={`omamori omamori-${kind}`} to={to}>
      <span className="omamori-charm" aria-hidden="true" />
      <span className="omamori-label">{label}</span>
    </Link>
  );
}
