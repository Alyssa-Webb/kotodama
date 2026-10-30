# Kotodama — morning report

## 1. Status

- **Live link:** **https://alyssa-webb.github.io/kotodama/** (repository: https://github.com/Alyssa-Webb/kotodama, shared with KenLinz, write access). Every push to `main` deploys automatically.
- **What works (run and checked in Safari's engine):** the full core loop. Lessons with 14 exercise types and voice, FSRS reviews, streaks with the 04:00 day rollover, Hardcore hearts, koban, shop, gachapon, town, spirits, avatar, the Mojibake boss, Kana/Listening Rush, pasting a ChatGPT pack, the Learner Report, backup/restore, offline play, dark mode. 118 unit tests and 16 end-to-end tests pass.
- **What's next:** install VOICEVOX and voice the starter pack, then ask ChatGPT for your first real unit.

## 2. Needs you

1. **Done:** published and hosting is on. KenLinz must accept the invitation emailed by GitHub (or at https://github.com/Alyssa-Webb/kotodama/invitations).
2. **Install the app.** iPhone: open https://alyssa-webb.github.io/kotodama/ in Safari → **Share** → **Add to Home Screen**. Mac: Safari → **File → Add to Dock**.
3. **Install VOICEVOX (free).** Download VOICEVOX for Mac from https://voicevox.hiroshiba.jp/, open it, and leave it running.
4. **Pick the voices.** Double-click **Voice Audition.command**. A page opens with sample lines in each candidate voice. Press **Choose for akari** and **Choose for tetsu** on the ones you like.
5. **Voice the starter pack.** Double-click **Voice Packs.command**. It writes `content/outbox/kotodama-starter-v1.jlpack`. AirDrop it to your iPhone, then in Kotodama open **More → Packs & Backup → Choose file** and pick it. Until then the app uses your device's Japanese voice.
6. **Play it on your iPhone** with the silent switch on and in airplane mode. I could only test in Safari's engine on the Mac, not on your phone.

## 3. Morning launch kit

1. **Publish (once).** Done: https://github.com/Alyssa-Webb/kotodama (if it ever needs redoing, `Publish to GitHub.command` does it).
2. **Hosting.** Done: https://github.com/Alyssa-Webb/kotodama/settings/pages → Source: GitHub Actions. Live at https://alyssa-webb.github.io/kotodama/
3. **iPhone.** Open https://alyssa-webb.github.io/kotodama/ in Safari → **Share** → **Add to Home Screen**. Always launch it from the icon: a Safari tab keeps separate progress.
4. **Mac.** Open the address in Safari → **File → Add to Dock**.
5. **Voices (once).** Install VOICEVOX from https://voicevox.hiroshiba.jp/ and leave it open. Node.js is already installed on this Mac (v24).
6. **Pick the voices.** Double-click `Voice Audition.command`.
7. **Voice the starter content.** Double-click `Voice Packs.command`.
8. **New lessons from ChatGPT.** Save ChatGPT's JSON reply into `content/inbox/`, double-click `Voice Packs.command`, then AirDrop the `.jlpack` from `content/outbox/` to your iPhone and import it. Or paste the JSON straight into the app (**Packs & Backup → Paste Lesson**) to play right away with the device voice.
9. **Testers.** Send them https://alyssa-webb.github.io/kotodama/ and steps 3 and 4.

## 4. What was built

Screenshots (Safari engine, iPhone 15 size): [contact sheet](docs/screenshots/iphone-contact-sheet.png) · [home](docs/screenshots/iphone-home.png) · [lesson](docs/screenshots/iphone-lesson.png) · [results](docs/screenshots/iphone-results.png) · [shop](docs/screenshots/iphone-shop.png) · [town](docs/screenshots/iphone-town.png) · [import](docs/screenshots/iphone-import.png) · [home, dark](docs/screenshots/iphone-home-dark.png) · desktop versions alongside (`docs/screenshots/desktop-*.png`).

| Milestone       | What you can do                                                                                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0 Foundations  | Installable PWA at `/kotodama/`, 言 seal icon, offline after first load, CI and deploy workflows, update-ready prompt                                                                                                             |
| M1 Lessons      | Starter pack: Kana Gate (あ–こ) and The Café (15 words, 7 phrases, ＿をください, 6 sentences, a dialogue, a boss). 14 exercise types, furigana at 4 script levels, typing in romaji or kana, mistakes replayed in a lesson review |
| M2 Memory       | FSRS-6 reviews (two cards per phrase/sentence), 04:00 day rollover, streak + kotatsu freezes, review debt, Hardcore hearts (1/hour or 10 reviews), backup file                                                                    |
| M3 ChatGPT loop | Paste / file / link / drag-drop import, readable errors + **Copy errors for ChatGPT**, preview, update in place keeping progress, Learner Report **Copy for ChatGPT**                                                             |
| M4 Economy      | Koban ledger, every number in `design/economy.json`, shop (10 consumables, 4 charms), koban spoil, Kintsugi + Redemption Trial, 4 difficulty modes, gachapon with published odds and pity                                         |
| M5 World        | Town map with illustrated districts that light up, spirits that grow and fade, bonsai, layered avatar + equip screen, Mojibake boss with phases                                                                                   |
| M6 Modes        | Kana Rush, Listening Rush, Dictation drill with ghost of your best run, daruma and hourglass items                                                                                                                                |
| Game feel       | Living ukiyo-e scene (day/night), guides Akari and Tetsu reacting to every answer, particles, screen shake, 気合 slam, stamped stars, count-up rewards, coin showers                                                              |
| M7 Voice        | `voice-build`, `voice-audition`, two double-click launchers. Built and unit-tested, not run for real (VOICEVOX not installed)                                                                                                     |

## 5. Known issues and decisions

- Voice pipeline not run against a real VOICEVOX engine yet; the device voice (Web Speech) reads everything until you voice a pack.
- Tracing is self-graded: no stroke-order data (KanjiVG) bundled yet.
- Not yet built from the plan: daily quests, omikuji, seasons and ghost-code trading (all v1.1 in the plan), town decorations and app-theme purchases, Lighthouse CI, Storybook.
- Real-iPhone behavior (silent switch, home-screen install) not tested on a device.
- Decisions: [0001 project folder](docs/adr/0001-project-folder.md) · [0002 pure engine libraries](docs/adr/0002-engine-pure-libraries.md) · [0003 exercise shapes](docs/adr/0003-exercise-shapes.md) · [0004 starter pack scope](docs/adr/0004-starter-pack-scope.md) · [0005 voice reading fallback](docs/adr/0005-voice-reading-fallback.md) · [0006 game visual direction](docs/adr/0006-game-visual-direction.md)

## 6. Your first lesson request to ChatGPT

1. In ChatGPT, create a Project named **Kotodama** and paste the prompt from [AUTHORING.md](AUTHORING.md) (everything in the code block) into its instructions.
2. Play a lesson or two, then in Kotodama open **More → Packs & Backup**, type a note for your teacher, and tap **Copy for ChatGPT**.
3. In the ChatGPT project, paste it and replace "(write what you want next here)" with your request, e.g. _"A unit on ordering food at a ramen shop, with counters for bowls and drinks."_
4. Copy ChatGPT's whole reply, tap **Paste Lesson**, paste, **Check**, then **Install**. If it's rejected, tap **Copy errors for ChatGPT**, paste them back, and ChatGPT fixes the pack.
