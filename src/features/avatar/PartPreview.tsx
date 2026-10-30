/** One avatar part drawn on its own (gacha reel cards, prize previews). */
import { avatarParts } from '../../foundations/world';

export function PartPreview({ id, size = 72 }: { id: string; size?: number }) {
  const part = avatarParts.find((p) => p.id === id);
  if (!part) return null;
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} role="img" aria-label={part.en}>
      <g dangerouslySetInnerHTML={{ __html: part.svg }} />
    </svg>
  );
}
