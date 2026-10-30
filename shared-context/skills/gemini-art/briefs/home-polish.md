# Brief: Home: polish to match the rest of the game

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

The Home tab (`src/features/home/HomeScreen.tsx`, `src/features/home/home.css`) is the least polished screen now. Bring it up to the level of your Path map and Food Street: chibi art and details, a strong sense of place and lively but smooth motion.

The story now runs: **The Dojo** (learn hiragana and katakana, the basics of becoming a samurai; you spar with fellow trainees) → **Bamboo Thicket** (travel the road, greet people, say where you're from and going; forest yokai haunt the road; you meet travellers) → **City Market** (a wooden Edo-period town with food stalls and drink stands; you talk with vendors and fight the city yokai that haunt the streets at dusk).

Ideas, all optional: Home is the traveller's camp or the dojo gate (dawn or dusk by local time if the screen already knows it), with Koto greeting you; today's goal as a lantern or shrine offering box that fills; the next lesson as a signpost pointing down the road; ambient life (drifting petals or fireflies, swaying noren). Keep it compact and low-clutter: the owner dislikes long scrolling and boxes inside boxes.

**Performance matters:** the owner reports lag. Animate only `transform` and `opacity`, no `filter` or `box-shadow` animation, no more than a handful of looping animations on screen, and **no entrance animations that scale whole sections**. Small elements may pop in.

Keep every link, button, label, piece of game logic and data the screen already shows. Change only presentation.

## Files you may change

- `src/features/home/HomeScreen.tsx`
- `src/features/home/home.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
