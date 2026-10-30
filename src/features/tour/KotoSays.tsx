/**
 * Koto in a role (shopkeeper, mayor...), greeting you with a different line each visit. Tap him
 * for another line; he says it out loud and changes pose.
 */
import { useState } from 'react';
import { Mascot, type MascotOutfit, type MascotPose } from '../../foundations/art/Mascot';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { haptic } from '../../foundations/haptics/haptics';
import type { KotoLine } from '../../schema/koto';
import './tour.css';

const POSES: MascotPose[] = ['wave', 'talk', 'cheer', 'point'];

export function KotoSays({ lines, outfit }: { lines: KotoLine[]; outfit: MascotOutfit }) {
  const [i, setI] = useState(() => Math.floor(Math.random() * lines.length));
  const { speak } = useJa();
  const line = lines[i % lines.length]!;
  const next = () => {
    const n = (i + 1) % lines.length;
    setI(n);
    haptic('tick');
    speak(lines[n]!.ja, { role: 'teach' });
  };
  return (
    <section className="koto-says" aria-label="Koto">
      <button className="koto-says-koto" onClick={next} aria-label="Talk to Koto">
        <Mascot key={i} outfit={outfit} pose={POSES[i % POSES.length]} size={92} facing="right" />
      </button>
      <div key={i} className="tour-bubble koto-says-bubble">
        <p className="tour-ja" lang="ja">
          <JaText text={line.ja} />
        </p>
        <p className="tour-en" style={{ marginBottom: 0 }}>
          {line.en}
        </p>
      </div>
    </section>
  );
}
