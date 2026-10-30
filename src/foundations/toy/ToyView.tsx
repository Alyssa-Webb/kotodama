/** A slot that shows a live 3D toy (rendered by the shared front canvas, not its own context). */
import { useEffect, useRef } from 'react';
import { toy } from './toy';

export function ToyView({
  item,
  size = 96,
  className,
}: {
  item: string;
  size?: number;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => toy.view(el.current!, item), [item]);
  return (
    <div
      ref={el}
      className={`toy-view ${className ?? ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
      onPointerDown={() => el.current && toy.nudge(el.current)}
    />
  );
}
