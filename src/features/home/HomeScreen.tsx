import { Link } from 'react-router';
import { useGame } from '../../foundations/store/gameStore';
import { isUnlocked } from '../../engine/game';
import { useSave, useStats } from '../hooks';
import { Avatar } from '../avatar/Avatar';
import { Slot } from '../../foundations/slots/Slot';
import { JaText } from '../../foundations/japanese/Ja';

export function HomeScreen() {
  const s = useStats();
  const save = useSave();
  const index = useGame((st) => st.index);
  const goalPct = Math.min(100, Math.round((s.todayXp / s.goal) * 100));
  // The next unlocked, unfinished node across installed packs.
  let next: { key: string; title: string; unit: string; href: string } | null = null;
  for (const p of index.paths) {
    const keys = p.nodes.map((n) => n.key);
    const n = p.nodes.find((x) => !save.nodes[x.key] && isUnlocked(save, keys, x.key));
    if (n) {
      next = {
        key: n.key,
        title: n.node.title,
        unit: n.unit.title,
        href: `/lesson/${n.packId}/${n.node.id}`,
      };
      break;
    }
  }
  return (
    <div className="stack">
      <section className="card card-accent home-hero">
        <div className="row spread" style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
          <div className="stack" style={{ gap: 'var(--sp-2)' }}>
            <p className="eyebrow">Today</p>
            <h1>
              {s.todayXp >= s.goal
                ? 'Goal met. The town glows.'
                : s.streak
                  ? `Keep your ${s.streak}-day streak alive`
                  : 'Wake your first spirit'}
            </h1>
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

      <div className="grid-2">
        <section className="card stack">
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <Slot slot="mascot.idle" fire={true} className="home-avatar">
              <Avatar size={96} />
            </Slot>
            <div className="stack" style={{ gap: 'var(--sp-1)' }}>
              <p className="eyebrow">Next lesson</p>
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
            <Link className="btn btn-accent btn-block" to={next.href}>
              {save.lessonCount ? 'Continue' : 'Start your first lesson'}
            </Link>
          ) : (
            <Link className="btn btn-indigo btn-block" to="/packs">
              Add a lesson pack
            </Link>
          )}
        </section>

        <section className="card stack">
          <p className="eyebrow">Dojo</p>
          <h2>{s.due ? `${s.due} spirits need you` : 'No spirits fading'}</h2>
          <p className="muted small">
            {s.due
              ? 'Clear due reviews to bring fading spirits back from the fog. Until then lessons pay half koban.'
              : 'Reviews appear here as your memory needs them.'}
          </p>
          <Link
            className={`btn btn-block ${s.due ? 'btn-indigo' : ''}`}
            to={s.due ? '/dojo' : '/reviews'}
          >
            {s.due ? 'Start rescue' : 'Open the Dojo'}
          </Link>
        </section>

        <Link to="/town" className="card stack card-link">
          <p className="eyebrow">Town</p>
          <h2>
            <JaText text="{言霊町|ことだまちょう}" /> · Kotodama Town
          </h2>
          <p className="muted small">See which districts you have woken.</p>
        </Link>
        <Link to="/modes" className="card stack card-link">
          <p className="eyebrow">Modes</p>
          <h2>Kana Rush · Listening Rush</h2>
          <p className="muted small">Survive until three misses. Beat your ghost.</p>
        </Link>
      </div>
    </div>
  );
}
