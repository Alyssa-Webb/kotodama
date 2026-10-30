# The world of Kotodama: a journey to fluency

Owner direction (2026-10-30): the scale should be expansive, like a real game with story beats. You progress through a world as your Japanese grows, from a beginner in the dojo to a Fluent Japanese Master. Fight yokai from Japanese folklore, talk to shopkeepers in speech bubbles, meet mysterious travellers who sell limited-time gacha, and become invested in the story.

## The journey (regions as progression beats)

Each region is a chapter. It teaches a skill band, has its own enemies, minigames, NPCs and a story boss, and unlocks the next region when the chapter's units are restored. Lesson packs map onto regions, so new content extends the world rather than a list.

| #   | Region                      | Skill band                                                          | Story beat                                                                            | Signature play                                                                |
| --- | --------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | **The Dojo**                | Hiragana and katakana                                               | You arrive as a nameless traveller; Koto the word-spirit and Sensei train you to read | Kana kendo drills, stroke brush trials, the Mojibake boss                     |
| 2   | **Bamboo Forest Road**      | On-the-go survival phrases (greetings, directions, asking for help) | Set out as a ronin-in-training; yokai have scrambled the road signs                   | Battle road vs kitsune tricksters and kodama; reading signposts to pick paths |
| 3   | **Rice Fields & Village**   | Food, numbers, counting, shopping                                   | Help the farmers whose words were stolen by a kappa                                   | Café and izakaya ordering in speech bubbles, market haggling, kappa duel      |
| 4   | **Castle Town (Jōkamachi)** | Polite speech, verbs, time and plans                                | The town lords speak only keigo; earn your way to an audience                         | Shopkeeper quests, inns, festival nights, a tengu duel                        |
| 5   | **Mountain Shrines**        | Kanji foundations, reading longer text                              | Pilgrimage up the mountain; shrine riddles in kanji                                   | Ema riddles, omikuji, oni gatekeepers                                         |
| 6   | **The Capital**             | Conversation, listening at speed, nuance                            | Rumours of the source of the mojibake curse                                           | Dialogue duels, debates, the final boss of garbled words                      |
| ∞   | **Endless roads**           | Every new pack                                                      | New regions, seasonal festivals                                                       | Each new lesson pack adds districts, NPCs and enemies                         |

Each region's town district feeds the tycoon (see [town-tycoon.md](town-tycoon.md)): the village has rice and tea, the castle town has inns and craft shops.

## Enemies: a yokai bestiary

Enemies are yokai who garble words. Defeating them "unscrambles" vocabulary, which is why correct answers are your attacks. Each has a region, a temperament, and a signature attack animation.

- **Dojo:** mojibake inklings, glitchlings (scrambled kana tiles), the Mojibake boss
- **Bamboo road:** kitsune (illusions that swap answer cards), kodama (tree echoes that repeat audio), kasa-obake (hopping umbrellas), chōchin-obake (lantern ghosts)
- **Rice fields:** kappa (steals your words unless you bow), tanuki (shape-shifts into other words), inugami
- **Castle town:** tengu (pride; demands polite forms), noppera-bō (the faceless one, a listening test), rokurokubi (a long neck that reads long sentences)
- **Mountain:** oni gatekeepers, yuki-onna (time pressure in the snow), raijū
- **Capital:** nue (a chimera of all skills), and the final boss

All of them are cute-menacing chibi, drawn by Gemini through the gemini-art skill, with fade-in "spirit" entrances.

## NPCs and speech-bubble play

- **Koto** (mascot): guide, shopkeeper with a fake mustache, town mayor, and narrator of the story.
- **Shopkeepers:** speech-bubble conversations where you order and haggle in Japanese, with choices that branch and remember you.
- **Mysterious travellers:** appear on forest roads at random times with limited-time gacha (region-themed prize pools, published odds, earned tokens only, never real money).
- **Sensei, farmers, lords, monks:** quest-givers whose requests are real exercises.

## Progression and identity

- **Ranks:** traveller → apprentice → ronin → samurai → master, with belts and titles on your avatar.
- **Story beats:** every region opens and closes with a short illustrated scene featuring Koto, and the bosses carry the plot.
- **A visible journey map** replaces the linear Duolingo-like path: a winding route through the regions you've unlocked.

## Build order (after the town tycoon core)

1. A region schema (`world/regions.json`: skill band, enemy roster, NPCs, music and palette) that drives the gate scene, battle enemies and the map.
2. The journey map screen, then the region 1 and 2 story beats.
3. Speech-bubble dialogue engine (branching, with memory) for shopkeepers.
4. Travellers with limited-time gacha pools.
5. More regions as content grows.
