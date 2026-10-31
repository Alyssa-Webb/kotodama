# Claims board: who is doing what right now

Ken's and Alyssa's main worry is the two AIs coding at the same time. This board prevents it. **No AI starts work on anything without claiming it here first.** Rules are in `../COLLABORATION.md` §2.

## How to claim (the push is the lock)

1. `git pull` and read this board, including the files every active claim lists.
2. If any active claim lists a file or folder you need, **stop.** Pick other work or ask in `room.md`. Never edit another AI's claimed files.
3. Add your row under **Active**, commit only this file (`chore(claims): claude claims <task>`) and **push right away, before touching any code.**
4. **If the push is rejected,** someone else pushed first. Pull, re-read the board, and go back to step 2. The claim that reached `main` first wins; never force-push.
5. Only after your claim is on `main`, start the work.
6. When done, or if you stop, move your row to **Done** (or delete it) in the same push as your final commit, or right after. Post a one-line note in `room.md`.

## Rules

- **List files precisely:** folders or globs are fine (`src/features/town/**`). Shared, high-traffic files (`src/app/global.css`, `world/*.json`, `package.json`, the starter pack) need a line in `room.md` before editing, even when they're in your claim, and only small, quick edits.
- **One active claim per AI**, plus at most one Argon art run each (two total across both machines).
- **Stale claims:** a claim with no commit or update for 24 hours may be taken over, after a note in `room.md` and a 2-hour wait for a reply.
- **Humans override:** Ken or Alyssa can edit this board at any time.
- When the GitHub-issue rule is live, the claim also names its issue (`#42`), and the issue gets the AI's label plus `status:in-progress`.

## Active

| Task | AI  | Files and folders | Branch | Issue | Claimed (UTC) |
| ---- | --- | ----------------- | ------ | ----- | ------------- |

## Done

| Task                                                    | AI          | Finished (UTC)   | Commit      |
| ------------------------------------------------------- | ----------- | ---------------- | ----------- |
| Battle walk: the road moves, not the sky                | Claude      | 2026-10-30 20:10 | `128eace`   |
| Town as an illustrated map                              | Claude      | 2026-10-30 20:55 | `c6dc8f5`   |
| Home: softer, kinder, more useful controls              | Claude      | 2026-10-31 03:45 | `a7154ad`   |
| Battle backdrops per region                             | Claude      | 2026-10-31 03:50 | (this push) |
| Home as one screen (scene, Continue, reminders)         | Claude      | 2026-10-31 04:00 | (this push) |
| Home: shop front at dusk (noren, lantern, ema, omamori) | Alyssa's AI | 2026-10-31 04:15 | (this push) |
| Dojo Master Musashi (2D art)                            | Alyssa's AI | 2026-10-31 05:15 | `4608b1f`   |
| Path gates between regions                              | Alyssa's AI | 2026-10-31 06:30 | (this push) |
