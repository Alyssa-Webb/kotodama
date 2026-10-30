# Brief: the avatar from behind, attack animations, and a yokai bestiary

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

(The bushes are already done; skip that task.)

## Task 2: the avatar seen from behind, with a real walk

Battle lessons show the player's avatar from behind, walking up a road. `world/avatar.json` parts have an optional `back` field: an inline SVG fragment in the same `0 0 100 120` box that is drawn instead of `svg` when `facing="back"`. Draw a `back` view for every part (base, outfits, headgear, held items, companions), consistent with each part's front art: the back of the head and hair, the back of the clothes, a hat seen from behind, a held item peeking out at the side, and a companion seen from behind. No face on the back views. Keep every other field unchanged.

Then give the walk real character. In `src/features/avatar/avatar.css`, `.avatar-actor[data-mood='walk']` (and `[data-facing='back']` when it helps) currently just bounces. Make it a proper chibi walk cycle: alternating left and right steps with a weight shift, a small bob on each step, a slight forward lean, and the shadow squashing on each footfall. Animate with `transform` only. If separate legs help, you may add leg or feet shapes inside the base part's `back` and `svg` art, but the walk must still look good when it is the whole avatar that moves.

## Task 3: road enemies

`src/foundations/art/Enemy.tsx` exports `ENEMY_KINDS` (`'inkling'`, `'glitchling'`, `'kasa-obake'`) and `Enemy({ kind, state, size })`, with states `'idle'`, `'enter'`, `'hit'`, `'attack'` and `'defeat'`. Its current art is a placeholder blob. Draw three distinct, cute-menacing chibi yokai that garble words:

- **inkling:** a mischievous ink drop with a brush-stroke tail and smudge eyes
- **glitchling:** a little spirit made of scrambled kana tiles that flicker
- **kasa-obake:** a one-eyed paper umbrella spirit hopping on one foot

Then add many more yokai from Japanese folklore, all cute-menacing chibi, each with its own silhouette and signature attack: `kitsune` (a fox with a glowing illusion flame), `kodama` (a little tree spirit with a rattling head), `kappa` (a water-dish head and a cucumber), `tanuki` (a leaf on its head and a puff of transformation smoke), `chochin-obake` (a lantern ghost with a long tongue), `tengu` (a red face, long nose and fan), `oni` (horns and a club), and `noppera-bo` (the faceless one). Add them all to `ENEMY_KINDS`.

Animate each state with personality: an idle wobble, a dramatic entrance, a hit flinch with a little star burst, an attack lunge toward the viewer, and a defeat in a puff of ink and paper scraps. The styles live in the enemy section at the end of `src/foundations/art/art.css`. You may add more kinds to `ENEMY_KINDS` if you draw them; keep the three names above.

## Task 4: attack animations

Battle attacks need real animation. When the player answers correctly, `.battle-hero .avatar-actor[data-mood='strike']` plays in `src/features/lesson/battle.css`. Make it a proper attack seen from behind: a wind-up, a sword or brush swing with a motion smear, follow-through and a recovery. Restyle the strike effects there (`.battle-fx-slash`, `.battle-fx-finisher`, `.battle-arc`, `.battle-dmg`) into great-looking slash arcs and impact sparks, with a bigger KO finisher. Each enemy's `attack` state should be a clear, readable attack toward the player (a lunge, a projectile or a breath). Style the `.battle-fx-impact` hit on the player to match: no layout change, transform and opacity only.

## Files you may change

- `src/features/lesson/battle.css`: strike and attack effect rules only
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
