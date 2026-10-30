import { Link } from 'react-router';
import { useGame } from '../../foundations/store/gameStore';
import { isUnlocked } from '../../engine/game';
import { bosses } from '../../foundations/world';
import { useSave } from '../hooks';
import { Stars } from '../lesson/common';
import './path.css';

export function PathScreen() {
  const index = useGame((s) => s.index);
  const save = useSave();
  return (
    <div className="stack">
      <h1>Path</h1>
      {index.paths
        .filter((p) => p.pack.pack.id !== 'shop-words')
        .map(({ pack, nodes }) => {
          const keys = nodes.map((n) => n.key);
          return (
            <section key={pack.pack.id} className="stack">
              <p className="eyebrow">
                {pack.pack.title} · {pack.pack.level}
              </p>
              {pack.units.map((unit) => (
                <div key={unit.id} className="card stack unit">
                  <h2>{unit.title}</h2>
                  <ol className="path-list">
                    {nodes
                      .filter((n) => n.unit.id === unit.id)
                      .map((n, i) => {
                        const done = save.nodes[n.key];
                        const open = isUnlocked(save, keys, n.key);
                        const boss =
                          n.node.kind === 'checkpoint'
                            ? bosses.find(
                                (b) =>
                                  b.checkpoint?.packId === n.packId &&
                                  b.checkpoint.nodeId === n.node.id,
                              )
                            : undefined;
                        const href = boss ? `/boss/${boss.id}` : `/lesson/${n.packId}/${n.node.id}`;
                        const icon =
                          n.node.kind === 'checkpoint'
                            ? '鬼'
                            : n.node.kind === 'story'
                              ? '話'
                              : done
                                ? '済'
                                : String(i + 1);
                        return (
                          <li
                            key={n.key}
                            className={`path-node ${done ? 'done' : ''} ${open ? 'open' : 'locked'} ${i % 2 ? 'alt' : ''}`}
                          >
                            {open ? (
                              <Link
                                to={href}
                                className="path-dot"
                                aria-label={`${n.node.title}${done ? ', completed' : ''}`}
                              >
                                <span lang="ja" aria-hidden="true">
                                  {icon}
                                </span>
                              </Link>
                            ) : (
                              <span className="path-dot" aria-label={`${n.node.title}, locked`}>
                                <span aria-hidden="true">·</span>
                              </span>
                            )}
                            <div className="stack" style={{ gap: 0 }}>
                              <strong>{n.node.title}</strong>
                              <span className="muted tiny">
                                {n.node.kind === 'checkpoint'
                                  ? boss
                                    ? `Boss · ${boss.en}`
                                    : 'Checkpoint'
                                  : n.node.kind === 'story'
                                    ? 'Story'
                                    : `${n.node.exercises.length} exercises`}
                              </span>
                              {done && <Stars n={done.stars} />}
                            </div>
                          </li>
                        );
                      })}
                  </ol>
                </div>
              ))}
            </section>
          );
        })}
      <Link className="btn btn-block" to="/packs">
        Add lessons from ChatGPT
      </Link>
    </div>
  );
}
