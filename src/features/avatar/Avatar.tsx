import { avatarParts } from '../../foundations/world';
import { AVATAR_SLOTS, type AvatarPart } from '../../schema/world';
import { useSave } from '../hooks';
import { dojoRank } from '../../engine/world';

const BELT: Record<string, string> = {
  kyu: 'var(--c-hud-ink)',
  mid: 'var(--c-secondary)',
  high: 'var(--c-accent)',
  dan: 'var(--c-hud-bg)',
};

export type AvatarMood = 'idle' | 'happy' | 'worried' | 'cheer' | 'focus';

/** Draws a mood face over the base part's neutral one (where the base says its face is). */
function Face({ face, mood }: { face: NonNullable<AvatarPart['face']>; mood: AvatarMood }) {
  if (mood === 'idle') return null;
  const { cx, eyeY, eyeDx, mouthY, skin } = face;
  const ink = 'var(--c-hud-bg)';
  const l = cx - eyeDx;
  const r = cx + eyeDx;
  const cover = (
    <rect
      x={cx - eyeDx - 8}
      y={eyeY - 7.5}
      width={(eyeDx + 8) * 2}
      height={mouthY - eyeY + 13}
      rx="9"
      fill={skin}
    />
  );
  const blush = (
    <>
      <ellipse cx={l - 3} cy={mouthY - 4} rx="4.4" ry="2.5" fill="var(--c-petal)" opacity="0.82" />
      <ellipse cx={r + 3} cy={mouthY - 4} rx="4.4" ry="2.5" fill="var(--c-petal)" opacity="0.82" />
    </>
  );
  const arcEye = (x: number) => (
    <path
      d={`M${x - 3.6} ${eyeY + 1.2} Q${x} ${eyeY - 4} ${x + 3.6} ${eyeY + 1.2}`}
      stroke={ink}
      strokeWidth="2.6"
      fill="none"
      strokeLinecap="round"
    />
  );
  switch (mood) {
    case 'happy':
      return (
        <g>
          {cover}
          {blush}
          {arcEye(l)}
          {arcEye(r)}
          <path
            d={`M${cx - 5.5} ${mouthY - 1.5} C${cx - 5.5} ${mouthY + 5.5} ${cx + 5.5} ${mouthY + 5.5} ${cx + 5.5} ${mouthY - 1.5} Z`}
            fill={ink}
          />
          <path
            d={`M${cx - 3.2} ${mouthY + 1.5} Q${cx} ${mouthY + 4.4} ${cx + 3.2} ${mouthY + 1.5}`}
            fill="var(--c-accent)"
          />
        </g>
      );
    case 'cheer':
      return (
        <g>
          {cover}
          {blush}
          {arcEye(l)}
          {arcEye(r)}
          <path
            d={`M${cx - 6.8} ${mouthY - 2.2} C${cx - 6.8} ${mouthY + 7.2} ${cx + 6.8} ${mouthY + 7.2} ${cx + 6.8} ${mouthY - 2.2} Z`}
            fill="var(--c-lacquer)"
          />
          <path
            d={`M${cx - 5.2} ${mouthY - 2.2} H${cx + 5.2}`}
            stroke="var(--c-hud-ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx={cx} cy={mouthY + 2.6} rx="3.8" ry="2.2" fill="var(--c-accent)" />
          <path
            d={`M${l - 8} ${eyeY - 5} l1.2 2.4 2.4 1.2 -2.4 1.2 -1.2 2.4 -1.2 -2.4 -2.4 -1.2 2.4 -1.2Z M${r + 8} ${eyeY - 5} l1.2 2.4 2.4 1.2 -2.4 1.2 -1.2 2.4 -1.2 -2.4 -2.4 -1.2 2.4 -1.2Z`}
            fill="var(--c-glow)"
          />
        </g>
      );
    case 'worried':
      return (
        <g>
          {cover}
          <ellipse
            cx={l - 3}
            cy={mouthY - 4}
            rx="3.8"
            ry="2"
            fill="var(--c-petal)"
            opacity="0.45"
          />
          <ellipse
            cx={r + 3}
            cy={mouthY - 4}
            rx="3.8"
            ry="2"
            fill="var(--c-petal)"
            opacity="0.45"
          />
          <circle cx={l} cy={eyeY + 0.5} r="2.8" fill={ink} />
          <circle cx={r} cy={eyeY + 0.5} r="2.8" fill={ink} />
          <circle cx={l - 0.8} cy={eyeY - 0.5} r="1" fill="var(--c-hud-ink)" />
          <circle cx={r - 0.8} cy={eyeY - 0.5} r="1" fill="var(--c-hud-ink)" />
          <path
            d={`M${l - 3.8} ${eyeY - 3.2} Q${l} ${eyeY - 4.8} ${l + 2.8} ${eyeY - 5.5} M${r + 3.8} ${eyeY - 3.2} Q${r} ${eyeY - 4.8} ${r - 2.8} ${eyeY - 5.5}`}
            stroke={ink}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${cx - 4.5} ${mouthY + 1.5} Q${cx - 2} ${mouthY - 1.2} ${cx} ${mouthY + 1.2} T${cx + 4.5} ${mouthY + 1.2}`}
            stroke={ink}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${r + 9.5} ${eyeY - 7} C${r + 13.5} ${eyeY - 1} ${r + 13} ${eyeY + 2.5} ${r + 9.5} ${eyeY + 2.5} C${r + 6} ${eyeY + 2.5} ${r + 5.5} ${eyeY - 1} ${r + 9.5} ${eyeY - 7}Z`}
            fill="var(--c-secondary)"
          />
          <path
            d={`M${r + 9.5} ${eyeY - 6} C${r + 12.2} ${eyeY - 1.2} ${r + 11.8} ${eyeY + 1.2} ${r + 9.5} ${eyeY + 1.2} C${r + 7.2} ${eyeY + 1.2} ${r + 6.8} ${eyeY - 1.2} ${r + 9.5} ${eyeY - 6}Z`}
            fill="var(--c-secondary-soft)"
          />
          <circle cx={r + 8.6} cy={eyeY - 1} r="0.9" fill="var(--c-hud-ink)" />
        </g>
      );
    case 'focus':
      return (
        <g>
          {cover}
          <circle cx={l} cy={eyeY + 0.5} r="3" fill={ink} />
          <circle cx={r} cy={eyeY + 0.5} r="3" fill={ink} />
          <circle cx={l - 0.9} cy={eyeY - 0.6} r="1.1" fill="var(--c-hud-ink)" />
          <circle cx={r - 0.9} cy={eyeY - 0.6} r="1.1" fill="var(--c-hud-ink)" />
          <path
            d={`M${l - 4} ${eyeY - 5.2} L${l + 3} ${eyeY - 2.6} M${r + 4} ${eyeY - 5.2} L${r - 3} ${eyeY - 2.6}`}
            stroke={ink}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M${cx - 4.2} ${mouthY + 0.5} Q${cx} ${mouthY - 1} ${cx + 4.5} ${mouthY - 0.5}`}
            stroke={ink}
            strokeWidth="2.4"
            fill="none"
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
  facing = 'front',
}: {
  size?: number;
  equipped?: Partial<Record<string, string>>;
  mood?: AvatarMood;
  /** 'back' draws each part's back view (walking into battle, seen from behind). */
  facing?: 'front' | 'back';
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
        // Base, outfit and hair always show something: the first free option when none is set.
        const id =
          eq[slot] ??
          (slot === 'base' || slot === 'outfit' || slot === 'hair'
            ? avatarParts.find((p) => p.slot === slot && p.free)?.id
            : undefined);
        const part = avatarParts.find((p) => p.id === id);
        if (!part) return null;
        // Seen from behind, a part without a back view would show its front over your back:
        // leave it out (the base's own back view covers the body) until it gets one.
        if (facing === 'back' && !part.back && slot !== 'base' && slot !== 'companion') return null;
        return (
          <g key={slot}>
            <g
              dangerouslySetInnerHTML={{
                __html: facing === 'back' ? (part.back ?? part.svg) : part.svg,
              }}
            />
            {facing === 'front' && slot === 'base' && part.face && (
              <Face face={part.face} mood={mood} />
            )}
            {slot === 'outfit' && (
              <g>
                <rect
                  x="30"
                  y="79.5"
                  width="40"
                  height="6.5"
                  rx="3.2"
                  fill={`color-mix(in srgb, ${belt} 62%, var(--c-hud-bg))`}
                />
                <rect x="30" y="78" width="40" height="6" rx="3" fill={belt} />
                <rect
                  x="46"
                  y="77.5"
                  width="8"
                  height="7.5"
                  rx="2.5"
                  fill={`color-mix(in srgb, ${belt} 68%, var(--c-hud-bg))`}
                />
                <rect x="46.5" y="77" width="7" height="6.5" rx="2.2" fill={belt} />
                <rect
                  x="33"
                  y="79"
                  width="10"
                  height="1.6"
                  rx="0.8"
                  fill="var(--c-coin-shine)"
                  opacity="0.45"
                />
              </g>
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
