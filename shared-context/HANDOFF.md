# Handoff: open tasks for the next AI (2026-10-30)

Read `README.md` in this folder first (vision, the owner's preferences, the AI split, how to run the Gemini skill). This file is the **task queue** the owner set at the end of the last session, plus the state of the work in flight and the traps we hit. The owner is Ken (GitHub KenLinz). He tests on an iPhone (Safari and Chrome, both WebKit) through the live site, and wants a push to `main` (which deploys https://alyssa-webb.github.io/kotodama/) after every working milestone.

**Model rule (owner, non-negotiable):** every design (characters, yokai, scenes, UI art) is made by **Gemini 4 Argon** (`gemini-4-argon-high`) through the `gemini-art` skill. Claude does code, logic, tests and wiring. GPT-5.6 Sol only does action-animation timing.

## Task queue (owner's words, then what we know)

Do them as separate tasks, each verified on a phone-sized WebKit render and pushed on its own.

### 1. Voices: cute main character, womanly Akari, manly Tetsu

> "I need the main character's voice to be cute, and a womanly voice for Akari and manly for Tetsu like we talked about."

- **Current voices:** VOICEVOX clips live in `public/voice/`, built by `npm run voice:app` (`tools/voice-app.ts`) with VOICEVOX running at `127.0.0.1:50021`. Akari is 冥鳴ひまり, Tetsu is 青山龍星 and Koto is ずんだもん (the `KOTO` constant in `tools/voice-app.ts`). The guide voices come from `voices.json` at the repo root if present, else `DEFAULT_VOICES` in `tools/voice/lib.ts`.
- **First check what he actually hears.** Lines without a clip (and every line before the first clip is cached) fall back to the device voice in `src/foundations/audio/voice.ts` (`deviceVoice`, `pitch`). On iPhone that can be the same female voice for both guides, so Tetsu may sound wrong for that reason alone. Confirm with the network panel that `/voice/*.mp3` is fetched.
- **Known bug:** Settings' "▶ Akari" and "▶ Tetsu" samples go through `Providers.say`, which picks the guide from the Voice setting instead of honouring the button. They should call `speak(text, { guide: 'akari' | 'tetsu' })` directly.
- **"Main character"** most likely means Koto (the mascot and guide). Confirm whether he means the player's avatar. Run `npm run voice:audition` so he can pick: a cute high voice for Koto (ずんだもん, 春日部つむぎ, 雨晴はう, もち子さん), a clearly feminine one for Akari and a clearly masculine one for Tetsu (青山龍星 or 玄野武宏). Save to `voices.json` and update `KOTO`, rerun `npm run voice:app`, and update the credits (the manifest's `credits` feed the Credits screen).

### 2. Purchasing and the coin-counting checkout

> "I don't think the counting out money feature is working at all because of purchasing not working."

- **Root cause found last session:** page-level CSS animations held a transform (`fill-mode: both`), which made `position: fixed` sheets lay out against the page instead of the screen. The Food Street order sheet and `PayCounter` opened about 1,100 px below the screen. The fix (commit `9aaed01`) made those animations `backwards`-only and portals `PayCounter`, the Food order sheet and the town staff picker to `<body>`.
- **Do next:**
  - Confirm on the phone, after a full reload (close the tab: the service worker serves the old build otherwise), that the Shop checkout (`ShopScreen` `checkout` → `PayCounter`) and Food Street both open the coin counter on screen and complete.
  - Audit every other `position: fixed` overlay rendered inside `<main>` (the tour, Koto dialogs, the gacha prize, `OutOfHearts`) and portal them too.
  - Add an e2e test that buys a shop item through the coin counter and asserts the sheet is inside the viewport (`boundingBox().y < viewport.height`).

### 3. The battle walk moves along the path, not the screen

> "The path animation should also be along the path, not the screen. There is a sky backdrop so it just looks awkward when moving between enemies while fighting."

- **Where it lives:** `src/features/lesson/BattleStage.tsx` and `battle.css`. While walking (`.battle-walking`), the `battle-parallax-far` and `battle-parallax-mid` layers and `battle-road-scroll` all slide, so the sky and the whole scene appear to move sideways.
- **Wanted:** the sky stays fixed and the motion happens on the road. Road markings and stones scroll toward the viewer along the trail's perspective, the roadside props pass by on either side of the road, and the avatar walks up the path toward the next foe.
- This is scene choreography: brief Argon (art) or GPT-5.6 Sol (motion timing). Keep the performance rule from last session: scenery loops pause while a question is up.

### 4. The Town as its own place, with every location on the map

> "The town also is on the backdrop of the mountains, which doesn't make sense. They should be their own areas, with map equivalents (ON THE MAP) for each location (school, shrine, cafe, bathhouse, shops, station, etc)."

- **Today:** `src/features/town/TownScreen.tsx` draws the shared `Scene` (a mountain backdrop) with tiny placeholder `Building` SVGs and emoji signs, then a list of cards. The tycoon (`Tycoon.tsx`, `engine/town.ts`, `world/buildings.json`) is a list under it.
- **Wanted:** an illustrated town map (Argon) where each district (Station, Café, Shrine, Shopping Street, Bathhouse, School, from `world/districts.json`) is a distinct, recognisable building in its own spot on the map, connected by streets. A locked district shows as a covered or boarded-up lot. Tapping a location opens its business (staff, collect, upgrade), so the tycoon lives on the map instead of in a long list.
- Keep the engine and data as they are. This is presentation plus moving the `Tycoon` business UI into a per-location sheet (portalled).

### 5. Shop: the Japanese price reading overlaps the buttons

> "The item descriptions (bottom Japanese) is overlapping the buttons in the item shop. I don't even know what it says."

- **What it is:** the price read aloud in Japanese (`<span class="price-ja">`, `yenFurigana(price)`, for example 六百円 with ろっぴゃくえん over it).
- **Likely cause:** the `.shop-grid` rules in `src/app/global.css` push the button down with `margin-top: auto`. The price reading sits right after the button with small furigana that overflows its line box onto it.
- **Fix:** give the reading its own row with enough line height for the ruby (or put it inside the button under the ¥ price). Consider labelling it ("Say it: ろっぴゃくえん") so the player knows it's the price in Japanese. Check in WebKit.

### 6. Home and Town: replace the heavy outlines and boxy buttons

> "Remember what we said about the big outlines and buttons on the main and town pages? Those are important to remove and replace with something smoother, kinder, and much more functionally useful for the user."

- **Earlier owner feedback:** "too blocky", "boxes inside boxes", low clutter, compact, prominent page titles, no avatar or duplicate currency next to titles.
- On Home (`src/features/home/`, just redrawn by Argon) and Town, replace the thick bordered cards and big outlined buttons with softer, lighter surfaces (no heavy borders, gentle shadows or none), fewer and clearer actions, and controls that do something useful in place (collect income, start the next lesson, eat when HP is low).
- Brief Argon with concrete before-and-after goals and keep every action that exists today.

### 7. Finish the Argon work in flight

Runs launched last session (branches `art/<name>`, worktrees in `.claude/worktrees/<name>`, logs in `.claude/skills/gemini-art/logs/`):

| Run            | State when this was written                                                                                                                                   | Next step                                                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yokai-city`   | **Part 1 merged and wired** (`yokai-city2`): chōchin-obake and nopperabō. The market fights them with the kasa-obake                                          | Brief `yokai-city3` based on `art/yokai-city2` for rokurokubi and bakeneko (their CSS is already in `city.css`), then wire them the same way                                                                                        |
| `foes-dojo3`   | **Merged and wired.** Dojo now fights `trainee-bokken` and `trainee-senpai`; `Enemy.test.ts` guards each region's roster                                      | Clean up the `foes-dojo`, `foes-dojo2` and `foes-dojo3` worktrees                                                                                                                                                                   |
| `path-regions` | **Merged** as `path-regions2`: Dojo (wood floor, hall, bokken rack, makiwara, taiko) and City Market (machiya street, yatai, dango stand, sake shop, chōchin) | Optional: a small brief for more Bamboo Thicket side detail                                                                                                                                                                         |
| not started    | Region battle backdrops: the battle scene is a bamboo woodland for every region                                                                               | Brief Argon: a dojo hall interior for the Dojo, the existing bamboo for the Thicket, an Edo market street at dusk for the City Market. Select by `regionForUnit(ref.unitIndex)`, as `foes` are passed into `Player` → `BattleStage` |

**Run at most two Argon runs at once.** With five in parallel, Cursor dropped connections ("NonRetriableError: Provider Error"). Small briefs survive; resume a dead run with a new brief based on its partial branch (`run-model.sh <new-name> art/<old-name>`). Clean up with `cleanup.sh <name>`, never `rm -rf` (the worktree's `node_modules` is a junction). Never edit `run.sh` or `run-model.sh` while runs are active.

## What shipped last session (for orientation)

- **Healing only on Food Street:** onigiri left the item shop, and stalls say up front why you can't order. Food Street has Argon's dish symbols.
- **Furigana everywhere:** kanji with hiragana readings; never Latin romaji. Ken has said "romanji" when he meant furigana, so ask before changing scripts. Settings has a Hiragana/Katakana switch (`settings.kana`, applied in `JaText`).
- **Story regions** (`world/regions.json`, `regionForUnit`):
  - **The Dojo:** `u01`, hiragana plus katakana; you spar with trainee samurai.
  - **Bamboo Thicket:** `u03`, placed second; greetings, から and へ, forest yokai.
  - **City Market:** `u02`, placed third; the café and food unit, city yokai.
  - Unit ids were kept so saved progress lines up. The design doc `design/world-and-story.md` still describes the older six-region plan; update it.
- **Town tycoon:** businesses per restored district, spirits (learned words) with rarity and memory-driven skill, staff slots, idle income capped at 8 hours, upgrades. The engine is `engine/town.ts` (tested), the data `world/buildings.json`, the save field `town`.
- **Home** redesigned by Argon. Forest yokai added (kodama, bake-danuki, karasu-tengu).
- **Smoother motion:** battle scenery loops pause during questions, and off-screen Path regions use `content-visibility`. Tab swipes follow the finger and arrive without entrance pops.
- **Bush gate:** a top-to-bottom rip; the left half falls left and the right half falls right (`foundations/moments/cut.ts`, tested).
- **Sound:** iOS audio unlock fixed. New synthesized slash, rip, hit and ambient wind sounds.

## Traps and rules learned the hard way

- **The service worker serves the old build.** The app now checks for updates every minute and on return, and applies them outside battles. When the owner "doesn't see" a change, first make sure he's on the new build.
- **Bump the starter pack version on every content change.** The edit goes in `tools/starter/build-starter.ts`; run `npx tsx tools/starter/build-starter.ts`. Installed copies only update when `pack.version` increases (it is 3 now). Pack item ids must use a known prefix (`k. w. p. g. s. d.`).
- **Full-screen sheets must portal to `<body>`.** Never leave an animation holding a transform on the page or its sections.
- **Inline SVG animation repaints the whole SVG.** Keep scenery loops few, and pause them when they aren't needed.
- **Windows:** `tools/authoring.test.ts` fails only on this checkout (CRLF). CI runs `prettier --check .`, so run `npx prettier --write` before pushing. Playwright runs with reduced motion.
- **VOICEVOX:** see `VOICEVOX.md`. MP3 encoding uses `@breezystack/lamejs` (no ffmpeg on this PC). Clips are cached in `tools/.voice-cache` (git-ignored), so rebuilds only render new lines.
- **Test saves:** the save lives in IndexedDB `kotodama` → `profile` → `main`. Editing `state.ledger` or `state.nodes` there (unique ledger `id`s) is the quickest way to reach a state, like low HP or a restored district, when testing in a browser.
