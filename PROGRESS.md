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
- **Toy VX pass (ADR 0007):** lazy three.js toy stage (backdrop world + front effects layer, one loop), training-start gate (bushes part, fbm fog dissolves, lanterns light) into grove/shrine/dojo worlds that stay alive behind every training, 3D stamp/crack/lanterns/hanabi/coins/stars/shatter effects on animation slots, live 3D shop items, purchase reveal, tap-to-open gachapon capsule, boss shatter; frame-time governor + device tiers (per-device, not in the save); haptic vocabulary (Android patterns, iPhone switch ticks) with a Haptics setting and a 3D quality setting.
- **M7 Voice tooling:** voice-build (speaker/style by name, reading check vs furigana, 1.0×/0.75×, afconvert AAC, hashed names, manifest + credits, .jlpack to outbox), voice-audition (local page, writes voices.json), `Voice Audition.command`, `Voice Packs.command`. Not run for real: VOICEVOX not installed.
- **Elo skill ratings** update from every answer (item difficulty from FSRS); dojo ranks and belt follow.
- **Verification:** 118 unit tests, content-lint, 16 WebKit e2e tests (golden path, ChatGPT loop, backup/restore, axe, dark mode, offline).

## In progress

- (nothing) — the fresh-context review's 15 findings are fixed with regression tests (hearts at 0 in the Dojo, heart loss committed per answer, goal changes, kotatsu waste, kintsugi window and trial, difficulty lock and heart clamp, particle grading, romaji particles, accents, review debt for disabled packs, zip bombs, all-or-nothing restore, onigiri at full hearts, data-driven rush/boss/charm numbers, first-exposure grading).

## Next

- Owner: publish (Publish to GitHub.command), install VOICEVOX, run Voice Audition and Voice Packs.
- Daily quests, omikuji, seasons (v1.1 in the plan); KanjiVG stroke data for graded tracing; Lighthouse CI; Storybook.

## Decisions

- docs/adr/0001-project-folder.md · 0002-engine-pure-libraries.md · 0003-exercise-shapes.md · 0004-starter-pack-scope.md · 0005-voice-reading-fallback.md · 0006-game-visual-direction.md

## Known issues

- Toy VX not yet felt on a real iPhone/Android (haptics and governor need hardware); tools/authoring.test.ts fails only on Windows checkouts with CRLF line endings.

- Not deployed: creating the public GitHub repo needs the owner (permission was not granted overnight).
- Trace exercises are self-graded (no stroke-order data bundled yet).
- Real-iPhone checks (silent switch, home-screen install, airplane mode) not done: needs the owner's device.
