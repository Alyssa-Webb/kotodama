/**
 * The player's avatar as a living character: it breathes, walks, hops when you answer right,
 * flinches when you miss, cheers on wins and lunges at bosses. Each reaction restarts its
 * animation (keyed by a counter), so back-to-back correct answers each get their own hop.
 */
import { useEffect, useRef, useState } from 'react';
import { Avatar, type AvatarMood } from './Avatar';
import './avatar.css';

export type ActorMood = AvatarMood | 'walk' | 'strike';

export function AvatarActor({
  mood = 'idle',
  size = 64,
  reaction = 0,
  equipped,
  className,
  facing = 'front',
}: {
  /** 'back' shows the avatar from behind (walking into battle). */
  facing?: 'front' | 'back';
  mood?: ActorMood;
  size?: number;
  /** Bump to replay the current mood's animation (one per answer). */
  reaction?: number;
  equipped?: Partial<Record<string, string>>;
  className?: string;
}) {
  const [beat, setBeat] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setBeat((b) => b + 1);
  }, [mood, reaction]);
  const face: AvatarMood = mood === 'walk' ? 'idle' : mood === 'strike' ? 'focus' : mood;
  return (
    <div
      className={`avatar-actor ${className ?? ''}`}
      data-mood={mood}
      data-facing={facing}
      style={{ width: size }}
    >
      <div key={beat} className="avatar-motion">
        <Avatar size={size} mood={face} facing={facing} {...(equipped ? { equipped } : {})} />
      </div>
      <span className="avatar-shadow" aria-hidden="true" />
    </div>
  );
}
