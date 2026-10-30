# Brief: real bushes, the avatar from behind, and road enemies

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task 1: bushes that look like foliage

The owner says the training-gate bushes (`Bushes` in `src/foundations/moments/MomentsLayer.tsx`, styles in the gate section of `src/foundations/moments/moments.css`) look like "sloppy circles". Redraw them as lush, layered shrubbery: clustered leaf shapes with pointed or rounded leaf tips and serrated outer silhouettes, several greens with shade bands and highlights, a few blossoms and berries, and depth between the mid and near layers. Keep the `Bushes({ side, depth })` signature. The swipe cut clips these layers with `clip-path` polygons that Claude computes, so keep each layer filling its box (absolutely positioned, full height). Do not change `Gate`, `GateSlice`, `cut.ts` or any gate logic.

## Task 2: the avatar seen from behind, with a real walk

Battle lessons show the player's avatar from behind, walking up a road. `world/avatar.json` parts have an optional `back` field: an inline SVG fragment in the same `0 0 100 120` box that is drawn instead of `svg` when `facing="back"`. Draw a `back` view for every part (base, outfits, headgear, held items, companions), consistent with each part's front art: the back of the head and hair, the back of the clothes, a hat seen from behind, a held item peeking out at the side, and a companion seen from behind. No face on the back views. Keep every other field unchanged.

Then give the walk real character. In `src/features/avatar/avatar.css`, `.avatar-actor[data-mood='walk']` (and `[data-facing='back']` when it helps) currently just bounces. Make it a proper chibi walk cycle: alternating left and right steps with a weight shift, a small bob on each step, a slight forward lean, and the shadow squashing on each footfall. Animate with `transform` only. If separate legs help, you may add leg or feet shapes inside the base part's `back` and `svg` art, but the walk must still look good when it is the whole avatar that moves.

## Task 3: road enemies

`src/foundations/art/Enemy.tsx` exports `ENEMY_KINDS` (`'inkling'`, `'glitchling'`, `'kasa-obake'`) and `Enemy({ kind, state, size })`, with states `'idle'`, `'enter'`, `'hit'`, `'attack'` and `'defeat'`. Its current art is a placeholder blob. Draw three distinct, cute-menacing chibi yokai that garble words:

- **inkling:** a mischievous ink drop with a brush-stroke tail and smudge eyes
- **glitchling:** a little spirit made of scrambled kana tiles that flicker
- **kasa-obake:** a one-eyed paper umbrella spirit hopping on one foot

Animate each state with personality: an idle wobble, a dramatic entrance, a hit flinch with a little star burst, an attack lunge toward the viewer, and a defeat in a puff of ink and paper scraps. The styles live in the enemy section at the end of `src/foundations/art/art.css`. You may add more kinds to `ENEMY_KINDS` if you draw them; keep the three names above.

## Files you may change

- `src/foundations/moments/MomentsLayer.tsx`: only `Bushes` and helpers it uses
- `src/foundations/moments/moments.css`: only the bush and leaf rules in the gate section
- `world/avatar.json`: only adding `back` fields (and adding legs or feet to the base art if needed)
- `src/features/avatar/avatar.css`: walk and back-facing rules only
- `src/foundations/art/Enemy.tsx`, and the enemy section of `src/foundations/art/art.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
