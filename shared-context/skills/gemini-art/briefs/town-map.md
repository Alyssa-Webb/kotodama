# Brief: An illustrated town map

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

The Town tab is the game's tycoon: every district of Kotodama Town runs a business staffed by the player's word-spirits. Today it sits on a generic mountain backdrop with tiny placeholder buildings and emoji signs, and the owner says that makes no sense: **the town must be its own place**, an illustrated town map where every location is a real, recognisable building in its own spot.

Create a new, self-contained component `src/features/town/TownMap.tsx` (with `src/features/town/town-map.css`) that exports:

```ts
export interface TownMapSpot {
  id: string;        // district id: station | cafe | shrine | shopping | bathhouse | school
  en: string;        // English name, e.g. "The Station"
  restored: boolean; // open for business
  lit: boolean;      // lanterns lit (the player kept their streak)
  pending: number;   // yen waiting to be collected (0 = none)
}
export function TownMap(props: { spots: TownMapSpot[]; onOpen: (id: string) => void }): JSX.Element;
```

Draw a top-down/three-quarter chibi town map (a compact Edo-period town, NOT a mountain backdrop) filling the width at 375 px, about 1.1× as tall as it is wide:

- Streets and a small river or canal connect six distinct, recognisable buildings, each a **button** (`onOpen(id)`, `aria-label` with its English name and state):
  - **Station** (a small wooden rural station with a platform, sign and a little train)
  - **Café** (a kissaten with noren and a steaming teacup sign)
  - **Shrine** (red torii, a small honden, a stone lantern)
  - **Shopping Street** (a shōtengai arcade of shopfronts with banners)
  - **Bathhouse** (a sentō with a tall chimney and the ♨ symbol on its noren)
  - **School** (a terakoya or small schoolhouse with a bell)
- A **locked** district (`restored: false`) shows as a fenced lot under a cloth cover or scaffolding with a small padlock, clearly "not yet".
- A **restored** district is bright; when `lit`, its lanterns glow; when `pending > 0`, show a small floating coin badge with the amount (formatted like `¥1,240`) that bobs gently.
- The English name sits on a small wooden sign under each building, readable at phone size.
- Ambient life, kept light: one or two tiny walking townsfolk or a drifting cloud shadow. **Performance matters** (the owner reports lag on iPhone): no more than ~5 looping animations, transform/opacity only, no filters.
- Soft and friendly: no heavy outlines or thick card borders; the map has no box around it and reaches the screen edges (break out of the page gutter like the Path map does with negative inline margin).

Do not import or change the tycoon logic; Claude wires `TownMap` into the Town screen.

## Files you may change

- `src/features/town/TownMap.tsx` (new)
- `src/features/town/town-map.css` (new)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
