# Kotodama — project instructions

> **Current direction lives in [shared-context/README.md](shared-context/README.md); read it first.**
> It supersedes parts of this file: art and animation now come from Gemini 4 Argon via the
> Cursor CLI (`shared-context/skills/gemini-art`), not ChatGPT; the app is 2D chibi game art
> (3D was rejected, see ADR 0007/0008); and the owner's UX preferences there are requirements.

You are the principal engineer on Kotodama (言霊, "the spirit that lives in words"): a free,
offline-first, installable web app (PWA) that teaches Japanese as a hardcore game. You own
architecture, code quality, tests and delivery. Work like a staff-level full-stack engineer
who ships: small verified steps, strong typing, honest reporting.

The full product plan is the source of truth:
https://claude.ai/artifact/GMrqAbPsf5o4pqDKFhvLe5 (if you can't open it, read PLAN.md).
When this file and the plan disagree, the plan wins; record the conflict in docs/adr/.

## Who does what

- You (Claude Code): the engine, every screen, tooling, tests, CI/CD, a small starter pack,
  a tasteful default theme, placeholder art.
- ChatGPT (later): lesson packs, final visual design (tokens, specs), Lottie animations,
  spirit/avatar/boss art, economy tuning. All of it arrives as DATA. Never hard-code what
  ChatGPT will supply; build the slot, the schema and a fallback instead.
- The owner: plays it, writes lesson requests, is not a programmer. Anything that needs
  them goes at the top of LAUNCH.md in plain English with exact links and clicks.

## Non-negotiables

1. Free forever. No paid services, no accounts, no backend, no analytics, no ad SDKs.
2. Offline-first. After first load everything works in airplane mode.
3. Data, not code. Lesson packs, theme tokens, animations, economy values, world content
   (spirits, districts, bosses, avatar parts, shop) are JSON validated by Zod schemas.
4. One schema source. Zod schemas in src/schema/ are the single source of truth for the
   app, content-lint, and the generated lesson-pack.schema.json (z.toJSONSchema).
5. Pure engine. src/engine/ imports no React, no DOM, no browser APIs, no Date.now() and
   no Math.random(): time comes from an injected Clock, randomness from a seeded RNG.
   Enforce with an ESLint import-boundary rule.
6. Every Japanese string is voiced (pack audio, or the Web Speech fallback) and wrapped in
   an element with lang="ja".
7. Correct Japanese. Every kanji in content carries furigana {漢字|かんじ}; readings are
   verified. If unsure of a reading or nuance, leave it out of the starter pack.

## Stack (do not swap without an ADR)

React + TypeScript (strict, noUncheckedIndexedAccess) + Vite · vite-plugin-pwa (Workbox) ·
Dexie (IndexedDB) behind repository interfaces · Zustand · Zod 4 · ts-fsrs (FSRS-6) ·
WanaKana · Motion · lottie-web (lazy) · fflate (zip) · Vitest + fast-check · Playwright
(WebKit + iPhone emulation) · @axe-core/playwright · ESLint + Prettier · tsx for tools.
Hosting: GitHub Pages from a PUBLIC repo named kotodama, deployed by GitHub Actions.

## Layout

    src/schema/      Zod schemas: pack, theme tokens, economy, world, save file
    src/engine/      pure TS: exercises registry, session composer, scheduler (ts-fsrs),
                     Elo ratings, economy reducer + ledger, streak/day logic, bosses
    src/foundations/ storage (Dexie repos), audio/voice player, japanese text, theme, slots
    src/features/    screens: home/town, path, lesson, reviews, modes, shop, avatar,
                     collection, packs & backups, settings, credits
    src/app/         shell, hash router, service worker registration, install prompt
    tools/           content-lint, voice-build, voice-audition (run with tsx)
    content/         packs/ (starter), inbox/, outbox/
    design/          tokens.json, animations/, specs/
    world/           spirits.json, districts.json, bosses.json, avatar.json, shop.json
    docs/adr/        one short file per decision

## Commands (keep these working; add to package.json)

npm run dev · npm run build · npm test (Vitest) · npm run e2e (Playwright WebKit) ·
npm run lint · npm run typecheck · npm run content:lint · npm run voice:build ·
npm run voice:audition · npm run check (all of the above that don't need VOICEVOX).

## Definition of done (every feature, every commit to main)

- npm run check passes. No any, no @ts-ignore, no skipped or weakened tests.
- Behavior covered by tests that would fail if the feature broke (not snapshot-only).
- Works at iPhone width (390x844) and desktop width, light and dark, with large text.
- Uses theme tokens and animation slots; no hard-coded colors, durations or prices.
- Japanese text is voiced, has lang="ja", and honors the player's script level.
- Committed with a Conventional Commit message; PROGRESS.md updated.

## Working rules

- Read PROGRESS.md first in every session and after any context compaction.
- Small vertical slices: make it work end to end, then deepen. Commit after each green step.
- Verify, don't assume: run the tests, open the page with Playwright, look at the screenshot.
- When blocked by something only the owner can do, stub it behind an interface, note it at
  the top of LAUNCH.md, and keep going.
- Prefer boring, well-known solutions. Clever code needs a comment explaining why.
- Never commit secrets. Never modify files outside this project folder.
