# Handoff: open tasks for the next AI (updated 2026-11-01)

Read `README.md` in this folder first (vision, the owner's preferences, the AI split, how to run the Gemini skill). This file is the **task queue** the owner set at the end of the last session, plus the state of the work in flight and the traps we hit. The owner is Ken (GitHub KenLinz). He tests on an iPhone (Safari and Chrome, both WebKit) through the live site, and wants a push to `main` (which deploys https://alyssa-webb.github.io/kotodama/) after every working milestone.

**Model rule (owner):** Ken's reason is that Argon was judged the best designer, so testing whether the AI server can do better is allowed (IDEAS.md, Decision 3). Otherwise, every design (characters, yokai, scenes, UI art) is made by **Gemini 4 Argon** (`gemini-4-argon-high`) through the `gemini-art` skill. Claude does code, logic, tests and wiring. GPT-5.6 Sol only does action-animation timing.

## New owner notes (2026-11-01): read `IDEAS.md`

Ken's latest notes are assessed in `IDEAS.md`, with decisions needed and a suggested order. Nothing there is approved yet. Ken has answered the five decisions (see the top of IDEAS.md): the app first, with content, lessons and the Path last; modern and past-day towns; the server may test designs; Koto's desk replaces titles except on full-screen pages; characters change style per area for now. **Don't run `argon-outbox/kotodama-path-scenes.zip`:** Path art is on hold until the Path has a tile-and-props system (IDEAS 1.1).

## Owner bug list (2026-10-31, from testing the live site): all 11 done and live

Reported by the owner after the hariko Town landed. In his words, then where to look. Verify each on a phone-sized WebKit render, push each fix, and send him the live link.

1. **Partly done (battle backdrops: Dojo sumi-e, Market and Bamboo road ukiyo-e). Next: the Path screen in ukiyo-e, the Shop in hariko.** "I thought there were major art direction changes." Only Home (noren/ema) and the Town buildings (hariko) have been restyled so far; ADR 0009 is being applied area by area. Next art: the Path and battles in ukiyo-e, the Dojo in sumi-e. Show visible progress fast.
2. **Done (mossy ground mounds).** "The shrine and lamp and lantern in the bamboo thicket are floating."** Path, Bamboo Thicket scenery (`RegionScene` in `src/features/path/PathScreen.tsx`): props not sitting on the ground.
3. **Done (no road strip indoors; road maps like the backdrop).** "The moving wood path in the dojo isn't aligned with the background, it's off."** Battle walk in the Dojo (`BattleStage.tsx`, `battle.css`, `DojoHallBackdrop` in `BattleBackdrops.tsx`): the scrolling floor doesn't line up with the hall's floor.
4. **Done (base-traveler face elements moved down 3 to match eyeY 42 / mouthY 51).** In a render every mood sits on the face; focus/worried brows tuck under the bangs and cheer sparkles overlap the hair. "Expressions of avatar not aligned with face."** `src/features/avatar/Avatar.tsx` (mood faces from the base part's `face` data in `world/avatar.json`): the mood features sit off the face.
5. **Done (time greeting + tap to cycle, his VOICEVOX clips, tested).** "Koto doesn't use VoiceVox voice on homepage and doesn't have cyclable text."** Home greeting (`SpeakableJa` in `HomeScreen.tsx`): play the ずんだもん clip from `public/voice/`, and let a tap cycle through several of Koto's lines (`world/koto.json`).
6. **Done (seal centred in its panel).** "Next lesson 'continue' button on homepage is not centered."** The hanko seal in `src/features/home/parts/NorenContinue.tsx` / `noren.css`.
7. **Done (opaque tab colour).** "Navbar icons display dice, the opacity looks bad on intersections for the icons."** Tab bar icons (`src/app/Shell.tsx`, icons in `src/foundations/art/icons.tsx`): overlapping semi-transparent strokes show darker where they cross. Draw them opaque (or as single paths) instead of stacked translucent shapes.
8. **Done (one set by Argon).** "The fire icon and heart icon and coin icon symbols are weird shapes on the information bar at the top. Why are they not uniform?"** Header stat pills (`Shell.tsx`, `icons.tsx`): give the three icons one size, one weight and one style.
9. **Done (lessons pin the voice to the guide on screen; resolveGuide tested).** "The voices for tetsu and akari do not swap between male and female. They don't use the proper voices."** Known bug (task 1 above): Settings samples go through `Providers.say`, which ignores the button; also check `voice.ts` uses each guide's VOICEVOX clip (Akari 冥鳴ひまり, Tetsu 青山龍星) and that the device-voice fallback picks a male voice for Tetsu.
10. **Done.** "Get rid of the mayor stamp on his desk in the Town."** Koto-as-mayor scene in `src/features/town/` (look for a stamp/seal prop).
11. **Done (`fix(ui): drop the text shadows`).** "All text has that weird shadow I am noticing. What the hell?" Global text-shadow, most likely in `src/app/global.css` (search `text-shadow`). Remove it from body text; keep at most a subtle one on text over busy art.

**Musashi:** both poses fixed (forward bow, empty scabbards).

**EdgeXpert 3D test (owner asked: "test this tool, see how to best use it, and determine its viability"):** `tools/server3d/` runs Hunyuan3D 2 (shape only) on the owner's dad's server (edgexpert-26d0, NetBird 100.114.218.255, `ssh admin1@…`, key auth) in the `nvcr.io/nvidia/pytorch:25.09-py3` container, working dir `~/kotodama3d`. Only use that folder; vLLM/Qwen on the box is his dad's, never stop it, and stopping server processes needs the owner's OK.

- **Result of `iterate.sh` (finished 2026-11-01 01:48 UTC, 72 tries, ~75 s each, no errors):** best front-silhouette match to the art (IoU, 1.0 = perfect) avatar 0.95, Koto 0.90, Musashi 0.90, all found in round 0. Five rounds of mutating steps/cfg/octree never beat them, and octree 448 was consistently worse (~0.6). The 8-frame hariko strike gave one model per frame, IoU 0.70 to 0.88 (likely jittery as stop-motion).
- **Early verdict:** good for fast, free 3D reference shapes from Argon's drawings ("make ~10 seeds, keep the best", not "polish 1000 times"). Not finished game art: untextured (the texture step failed to build `custom_rasterizer` on ARM) and no rigging.
- **Fetched and viewable (2026-11-01):** the best model per character and the 8 strike frames are in `design/reference/server3d/iter/` (`.glb` git-ignored), with `scores.csv` and `viewer.html` (a three.js turntable, stop-motion and per-round IoU table). Serve it with `python -m http.server 5181 --bind 0.0.0.0 --directory design/reference/server3d/iter` (Vite can't serve it: it rewrites the import map) and open `/viewer.html`. The meshes come without normals; the viewer computes them.
- **Creation test (2026-11-01):** `tools/server3d/art/start.sh` runs Stable Diffusion XL in its own `kotodama-art` container. First round: 1 hit, 2 partial, 2 misses out of 5 briefs, concept art only. Sheets are in `design/reference/server-art/`, results in IDEAS.md section 4. Blind rating against Argon is left.

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

| Run            | State when this was written                                                                                                                                                                       | Next step                                                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yokai-city`   | **Merged.** Chōchin-obake, nopperabō and bakeneko fight in the City Market. `RokurokubiArt` is merged but **held out of `ENEMY_KINDS`**: her long neck read as an arm and her attack barely moved | Review the `rokurokubi-neck` refine run, then add `rokurokubi` to `ENEMY_KINDS`, the `Enemy` switch and `Enemy.test.ts`                                                                                                             |
| `foes-dojo3`   | **Merged and wired.** Dojo now fights `trainee-bokken` and `trainee-senpai`; `Enemy.test.ts` guards each region's roster                                                                          | Clean up the `foes-dojo`, `foes-dojo2` and `foes-dojo3` worktrees                                                                                                                                                                   |
| `path-regions` | **Merged** as `path-regions2`: Dojo (wood floor, hall, bokken rack, makiwara, taiko) and City Market (machiya street, yatai, dango stand, sake shop, chōchin)                                     | Optional: a small brief for more Bamboo Thicket side detail                                                                                                                                                                         |
| not started    | Region battle backdrops: the battle scene is a bamboo woodland for every region                                                                                                                   | Brief Argon: a dojo hall interior for the Dojo, the existing bamboo for the Thicket, an Edo market street at dusk for the City Market. Select by `regionForUnit(ref.unitIndex)`, as `foes` are passed into `Player` → `BattleStage` |

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

## Ideas parked for later (owner notes, not yet designed)

- **Mischievous Koto at checkout (Ken):** tap coins into the tray carelessly (too many, too fast) and Koto pockets the extra with a little mischievous grin. That adds risk and reward to paying, so counting carefully matters. It suggests a **cart system** for the Shop and Food Street: pick several items, then count out one total at the counter. Keep it gentle (small amounts, a playful animation and line from Koto, maybe a way to win it back), never punishing for young players.
- **The Dojo (Alyssa's area):** the full brief is in `design/dojo.md` (doors, interior, drills, Musashi and his five scrolls, XP and skill points, chapter scaling, daily caps, mastery gates). Claude does not build the Dojo.
- **Speaking:** answer conversation choices by saying them out loud. Match against the closed set of choices on the reading, judge intelligibility rather than pitch accent, show what was heard, and always keep a tap fallback. Recognition may go through Apple's or Google's servers, so make it an opt-in online feature with a clear privacy notice.
- **Tester trip series:** send playtesters to Japan and cut their real interactions against the matching game moments for a trailer. Get consent and release forms.
