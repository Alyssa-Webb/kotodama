# The Dojo: design brief (owner: Alyssa)

The Dojo is Alyssa's area. This file collects what Ken, Alyssa and Claude agreed in discussion (2026-10-30) so she can design and build it. Nothing here is implemented yet beyond what "Today" lists. Treat it as direction, not a spec: Alyssa owns the final calls.

## Purpose

The road teaches; **the Dojo is where you prove you've learned.** It is the home of review, and review is a core game mechanic, not homework. Getting stronger, opening new chapters and earning the Master's gifts all come from mastering words, phrases and characters over days.

## The visit, start to finish

1. **Entering:** tapping the Dojo opens its **doors**, which swing open automatically (like the bush rip before a lesson, but with no swipe). About a second; a tap skips it. Play the full swing on the first visit of the day and a quick version afterwards. Include a reduced-motion version (a simple fade).
2. **The interior:** a dojo hall with **training dummies** and **senpai** (senior students) training in the background. Keep the scene light: the owner's phone shows lag when large animated scenes run during questions, so scenery should pause while a question is up (see `.battle:not(.battle-walking)` in `features/lesson/battle.css`).
3. **Review drills**, in two formats:
   - **Training dummies (combat):** quick recall drills (reading kana, meaning, listening, typing). Dummies never fight back: no HP loss, so practice feels safe.
   - **Senpai (conversation):** phrase and sentence review in the same format as the Bamboo Thicket conversations (choose the right reply; later, say it aloud).
4. **The Master's trial:** each review session can end with a final review against the Dojo Master: mixed items, no hints, possibly timed. Ken's town design doc sketches a "kendo duel" where the master strikes on a rhythm and you must answer before the blow lands.

## The Dojo Master: Miyamoto Musashi (宮本武蔵)

- Japan's most famous swordsman and author of **The Book of Five Rings (五輪書)**. Like Koto, he is a mascot, but just for the Dojo: dignified, wise and a little dry-humoured; chibi but respectful. Art goes to Gemini 4 Argon (owner rule).
- **The five scrolls** are granted at mastery milestones. Each unlocks a combat style:
  - **Earth (地):** fundamentals, a steadier stance and more HP
  - **Water (水):** adaptability, retry or swap a question
  - **Fire (火):** timing, bonus damage for fast answers
  - **Wind (風):** knowing other schools, reveal an enemy's weakness
  - **Void (空):** mastery, a finisher
- **Historically grounded weapons and items:**
  - the bokken Musashi carved from an oar for the Ganryūjima duel against Sasaki Kojirō
  - the paired katana and wakizashi of his Niten Ichi-ryū school
  - the jitte (his father Munisai's art)
  - his ink brush (he was also a painter)

## Progression rules (agreed)

- **Stats never replace knowing the answer.** A wrong answer is always a miss. Levels and gear only change pacing: more HP, bigger hits, a hint charge, a crit for quick recall.
- **Review earns XP and skill points, spent at the Dojo** on skills and item upgrades. Item drops and upgrade trees are future scope.
- **Enemies scale by chapter, with a story reason** (deeper yokai, stronger rivals, the Master's later trials). Each chapter is tuned to a player who has reviewed well: keep up and fights feel fair, skip review and you fall behind, over-review and you get only a small edge. Keep the curves as data (one curve per chapter: enemy HP and damage, expected player power).
- **A daily review cap stops cramming.**
  - Only reviews of items the memory scheduler (FSRS) says are due today earn XP and power.
  - Rewards stop after a daily amount (for example 15–20 minutes).
  - Practice past the cap stays open but earns nothing.
  - Overdue reviews after a break come back in manageable daily slices.
- **Mastery gates between chapters**, like the star doors in Mario: the next chapter opens when about 70–80% of the current chapter's items are mastered. Mastered means recalled well across several days (FSRS stability), so a gate can't be rushed in one evening. Show progress clearly ("Mastered 18 of 24 needed", next review times), and keep side content (Town, Food Street, practice) available while players wait.
- **Musashi's scrolls come only from mastery milestones,** never from XP.

## Speaking (future)

Conversation drills can ask the player to **say** the reply instead of tapping it:

- Use the browser's speech recognition in Japanese and match what was heard against the closed set of choices, by reading.
- Judge intelligibility, not pitch accent.
- Show what was heard, allow retries, and always keep a tap fallback (accessibility; quiet places).
- On many phones the audio goes to Apple's or Google's servers, so make it an opt-in online feature with a clear privacy notice.

## Accessibility (Alyssa's lane)

Reduced-motion versions of every animation, large tap targets, a tap alternative to swipes and speech, readable contrast in light and dark, and screen-reader labels on every interactive element. Keep sessions short (5–10 minutes): review fatigue is the top reason people quit learning apps.

## Suggested build order

1. Door entrance, dojo interior and dummy drills, driven by the existing review queue
2. Senpai conversation drills
3. Daily review cap and mastery tracking
4. The Master's trial and the first scroll; then ranks, XP and skills
5. Chapter mastery gates; later item drops, upgrades and speaking

## Today (what already exists to build on)

- **Dojo reviews:** `src/features/reviews/ReviewsScreen.tsx` (route `/reviews`) plays the due review queue through the lesson `Player`, as a battle against the Dojo's foes. The `world/regions.json` `dojo` roster is `trainee-bokken` and `trainee-senpai` (art in `src/foundations/art/foes/DojoFoes.tsx`).
- **Memory:** `src/engine/memory/scheduler.ts` (ts-fsrs) and `dueCards` in `engine/game.ts`. Spirit stages (`engine/world.ts` `spiritStage`): `guardian` means stability of 21 days or more, a good basis for "mastered".
- **Ranks:** `dojoRank` and `eloUpdate` in `engine/world.ts` (10-kyū up to dan grades).
- **Entrance animation:** the bush rip is the `Gate` moment in `src/foundations/moments/MomentsLayer.tsx` (geometry in `cut.ts`); the doors can follow the same moment pattern (`design/moments.json` timings).
- **Economy hooks:** `design/economy.json` `hp` (damage per unit) and `hearts.dojoReviewsPerHeart` (0: reviews don't heal).
- **The dojo battle backdrop** (a wooden hall) is being drawn by Argon in the `battle-scenes` run; reuse it for the interior.
