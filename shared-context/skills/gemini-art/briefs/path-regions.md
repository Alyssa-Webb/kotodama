# Brief: Path: clearly distinct story regions

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

The story now runs: **The Dojo** (learn hiragana and katakana, the basics of becoming a samurai; you spar with fellow trainees) → **Bamboo Thicket** (travel the road, greet people, say where you're from and going; forest yokai haunt the road; you meet travellers) → **City Market** (a wooden Edo-period town with food stalls and drink stands; you talk with vendors and fight the city yokai that haunt the streets at dusk).

The Path tab (`src/features/path/PathScreen.tsx`, `src/features/path/path.css`) is your full-bleed saga map. The owner likes it and does not want a full redesign. Two changes:

1. **Regions follow the new story.** In the `REGIONS` table, keep `dojo` first, then rename the second to `{ id: 'bamboo', en: 'Bamboo Thicket', ja: '竹藪', rt: 'たけやぶ' }`, and replace the third (`village`, Rice Fields & Village) with `{ id: 'market', en: 'City Market', ja: '市場', rt: 'いちば' }`. Keep castle, shrine and capital after them. Update the `RegionInfo` id union and every `'village'` branch to `market`.
2. **Make each region unmistakable at a glance, with more side detail.** The areas must contrast clearly against each other. Each gets its own palette and ground, with props along both edges of the trail:
   - **Dojo:** a polished wooden floor or stone-and-gravel training yard; a dojo hall with a tiled roof; a weapon rack of bokken; a makiwara post; a hanging taiko; noren with a crest. Warm wood tones.
   - **Bamboo Thicket:** dense green bamboo walls on both sides (tall stalks with nodes and leaf sprays), shafts of light, a moss-covered Jizō, a stone road marker (michishirube), a small stream with a log bridge, fireflies. Cool greens.
   - **City Market:** a wooden machiya street: food stall carts (yatai) with noren, a dango stand, a sake shop with a sugidama ball hanging, red chōchin lanterns, stacked barrels, a wooden sign board. Warm reds and amber lantern light.

   Transitions between regions can blend, but each region's middle must be clearly its own. Keep it light enough to scroll smoothly (no filters, no huge path counts, few looping animations).

Keep every link, `aria-label`, lock rule, the current-node avatar, node kinds and the furigana region names exactly as they work now. Check at 375 px wide.

## Files you may change

- `src/features/path/PathScreen.tsx`
- `src/features/path/path.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
