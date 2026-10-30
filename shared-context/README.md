# Kotodama — shared context for co-developers and their AI

**Read this first, and follow the direction it describes.** This folder holds everything a new collaborator (human or AI) needs to continue Kotodama the way it has been built: the vision, the decisions behind it, the AI workflow, and the owner's explicit preferences. When something here conflicts with an older doc (for example, `CLAUDE.md` saying ChatGPT does the final visual design, or `PLAN.md`'s Duolingo-like path), **this folder and the ADRs win**. Record any new conflict as an ADR in `docs/adr/`.

## Contents

| Path                        | What it is                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                 | This guide: vision, rules, workflow, history, open work                                                                      |
| `HANDOFF.md`                | **The current task queue** from the owner, work in flight, and traps learned the hard way. Start here after this file        |
| `VOICEVOX.md`               | Setting up VOICEVOX and rendering the app's voices                                                                           |
| `design/world-and-story.md` | The world: regions as story chapters, the yokai bestiary, NPCs, the journey to fluency                                       |
| `design/town-tycoon.md`     | The town as a tycoon game: residents, stations, products, spirits with rarity                                                |
| `skills/gemini-art/`        | The Claude Code skill that delegates art and animation to Gemini 4 Argon through the Cursor CLI, with every brief we've sent |

Install the skill by copying `shared-context/skills/gemini-art/` to `.claude/skills/gemini-art/` in your checkout (`.claude/` is git-ignored and per-machine).

## 1. What Kotodama is now

A **game** for learning Japanese, endlessly. It must not feel like Duolingo or Quizlet. It's an offline-first PWA (React, TypeScript, Vite), free, with no accounts and no backend.

- **You are a traveller on a journey to fluency.** Regions are story chapters: Dojo (kana) → Bamboo Forest Road (phrases on the go) → Rice Fields & Village (food, numbers, shopping) → Castle Town (polite speech) → Mountain Shrines (kanji) → the Capital (conversation). See `design/world-and-story.md`.
- **Lessons are battles.** Your avatar, seen from behind, walks a woodland path and meets yokai. A correct answer is your attack and drains the enemy's health; a wrong answer is its attack and costs your HP. Damage grows the further along the story you are.
- **Health is persistent.** It never refills by itself. You heal only by eating: on Food Street you order from townsfolk in Japanese, hear the price in Japanese, pay by counting real yen, and eat. Better meals unlock as you level up.
- **Money teaches money.** The currency is real yen at realistic prices (¥150 onigiri, ¥950 ramen). Every price shows its Japanese reading (百五十円, ひゃくごじゅうえん), and checkout makes you count out the actual coins and notes. **Koban** (old gold coins) are the gacha currency.
- **Koto is the heart of the app,** our Duo. He's a chibi word-spirit (言霊) with 8 poses and 4 outfits: guide, shopkeeper with a fake mustache, mayor, sensei. He gives the **?** tour on Home, runs the shop counter, greets you as mayor in Town, and should appear in every role the game adds.
- **The town is a main screen** and becomes a tycoon game (see `design/town-tycoon.md`): words you learn become spirits and residents, spirits have rarities, stations and roles drive each building's products.
- **Gacha** is a case-opening reel with rarity-escalating effects. It costs earned koban only (never money), publishes its odds, and has duplicate protection and pity.

## 2. The owner's preferences (follow these)

Collected from direct feedback while building. Treat them as requirements.

- **A game first.** Every screen should feel playful, tactile and alive, never like a list of buttons or a quiz website.
- **Art style: chibi and cute** (Gemini's direction, chosen by the owner): big heads, round chunky shapes, flat saturated fills, a darker bottom shade band, one top-left highlight, no thin outlines. It's Duolingo's toy feel in spirit, with an original Japanese theme.
- **2D only.** A 3D (three.js) pass was built and rejected: it lagged on phones and looked worse. Don't reintroduce 3D.
- **Animation must be dynamic and polished.** Go beyond squash and stretch: particles, secondary motion, trails, hit-stop, impact. Every change the player should notice gets animated, whether HP, yen, XP or level. Animate only `transform` and `opacity` so it stays smooth on phones, and respect reduced motion.
- **Interactions should be physical:** swipe to slice the bushes open (a jagged cut that follows your finger), swipe between main tabs, tap to open capsules, count coins by tapping them.
- **Haptics** fire on taps and big moments (a named vocabulary in `design/animations.json`). iPhone Safari only supports light ticks; that's accepted.
- **English first in the UI.** Japanese appears as a learning hint, not as UI labels learners can't read yet (it's "Focus ×2 XP", not 気合！×2). Never reveal an answer: "Can't listen now?" skips the question rather than showing its text.
- **Low clutter.** Page titles are prominent banners of their own; there's no avatar or duplicate currency beside them. Pages should be compact and easy to scroll; the audience skews young.
- **Audio** must be slow and clear enough to enunciate, without lag or repeats. Koto has a cute chibi voice (device voice for now; VOICEVOX ずんだもん planned).
- **Testing:** give the owner a phone-testable build after every working milestone, and push to `main` (which deploys the live site) at each one.

## 3. How the work is split between AIs

> **Model rule (owner):** every _design_ (characters, avatar parts, yokai, items, scenes, icons, UI art) MUST be made by **Gemini 4 Argon** (`gemini-4-argon-high`), never a substitute. If Argon's provider drops, shrink the brief and retry Argon. Don't switch models. **GPT-5.6 Sol** (`gpt-5.6-sol-high`, via `run-model.sh`) is for action and motion animation only (attack choreography, effects timing) and must not edit design art. When a GPT run touches art files, merge only its animation files and send the art part to Argon.

| Who                                   | Does what                                                                                                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude (Claude Code)**              | Architecture, engine and game logic, data schemas, UI structure, wiring, tests, CI, reviewing and merging all AI art                          |
| **Gemini 4 Argon via the Cursor CLI** | All sprites, character art, item art, scene art and CSS/SVG animation, through the `gemini-art` skill                                         |
| **GPT (via Cursor) / ChatGPT**        | Lesson content: the structured, story-aligned curriculum. `AUTHORING.md` has the pack prompt, and `npm run content:lint` validates the output |

How we got here: Claude first drafted art itself, then a 3D pass, which was rejected. We then ran the same art brief through **GPT-5.6 Sol** and **Gemini 4 Argon** side by side, served both to the owner's phone, and the owner chose **Gemini's chibi direction**. Since then, every visual asset and animation goes through Gemini, and Claude stays on code.

### Using the gemini-art skill (lessons learned)

- **Setup:** install Cursor's CLI (`irm 'https://cursor.com/install?win32=true' | iex` on Windows), then sign in with `agent.cmd login`. Use the `.cmd` launcher. **Never change the PowerShell execution policy** to make `agent` work.
- **Briefs:** write one from `brief-template.md`. Keep the house-style and rules sections verbatim, and list the exact files Gemini may touch, without overlapping files other work is changing.
- **Running:** `bash .claude/skills/gemini-art/run.sh <brief> <base-branch>`, run in the background. It creates a worktree on `art/<brief>`, links `node_modules`, runs Gemini with `--force` inside that worktree only, and commits the result.
- **Keep briefs small.** Cursor's model provider often drops long runs (`NonRetriableError: Provider Error`). The runner commits whatever finished, so merge any complete parts and rerun a trimmed brief, often based on the partial branch.
- **Review every diff:** check it stays inside the brief's files, uses theme colors only, animates only transform and opacity, and leaves game logic alone. Then run the type checks, lint and tests, look at it at phone size, and merge.
- **Clean up with `cleanup.sh`.** Never `rm -rf` a worktree: its `node_modules` is a junction to the real one.
- **Read-only patch mode doesn't work:** we tried having the model return a diff instead of editing, and the hand-written patches were malformed. Use isolated worktrees instead.

## 4. Architecture map of the game systems

- **Moments** (`src/foundations/moments/`): full-screen 2D animations. The training gate with the swipe slice (`cut.ts` turns a swipe into the jagged cut, tested), red-ink 〇/✕ answer marks, sweeps, rays, coin arcs, the boss katana slash, noren curtains, the case-opening gacha reel (`CaseOpening.tsx`, with `engine/gachaReel.ts`). Timings are in `design/moments.json`.
- **Battle:** the rules in `engine/battle.ts` are derived from the lesson session, so they can't drift from grading. The view is `features/lesson/BattleStage.tsx`, and enemies are `foundations/art/Enemy.tsx`.
- **Health:** in `engine/game.ts`, hearts are HP points. Max HP is `maxHearts` (level-based), damage per miss is `damageFor` (scales with story unit), meals use `eatMeal`, and `playerLevel` comes from XP. Rules are in `economy.json`'s `hp` section.
- **Yen:**
  - `engine/text/yen.ts`: Japanese readings with sound changes, and the fewest coins for an amount.
  - `features/shop/PayCounter.tsx`: the coin-counting checkout.
  - `features/food/`: Food Street.
  - `world/meals.json`: the menu.
- **Koto:**
  - `foundations/art/Mascot.tsx`: his art.
  - `features/tour/`: the tour, plus `KotoSays` for his shop and town stages.
  - `world/koto.json`: his lines.
- **Haptics:** `foundations/haptics/` (the named patterns are in `design/animations.json`).
- **Everything tunable is data** (`design/*.json`, `world/*.json`), validated by Zod schemas in `src/schema/`.
- **Saves:** the save version is 2. The v1→v2 migration converts koban to yen at ¥10 each and hearts to HP at 20 each.

## 5. Testing and shipping

- `npm test`, `npx tsc -p tsconfig.json`, `npx eslint src e2e tools` and `npx playwright test` must all pass before pushing. On Windows, `tools/authoring.test.ts` fails only because of CRLF line endings.
- E2E runs with reduced motion (Playwright config), so animations never block clicks.
- **Phone testing on the LAN:**

  ```bash
  npx vite build --outDir dist-phone
  ```

  ```bash
  npx vite preview --host 0.0.0.0 --port 4176 --outDir dist-phone
  ```

  Then open `http://<PC-IP>:4176/kotodama/` from a phone on the same network. Reload to pick up new builds; the service worker caches the old one.

- **Live site:** pushing to `main` deploys https://alyssa-webb.github.io/kotodama/ through GitHub Actions. Merge others' `main` before pushing, and never force-push.
- Commits use Conventional Commit messages. Record decisions as ADRs in `docs/adr/` (0007 is the rejected 3D pass, 0008 the 2D moments and the avatar as a character).

## 6. Open work, in priority order

1. **Gemini animation passes** (briefs in `skills/gemini-art/briefs/`):
   - `stat-anim`: an animated HP bar and every stat change
   - `avatar-back`: the avatar redesign, back views and walk/attack motion
   - `battle-fx`: the yokai bestiary and dynamic attack effects

   All three have been hit by provider drops, so rerun any that didn't land.

2. **Compact layouts:** shorten the long-scroll pages (Shop first) into tighter, more scrollable formats, then a fine-detail polish pass through Gemini (shop counter wood, town houses, UI).
3. **VOICEVOX:** install it and voice Koto with a chibi mascot voice (ずんだもん), credited as `VOICEVOX:ずんだもん`. The voice tools (`npm run voice:build`, `voice:audition`) already exist.
4. **Structured story curriculum:** have GPT write chapter packs per region (see `AUTHORING.md`), validate with `content:lint`, and verify every reading.
5. **Town tycoon phase 1:** buildings, idle income, spirits with rarity, stations.
6. **Journey map** to replace the linear path, then region scenes, speech-bubble NPCs and travelling-merchant gacha.
7. **Before launch:** set `economy.testing.grantTokens` to 0 (it gives every save 5 koban for testing).
