# Queued issue proposals (not posted yet)

Drafted by Claude while the collaboration rule is inactive (`../COLLABORATION.md`). When Ken says it's live: run `setup-labels.sh`, post each draft below as an issue from the **AI proposal** template (`gh issue create -R Alyssa-Webb/kotodama --title ... --body-file ... --label ...`), then delete it from this file and note the issue number in the chat room.

---

## 1. [proposal] Battle walk: the road moves, not the whole battle window

- **Labels:** `ai:claude`, `area:battle`, `area:art`, `enhancement`
- **What changes:** while the hero walks between foes, the sky and backdrop stay still. Only the road surface and its stones, markings and roadside clutter move, flowing toward the viewer along the trail's perspective and passing on either side as they near. Nothing slides across the whole square battle window.
- **Why (Ken):** "fix the path so the rocks and clutter move along the path, not across the entire square combat UI region." Earlier: "There is a sky backdrop so it just looks awkward when moving between enemies."
- **Files and areas:** `src/features/lesson/BattleStage.tsx`, `src/features/lesson/battle.css` (art by Argon: `briefs/battle-walk.md`, in flight when this was written).
- **Verify:** a lesson at 390×844 in WebKit, frame-by-frame captures of the walk; scenery loops still pause while a question is up; reduced motion shows no movement; e2e passes.

## 2. [proposal] Battle backdrops per story region

- **Labels:** `ai:claude`, `area:battle`, `area:art`, `enhancement`
- **What changes:** `BattleStage` takes `region: 'dojo' | 'bamboo' | 'market'` (from `regionForUnit` on the lesson's unit, and the Dojo for reviews):
  - **dojo:** inside a wooden dojo hall (floorboards toward a kamiza alcove with a scroll, a bokken rack, shoji light)
  - **bamboo:** the current bamboo road
  - **market:** an Edo market street at dusk (machiya, yatai with noren, red chōchin, a sake shop's sugidama)
- **Why:** every region currently fights in the same bamboo wood, which breaks the story's sense of place.
- **Files and areas:** `BattleStage.tsx`, `battle.css` (Argon), `LessonScreen.tsx` and `ReviewsScreen.tsx` (pass `region`). It touches the same files as #1, so it runs after it. The Dojo backdrop is shared with Alyssa's Dojo interior: coordinate with her AI in the chat room first.
- **Verify:** one lesson per region at phone size; e2e.

## 3. [proposal] Home: softer, kinder, more useful controls

- **Labels:** `ai:claude`, `area:home`, `area:art`, `accessibility`, `enhancement`
- **What changes:** replace Home's thick bordered cards and big outlined buttons with soft, light surfaces and fewer, clearer actions that do something in place: start the next lesson, collect town income, eat when HP is low, and see the daily goal at a glance. Keep every action that exists today.
- **Why (Ken):** "Remember what we said about the big outlines and buttons on the main and town pages? Those are important to remove and replace with something smoother, kinder, and much more functionally useful." Earlier feedback: too blocky, boxes inside boxes, low clutter.
- **Files and areas:** `src/features/home/HomeScreen.tsx`, `src/features/home/home.css` (art by Argon). Alyssa's accessibility work may overlap: ask her AI first.
- **Verify:** Home at 390×844, light and dark, large text; tap targets of at least 44 px; reduced motion; e2e golden path.

## 4. [proposal] Town as an illustrated map (finishing)

- **Labels:** `ai:claude`, `area:town`, `area:art`, `enhancement`
- **What changes:** the Town becomes its own illustrated map (Argon's `TownMap`). Every district is a building on the map; tapping one opens its business sheet (staff, collect, upgrade). There's a "Collect all" above the map and Food Street as one soft row that highlights when you're hurt. The old mountain backdrop and district cards are gone.
- **Status when drafted:** in flight before the rule; the wiring was written and waiting for the map art. If it merged before the rule went live, post this as a closed issue for the record.
- **Files and areas:** `src/features/town/*`.

## Parked ideas (not proposals yet; humans decide when)

- Mischievous Koto at checkout plus a cart system (`HANDOFF.md`, "Ideas parked for later")
- Speaking replies in conversations (`design/dojo.md`, Speaking)
- Tester trip trailer series
