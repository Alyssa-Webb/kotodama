# Kotodama Town: a tycoon game built on endless Japanese

Owner direction (2026-10-30): the town is a main screen and the heart of the game; add tycoon systems; it must feel like a game, not Duolingo or Quizlet; it must scale with endless lessons; the minigames need real game design.

## Core loop

**Learn words → words become residents → residents work in buildings → buildings earn koban and unlock new areas → expansion needs new words.**

- **Every word you learn is a resident.** The existing spirits (FSRS stages) become townsfolk: a word's memory strength is the resident's skill level. Residents staff buildings that match their category: food words staff the café, place words work at the station, verbs train at the dojo.
- **Buildings** are placed on a grid inside each district (Station, Café, Shrine, Shopping Street, Bathhouse, School, plus new districts as packs add units). Each building has a level, an income rate, staff slots and a word-category affinity.
- **Income accrues in real time** while you are away (capped at about 8 hours, so the game rewards coming back rather than grinding). You collect it with a satisfying tap, with coins flying to the counter.
- **Memory drives the economy.** A building's output is multiplied by its staff's average retention (FSRS retrievability). Words you are forgetting make their buildings sputter, with grey smoke and a "needs review" lantern on them. Reviewing them in the Dojo restores production. The reviews you owe now have a visible, game-native cost, without turning it into nagging.
- **Expansion is gated by learning, not by grinding.** New plots and districts unlock when a unit is restored (the existing `restoredBy`). Building levels cap at the number of mastered words in that category, so the only way to grow is to learn more Japanese. That is what makes it scale with endless content.

## Spirits: variety, rarity and stations (owner request)

- **Many spirit types**, each tied to a word category and an element of Japanese life: tea sprites (food and drink), lantern foxes (places), ink tanuki (verbs), bell kodama (greetings and phrases), wave koi (adjectives), cloud tengu (time and weather), and more as packs add categories. Data lives in `world/spirits.json`, with Gemini drawing each one in the chibi style.
- **Rarity is rolled when a spirit is acquired** (common, rare, epic, legendary), using the same published-odds machinery as the gachapon, and seeded per save so it can't be rerolled by reloading. Rarity scales a spirit's effectiveness in town: output, speed, capacity and special perks. A spirit's level still comes from how well you know its word (FSRS), so a legendary spirit for a word you're forgetting still sputters.
- **Stations and roles:** every building has role slots (brewer, cook, clerk, porter, greeter, scribe). Assigning spirits by drag and drop sets what the building produces and how much. Matching a spirit to a role that fits its category gives a bonus.
- **Products and inventory:** buildings turn spirit labour into products (tea, bento, souvenirs, tickets, scrolls) held in a per-building inventory with a capacity. Products sell for koban automatically or fill resident requests, and some feed other buildings, forming production chains. Better spirits and roles mean more stock, faster restocks and higher-value products.

## Tycoon systems (in build order)

1. **Buildings and income:** a plot grid per district, build and upgrade with koban, an income ledger (event-sourced like the existing ledger), idle accrual with a cap, a collect-all action. Data in `world/buildings.json` (cost curve, output, affinity, art id).
2. **Residents and staffing:** auto-staff from learned words by category, with each resident's level taken from FSRS. Tap a resident to hear the word and see its card, so the town becomes a living vocabulary book.
3. **Requests (quests):** residents ask for things in Japanese ("コーヒーをください"). Fulfilling one means answering a quick, real exercise and pays a bonus. These bring the daily-quest idea from the plan into the town.
4. **Festivals (events):** weekly or seasonal events (Tanabata, Obon, momiji season) with a district theme, temporary building skins and a special minigame.
5. **Visitors and trade:** a travelling merchant offers rare decorations for capsule tokens; ghost-code visits let testers tour each other's towns with no server, building on the plan's offline ghost-code idea.

## Minigame redesign (one game per skill, each a real game)

| Game                  | Skill                 | Core mechanic                                                                                | Why it is a game                             |
| --------------------- | --------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Kendo duel** (boss) | recall under pressure | A sensei attacks on a rhythm; answer before the strike lands; fast answers counter-strike.   | Timing, risk and reward, a readable opponent |
| **Bamboo cut**        | reading / kana        | Stalks fall bearing readings; swipe-slice the right one; combos speed up the fall            | Physical input, escalating speed             |
| **Café rush**         | listening + vocab     | Customers order out loud; drag the right dish to the right customer before patience runs out | Juggling, tips for speed                     |
| **Brush & ink**       | kanji                 | Trace strokes in order; stroke accuracy and rhythm score; perfect characters seal the scroll | Skill expression, mastery                    |
| **Station dash**      | reading signs         | Read station-sign kanji to switch tracks and keep the train running                          | Spatial routing                              |
| **Shoji match**       | memory                | Slide paper screens to pair words with pictures or sounds                                    | Short and calm, for the review gap           |

Each game is a plugin over the existing exercise engine (the same questions, FSRS grading and rewards), so new lesson packs feed every game automatically, and games pay into the town economy.

## Screens

- **Town (main tab):** the playable town map with districts, buildings, residents walking around, collectable income, request bubbles and "sputtering" buildings that need review.
- **Home** turns into the daily dashboard: today's goal, the next lesson, town income waiting, and requests.

## Build phases

1. Town as the main screen, with buildings, income, idle accrual, collecting and upgrading (engine, data, UI). Art from Gemini through the gemini-art skill.
2. Residents from learned words, retention-driven output, sputtering buildings linked to Dojo reviews.
3. Requests (quests) and the first two redesigned games (Café rush, Bamboo cut).
4. Remaining games, festivals, visitors.
