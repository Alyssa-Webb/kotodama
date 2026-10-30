# Overnight mission: build Kotodama

Read CLAUDE.md, then the plan (https://claude.ai/artifact/GMrqAbPsf5o4pqDKFhvLe5, or PLAN.md),
then this file. Then start. The owner is asleep for about 8 hours and will not answer
questions: decide, record the decision, and keep moving.

## What success looks like in the morning

In priority order. Finishing 1-4 solidly beats starting 5-8 and finishing none.

1. Live and installable. https://<username>.github.io/kotodama/ serves the app; it
   installs to the iPhone home screen and the Mac Dock and opens offline.
2. A real lesson, end to end. From the starter pack: pick a node, play 10-15 mixed
   exercises with audio, see results, earn XP and koban, and the items enter review.
3. The memory loop. FSRS reviews, streak, day rollover, Hardcore hearts, saved progress
   that survives reloads, backup and restore.
4. The ChatGPT loop. Paste or import a pack, validate it, preview it, install it, play it,
   export a Learner Report. AUTHORING.md contains the plan's ChatGPT prompt verbatim.
5. Economy and shop (koban ledger, consumables, charms, Hardcore consequences).
6. The world: town districts, spirits that grow and fade, avatar, first boss.
7. Game modes: Kana Rush, Listening Rush, dictation, lesson review.
8. Voice pipeline run for real (only if the VOICEVOX engine is reachable).

Each milestone must leave main deployable and green. Never leave the app broken at the end
of a milestone.

## Autonomy rules

- Ambiguity: choose the option that is reversible, simplest, and closest to the plan;
  write a 5-line ADR in docs/adr/ (context, decision, alternatives, consequences).
- Blocked on the owner (GitHub sign-in, VOICEVOX not installed): build the interface and a
  fallback, add a one-line instruction to the top of LAUNCH.md, continue.
- A test fails: fix the code or the test's wrong assumption. Never delete, skip, or loosen
  a test to get green, and never special-case test inputs in production code.
- Context: keep PROGRESS.md current (done / in progress / next / decisions / known issues).
  After any compaction, re-read CLAUDE.md and PROGRESS.md before acting.
- Review yourself: at the end of each milestone, spawn a reviewer subagent with fresh
  context to review the diff against CLAUDE.md's definition of done; fix what it finds.

## Milestone plan

### M0 — Foundations (aim: first 60-90 min)
- git init; scaffold Vite + React + TS strict; install the stack from CLAUDE.md.
- ESLint import boundaries: engine imports only schema; foundations never imports
  features. Prettier, typecheck, Vitest, Playwright (WebKit project + iPhone 15 profile).
- PWA: manifest with scope and start_url /kotodama/, display standalone, theme and
  background colors, 192/512 icons plus a 180x180 apple-touch-icon (generate a simple
  original 言 seal mark as SVG, then render the PNGs). Vite base '/kotodama/'.
  Hash routing (createHashRouter), so GitHub Pages needs no 404 tricks.
- viewport-fit=cover, safe-area insets via env(safe-area-inset-*), 100dvh layouts.
- GitHub: if `gh auth status` succeeds, `gh repo create kotodama --public --source . --push`,
  then add .github/workflows/ci.yml (check on PRs and pushes) and deploy.yml (build, then
  actions/upload-pages-artifact + actions/deploy-pages), and enable Pages with build type
  "workflow" (`gh api -X POST repos/{owner}/kotodama/pages -f build_type=workflow`, or PUT if
  it exists). Get the username with `gh api user -q .login`.
  If not signed in: create "Publish to GitHub.command" (chmod +x) that runs
  `gh auth login --web`, creates the repo, pushes, and enables Pages, with clear echo output.
- Write the first LAUNCH.md skeleton now, so a morning report exists even if the night
  ends early.

### M1 — Schemas, starter pack, lesson player
- Zod schemas for the pack exactly as the plan's ChatGPT prompt defines (TypeScript types
  to Zod). Generate lesson-pack.schema.json. A test validates the prompt's example pack.
- content-lint (tsx CLI): schema, referential integrity, kana-only readings, balanced
  furigana, every tiles array joins back to its text, unique IDs, introduces-exactly-once,
  node rules (10-15 exercises, at least 4 types), reachable nodes, voice coverage report.
- Furigana parser {漢字|かな} to tokens to <ruby> with <rt>; hide or show by script level.
- Starter pack (about 60-80 items, all N5, all checked twice):
  - Unit "Kana Gate": hiragana あ to こ (kana items with trace and match exercises).
  - Unit "The Café" (district: café): about 12 words, はじめまして, いただきます,
    お願いします, the pattern ＿をください, 6 sentences, one dialogue, a checkpoint boss.
  Keep it small and correct; ChatGPT writes the real curriculum later.
- Exercise plugin registry and the v1 types: choice, match, listen, dictation, tiles, type,
  fill, situation, translate, register, pattern (trace may come later). Each plugin =
  Zod schema + React component + pure grader + unit tests for its grader.
- Answer normalization: NFKC, full/half width, optional hiragana/katakana fold, long-vowel
  variants, trailing punctuation, accept[] alternates. Property tests with fast-check.
- Lesson player: progress bar, combo/Kiai meter, hearts, instant feedback, lesson-complete
  screen, lesson review (each mistake with the right answer).

### M2 — Memory, time, persistence
- Dexie schema v1 with explicit migrations; repositories behind interfaces; in-memory
  implementations for tests.
- ts-fsrs scheduling: two cards per phrase, pattern and sentence (understand / produce).
  Rating from correctness, hints, and response time. Retention target 0.9.
- Day logic: the game day rolls over at 04:00 local time (configurable), computed from the
  injected Clock and the device time zone. Test midnight, 03:59/04:01, DST in both
  directions, and changing time zone mid-streak.
- Streak, kotatsu freeze auto-use, review debt, Hardcore hearts (5, refill 1 per hour or 1
  per 10 Dojo reviews), lesson failure at zero hearts.
- navigator.storage.persist() on first meaningful save. Backup/restore: one versioned JSON
  file (Zod-validated) with progress, ledger, packs metadata, settings.

### M3 — The ChatGPT loop
- Import screen: paste JSON, choose a file (input type=file accepting .json and .jlpack),
  load from URL, drag-and-drop on Mac. Unzip .jlpack with fflate; reject path traversal,
  oversize files, and non-allowlisted media types.
- Preview, install, play. Same pack ID + higher version updates in place; progress keyed by
  item ID survives; removed items are archived.
- Errors: human-readable list plus a "Copy errors for ChatGPT" button.
- Learner Report: Markdown (paste-ready, prefixed with a one-line instruction for ChatGPT)
  and JSON. "Copy for ChatGPT" button. AUTHORING.md = the plan's prompt verbatim.

### M4 — Economy and Hardcore rules
- Event-sourced ledger: every koban, token and heart change is an event; balances are a
  pure reduction. economy.json holds every number from the plan's Incentives section.
- Shop with the plan's consumables and charms; buying an item adds its Japanese name as an
  item to the collection. Koban spoil (10% per missed day in Hardcore), Kintsugi +
  Redemption Trial (20 questions from weakest items, at most 2 mistakes), difficulty modes.
- Gachapon with a seeded RNG stored in state, published odds, duplicate protection, pity.

### M5 — World, avatar, boss
- Town map of districts (SVG placeholder art, lit or dark), spirit stages from FSRS
  stability (egg, sprite, guardian, fading, lost in fog), bonsai that grows and withers.
- Layered SVG avatar with slots from the plan; placeholder parts; equip screen.
- Boss battle engine (HP, phases that change exercise type, hearts, once per day in
  Hardcore) with Mojibake as the first boss on the café checkpoint.

### M6 — Modes and polish
- Kana Rush, Listening Rush (3 misses, timer, ghost of your best run), dictation, trace
  (canvas + Pointer Events; KanjiVG data with CC BY-SA attribution on the Credits screen).

### M7 — Voice (only if `curl -s localhost:50021/version` answers)
- voice-build: discover speaker and style IDs via GET /speakers by NAME (冥鳴ひまり for
  Akari, 青山龍星 for Tetsu), never hard-coded numbers. For each line:
  POST /audio_query?text=&speaker=, compare the moras' kana with the expected reading from
  the furigana; if they differ, rebuild from kana via
  POST /accent_phrases?text=<kana>&speaker=&is_kana=true. Set speedScale 1.0 and 0.75.
  POST /synthesis to WAV, then AAC with macOS's built-in `afconvert -f m4af -d aac`
  (no ffmpeg needed). File name = hash(text, reading, voice, style, speed). Write the
  manifest and the credits ("VOICEVOX:冥鳴ひまり", "VOICEVOX:青山龍星"); bundle the
  .jlpack into outbox/.
- voice-audition: render 10 sample lines for each candidate voice and style and generate a
  local HTML page to choose by ear; write the choice to voices.json.
- Double-clickable "Voice Audition.command" and "Voice Packs.command" (inbox/ to outbox/),
  which first check that VOICEVOX is running and say exactly what to do if not.
- Voice setting in the app: Akari, Tetsu, Alternate by lesson (default), Alternate by line,
  Duet (Akari teaches, Tetsu quizzes; they voice the two dialogue speakers).

## Platform knowledge you must apply (iOS home-screen PWA)

- Audio: set navigator.audioSession.type = 'playback' when available, so sound plays on
  silent; create or resume the AudioContext inside the first user gesture; preload a
  lesson's clips before it starts; a "Respect silent switch" setting turns this off.
- Speech fallback: speechSynthesis with a ja-JP voice, chosen after voiceschanged; cap the
  utterance queue; never block a lesson waiting for voices.
- Storage: installed apps don't share storage with Safari tabs. Detect standalone mode
  (navigator.standalone or matchMedia('(display-mode: standalone)')) and, in a browser tab,
  show a gentle "Add to Home Screen" guide instead of letting progress live in a tab.
- No install prompt event on iOS: show manual Share, then Add to Home Screen instructions.
- Service worker updates: prompt-to-update flow ("Update ready"), never a silent reload
  mid-lesson. Precache the app shell; cache installed pack audio in IndexedDB or the
  Cache API.
- Input: 16px minimum font in inputs (prevents iOS zoom), autocapitalize="off",
  autocorrect="off", spellcheck={false} on answer fields; the Japanese IME must work for
  typing exercises (handle compositionstart/compositionend).
- Motion: honor prefers-reduced-motion. Tap targets at least 44x44.

## Default look (ChatGPT replaces it later via tokens)

Make it beautiful now; a reviewer should want to play it. A calm Japanese palette in
design/tokens.json: washi off-white, sumi ink, vermilion accent, indigo secondary, gold for
koban, with a matching dark mode (ink background, paper text). System fonts: Hiragino Sans
for UI, Hiragino Mincho for large Japanese display text. Rounded cards, generous spacing,
satisfying micro-interactions (correct = soft vermilion pulse plus a Web Audio synthesized
chime; wrong = brief shake). All animation goes through the named slots.

## Verification loop (do this at every milestone)

1. npm run check is green.
2. Playwright drives the golden path on WebKit at iPhone size and saves screenshots to
   docs/screenshots/ (home, lesson in progress, results, shop, town, import). Open and
   inspect them; fix anything that looks broken, cramped, or unstyled.
3. Reviewer subagent pass; fix findings.
4. Commit, push, confirm the deploy workflow succeeded (gh run watch or gh run list).
5. Update PROGRESS.md.

## Before you stop: the morning report

Finish LAUNCH.md with, in this order:

1. Status in three lines: live link (or why not), what works, what's next.
2. Needs you (numbered, plain English, exact links): e.g. sign in to GitHub, install
   VOICEVOX from https://voicevox.hiroshiba.jp/, run Voice Audition.
3. The plan's morning launch kit with every link filled in for the real username.
4. What was built, by milestone, with screenshots linked from docs/screenshots/.
5. Known issues and decisions (link the ADRs).
6. How to give ChatGPT its first lesson request (the AUTHORING.md flow).

Do not claim anything works that you did not run and see working.
