# Progress

Read this first every session (and after any context compaction), together with CLAUDE.md.

## Done

- **M0 Foundations:** Vite + React + TS strict, ESLint layer boundaries (engine is pure: no DOM, Date.now, Math.random), Prettier, Vitest, Playwright (WebKit iPhone 15 + desktop Safari), PWA manifest (scope/start_url /kotodama/), 言 seal icons, hash router, safe areas, CI + Pages deploy workflows, `Publish to GitHub.command`.
- **M1 Content + lessons:** Zod pack schema = the plan's TypeScript spec; `lesson-pack.schema.json`; `validatePack` shared by app and `content-lint`; furigana parser and script levels; answer normalization (property-tested); 14 exercise plugins rendered through 6 shapes; starter pack (39 items, 133 exercises, readings checked twice); AUTHORING.md = plan prompt verbatim (tested).
- **M2 Memory:** FSRS-6 via ts-fsrs (understand/produce cards), grades from correctness, hints and time; 04:00 game-day rollover with DST and time-zone tests; streak, kotatsu auto-use, review debt, Hardcore hearts (hourly refill, 10 Dojo reviews = 1 heart); Dexie repos + in-memory repos; save migrations; persistent-storage request; backup/restore.
- **M3 ChatGPT loop:** paste / file (.json, .jlpack) / URL / drag-drop import, validation errors with "Copy errors for ChatGPT", preview with diff, install/update in place with archiving, pack library, Learner Report (Markdown + JSON).
- **M4 Economy:** event-sourced ledger, economy.json (every number from the plan), shop (consumables, charms), item names join reviews, koban spoil, Kintsugi + Redemption Trial, difficulty modes, gachapon (seeded RNG, published odds, duplicate protection, pity).
- **M5 World:** town districts, spirit stages from FSRS, bonsai, layered SVG avatar + equip screen, Mojibake boss battle (HP, phases, once per day in Hardcore).
- **M6 Modes:** Kana Rush, Listening Rush, Dictation drill (timer, misses, ghost of best run, daruma/hourglass), lesson review of mistakes, trace (canvas, self-graded).
- **Game-feel overhaul (owner request):** living ukiyo-e scene, reactive guides Akari/Tetsu, canvas FX layer (particles, flashes, shake, floating XP, 気合 banner), lacquer/gold game skin, stamped results, map path, boss art; all through tokens + animation slots (ADR 0006).
- **M7 Voice tooling:** voice-build (speaker/style by name, reading check vs furigana, 1.0×/0.75×, afconvert AAC, hashed names, manifest + credits, .jlpack to outbox), voice-audition (local page, writes voices.json), `Voice Audition.command`, `Voice Packs.command`. Not run for real: VOICEVOX not installed.
- **Elo skill ratings** update from every answer (item difficulty from FSRS); dojo ranks and belt follow.
- **Verification:** 103 unit tests, content-lint, 16 WebKit e2e tests (golden path, ChatGPT loop, backup/restore, axe, dark mode, offline).

## In progress

- Reviewer findings (fresh-context review) → fixes.

## Next

- Owner: publish (Publish to GitHub.command), install VOICEVOX, run Voice Audition and Voice Packs.
- Daily quests, omikuji, seasons (v1.1 in the plan); KanjiVG stroke data for graded tracing; Lighthouse CI; Storybook.

## Decisions

- docs/adr/0001-project-folder.md · 0002-engine-pure-libraries.md · 0003-exercise-shapes.md · 0004-starter-pack-scope.md · 0005-voice-reading-fallback.md · 0006-game-visual-direction.md

## Known issues

- Not deployed: creating the public GitHub repo needs the owner (permission was not granted overnight).
- Trace exercises are self-graded (no stroke-order data bundled yet).
- Real-iPhone checks (silent switch, home-screen install, airplane mode) not done: needs the owner's device.
