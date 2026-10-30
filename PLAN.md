# Kotodama — Technical Plan

Oct 29, 2026 · @Lyss

## Executive summary

We build Kotodama (言霊, "the spirit that lives in words"), an offline-first web app that installs on your iPhone home screen and your Mac Dock, costs nothing to run, and never expires. It is a game engine for learning Japanese: it runs lessons, scores them, schedules reviews, rewards the player and speaks every line of Japanese aloud in two voices, all inside a town you bring back to life with an avatar, word spirits, bosses and a koban economy, while ChatGPT supplies the lessons and the look as data.

Everything ChatGPT produces arrives through a versioned contract: lesson packs as JSON, the visual theme as design tokens, and animations as named slots. A free voice engine on your Mac then gives every Japanese word and sentence in a pack a natural voice, so a new unit or a re-skin never needs a code change.

- **Stack:** TypeScript and React, built with Vite, as an installable web app (PWA) with a service worker for offline play
- **Cost: US$0.** Free hosting on GitHub Pages, free open-source libraries, a free local voice engine (VOICEVOX); no Apple Developer Program
- **Devices:** iPhone and iPad through Add to Home Screen, Mac through Safari's Add to Dock; one app, one address
- **Data:** all progress stays on the device; backup and restore by file; new lesson plans import any time
- **Learning core:** FSRS-6 spaced repetition through the official ts-fsrs library, plus an Elo-style skill rating (borrowed from Chess.com) to pick the right difficulty
- **Voice:** every kana, word, sentence and dialogue line pre-voiced at normal and slow speed, with the device's own Japanese voice as an instant fallback
- **Quality bar:** unit, visual and end-to-end tests run in WebKit (Safari's engine), CI on every change, and a content validator that blocks bad lesson data

## Key decisions & assumptions

An installable web app is the right call for a permanently free product: it needs no Apple membership, installs from a link, updates itself and runs offline once loaded. Its limits on iOS are real but manageable; each one is named under risks.

| Decision | Choice | Why | Rejected alternative |
| --- | --- | --- | --- |
| App type | Installable web app (PWA) | Free forever, no 7-day expiry, testers install from a link | Native iOS app: lasting installs need US$99/year |
| Framework | React + TypeScript, built with Vite | Largest ecosystem, and ChatGPT writes it fluently, which matters for co-development | Svelte or Solid: lighter, but fewer libraries and examples |
| Mac version | The same web app, added to the Dock from Safari | Opens in its own window with one click; nothing extra to build | Electron: possible later, but a heavy separate desktop build for no gain now |
| Hosting | GitHub Pages from a public repository | Free HTTPS on the GitHub account you already have; deploys from GitHub Actions. Only code and the starter pack are public; your imported packs and progress never leave your devices | Cloudflare Pages: also free, but needs a new account |
| Storage | IndexedDB through Dexie, behind a repository interface | Holds progress, packs and audio offline | localStorage: too small, text only |
| Offline | Service worker (Workbox via vite-plugin-pwa) | App and installed packs work with no connection | None |
| State | Zustand stores over a pure TypeScript engine | Engine logic is testable without a browser | Redux: more boilerplate for the same result |
| Animations | Motion for interface movement, Lottie for asset animations | ChatGPT knows both; Lottie files can be sourced or authored outside the code | Rive: richer, but its files need the Rive editor |
| Voice | VOICEVOX on your Mac pre-renders audio into packs; the device's Web Speech voice as fallback | Free, natural Japanese with many character voices; plays offline once imported | Cloud text-to-speech: billed per character |
| Accounts and backend | None | Nothing to host, secure or pay for | Server sync: needs a paid or self-run backend |

**Confirmed with you (29 Oct):**

- Apple silicon Mac (M-series); it runs the voice engine and every development tool.
- v1 is for you and a small group of testers, who are hardcore gamers.
- Permanently free: a web app on the home screen, no Apple Developer Program.
- Name: **Kotodama**. Hosting: your existing GitHub account (no Cloudflare).
- Two narrator voices with a setting to switch or alternate between them.
- Hardcore is the default difficulty.

## Experience design

The game takes Duolingo's habit loop, Shashingo's collecting, and Chess.com's ratings and modes, and wraps them in a world that wakes up as you learn, with hardcore stakes. ChatGPT owns how each screen looks and moves; this section defines what the engine must support.

**Core loop (one session, 3 to 5 minutes):** open the app → see today's goal ring and streak → tap the next node on the path → play 10 to 15 exercises with instant feedback → finish screen shows XP, stars, and new words added to the collection → the scheduler queues those words for review → a reminder brings the player back tomorrow.

| Mechanic | Borrowed from | How we use it | Phase |
| --- | --- | --- | --- |
| Learning path | Duolingo | Units of nodes that unlock in order; a checkpoint challenge closes each unit | v1 |
| XP, levels, daily goal | Duolingo | XP per exercise, combo bonus, a goal the player picks (5/10/20 min) | v1 |
| Streak + streak freeze | Duolingo | A day counts when the daily goal is met; freezes are bought with koban (see Incentives) | v1 |
| Combo meter | Arcade games | Consecutive correct answers raise a multiplier; adds game feel without penalty | v1 |
| Spirit collection | Shashingo | Every item learned wakes a kotodama spirit to collect; it grows or fades with your memory of that item | v1 |
| Script ladder | Shashingo | Show romaji, kana, kana + furigana, or kanji per player; the app suggests moving up as mastery grows | v1 |
| Timed survival mode | Chess.com Puzzle Rush | "Kana Rush": answer until three misses, beat your best score | v1 |
| Lesson review | Chess.com Game Review | After a lesson, replay each mistake with the right answer and a short note | v1 |
| Skill rating | Chess.com puzzle rating | A rating per skill (kana, vocabulary, grammar, listening) that rises and falls; drives exercise difficulty | v1.1 |
| Daily challenge | Chess.com Daily Puzzle | One shared item per day, same for everyone | v1.1 |
| Quests + achievements | Duolingo | Three daily quests, long-term badges | v1.1 |
| Weekly leagues | Duolingo | Needs a shared scoreboard; considered after the beta, on free tiers only | v2 |

### The world: a town that wakes as you learn

Kotodama has a world, and every system in it runs on learning Japanese. The premise: a small Japanese town has fallen silent because its word spirits (kotodama) have faded. Every item you learn wakes a spirit, and every unit you finish brings a district back to life.

**The town map.** Each unit restores one district: the station, the shopping street, the café, the shrine, the bathhouse, the school. Lanterns light, shops open and townsfolk return as you progress. Packs declare which district they restore, so ChatGPT's new lessons literally build out the town. Your bonsai lives in the shrine garden at the center.

**Kotodama spirits (the collection).** Each learned item wakes an original spirit, and its species follows the item: tiny glyph sprites for kana, creatures for words (a food word wakes a food spirit), twin spirits for phrases, shape-shifters for patterns. Spirits grow with your memory of the item, measured by the review scheduler:

| Stage | Memory state | What you see |
| --- | --- | --- |
| Egg (卵) | Just introduced | A glowing egg in your collection |
| Sprite (子) | Learning | Small, playful, follows your avatar around town |
| Guardian (守り) | Mastered (remembered for 3+ weeks) | Full form; adds a small koban bonus to its district |
| Fading | Review overdue | Turns translucent and stops giving bonuses |
| Lost in the fog | Badly overdue | Vanishes into the fog; a review rescues it |

Reviews become rescue missions: the review screen is a fog-clearing expedition that brings lost spirits home.

**Boss battles.** Every unit checkpoint is a fight against an original yōkai. Each correct answer hits the boss (harder with a high combo); each mistake costs you a heart. Bosses change phase and exercise style mid-fight and taunt you in voiced Japanese you have learned to understand. Starting roster:

- **Mojibake (文字化け)**, a beast of garbled text: kana and reading battles.
- **Wasure-oni (忘れ鬼)**, the forgetting ogre: built entirely from your weakest items.
- **Hayakuchi-kitsune (早口狐)**, the fast-talking fox: listening battles at 1.25× speed.
- **Keigo-tengu (敬語天狗)**, the stickler for manners: casual-to-polite register duels.

A defeated boss restores its district and drops loot: a capsule token, a cosmetic, and a title.

**Dojo ranks.** The per-skill rating becomes martial-arts ranks, from 10-kyū up to 1-kyū, then shodan (1st dan) and beyond, for kana, vocabulary, grammar and listening. Your highest rank sets the belt color on your avatar.

**Kiai meter.** Correct answers in a row fill the meter. When it is full, you shout "Kiai!" (voiced) and the next 5 answers earn double koban and XP.

**Daily shrine visit.** Draw an omikuji fortune written and voiced in Japanese. Translate it correctly to claim the reward; 大吉 (great blessing) pays the most.

**Gachapon.** A capsule machine paid with capsule tokens, which come only from learning: boss wins, perfect lessons, clearing review debt. It never takes koban or money, shows its odds, and protects you from duplicates.

**Seasons.** Monthly events with themed packs ChatGPT writes for the season (moon viewing, autumn leaves, New Year, cherry blossoms), limited cosmetics earned through event quests, and a seasonal boss.

**Ghost races.** Rush modes race against a replay of your own best run. Testers can trade ghost codes (a short exported string) to race each other with no server.

The spirit roster, district list, bosses and their art are data ChatGPT designs (`world/spirits.json`, `world/districts.json`, `world/bosses.json`, plus layered SVG art). The engine ships with simple placeholder art, so the game is fully playable before the art arrives.

### Your avatar

You play as a traveler who has come to wake the town. Your avatar appears on the home screen, walks the town map with your spirit sprites, stands beside you in lessons (cheering a correct answer, flinching at a miss), and takes a battle stance in boss fights.

**Built from layers.** The avatar is layered SVG, so every part swaps independently and stays sharp at any size:

| Slot | Examples | Mostly from |
| --- | --- | --- |
| Base | Body shape, skin tone, face, hairstyle and color | Free at creation |
| Outfit | 浴衣 yukata, 甚平 jinbei, 袴 hakama, 忍び装束 shinobi garb, station-staff uniform, ramen-chef apron | Shop, seasons |
| Headgear | 笠 straw kasa, 手ぬぐい headband, 狐面 kitsune mask, 鉢巻 hachimaki | Shop, achievements |
| Held item | 扇子 folding fan, 筆 calligraphy brush, 番傘 paper umbrella, 線香花火 sparkler, たい焼き taiyaki | Shop, gachapon |
| Companion | 豆柴 mame-shiba, 狸 tanuki, 文鳥 Java sparrow, a tiny 木霊 kodama tree spirit | Gachapon, bosses |
| Belt and aura | Belt color from your dojo rank; an aura at 30, 100 and 365-day streaks | Learning only |
| Title (称号) | 仮名の達人 Kana Master, 夜更かし Night Owl, 鬼退治 Ogre Slayer | Achievements only |
| Charm (お守り) | One equipped charm with a small perk (see Incentives) | Shop, bosses |

**Learning-locked gear.** The most prestigious parts can't be bought, only earned: the 鉢巻 hachimaki for a 30-day streak, the 狐面 kitsune mask for tracing 100 kanji, a golden 筆 brush for 1,000 correct dictations, a dragon companion for defeating every boss in a season. They are visible proof of what you have learned.

**Every item teaches its name.** Each avatar part, shop item and decoration has a Japanese name with furigana and voice. Buying or earning it adds that word to your collection as a new item, so even shopping is study.

Avatar parts are data ChatGPT designs (`world/avatar.json` with anchor points per slot, plus SVG layers), so new outfits arrive the same way lesson packs do.

### Incentives: koban, the shop, and consequences

The economy runs on **koban** (小判, Edo-period gold coins) earned only by learning, plus **capsule tokens** for the gachapon. Nothing is ever bought with real money. Every source of reward is a learning action, and every penalty is undone by learning.

**Earning koban** (starting values, tuned during the beta)

| Action | Koban |
| --- | --- |
| Finish a lesson | 10, +5 for 3 stars, doubled during Kiai |
| Clear all due reviews (rescue every fading spirit) | 15 |
| Complete a daily quest | 10 to 20 each |
| Translate the daily omikuji | 5 to 50, by fortune |
| Beat a Rush personal best or a friend's ghost | 10 |
| Defeat a boss | 100 + a capsule token |
| Streak milestones (7, 30, 100, 365 days) | 50, 150, 500, 1,500 |
| Guardian spirits | +1 per guardian in a district, collected daily |

**Consumables** (each name is a word you learn when you buy it)

| Item | Effect | Price |
| --- | --- | --- |
| こたつ Kotatsu | Streak freeze: stay warm through one missed day; hold up to 2 | 60 |
| 金継ぎ Kintsugi | Streak repair: mend a broken streak with gold within 48 hours; also requires passing a Redemption Trial | 150 + 5 per streak day |
| 提灯 Chōchin lantern | Hint: lights up one tile, letter or option | 8 |
| おにぎり Onigiri | Restores 1 heart | 15 |
| 太鼓 Taiko drum | Double XP for 15 minutes | 50 |
| 招き猫 Maneki-neko | +25% koban for your next 3 lessons | 70 |
| だるま Daruma | Extra life in a Rush round (falls down, gets back up) | 20 |
| 砂時計 Sunadokei hourglass | +10 seconds in a Rush round | 25 |
| お守り Omamori shield | Keeps one spirit from fading for 3 days | 30 |
| 絵馬 Ema plaque | Write a wish to reroll one daily quest | 20 |

**Charms** (one equipped at a time, small perks tied to study)

| Charm | Perk | How to get it |
| --- | --- | --- |
| 学業守り Study charm | +10% XP on reviews | Shop, 200 |
| 合格守り Exam charm | Your first mistake in a boss fight costs no heart | Defeat 3 bosses |
| 耳守り Ear charm | +15% koban in listening exercises | Shop, 250 |
| 筆守り Brush charm | Tracing exercises count double toward your kanji rank | Trace 50 kanji |

**Cosmetics and town decorations**

| Category | Examples | Price |
| --- | --- | --- |
| Avatar parts | Outfits, headgear, held items (see Your avatar) | 80 to 400 |
| Town decorations | 鳥居 torii gate, 自動販売機 vending machine, 鯉の池 koi pond, 屋台 food stall, 桜 cherry tree, 銭湯 bathhouse sign | 60 to 300 |
| Bonsai styles | 松 pine, 梅 plum, 紅葉 maple, 藤 wisteria | 120 |
| App themes | 浮世絵 Ukiyo-e woodblock, ネオン新宿 Neon Shinjuku, 墨と和紙 Ink and washi, 抹茶 Matcha | 300 |
| Sound packs | 祭り festival, 寺の鐘 temple bells, 8-bit arcade | 150 |
| Story packs | Special voiced dialogue stories | 250 |

**Consequences for missing a day**

- **Streak loss:** the streak resets to zero unless a kotatsu is equipped (used automatically).
- **The town dims:** lanterns in your districts go dark, and the bonsai drops leaves; three missed days leaves it bare until you return.
- **Spirits fade:** overdue items fade and stop paying bonuses; long-ignored ones are lost in the fog until a review rescues them.
- **Review debt:** until all due reviews are cleared, lessons earn half koban.
- **Koban spoil:** in Hardcore, 10% of your koban is lost for each missed day (a kotatsu prevents it).
- **Missed chest:** the daily reward chest is forfeited.
- **Reminders:** an evening push warns when the streak is at risk (needs a small free scheduled job, planned for v1.1).

**Difficulty: Hardcore is the default.** You chose this for a group of hardcore gamers, so the default has real stakes, but every penalty is recovered by studying rather than by waiting.

| Mode | Hearts | Missed day | Streak repair |
| --- | --- | --- | --- |
| Casual | None; mistakes cost combo and stars | Streak loss only | Kintsugi |
| Standard | 5, refill fully each day | All consequences except koban spoil | Kintsugi |
| **Hardcore (default)** | 5 shared across lessons; at zero the lesson fails and its XP is lost; refill 1 per hour, or earn them back by clearing 10 reviews in the Dojo | All consequences, including koban spoil | Kintsugi and passing a Redemption Trial: 20 questions from your weakest items with at most 2 mistakes |
| Ironman | 3 hearts, no onigiri | All consequences | None, ever. Only for the brave |

Bosses can be challenged once per day in Hardcore and Ironman; a loss means coming back tomorrow, better prepared.

All rewards, prices, penalties and drop odds live in `economy.json`, plain data ChatGPT can tune without code changes. Every koban, token and heart is written to a ledger, so balances are always explainable and testable.

## System architecture

The app is four layers of TypeScript modules, and lesson content enters only at the bottom, already validated and voiced.

&#91;embedded content: web app architecture · 4 layers, voiced data from ChatGPT\]

The engine layer has no React and no browser APIs, so all game, learning and economy logic runs in fast unit tests. Features reach storage, audio and time through interfaces, so tests swap in fakes (a fixed clock, in-memory storage, silent audio) and the two AI collaborators can build in parallel.

## Learning engine

The engine has three jobs: run any exercise type the content asks for, decide what the player sees next, and remember what they know. Each job sits behind a TypeScript interface so it can be tested alone and replaced without touching the rest.

### Exercise types are plugins

Every exercise type is one small module: a data schema (Zod), a React component, and a grader. A registry maps the `type` string in lesson JSON to its plugin. Adding a type means adding one module; the lesson player never changes. An unknown type fails the content validator and is skipped safely at runtime.

| Type id | What the player does | Grading | Phase |
| --- | --- | --- | --- |
| `choice` | Pick the meaning, reading or word from 3 to 4 options | Exact match | v1 |
| `match` | Pair kana with sounds or romaji, or words with meanings | All pairs correct | v1 |
| `listen` | Hear audio, pick what was said | Exact match | v1 |
| `dictation` | Hear a word or sentence, type it in kana | Normalized text match with typo tolerance | v1 |
| `tiles` | Arrange word tiles into a sentence; each tile speaks when tapped | Any accepted order in the answer key | v1 |
| `type` | Type the answer; romaji converts to kana as you type | Normalized text match with typo tolerance | v1 |
| `fill` | Choose the missing particle or word | Exact match | v1 |
| `trace` | Write a kana or kanji with a finger or Apple Pencil | Stroke count, order and direction against reference data | v1 |
| `shadow` | Listen, record yourself, play both back side by side | Self-rated (again, hard, good, easy) | v1.1 |
| `speak` | Say the phrase; the browser transcribes it | Transcript against accepted readings; only where supported | v2 trial |

### What the player sees next

A session composer builds each lesson from three inputs: words due for review, new items from the current path node, and the player's skill rating. It interleaves them and moves each item from recognition (pick it) to recall (type it) to production (say or write it) as the item matures.

- **Memory: FSRS-6.** Each learnable item (kana, word, grammar point) has a memory card scheduled by FSRS-6, the algorithm Anki now uses. We use ts-fsrs, the official TypeScript implementation from the FSRS project, directly. The engine turns each answer into a rating from correctness, hints used and response time. Default target retention is 90%.
- **Difficulty: Elo-style rating.** The player has a rating per skill and every item has a difficulty rating; each answer updates both. The composer picks items the player should get right 75 to 85% of the time.

### Japanese-specific tooling

- **Furigana:** browsers draw ruby text natively (`<ruby>`), so readings over kanji work everywhere. Content marks readings explicitly, e.g. `{漢字|かんじ}`, and the player's script level decides whether they show.
- **Romaji to kana:** WanaKana (MIT license) converts typing live, backed by our own round-trip property tests.
- **Answer normalization:** folds full-width and half-width forms, optional hiragana/katakana folding, long-vowel variants, and accepts alternates listed in the content.
- **Handwriting:** a canvas using Pointer Events (finger or Apple Pencil) plus open stroke-order data (KanjiVG, CC BY-SA, so attribution is required).
- **Fonts:** the system Japanese fonts (Hiragino on Apple devices), so nothing large to download.

## Fully voiced Japanese

Every piece of Japanese in the app has a voice: each kana, word, example sentence and dialogue line ships with natural audio at normal and slow speed, so any exercise or game mode can be played by ear. The audio is made once on your Mac, for free, and then plays offline on any device.

### The voice pipeline

1. ChatGPT writes a lesson pack, marking the reading of every kanji and, in dialogues, which character speaks each line.
2. On your Mac, our `voice-build` tool finds every Japanese string in the pack.
3. It sends each one to VOICEVOX, a free Japanese voice engine that runs locally and exposes a built-in HTTP API. It passes the explicit kana reading, so kanji are never misread.
4. It renders two speeds (1.0× and 0.75×), compresses each clip, names the file by a hash of text, reading, voice and speed so nothing is rendered twice, and writes an audio manifest.
5. It bundles everything into the `.jlpack` file you import on your phone. Audio then plays with no connection.

Rough size: a unit of 100 words and 100 sentences at two speeds in both voices is about 10 MB (an estimate, to be measured in Sprint 1).

### The two voices

Every line is rendered in both of your chosen voices, and each voice belongs to an in-world guide:

| Guide | Voice you asked for | VOICEVOX voice | Style | Credit line |
| --- | --- | --- | --- | --- |
| **Akari (灯), the lantern-keeper** | Woman around 30, native, comforting, assuring, thoughtful, kind | 冥鳴ひまり (Meimei Himari), described as soft and warm; runner-up No.7 in its storytelling style | Normal, calm pace | VOICEVOX:冥鳴ひまり |
| **Tetsu (鉄), the wandering rōnin** | Man, deep, soft, trusting, kind, tough, gravelly | 青山龍星 (Aoyama Ryūsei), described as a heavy, deep low voice | Its soft, calm style | VOICEVOX:青山龍星 |

**Voice setting** (Settings > Voice):

- **Akari** or **Tetsu**: one voice for everything.
- **Alternate by lesson** (default): the guides take turns, one lesson each.
- **Alternate by line**: every new line switches voice, which trains your ear on two speakers.
- **Duet**: Akari teaches and Tetsu quizzes; in dialogues they play the two speakers.

**Voice audition (Sprint 0, ready by morning):** `voice-build` renders the same 10 sample lines in each candidate voice and style, and the app shows an audition page so you can pick by ear. The choices above are the defaults until you do.

**Terms:** both voices are free to use with the credit line above, shown on the Credits screen. 青山龍星 additionally requires prior permission if a company is involved, which does not apply to a personal app. Presenting them as the original characters Akari and Tetsu is checked against each voice's terms in Sprint 0; if that is not allowed, the guides keep their own VOICEVOX names.

### When a pack has no audio yet

A pack pasted straight from ChatGPT on your phone still plays: the app speaks it with the device's built-in Japanese voice (Web Speech API) and marks the pack "voice pending." The next time you run `voice-build` on the Mac, the pack is upgraded to full audio and your progress carries over.

### Playback on iPhone

- **Silent switch:** iOS mutes Web Audio when the phone is on silent. The app sets the audio session to playback mode (supported since iOS 17), with a setting for players who want silent mode respected.
- **First tap:** Safari only allows sound after a user gesture, so audio unlocks on the first tap of a session and each lesson's clips preload before it starts.
- **Real-device check:** every release is played on your iPhone from the home screen, on silent and in airplane mode.

### Game modes that voice unlocks

| Mode | How it plays | Phase |
| --- | --- | --- |
| Tap to hear | Any Japanese text on any screen speaks when tapped; optional autoplay | v1 |
| Listen and pick | Hear a word or sentence, choose the match | v1 |
| Dictation | Hear it, type it in kana | v1 |
| Listening Rush | Timed survival mode, by ear only | v1 |
| Dialogue scenes | Short voiced conversations between characters; pick the right reply | v1.1 |
| Shadowing | Listen, record yourself, compare side by side | v1.1 |
| Eyes-free lessons | A whole lesson playable without looking, for walks and commutes | v1.1 |
| Pitch-accent pairs | Hear pairs like 橋 and 箸, choose which was said; needs accent data in content | v2 |

## Content & design pipeline (the ChatGPT contract)

ChatGPT and I never edit the same files: ChatGPT delivers data, I build the engine that reads it, and an automated validator sits between us. If ChatGPT's output passes the validator, it works in the app.

| ChatGPT delivers | Format | Where it lives | Engine reads it as |
| --- | --- | --- | --- |
| Lesson packs | JSON matching `lesson-pack.schema.json`; images optional; audio added by `voice-build` | `content/packs/<pack-id>/` | Units, nodes, items, exercises, voiced lines |
| Visual theme | `tokens.json`: colors (light + dark), type scale, spacing, radii, motion timings | `design/tokens.json` | CSS variables plus a typed theme object |
| Animations | Lottie JSON files mapped to named slots in `animations.json` | `design/animations/` | Played when the engine fires that slot's event |
| Screen specs | Markdown + reference images per screen | `design/specs/` | Read by me when building the screen |

### Lesson pack shape

Items (the things you learn) are separate from exercises (the ways you practice them), so one word can appear in many exercise types and its memory is tracked once. IDs are permanent: progress is keyed to them, so an ID is never reused or renamed. ChatGPT never writes audio paths; `voice-build` fills them in.

The full format spec, every item kind and a worked example live in **The ChatGPT lesson prompt** below, which is the single source of truth for the pack format.

### Animation slots

The engine fires named events; the theme decides what each one looks and sounds like. A missing animation falls back to a built-in Motion default, so design can lag behind code without breaking anything. Starting slots: `answer.correct`, `answer.incorrect`, `combo.up`, `lesson.complete`, `node.unlock`, `streak.extend`, `level.up`, `mascot.idle`.

### Guardrails between the two collaborators

- **Content linter:** `content-lint`, a TypeScript command-line tool that shares the exact Zod schemas the app uses. It checks structure, that every referenced item exists, that readings contain only kana, that furigana markup is balanced, that IDs are unique, that every node is reachable, and that every Japanese line has audio (or is flagged voice pending). It runs on every commit and blocks the build on failure.
- **Answer-key bot:** a headless test plays every exercise in every pack using its own answer key, proving each one can be completed.
- **Live preview:** with the dev server running, dropping a pack or theme file into the project reloads the app instantly, so you can play-test ChatGPT's output in seconds.
- **Component gallery:** Storybook shows every screen piece and exercise on its own, light and dark, so ChatGPT's design changes are reviewed side by side.
- **Authoring brief:** I write `AUTHORING.md` and `DESIGN-BRIEF.md` with the schema, worked examples and rules, ready to paste into ChatGPT.
- **Versioning:** `schemaVersion` follows semantic versioning; a breaking change ships with a migration and a note in the brief.

## What lessons can teach: beyond vocabulary

Vocabulary is one of six kinds of learnable item. The other five teach how Japanese is actually used: kana, set phrases, sentence patterns that generate many sentences, full sentences, and voiced dialogues. Every kind is scheduled by the same memory engine and voiced the same way.

| Kind | ID prefix | What it holds | Example |
| --- | --- | --- | --- |
| Kana | `k.` | One character and its sound | か (ka) |
| Word | `w.` | Vocabulary, part of speech, and for verbs and adjectives their forms | 食べる → 食べます, 食べて |
| Phrase | `p.` | A set expression with a usage note, register, and casual or polite variants | いただきます, said before eating |
| Pattern | `g.` | A grammar pattern with slots the app fills from words you know | ＿をください → 水をください, コーヒーをください |
| Sentence | `s.` | A complete sentence with translation and tile breaks | 駅はどこですか。 |
| Dialogue | `d.` | A voiced conversation in a setting, with optional player choices | Ordering at a café |

Teaching notes on grammar and culture appear on teach cards inside a lesson; they are read, not scheduled.

### Exercise types for real-world Japanese

These join the plugin registry alongside the types listed under Learning engine.

| Type id | What the player does | Phase |
| --- | --- | --- |
| `situation` | Read a scene ("You're at a café and want water") and choose or build what to say | v1 |
| `translate` | English to Japanese with tiles, or Japanese to English typed | v1 |
| `register` | Rewrite casual as polite or the reverse (ありがとう → ありがとうございます) | v1 |
| `pattern` | The app fills a pattern's slot with a known word; build or translate the sentence | v1 |
| `conjugate` | Give a requested form of a verb or adjective | v1.1 |
| `reply` | In a voiced dialogue, choose your character's next line | v1.1 |

### Variety without more authoring

- **Two memories per item:** each phrase, pattern or sentence has an *understand* card (Japanese to meaning) and a *produce* card (meaning to Japanese), because recognizing a phrase and saying it are different skills.
- **Patterns multiply content:** a pattern with a food slot and 10 known food words yields 10 sentences; the composer prefers combinations the player hasn't seen. `voice-build` pre-renders every combination up to 50 per pattern; beyond that, the device voice fills in.
- **Many right answers:** phrases and sentences list accepted alternates, register variants, and both literal and natural translations; the grader accepts any of them and teaches the preferred one.
- **Builds on what you know:** the Learner Report lists your known items by kind, so ChatGPT's next pack reuses them in new phrases instead of starting over.

## The ChatGPT lesson prompt

This is the exact prompt ChatGPT uses to write lesson packs the app can read. Its format spec is written as TypeScript types, which ChatGPT follows reliably, and the same types generate the app's validator, so the prompt and the app cannot drift apart.

**How you use it:**

1. Create a ChatGPT Project for this app and paste the prompt below into its instructions once.
2. Each time you want a new pack, tap **Copy for ChatGPT** in the app. It copies your current Learner Report.
3. In the ChatGPT Project, paste the report and add your request (for example, "a unit on ordering food, include counters for drinks").
4. Copy ChatGPT's JSON reply and tap **Paste Lesson** in the app, or save it as a file and run `voice-build` on the Mac for full voice.
5. If the app rejects it, tap **Copy errors for ChatGPT** and paste them back; ChatGPT fixes and resends.

CI also validates the example inside this prompt on every build, so the prompt is tested like code.

```markdown
# Role
You write lesson packs for Kotodama, a Japanese-learning game app. The app reads your output
directly, so it must be valid JSON that matches the format spec exactly. You design
what to teach; the app handles scheduling, scoring, voice audio and visuals.

# Inputs I will give you
- LEARNER REPORT: level, known items (by ID and kind), weak items, recent mistakes,
  installed pack IDs, and my notes.
- MY REQUEST: the topic, situation or skill I want next.

# Output
Reply with exactly one fenced code block tagged json containing one LessonPack.
No text before or after it. Valid JSON only: no comments, no trailing commas.

# Format spec (TypeScript types; the JSON must satisfy them)
<format_spec>
type Furigana = string;   // Japanese text. Write EVERY kanji run as {漢字|かんじ}.
                          // Kana-only text needs no braces. Example: "{猫|ねこ}が{好|す}きです。"
type Id = string;         // Permanent. Prefix + dot + lowercase slug:
                          // k. kana, w. word, p. phrase, g. pattern, s. sentence, d. dialogue
type Register = "casual" | "polite" | "formal";
type Role = "narrator" | "teacher" | "friend" | "clerk" | "player";

interface LessonPack {
  schemaVersion: "1.0.0";
  pack: { id: string; title: string; version: number;
          level: "N5" | "N4" | "N3" | "N2" | "N1";
          description: string; requires?: string[];      // pack IDs this builds on
          district?: string };                      // town district it restores, e.g. "café"
  items: Item[];             // ONLY items that are new in this pack
  dialogues?: Dialogue[];
  units: Unit[];
}

type Item = Kana | Word | Phrase | Pattern | Sentence;
interface Base { id: Id; meanings: string[]; romaji?: string; notes?: string; tags?: string[] }
interface Kana extends Base { kind: "kana"; text: string }
interface Word extends Base {
  kind: "word"; text: Furigana;
  pos: "noun" | "verb" | "i-adj" | "na-adj" | "adverb" | "counter" | "other";
  forms?: Record<string, Furigana>;   // verbs and adjectives: "masu", "te", "nai", "past"
  example?: Example;
}
interface Phrase extends Base {
  kind: "phrase"; text: Furigana; register: Register;
  usage: string;                      // when and why you say it
  literal?: string;
  variants?: { text: Furigana; register: Register }[];
  accept?: Furigana[];                // other correct answers
  tiles?: Furigana[];                 // the text split into tiles, in order
}
interface Pattern extends Base {
  kind: "pattern";
  pattern: Furigana;                  // slots in double braces: "{{drink}}をください"
  slots: Record<string, Id[]>;        // word IDs that may fill each slot
  meaningPattern: string;             // "{{drink}}, please"
  examples: Example[];
}
interface Sentence extends Base {
  kind: "sentence"; text: Furigana; register: Register;
  tiles: Furigana[]; accept?: Furigana[];
}
interface Example { text: Furigana; en: string }

interface Dialogue {
  id: Id; title: string; setting: string;
  lines: { speaker: Role; text: Furigana; en: string;
           // choices ONLY on lines whose speaker is "player"; exactly one correct
           choices?: { text: Furigana; correct: boolean; feedback: string }[] }[];
}

interface Unit { id: string; title: string; nodes: Node[] }
interface Node {
  id: string;                         // "u01.n01"
  kind: "lesson" | "story" | "checkpoint";
  title: string;
  introduces: Id[];                   // new items first taught here
  teach?: ({ item: Id } | { note: { title: string; body: string } })[];
  exercises: Exercise[];
}
type Exercise = { id: string } & (    // "u01.n01.e01"
  | { type: "choice"; item: Id; ask: "meaning" | "reading" | "japanese"; distractors: Id[] }
  | { type: "match"; items: Id[] }                          // 4 to 6 items
  | { type: "listen"; item: Id; distractors: Id[] }
  | { type: "dictation"; item: Id }
  | { type: "tiles"; item: Id; extraTiles?: Furigana[] }    // item must have tiles
  | { type: "type"; item: Id; ask: "japanese" | "meaning" }
  | { type: "fill"; text: Furigana; answer: Furigana; options: Furigana[]; en: string } // blank is ＿＿
  | { type: "trace"; item: Id }                             // kana or one-kanji words only
  | { type: "situation"; scene: string; answer: Id; distractors: Id[] }
  | { type: "translate"; item: Id; direction: "toJapanese" | "toEnglish" }
  | { type: "register"; item: Id; from: Register; to: Register }
  | { type: "pattern"; item: Id; direction: "toJapanese" | "toEnglish" }
  | { type: "conjugate"; item: Id; form: string }
  | { type: "reply"; dialogue: Id }
);
</format_spec>

# Rules
1. Furigana on every kanji, every time, with the reading correct for that context.
2. IDs are permanent. Reference known items from the Learner Report by ID without
   redefining them. Define only new items in "items". Never reuse an ID for something else.
3. Every new item appears in "introduces" exactly once in the pack.
4. Lesson nodes: 10 to 15 exercises, at most 6 new items, at least 4 exercise types.
   Each new item is practiced at least 3 times across at least 2 types.
5. Teach real Japanese, not just words: from the second lesson on, every lesson
   includes at least one phrase, pattern or sentence. Prefer situations I will meet.
6. Each unit has at least one dialogue used by a "story" node, and ends with a
   "checkpoint" node of 15 to 20 exercises and no new items.
7. Distractors are the same kind as the answer, plausible, and never also correct.
8. Meanings: the shortest natural English first (1 to 4 words), alternatives after.
9. Default to polite (です/ます) unless I ask otherwise; label every register correctly.
10. Reuse my weak items from the Learner Report in new contexts.
11. Never include audio, image or file paths. The app voices everything itself.

# Before you reply, check
- The JSON parses and matches every type above.
- Every Id referenced is defined in this pack or listed in the Learner Report.
- Every kanji has furigana; every tiles array joins back into its text.
- Rules 3 to 6 hold for every node and unit.

# Example (shortened: real lesson nodes need 10 to 15 exercises)
<example>
{
  "schemaVersion": "1.0.0",
  "pack": { "id": "cafe-basics", "title": "At the Café", "version": 1, "level": "N5",
            "description": "Order drinks politely.", "requires": ["ja-core"] },
  "items": [
    { "id": "w.mizu", "kind": "word", "text": "{水|みず}", "romaji": "mizu", "pos": "noun", "meanings": ["water"] },
    { "id": "w.koohii", "kind": "word", "text": "コーヒー", "romaji": "koohii", "pos": "noun", "meanings": ["coffee"] },
    { "id": "p.onegaishimasu", "kind": "phrase", "text": "お{願|ねが}いします", "register": "polite",
      "meanings": ["please", "I'd like that, please"],
      "usage": "Said after naming what you want, or when asking a favor.",
      "variants": [{ "text": "お{願|ねが}い", "register": "casual" }],
      "tiles": ["お{願|ねが}い", "します"] },
    { "id": "g.o-kudasai", "kind": "pattern", "pattern": "{{drink}}をください",
      "slots": { "drink": ["w.mizu", "w.koohii"] }, "meanings": ["please give me ..."],
      "meaningPattern": "{{drink}}, please",
      "examples": [{ "text": "{水|みず}をください。", "en": "Water, please." }] },
    { "id": "s.mizu-o-kudasai", "kind": "sentence", "text": "{水|みず}をください。", "register": "polite",
      "meanings": ["Water, please."], "tiles": ["{水|みず}", "を", "ください", "。"] }
  ],
  "dialogues": [
    { "id": "d.cafe-order", "title": "Ordering a coffee", "setting": "A small café in Kyoto",
      "lines": [
        { "speaker": "clerk", "text": "いらっしゃいませ。ご{注文|ちゅうもん}は？", "en": "Welcome. What would you like?" },
        { "speaker": "player", "text": "コーヒーをください。", "en": "Coffee, please.",
          "choices": [
            { "text": "コーヒーをください。", "correct": true, "feedback": "Polite and natural." },
            { "text": "コーヒーです。", "correct": false, "feedback": "That means 'It is coffee', not a request." } ] },
        { "speaker": "clerk", "text": "かしこまりました。", "en": "Certainly." } ] }
  ],
  "units": [
    { "id": "u01", "title": "Ordering drinks", "nodes": [
      { "id": "u01.n01", "kind": "lesson", "title": "Asking for things",
        "introduces": ["w.mizu", "w.koohii", "g.o-kudasai", "s.mizu-o-kudasai", "p.onegaishimasu"],
        "teach": [ { "item": "w.mizu" }, { "item": "w.koohii" },
                   { "note": { "title": "を + ください", "body": "Say the thing, then を, then ください." } },
                   { "item": "g.o-kudasai" }, { "item": "p.onegaishimasu" } ],
        "exercises": [
          { "id": "u01.n01.e01", "type": "listen", "item": "w.mizu", "distractors": ["w.koohii"] },
          { "id": "u01.n01.e02", "type": "pattern", "item": "g.o-kudasai", "direction": "toJapanese" },
          { "id": "u01.n01.e03", "type": "situation", "scene": "You're thirsty at a restaurant and want water.",
            "answer": "s.mizu-o-kudasai", "distractors": ["p.onegaishimasu"] },
          { "id": "u01.n01.e04", "type": "fill", "text": "コーヒー＿＿ください。", "answer": "を",
            "options": ["を", "は", "が"], "en": "Coffee, please." },
          { "id": "u01.n01.e05", "type": "register", "item": "p.onegaishimasu", "from": "polite", "to": "casual" }
        ] },
      { "id": "u01.n02", "kind": "story", "title": "At the counter", "introduces": [],
        "exercises": [ { "id": "u01.n02.e01", "type": "reply", "dialogue": "d.cafe-order" } ] }
    ] }
  ]
}
</example>
```

## Lesson plan import and export

Lesson plans arrive while the app is running, not with app updates: any device can import a pack and export one, so a new plan from ChatGPT reaches your iPhone in under a minute.

**The learning loop this enables:**

1. You play lessons on iPhone or Mac.
2. The app builds a **Learner Report**: level, known items by kind, weak items, recent mistakes, what is due, and notes you typed for your "teacher."
3. You give it to ChatGPT with your request, using the prompt in this plan.
4. ChatGPT writes the next pack as JSON.
5. You import it (optionally voicing it on the Mac first), play it, and the loop repeats.

### Ways in

A pack is a `.jlpack` file (a zip of `pack.json` plus voice audio) or plain JSON straight from ChatGPT. iPhone home-screen web apps can't register as file handlers or share targets, so every route ends at the app's **Import** screen.

| Route | Direction | How it works | Voice | Phase |
| --- | --- | --- | --- | --- |
| Paste | iPhone or Mac | Copy ChatGPT's JSON, tap Paste Lesson | Device voice until voiced on the Mac | v1 |
| AirDrop + Files | Mac to iPhone | AirDrop the voiced `.jlpack`; it lands in Files; tap Import and pick it | Full | v1 |
| Link | Any | Paste a link to a hosted pack, such as a GitHub Gist | Full if voiced | v1 |
| Drag and drop | Mac | Drop a file onto the app window | Full if voiced | v1 |

### Ways out

- **Export a pack** to share with a tester or move between devices.
- **Learner Report**, copied as text ready to paste into ChatGPT, or saved as JSON.
- **Full backup:** one file holding progress, koban ledger, installed packs and settings. Restore it on another device; this is how the Mac and the iPhone share progress without a server. The app shows when you last backed up and prompts after long sessions.

### Import safety and correctness

- **Same validator everywhere:** the app runs the same Zod schemas as `content-lint`. An invalid pack is rejected with a readable error list and a **Copy errors for ChatGPT** button.
- **Preview before install:** title, version, units, item counts by kind, voice status, and what is new or changed versus the installed version.
- **Updates keep progress:** the same pack ID with a higher version replaces the old one; memory, ratings and koban carry over because item IDs are stable; removed items are archived, never deleted.
- **Untrusted input:** packs are data only, never code; size cap per pack; archive paths sanitized; only allowed audio types; IDs namespaced so two packs cannot collide.
- **Pack Library screen:** installed packs with version, source and voice status; enable, disable, export or delete (deleting asks first and archives progress).

## Running it on iPhone and Mac

The app lives at one free HTTPS address. Installing it is one share-sheet tap per device; after the first load it runs offline, updates itself, and never expires.

1. **iPhone or iPad:** open the address in Safari, tap Share, then Add to Home Screen. It opens full screen with its own icon, like an App Store app.
2. **Mac:** open the address in Safari, then File > Add to Dock. One click launches it in its own window.
3. **Testers:** send them the link and the same two steps.

**Updates:** every merge to `main` deploys automatically. The app shows "Update ready" and switches over on the next launch; there is nothing to reinstall.

**Keeping data safe:** Safari can delete a website's data after seven days without a visit, but apps added to the home screen are exempt and keep their own data. So always play the installed app, not a Safari tab; the two keep separate data. Browser storage is still not guaranteed, so the app requests persistent storage and makes the backup file easy (see import and export).

**Development and testing:**

- `npm run dev` on the Mac for live coding with instant reload.
- Pull requests run every check in CI; to try a change on your iPhone before merging, open the Mac's dev server from the phone over your home Wi-Fi (offline features need the deployed version).
- `voice-build` and VOICEVOX run only on the Mac; the phone never needs them.

**Mac-specific touches:** keyboard play (number keys pick answers, Return continues, Space replays audio), a wide layout with the path beside the lesson, and drag-and-drop import. Electron is not needed; the Dock app covers it.

## Your morning launch kit

Claude Code builds Kotodama overnight on your Mac. When it stops, it writes `LAUNCH.md` in the project folder with these steps and every link filled in with your GitHub username. Anything it couldn't do without you is at the top of that file. Cloudflare is not needed.

1. **Publish (once, about 2 minutes).** If Claude Code was already signed in to GitHub on your Mac, the `kotodama` repository exists and is live; skip to step 3. If not, double-click `Publish to GitHub.command` in the project folder. It signs you in to GitHub once in your browser (via the free [GitHub CLI](https://cli.github.com)), creates the repository and pushes.
2. **Turn on hosting (if step 1 didn't).** Open `https://github.com/<your-username>/kotodama/settings/pages` and set **Source** to **GitHub Actions**. A couple of minutes later Kotodama is live at `https://<your-username>.github.io/kotodama/`.
3. **iPhone.** Open that address in Safari, tap **Share**, then **Add to Home Screen**. Always launch it from the icon.
4. **Mac.** Open the address in Safari, then **File > Add to Dock**.
5. **Voices (once).** Download VOICEVOX for macOS from [voicevox.hiroshiba.jp](https://voicevox.hiroshiba.jp/), open it, and leave it running in the background. If `LAUNCH.md` says Node.js is missing, install the LTS version from [nodejs.org](https://nodejs.org).
6. **Pick the voices.** Double-click `Voice Audition.command`. It renders sample lines and opens a page where you choose Akari's and Tetsu's voice by ear.
7. **Voice the starter content.** Double-click `Voice Packs.command`. Until you do, the app speaks with your device's built-in Japanese voice.
8. **New lessons from ChatGPT.** Save ChatGPT's JSON reply into the `inbox` folder, double-click `Voice Packs.command`, then AirDrop the finished `.jlpack` from the `outbox` folder to your iPhone and tap **Import** in the app. Or paste the JSON straight into the app to play it right away with the device voice.
9. **Testers.** Send them the `github.io` link and steps 3 and 4.

Everything in this kit is free. The only steps that truly need you are signing in to GitHub (if Claude Code couldn't) and installing VOICEVOX.

## Quality: testing, CI/CD and review

Nothing reaches `main` without passing automated checks, and nothing reaches your phone without coming from `main`. That rule applies equally to my code and to ChatGPT's content and design files.

| Layer | Tool | What it covers | Bar |
| --- | --- | --- | --- |
| Unit | Vitest | Scheduler use, romaji/kana, answer normalizer, ratings, session composer, XP, streak, koban ledger and shop rules | 85%+ line coverage on the engine |
| Property | fast-check | Converter round-trips; normalizer and pattern filler never crash on any input | Thousands of cases per run |
| End-to-end | Playwright on WebKit (Safari's engine) | Install flow, finish a lesson, keep and lose a streak, buy a freeze, import a pack, backup and restore | All golden paths green |
| Visual | Playwright screenshots + Storybook | Every exercise and screen in light and dark, phone, tablet and desktop widths, large text | Any pixel change needs approval |
| Accessibility | axe-core | Labels, contrast, focus order, tap-target size | Zero violations |
| PWA and speed | Lighthouse CI | Installable, works offline, first load under 2 seconds, lesson start under 300 ms | Regression fails the build |
| Content | `content-lint` + answer-key bot | Every pack valid, every exercise completable, every Japanese line voiced or flagged | Zero errors |
| Real device | Your iPhone | Home-screen app on silent, in airplane mode, after a restart | Checked each release |

**Time is a dependency.** Streaks, the bonsai, review debt and reminders all depend on the clock and time zone, the classic source of bugs in apps like this. All date logic takes an injectable clock, and tests cover midnight, travel across time zones and daylight-saving changes.

**CI/CD:** the public \`kotodama\` repository on your GitHub account; GitHub Actions runs lint (ESLint, Prettier, TypeScript strict mode), all tests and the content linter on every pull request, within the free monthly minutes. A GitHub Actions workflow then builds and deploys `main` to the live address.

**Code review and workflow:** trunk-based development with short branches and small pull requests; Conventional Commits; semantic version numbers and a changelog; architecture decisions recorded as short ADR files so both AI collaborators work from the same reasoning.

**Definition of done** for any feature:

- [ ] Tests written and passing, including edge cases
- [ ] Works installed on iPhone and in the Mac Dock app, offline, light and dark, largest text size
- [ ] Every Japanese line it shows can be heard
- [ ] Uses theme tokens and animation slots, no hard-coded colors or timings
- [ ] Reviewed in a pull request, checked on the dev server, merged to `main`

**Privacy:** no analytics and no accounts. Hosting serves only static files; progress and packs never leave your devices unless you export them.

## Delivery roadmap

Five one-week sprints reach a v1.0 beta link for your testers, and the ChatGPT loop with full voice works from week 2.

&#91;embedded content: delivery roadmap · 5 sprints to beta, then v1.1 and v2\]

Weeks are estimates for planning; a sprint closes only when its gate passes. Every sprint costs US$0.

## Risks and open questions

The two biggest risks are iOS treating web-app data as disposable and two AI collaborators drifting apart; installation rules plus backups handle the first, and the shared schema, validator and tested prompt handle the second.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| iOS clears web-app data | Lost progress and koban | Play only the installed app (exempt from the 7-day purge); request persistent storage; one-tap backup file with reminders |
| iOS web limits (no file handler, no share target) | Imports take an extra tap | Clear Import screen; paste and link routes |
| Audio silent on the mute switch or before the first tap | "The app is broken" | Playback audio session, unlock on first tap, real-device check each release |
| Voice engine misreads kanji or pitch | Learner copies a wrong pronunciation | Explicit kana readings sent to VOICEVOX; spot-check new packs; per-line overrides in the pack |
| A voice character's terms change | That voice must be replaced | Content names roles, not voices; credits come from the manifest; re-render with `voice-build` |
| Streak reminders need a sender | No push without a scheduled job | Free scheduled worker in v1.1; in-app warnings until then |
| ChatGPT output doesn't match the format | Broken lessons | Typed spec in the prompt, validator, copy-errors loop, prompt example tested in CI |
| Streak and time-zone bugs | Unfair streak loss | Injectable clock and date-edge tests |
| A free tier changes | Hosting must move | The app is static files; it redeploys to another free host in minutes |
| Browser speech recognition is patchy on iOS | No auto-graded speaking | Shadowing with self-rating in v1.1; recognition only as a trial |

**Questions for you before Sprint 0:**

- [x] Apple silicon Mac: confirmed (M-series)
- [x] Audience: you plus a small group of hardcore-gamer testers
- [x] Permanently free: web app on the home screen
- [x] Name: Kotodama; hosting on your GitHub account
- [x] Voices: Akari (warm female) and Tetsu (deep male), with a switch-and-alternate setting
- [x] Difficulty: Hardcore by default
- [ ] Morning: sign in to GitHub if Claude Code couldn't, and install VOICEVOX (launch kit steps 1 and 5)
- [ ] Morning: confirm Akari's and Tetsu's voices in the audition (step 6)
- [ ] Where do you plan lessons with ChatGPT: Mac, iPhone or both? This decides which import route we polish first
