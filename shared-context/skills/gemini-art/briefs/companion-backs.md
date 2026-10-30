# Brief: Back views for every companion

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

In battle the avatar walks away from the camera (`<Avatar facing="back">` in `src/features/avatar/Avatar.tsx`), so every part is drawn from its `back` SVG string in `world/avatar.json`. A part with no `back` is currently hidden from behind. The owner wants **every** part seen properly from behind.

Each back view must:

- match its front's silhouette, colours, size and position exactly, so swapping facing never changes the shape (it is the same object turned 180°);
- show what you would really see from behind, and nothing that only exists on the front (no faces, eyes, buttons, front openings or front crests);
- follow `shared-context/design/chibi-style-guide.md` sections 2, 3, 6 and 8: the +3 shade lip, one top-left highlight per form, theme variables only, dark parts in `--c-hud-bg`.

Read how `base-traveler`'s `back` is built and copy its conventions.

Add a `back` to **every `slot: "companion"` part** (`companion-mameshiba`, `companion-tanuki`, `companion-buncho`, `companion-kodama`). The pet walks beside the player into battle, so it is also seen from behind, on the **mirrored side**: the back of its head with the ears from behind, its back and tail (the shiba's curled tail, the tanuki's striped tail, the buncho's tail feathers and folded wings, the kodama's round head from behind). No faces. Keep each pet's size and ground shadow exactly as in its front.

## Files you may change

- `world/avatar.json`: only add `back` fields to companion parts; change nothing else

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
