/** The ChatGPT loop: import → validate → preview → install, plus the library, backups and the Learner Report. */
import { useRef, useState, type DragEvent } from 'react';
import { Link } from 'react-router';
import {
  formatErrorsForChatGPT,
  validatePack,
  type ValidationResult,
} from '../../engine/pack/validate';
import { lineKey } from '../../engine/pack/lines';
import { buildReport, reportMarkdown } from '../../engine/report';
import type { Item } from '../../schema/pack';
import { parsePastedJson, readFile, readUrl, type ImportPayload } from '../../foundations/importer';
import { markBackedUp, useGame } from '../../foundations/store/gameStore';
import type { PackSource } from '../../foundations/storage/repos';
import { useSave } from '../hooks';

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

function download(name: string, text: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

interface Pending {
  payload: ImportPayload;
  result: ValidationResult;
  source: PackSource;
}

export function PacksScreen() {
  const save = useSave();
  const packs = useGame((s) => s.packs);
  const index = useGame((s) => s.index);
  const clock = useGame((s) => s.clock);
  const { installPack, removePack, setPackEnabled, exportBackup, restoreBackup, commit } =
    useGame.getState();
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const restoreInput = useRef<HTMLInputElement>(null);

  const check = (payload: ImportPayload, source: PackSource) => {
    const others = packs.filter(
      (p) => p.enabled && p.id !== (payload.json as { pack?: { id?: string } })?.pack?.id,
    );
    const knownItems = new Map<string, Item['kind']>(
      others.flatMap((p) => p.json.items.map((i) => [i.id, i.kind] as const)),
    );
    const knownDialogues = new Set(others.flatMap((p) => p.json.dialogues?.map((d) => d.id) ?? []));
    const voicedKeys = payload.voice
      ? new Set(Object.keys(payload.voice.manifest.lines).map(lineKey))
      : undefined;
    const result = validatePack(payload.json, {
      knownItems,
      knownDialogues,
      ...(voicedKeys ? { voicedKeys } : {}),
    });
    setPending({ payload, result, source });
    setMessage(null);
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setPending(null);
      setMessage({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  const onFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (f) void run(async () => check(await readFile(f), 'file'));
  };

  const installed = pending?.result.pack
    ? packs.find((p) => p.id === pending.result.pack!.pack.id)
    : undefined;
  const diff = (() => {
    if (!pending?.result.pack || !installed) return null;
    const oldIds = new Set(installed.json.items.map((i) => i.id));
    const newIds = new Set(pending.result.pack.items.map((i) => i.id));
    const changed = pending.result.pack.items.filter(
      (i) =>
        oldIds.has(i.id) &&
        JSON.stringify(i) !== JSON.stringify(installed.json.items.find((o) => o.id === i.id)),
    ).length;
    return {
      added: [...newIds].filter((i) => !oldIds.has(i)).length,
      removed: [...oldIds].filter((i) => !newIds.has(i)).length,
      changed,
    };
  })();
  const versionProblem =
    pending?.result.pack && installed && pending.result.pack.pack.version < installed.version
      ? `Version ${installed.version} is already installed; this is version ${pending.result.pack.pack.version}.`
      : null;

  const report = buildReport(
    save,
    index,
    packs.filter((p) => p.enabled).map((p) => ({ id: p.id, version: p.version })),
    clock.now(),
  );
  const daysSinceBackup = save.lastBackupAt
    ? Math.floor((clock.now() - save.lastBackupAt) / 86_400_000)
    : null;

  return (
    <div
      className="stack"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        onFiles(e.dataTransfer.files);
      }}
    >
      <h1>Packs & Backup</h1>

      <section
        className={`card stack ${dragging ? 'card-indigo' : ''}`}
        aria-label="Import a lesson pack"
      >
        <h2>Paste Lesson</h2>
        <p className="muted small">
          Paste ChatGPT's whole reply, choose a .json or .jlpack file, load a link, or drop a file
          on this page (Mac).
        </p>
        <label className="field">
          <span className="sr-only">Pack JSON</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='```json { "schemaVersion": "1.0.0", ... } ```'
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </label>
        <div className="row">
          <button
            className="btn btn-accent"
            disabled={!text.trim() || busy}
            onClick={() => void run(async () => check({ json: parsePastedJson(text) }, 'paste'))}
          >
            Check
          </button>
          <button className="btn" disabled={busy} onClick={() => fileInput.current?.click()}>
            Choose file
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,.jlpack,application/json,application/zip"
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <label className="sr-only" htmlFor="pack-url">
            Pack link
          </label>
          <input
            id="pack-url"
            type="url"
            inputMode="url"
            placeholder="https://gist.github.com/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            className="btn"
            disabled={!url || busy}
            onClick={() => void run(async () => check(await readUrl(url), 'url'))}
          >
            Load
          </button>
        </div>
        {message && (
          <p className={message.ok ? 'ok-text' : 'bad-text'} role="status">
            {message.text}
          </p>
        )}
      </section>

      {pending && !pending.result.ok && (
        <section className="card stack" aria-label="Validation errors">
          <h2 className="bad-text">{pending.result.errors.length} problem(s) found</h2>
          <ul className="small" style={{ maxHeight: 280, overflow: 'auto' }}>
            {pending.result.errors.slice(0, 50).map((e, i) => (
              <li key={i}>
                <code>{e.path}</code>: {e.message}
              </li>
            ))}
          </ul>
          <button
            className="btn btn-indigo"
            onClick={() =>
              void copy(
                formatErrorsForChatGPT(pending.result, pending.result.pack?.pack.title),
              ).then((ok) =>
                setMessage({
                  ok,
                  text: ok ? 'Errors copied. Paste them back into ChatGPT.' : 'Copy failed.',
                }),
              )
            }
          >
            Copy errors for ChatGPT
          </button>
        </section>
      )}

      {pending?.result.ok && pending.result.pack && (
        <section className="card card-accent stack" aria-label="Pack preview">
          <p className="eyebrow">Preview</p>
          <h2>
            {pending.result.pack.pack.title}{' '}
            <span className="pill">v{pending.result.pack.pack.version}</span>{' '}
            <span className="pill">{pending.result.pack.pack.level}</span>
          </h2>
          <p>{pending.result.pack.pack.description}</p>
          <p className="small">
            {pending.result.stats!.units} units · {pending.result.stats!.nodes} nodes ·{' '}
            {pending.result.stats!.exercises} exercises
            <br />
            {Object.entries(pending.result.stats!.items)
              .filter(([, n]) => n)
              .map(([k, n]) => `${n} ${k}`)
              .join(' · ')}
            <br />
            Voice:{' '}
            {pending.result.stats!.voicedLines === pending.result.stats!.voiceLines
              ? 'fully voiced'
              : `voice pending (${pending.result.stats!.voicedLines}/${pending.result.stats!.voiceLines} lines have audio; the device voice reads the rest)`}
          </p>
          {diff && (
            <p className="small">
              Update from v{installed!.version}: {diff.added} new, {diff.changed} changed,{' '}
              {diff.removed} removed (archived, progress kept).
            </p>
          )}
          {pending.result.warnings.filter((w) => w.path !== '(voice)').length > 0 && (
            <details className="small">
              <summary>
                {pending.result.warnings.filter((w) => w.path !== '(voice)').length} warning(s)
              </summary>
              <ul>
                {pending.result.warnings
                  .filter((w) => w.path !== '(voice)')
                  .map((w, i) => (
                    <li key={i}>
                      {w.path}: {w.message}
                    </li>
                  ))}
              </ul>
            </details>
          )}
          {versionProblem && <p className="bad-text">{versionProblem}</p>}
          <div className="row">
            <button
              className="btn btn-accent"
              disabled={busy || !!versionProblem}
              onClick={() =>
                void run(async () => {
                  const r = await installPack(
                    pending.result.pack!,
                    pending.source,
                    pending.payload.voice,
                  );
                  setPending(null);
                  setText('');
                  setMessage({
                    ok: true,
                    text: r.updated
                      ? `Updated. ${r.archived.length} removed item(s) archived; progress kept.`
                      : 'Installed. Find it on the Path.',
                  });
                })
              }
            >
              {installed ? 'Update' : 'Install'}
            </button>
            <button className="btn btn-ghost" onClick={() => setPending(null)}>
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="card stack" aria-label="Pack library">
        <h2>Library</h2>
        {packs.map((p) => (
          <div
            key={p.id}
            className="row spread"
            style={{ borderTop: '1px solid var(--c-border)', paddingTop: 'var(--sp-3)' }}
          >
            <div className="stack" style={{ gap: 0 }}>
              <strong>{p.json.pack.title}</strong>
              <span className="muted tiny">
                {p.id} · v{p.version} · {p.source} · {p.voice ? 'voiced' : 'voice pending'}
              </span>
            </div>
            <div className="row" style={{ gap: 'var(--sp-1)' }}>
              <button
                className="btn btn-small"
                onClick={() => void setPackEnabled(p.id, !p.enabled)}
              >
                {p.enabled ? 'Disable' : 'Enable'}
              </button>
              <button
                className="btn btn-small"
                onClick={() =>
                  download(`${p.id}-v${p.version}.json`, JSON.stringify(p.json, null, 2))
                }
              >
                Export
              </button>
              {p.source !== 'starter' && (
                <button
                  className="btn btn-small btn-ghost"
                  onClick={() =>
                    window.confirm(
                      `Delete "${p.json.pack.title}"? Its progress is archived, not erased.`,
                    ) && void removePack(p.id)
                  }
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        <Link to="/path" className="btn btn-small btn-ghost">
          Go to the Path
        </Link>
      </section>

      <section className="card stack" aria-label="Learner Report">
        <h2>Learner Report for ChatGPT</h2>
        <p className="muted small">
          Tells ChatGPT what you know, what you get wrong and what you want next.
        </p>
        <label className="field">
          Notes for your teacher
          <textarea
            style={{ minHeight: 90, fontFamily: 'var(--font-ui)' }}
            value={save.notes}
            onChange={(e) => commit({ ...save, notes: e.target.value })}
            placeholder="e.g. I'm going to Kyoto in May; I want food and train phrases."
          />
        </label>
        <div className="row">
          <button
            className="btn btn-indigo"
            onClick={() =>
              void copy(reportMarkdown(report)).then((ok) =>
                setMessage({
                  ok,
                  text: ok
                    ? 'Report copied. Paste it into your ChatGPT project and add your request.'
                    : 'Copy failed.',
                }),
              )
            }
          >
            Copy for ChatGPT
          </button>
          <button
            className="btn"
            onClick={() =>
              download('kotodama-learner-report.json', JSON.stringify(report, null, 2))
            }
          >
            Save as JSON
          </button>
        </div>
        <details className="small">
          <summary>Preview</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 'var(--fs-xs)' }}>
            {reportMarkdown(report)}
          </pre>
        </details>
      </section>

      <section className="card stack" aria-label="Backup">
        <h2>Backup</h2>
        <p className="small">
          {daysSinceBackup === null
            ? 'Never backed up. Browser storage is not guaranteed: keep a backup file.'
            : `Last backup ${daysSinceBackup === 0 ? 'today' : `${daysSinceBackup} day(s) ago`}.`}
        </p>
        <div className="row">
          <button
            className="btn btn-accent"
            onClick={() => {
              const b = exportBackup();
              download(
                `kotodama-backup-${new Date(b.exportedAt).toISOString().slice(0, 10)}.json`,
                JSON.stringify(b),
              );
              markBackedUp();
            }}
          >
            Download backup
          </button>
          <button className="btn" onClick={() => restoreInput.current?.click()}>
            Restore…
          </button>
          <input
            ref={restoreInput}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              void run(async () => {
                if (
                  !window.confirm(
                    'Restoring replaces the progress on this device with the backup. Continue?',
                  )
                )
                  return;
                const r = await restoreBackup(JSON.parse(await f.text()));
                setMessage(
                  r.ok ? { ok: true, text: 'Backup restored.' } : { ok: false, text: r.error },
                );
              });
            }}
          />
        </div>
        <p className="muted tiny">
          The Mac and iPhone share progress this way: back up on one, restore on the other.
        </p>
      </section>
    </div>
  );
}
