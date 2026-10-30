/** Stand-in for Koto until Gemini's art lands (same props as the brief's contract). */
export type MascotPose =
  'idle' | 'wave' | 'point' | 'talk' | 'cheer' | 'think' | 'surprised' | 'sleep';
export type MascotOutfit = 'guide' | 'shopkeeper' | 'mayor' | 'sensei';
export function Mascot({
  size = 120,
  className,
}: {
  pose?: MascotPose;
  outfit?: MascotOutfit;
  size?: number;
  facing?: 'left' | 'right';
  className?: string;
}) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
      width={size}
      height={size}
      alt=""
      className={className}
      style={{ borderRadius: '50%' }}
    />
  );
}
