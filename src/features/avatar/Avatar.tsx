import { avatarParts } from '../../foundations/world';
import { AVATAR_SLOTS } from '../../schema/world';
import { useSave } from '../hooks';
import { dojoRank } from '../../engine/world';

const BELT: Record<string, string> = {
  kyu: 'var(--c-surface)',
  mid: 'var(--c-secondary)',
  high: 'var(--c-accent)',
  dan: 'var(--c-ink)',
};

/** Layered SVG avatar: each slot's part is drawn in order; the belt color follows the best dojo rank. */
export function Avatar({
  size = 120,
  equipped,
}: {
  size?: number;
  equipped?: Partial<Record<string, string>>;
}) {
  const save = useSave();
  const eq = equipped ?? save.avatar.equipped;
  const best = Math.max(...Object.values(save.elo));
  const rank = dojoRank(best);
  const belt =
    rank.includes('dan') || rank === 'Shodan'
      ? BELT.dan
      : best >= 1400
        ? BELT.high
        : best >= 1100
          ? BELT.mid
          : BELT.kyu;
  const order = AVATAR_SLOTS.filter((s) => s !== 'title' && s !== 'charm' && s !== 'belt');
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} role="img" aria-label="Your avatar">
      {order.map((slot) => {
        const part = avatarParts.find((p) => p.id === eq[slot]);
        if (!part) return null;
        return (
          <g key={slot}>
            <g dangerouslySetInnerHTML={{ __html: part.svg }} />
            {slot === 'outfit' && (
              <rect
                x="31"
                y="80"
                width="38"
                height="5"
                rx="2"
                fill={belt}
                stroke="var(--c-border)"
                strokeWidth="0.5"
              />
            )}
          </g>
        );
      })}
      {save.streak.current >= 30 && (
        <circle
          cx="50"
          cy="60"
          r="48"
          fill="none"
          stroke="var(--c-gold)"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
