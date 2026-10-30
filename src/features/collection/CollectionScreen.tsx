import { useState } from 'react';
import { cardsOf, speciesFor, spiritStage, type SpiritStage } from '../../engine/world';
import { itemJapanese, itemMeaning } from '../../engine/pack/index';
import { useGame } from '../../foundations/store/gameStore';
import { spirits } from '../../foundations/world';
import { SpeakableJa } from '../../foundations/japanese/Ja';
import { useSave, useStats } from '../hooks';
import '../town/town.css';

const STAGE_LABEL: Record<SpiritStage, string> = {
  egg: 'Egg',
  sprite: 'Sprite',
  guardian: 'Guardian',
  fading: 'Fading',
  lost: 'Lost in the fog',
};

function SpiritArt({ stage, hue }: { stage: SpiritStage; hue: number }) {
  const fill = `hsl(${hue} 60% 62%)`;
  if (stage === 'egg')
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <ellipse
          cx="20"
          cy="22"
          rx="11"
          ry="14"
          fill="var(--c-surface-alt)"
          stroke={fill}
          strokeWidth="2"
        />
        <path d="M12 22 L16 19 L20 23 L24 19 L28 22" stroke={fill} fill="none" strokeWidth="1.5" />
      </svg>
    );
  const r = stage === 'guardian' ? 15 : 11;
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      {stage === 'guardian' && (
        <circle cx="20" cy="20" r="19" fill="none" stroke="var(--c-gold)" strokeWidth="1.5" />
      )}
      <path
        d={`M${20 - r} 24 Q${20 - r} ${20 - r} 20 ${20 - r} Q${20 + r} ${20 - r} ${20 + r} 24 Q${20 + r * 0.5} ${24 + r * 0.5} 20 ${24 + r * 0.3} Q${20 - r * 0.5} ${24 + r * 0.5} ${20 - r} 24Z`}
        fill={fill}
      />
      <circle cx={20 - r * 0.35} cy="20" r="1.8" fill="var(--c-ink)" />
      <circle cx={20 + r * 0.35} cy="20" r="1.8" fill="var(--c-ink)" />
    </svg>
  );
}

export function CollectionScreen() {
  const save = useSave();
  const stats = useStats();
  const index = useGame((s) => s.index);
  const scheduler = useGame((s) => s.scheduler)!;
  const [filter, setFilter] = useState<SpiritStage | 'all'>('all');
  const ids = [...new Set(Object.keys(save.cards).map((k) => k.split('#')[0]!))];
  const rows = ids
    .map((id) => ({
      item: index.item(id),
      stage: spiritStage(cardsOf(save, id), stats.now, scheduler, save.boosts.omamori[id] ?? 0),
    }))
    .filter((r) => r.item && (filter === 'all' || r.stage === filter));
  return (
    <div className="stack">
      <h1>Spirits</h1>
      <p className="muted small">
        Every item you learn wakes a spirit. It grows with your memory and fades when a review is
        overdue.
      </p>
      <div className="seg" role="group" aria-label="Filter">
        {(['all', 'egg', 'sprite', 'guardian', 'fading', 'lost'] as const).map((f) => (
          <button
            key={f}
            className="btn btn-small"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : STAGE_LABEL[f]}
          </button>
        ))}
      </div>
      {!rows.length && <p className="card">No spirits here yet. Finish a lesson to wake some.</p>}
      <div
        className="grid-2"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
      >
        {rows.map(({ item, stage }) => (
          <div key={item!.id} className={`card card-tight spirit ${stage}`}>
            <SpiritArt stage={stage} hue={speciesFor(item!, spirits)?.hue ?? 0} />
            <SpeakableJa text={itemJapanese(item!)} className="big-ja" />
            <span className="small">{itemMeaning(item!)}</span>
            <span
              className={`pill ${stage === 'guardian' ? 'pill-gold' : stage === 'fading' || stage === 'lost' ? 'pill-accent' : ''}`}
            >
              {STAGE_LABEL[stage]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
