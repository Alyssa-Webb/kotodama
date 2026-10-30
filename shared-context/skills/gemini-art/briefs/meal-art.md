# Brief: Food Street dish symbols

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

Food Street (`src/features/food/FoodScreen.tsx`) is the only place the player heals: they pick a stall, order in Japanese and pay in yen. Each stall card needs a **dish symbol** the player recognises at a glance, the way the shop's items have `ItemArt` (`src/foundations/art/ItemArt.tsx`: read it and match its structure, viewBox and style exactly).

Create `src/foundations/art/MealArt.tsx` exporting `export function MealArt({ id, size = 72 }: { id: string; size?: number })`, with a `switch (id)` drawing one appetising chibi dish per meal id in `world/meals.json`:

- `onigiri`: a rice ball with a nori band
- `misoshiru`: a lacquer bowl of miso soup with tofu cubes and wakame, a wisp of steam
- `dango`: three tri-colour dango (pink, white, green) on a skewer
- `gyudon`: a donburi bowl of rice topped with beef and onion, pickled ginger
- `udon`: a bowl of thick udon in broth with a kamaboko slice and scallions
- `ramen`: a ramen bowl with noodles, chashu, half egg, nori sheet and naruto
- `tonkatsu`: a tray set: sliced golden cutlet, shredded cabbage, rice bowl, miso cup
- `sushi`: a wooden geta board with nigiri (tuna, salmon, egg) and a maki roll
- `kaiseki`: a lacquered multi-dish course (small bowls and plates on a tray), the most luxurious
- `default`: a covered bowl

Use the same idle class as `ItemArt` (`item-bob`) for a gentle bob, plus 1–2 steam wisps (opacity/transform only) on hot dishes; reuse existing classes from `src/foundations/art/art.css` where possible. Each must still read at 44 px.

## Files you may change

- `src/foundations/art/MealArt.tsx` (new)
- `src/foundations/art/art.css` (only add new `.meal-*` rules at the end)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
