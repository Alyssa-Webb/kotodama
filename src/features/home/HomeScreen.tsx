import { Link } from 'react-router';
import { useGame } from '../../foundations/store/gameStore';
import { daysAway, isUnlocked } from '../../engine/game';
import { districtStates } from '../../engine/world';
import { districts } from '../../foundations/world';
import { useSave, useStats } from '../hooks';
import { Avatar } from '../avatar/Avatar';
import { Slot } from '../../foundations/slots/Slot';
import { JaText, SpeakableJa } from '../../foundations/japanese/Ja';
import { Scene } from '../../foundations/art/Scene';
import { Guide } from '../../foundations/art/Guide';
import { CapsuleIcon, FlameIcon, KobanIcon } from '../../foundations/art/icons';
import './home.css';

function greeting(hour: number): { ja: string; en: string } {
  if (hour < 4 || hour >= 18) return { ja: 'こんばんは！', en: 'Good evening, traveler.' };
  if (hour < 11) return { ja: 'おはようございます！', en: 'Good morning, traveler.' };
  return { ja: 'こんにちは！', en: 'Hello, traveler.' };
}

export function HomeScreen() {
  const s = useStats();
  const save = useSave();
  const index = useGame((st) => st.index);
  const clock = useGame((st) => st.clock);
  const goalPct = Math.min(100, Math.round((s.todayXp / s.goal) * 100));
  const away = daysAway(save, { now: s.now, timeZone: clock.timeZone() });
  const towns = districtStates(save, index, districts, away);
  const awake = Math.max(
    0.15,
    towns.filter((d) => d.lit).length /
      Math.max(1, towns.filter((d) => d.district.restoredBy).length),
  );
  const hello = greeting(new Date(s.now).getHours());
  let next: { title: string; unit: string; href: string; kind: string } | null = null;
  for (const p of index.paths) {
    const keys = p.nodes.map((n) => n.key);
    const n = p.nodes.find((x) => !save.nodes[x.key] && isUnlocked(save, keys, x.key));
    if (n) {
      next = {
        title: n.node.title,
        unit: n.unit.title,
        href: `/lesson/${n.packId}/${n.node.id}`,
        kind: n.node.kind,
      };
      break;
    }
  }
  return (
    <div className="stack">
      <section className="card home-hero" aria-label="Today">
        <Scene
          className="home-scene"
          height={230}
          awake={save.lessonCount ? awake : 0.2}
          ambient="petals"
        />
        <div className="home-hero-guide">
          <Slot slot="mascot.idle" fire={true}>
            <Guide
              who={save.lessonCount % 2 ? 'tetsu' : 'akari'}
              mood={s.todayXp >= s.goal ? 'cheer' : 'idle'}
              size={104}
            />
          </Slot>
          <div className="speech">
            <SpeakableJa text={hello.ja} role="teach" className="speech-ja" />
            <span className="small">{hello.en}</span>
          </div>
        </div>
        <div className="home-hero-body">
          <div className="stack" style={{ gap: 'var(--sp-1)' }}>
            <p className="eyebrow">Today</p>
            <h1>
              {s.todayXp >= s.goal
                ? 'Goal met. The town glows.'
                : s.streak
                  ? `Keep your ${s.streak}-day streak alive`
                  : 'Wake your first spirit'}
            </h1>
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              <span className="pill pill-accent">
                <FlameIcon size={16} lit={s.streak > 0} /> {s.streak} day streak
              </span>
              <span className="pill pill-gold">
                <KobanIcon size={16} /> {s.koban}
              </span>
              {s.tokens > 0 && (
                <span className="pill">
                  <CapsuleIcon size={16} /> {s.tokens}
                </span>
              )}
            </div>
            <p className="muted small">
              {s.todayXp} / {s.goal} XP
              {s.due > 0 ? ` · ${s.due} review${s.due === 1 ? '' : 's'} due` : ''}
            </p>
          </div>
          <Slot slot="streak.extend" fire={save.streak.lastGoalDay} className="ring-wrap">
            <div
              className="ring"
              style={{ ['--p' as string]: goalPct }}
              role="img"
              aria-label={`Daily goal ${goalPct}%`}
            >
              <div>{goalPct}%</div>
            </div>
          </Slot>
        </div>
      </section>

      <section className="card next-card stack">
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <div className="next-avatar">
            <Avatar size={84} />
          </div>
          <div className="stack" style={{ gap: 'var(--sp-1)', minWidth: 0 }}>
            <p className="eyebrow">{next?.kind === 'checkpoint' ? 'Boss ahead' : 'Next lesson'}</p>
            {next ? (
              <>
                <h2>{next.title}</h2>
                <p className="muted small">{next.unit}</p>
              </>
            ) : (
              <p>Every installed lesson is done. Ask ChatGPT for the next pack.</p>
            )}
          </div>
        </div>
        {next ? (
          <Link className="btn btn-accent btn-block play-btn" to={next.href}>
            {save.lessonCount ? 'Continue' : 'Start your first lesson'}
          </Link>
        ) : (
          <Link className="btn btn-indigo btn-block" to="/packs">
            Add a lesson pack
          </Link>
        )}
      </section>

      <div className="grid-2">
        <Link
          to={s.due ? '/dojo' : '/reviews'}
          className={`card stack card-link tile-card ${s.due ? 'urgent' : ''}`}
        >
          <p className="eyebrow">Dojo</p>
          <h2>{s.due ? `${s.due} spirits fading` : 'No spirits fading'}</h2>
          <p className="muted small">
            {s.due
              ? 'Clear the fog to rescue them. Until then lessons pay half koban.'
              : 'Reviews appear here as your memory needs them.'}
          </p>
        </Link>
        <Link to="/town" className="card stack card-link tile-card">
          <p className="eyebrow">Town</p>
          <h2>
            <JaText text="{言霊町|ことだまちょう}" />
          </h2>
          <p className="muted small">
            {towns.filter((d) => d.restored).length} of {towns.length} districts awake
          </p>
        </Link>
        <Link to="/modes" className="card stack card-link tile-card">
          <p className="eyebrow">Arcade</p>
          <h2>Kana Rush · Listening Rush</h2>
          <p className="muted small">Survive until three misses. Beat your ghost.</p>
        </Link>
        <Link to="/collection" className="card stack card-link tile-card">
          <p className="eyebrow">Spirits</p>
          <h2>
            {Object.keys(save.cards).length
              ? `${new Set(Object.keys(save.cards).map((k) => k.split('#')[0])).size} awake`
              : 'None yet'}
          </h2>
          <p className="muted small">Every word you learn wakes one.</p>
        </Link>
      </div>
    </div>
  );
}
