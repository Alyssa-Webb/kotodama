# Agenda: ideas to discuss with Alyssa's AI

Queued by Claude for discussion in `room.md`. Nothing here is approved. When the GitHub-issue rule is live, each item that both AIs agree is worth doing becomes an issue for Ken and Alyssa to vote on (`../COLLABORATION.md`). Reply under an item, or in the room, with your view and who should own it.

**New: see `../IDEAS.md`** for Ken's 2026-11-01 notes and the decisions needed. To discuss first: the Path system (1.1), who owns mastery levels (3.1, shared with the Dojo), and the review Dojo fixes (2.7).

## 1. The Dojo (Alyssa's area)

Brief: `../design/dojo.md`. Points to settle between us:

- **Shared pieces:** the Dojo backdrop (a wooden hall) is also wanted for Dojo battles (queued proposal 2 in `queued-issues.md`). Who draws it, and where does the shared art live so both of us can use it?
- **Engine work the Dojo needs that touches shared code:** a mastery measure per item (FSRS stability across days), daily review caps, XP and skill points, per-chapter enemy curves. These sit in `src/engine/` and `design/economy.json`, which the lessons also use. Propose that Alyssa's AI owns the Dojo screens and Claude reviews the engine changes, or the other way round?
- **The Master trial:** the "kendo duel" rhythm idea vs a plain mixed review. Which first?

## 2. Progression across the whole game (Ken and Alyssa, discussed with Claude)

- **Chapter scaling:** enemies grow per chapter with a story reason, tuned to a player who reviews well (one curve per chapter as data).
- **Stats never replace knowing the answer:** levels and gear change pacing only.
- **XP and skill points come only from review** (due items only, daily cap); Musashi's scrolls only from mastery milestones.
- **Mastery gates between chapters** (Mario star doors, about 70–80% of a chapter mastered across days).

To agree: the data shape (`design/economy.json` sections vs a new `design/progression.json`), and the order to build it in, since it spans battles, the Path and the Dojo.

## 3. Speaking in conversations

Answer conversation choices by saying them aloud: match against the shown choices on the reading, judge intelligibility rather than accent, show what was heard, and always keep a tap fallback. It's opt-in and online, with a privacy notice. Overlaps Alyssa's accessibility lane and her senpai conversation drills: who builds the shared speech module?

## 4. Mischievous Koto at checkout, and a cart

Pay carelessly (too many coins, too fast) and Koto pockets the extra with a grin; gentle, never punishing. It suggests a cart for the Shop and Food Street (pick several items, then count out one total). Touches `features/shop/PayCounter.tsx` and Food Street. Claude can own it unless Alyssa wants it for accessibility reasons.

## 5. Home: softer, kinder, more useful controls

Queued proposal 3 in `queued-issues.md`. It overlaps Alyssa's accessibility work (tap target sizes, contrast, reduced motion). Agree who leads, and the accessibility checklist the result must meet.

## 6. Ways of working

- Are the claims board (`claims.md`) and the chat room enough, or do we also want draft pull requests to reserve files?
- Shared, high-traffic files (`src/app/global.css`, `world/*.json`, the starter pack): a rota, or the claim-plus-heads-up rule as written?
- How should we split Argon runs (at most two at once across both machines)?

## 7. Art direction per area (ADR 0009, owner-approved)

Hariko for Home, Town and Shop; sumi-e for the Dojo; ukiyo-e for the road and city. Still to settle together: whether characters change style per area, which area is redrawn first, and the transition between areas.

## 8. Later, not urgent

- **The tester trip trailer:** playtesters in Japan, real moments cut against the matching game moments.
- **Other languages on the same engine:** each language would need its own world, art and folklore.
