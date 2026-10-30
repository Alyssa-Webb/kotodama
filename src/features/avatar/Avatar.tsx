import { avatarParts } from '../../foundations/world';
import { AVATAR_SLOTS, type AvatarPart } from '../../schema/world';
import { useSave } from '../hooks';
import { dojoRank } from '../../engine/world';

const BELT: Record<string, string> = {
  kyu: 'var(--c-surface)',
  mid: 'var(--c-secondary)',
  high: 'var(--c-accent)',
  dan: 'var(--c-ink)',
};

export type AvatarMood = 'idle' | 'happy' | 'worried' | 'cheer' | 'focus';

/** Draws a mood face over the base part's neutral one (where the base says its face is). */
function Face({ face, mood }: { face: NonNullable<AvatarPart['face']>; mood: AvatarMood }) {
  if (mood === 'idle') return null;
  const { cx, eyeY, eyeDx, mouthY, skin } = face;
  const ink = 'var(--c-ink)';
  const l = cx - eyeDx;
  const r = cx + eyeDx;
  const cover = (
    <ellipse
      cx={cx}
      cy={(eyeY + mouthY) / 2}
      rx={eyeDx + 5}
      ry={(mouthY - eyeY) / 2 + 5}
      fill={skin}
    />
  );
  const blush = (
    <>
      <ellipse cx={l - 3} cy={mouthY - 3} rx="3.4" ry="2" fill="var(--c-petal)" opacity="0.8" />
      <ellipse cx={r + 3} cy={mouthY - 3} rx="3.4" ry="2" fill="var(--c-petal)" opacity="0.8" />
    </>
  );
  const arcEye = (x: number) => (
    <path
      d={`M${x - 3} ${eyeY + 1} Q${x} ${eyeY - 3} ${x + 3} ${eyeY + 1}`}
      stroke={ink}
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
  );
  switch (mood) {
    case 'happy':
      return (
        <g>
          {cover}
          {arcEye(l)}
          {arcEye(r)}
          {blush}
          <path
            d={`M${cx - 5} ${mouthY - 1} Q${cx} ${mouthY + 6} ${cx + 5} ${mouthY - 1}Z`}
            fill={ink}
          />
        </g>
      );
    case 'cheer':
      return (
        <g>
          {cover}
          {arcEye(l)}
          {arcEye(r)}
          {blush}
          <path
            d={`M${cx - 6} ${mouthY - 2} Q${cx} ${mouthY + 8} ${cx + 6} ${mouthY - 2}Z`}
            fill={ink}
          />
          <path
            d={`M${cx - 3} ${mouthY + 2.6} Q${cx} ${mouthY + 4.6} ${cx + 3} ${mouthY + 2.6}`}
            fill="var(--c-accent)"
          />
        </g>
      );
    case 'worried':
      return (
        <g>
          {cover}
          <circle cx={l} cy={eyeY + 1} r="1.9" fill={ink} />
          <circle cx={r} cy={eyeY + 1} r="1.9" fill={ink} />
          <path
            d={`M${l - 3} ${eyeY - 5} L${l + 2} ${eyeY - 3.5} M${r + 3} ${eyeY - 5} L${r - 2} ${eyeY - 3.5}`}
            stroke={ink}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d={`M${cx - 4} ${mouthY + 1} q2 -2 4 0 t4 0`}
            stroke={ink}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${r + 9} ${eyeY - 6} q3 5 0 7 q-3 -2 0 -7z`}
            fill="var(--c-secondary-soft)"
            stroke="var(--c-secondary)"
            strokeWidth="0.6"
          />
        </g>
      );
    case 'focus':
      return (
        <g>
          {cover}
          <circle cx={l} cy={eyeY} r="2.1" fill={ink} />
          <circle cx={r} cy={eyeY} r="2.1" fill={ink} />
          <path
            d={`M${l - 3.5} ${eyeY - 4.5} L${l + 2.5} ${eyeY - 2.5} M${r + 3.5} ${eyeY - 4.5} L${r - 2.5} ${eyeY - 2.5}`}
            stroke={ink}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d={`M${cx - 4} ${mouthY} L${cx + 4} ${mouthY}`}
            stroke={ink}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      );
  }
}

/** Layered SVG avatar: each slot's part is drawn in order; the belt color follows the best dojo rank. */
export function Avatar({
  size = 120,
  equipped,
  mood = 'idle',
}: {
  size?: number;
  equipped?: Partial<Record<string, string>>;
  mood?: AvatarMood;
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
            {slot === 'base' && part.face && <Face face={part.face} mood={mood} />}
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
