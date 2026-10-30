/**
 * Koto in a role, on his own little stage: behind the shop counter with his wares (shopkeeper),
 * or at the town podium (mayor). Like the guide on Home, the counter cuts him off at the waist.
 * He waves hello when you arrive, then talks; tap him for another line (spoken aloud).
 */
import { useEffect, useState } from 'react';
import { Mascot, type MascotOutfit, type MascotPose } from '../../foundations/art/Mascot';
import { ItemArt } from '../../foundations/art/ItemArt';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { haptic } from '../../foundations/haptics/haptics';
import type { KotoLine } from '../../schema/koto';
import './tour.css';

const TALK: MascotPose[] = ['talk', 'point', 'cheer', 'talk'];
const WARES = ['onigiri', 'chochin', 'daruma', 'taiko', 'maneki'];

export function KotoSays({
  lines,
  outfit,
  role,
}: {
  lines: KotoLine[];
  outfit: MascotOutfit;
  role: 'shop' | 'town';
}) {
  const [i, setI] = useState(() => Math.floor(Math.random() * lines.length));
  const [pose, setPose] = useState<MascotPose>('wave');
  const { speak } = useJa();
  const line = lines[i % lines.length]!;

  // A wave hello on arrival, then he starts talking.
  useEffect(() => {
    const t = window.setTimeout(() => setPose('talk'), 1600);
    return () => window.clearTimeout(t);
  }, []);

  const next = () => {
    const n = (i + 1) % lines.length;
    setI(n);
    setPose(TALK[n % TALK.length]!);
    haptic('tick');
    speak(lines[n]!.ja, { role: 'koto' });
  };

  return (
    <section className={`koto-stage koto-stage-${role}`} aria-label="Koto">
      <div className="koto-stage-back" aria-hidden="true">
        {role === 'shop' ? (
          <>
            <span className="koto-awning" />
            <span className="koto-noren" lang="ja">
              店
            </span>
          </>
        ) : (
          <>
            <span className="koto-hall" />
            <span className="koto-lanterns" />
          </>
        )}
      </div>
      <button className="koto-stage-koto" onClick={next} aria-label="Talk to Koto">
        <Mascot outfit={outfit} pose={pose} size={132} facing="right" />
      </button>
      <div className="koto-counter" aria-hidden="true">
        {role === 'shop' ? (
          WARES.map((id, k) => (
            <span key={id} className="koto-ware" style={{ animationDelay: `${k * 0.4}s` }}>
              <ItemArt id={id} size={40} />
            </span>
          ))
        ) : (
          <span className="koto-podium-seal" lang="ja">
            町長
          </span>
        )}
      </div>
      <div key={i} className="koto-stage-bubble" role="status">
        <p className="tour-ja" lang="ja">
          <JaText text={line.ja} />
        </p>
        <p className="tour-en">{line.en}</p>
      </div>
    </section>
  );
}
