# Brief: anime-style attack animation (GPT action animator)

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

You are the action-animation specialist (anime fight choreography). The owner says the current battle attacks look rough. Rebuild them with real anime animation technique.

**Where:** `src/features/lesson/BattleStage.tsx` keeps a one-shot effect state, `fx: { id, kind: 'slash' | 'finisher' | 'impact' } | null` (slash = a correct answer hits the yokai; finisher = the knockout blow; impact = the yokai hits the player), and currently renders it inline (the `{fx && (...)}` block, styled by `.battle-fx*` rules in `src/features/lesson/battle.css`). Move that rendering into a new component, `src/features/lesson/BattleFx.tsx` (`export function BattleFx({ fx, onDone })`), styled by a new `src/features/lesson/battle-fx.css`. In `BattleStage.tsx`, change only that `{fx && ...}` block to `<BattleFx fx={fx} onDone={() => setFx(null)} />`. The hero is at about 32% left and the bottom of the 156 px-tall `.battle` strip; the enemy is at about 58% left, around 34 px from the top.

**Techniques to use:**

- **slash (a normal hit):** anticipation; a tapered crescent slash trail with a smear frame; 2–3 diagonal speed lines; hit-stop (the trail holds 60–80 ms); impact sparks and a small starburst at the enemy; a damage number that punches in and floats away; then a lingering after-glow of the cut fading out. Vary it: alternate between a horizontal slash, a rising slash and a quick double jab (two fast straight thrust lines with small impact rings), using `fx.id` parity to choose.
- **finisher (KO):** a proper impact frame. Flash 2–3 frames of a high-contrast inverted full-screen frame (black and white, radial speed lines converging on the enemy, the enemy silhouette in pure ink), then a cross slash, a big shockwave ring, a radial burst of ink and paper scraps, screen-punch scale, a "KO!" stamp slam and slow after-image fades. The full-screen frame may be `position: fixed` but must not block taps.
- **impact (the player is hit):** a red-edge vignette pulse, claw or swipe marks across the hero side, a short knockback shake, and a "−HP" number that drops and fades.

Keep everything snappy (under 700 ms, except the KO at about 1.1 s), and use transform and opacity only.

## Files you may change

- `src/features/lesson/BattleFx.tsx` (new)
- `src/features/lesson/battle-fx.css` (new)
- `src/features/lesson/BattleStage.tsx`: ONLY replace the `{fx && (...)}` block with `<BattleFx .../>` and import it
- `src/features/lesson/battle.css`: you may delete the old `.battle-fx*`, `.battle-arc` and `.battle-dmg` rules

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
