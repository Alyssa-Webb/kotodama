# Brief: Koto, part 2 — the Mascot component

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

The owner wants the chibi word spirit you designed for the app icon (`seal()` in `tools/make-icons.ts`: the round kotodama spirit with ears, a golden spirit-flame tuft, a shimenawa headband with a bell and the 言 seal) to become the app's mascot, as central and loved as Duo is to Duolingo. His name is **Koto**. Create him as a reusable, expressive, animated character component.

Create `src/foundations/art/Mascot.tsx` exporting exactly:

```ts
export type MascotPose =
  'idle' | 'wave' | 'point' | 'talk' | 'cheer' | 'think' | 'surprised' | 'sleep';
export type MascotOutfit = 'guide' | 'shopkeeper' | 'mayor' | 'sensei';
export function Mascot(props: {
  pose?: MascotPose; // default 'idle'
  outfit?: MascotOutfit; // default 'guide'
  size?: number; // px width, default 120
  facing?: 'left' | 'right'; // default 'right' (mirror for 'left')
  className?: string;
}): JSX.Element;
```

- **Outfits:**
  - `guide`: his everyday look, matching the app icon.
  - `shopkeeper`: a happi coat, a little apron, and a comically oversized fake mustache that wobbles when he talks.
  - `mayor`: a sash, a tiny top hat or eboshi, and a ceremonial fan.
  - `sensei`: a hakama and a headband with a training bokken.
- **Poses:** each is a distinct silhouette, not just a face swap. `wave` raises a paw and waves. `point` points to his right, toward his facing side, for use in the tour. `talk` animates the mouth. `cheer` jumps with paws up. `think` puts a paw on his chin with a "…" bubble. `surprised` makes his ears shoot up. `sleep` brings out a little Z bubble.
- **Always alive:** an idle breath, blinks every few seconds, an ear twitch, and a flicker of the spirit flame. Motion is springy, with anticipation and follow-through.
- `src/foundations/art/mascot.css` ALREADY EXISTS (you wrote it in an earlier run that was cut off). Read it first and write `Mascot.tsx` to use its class names and keyframes; adjust the CSS only where needed. Keep the component compact: shared body parts drawn once, outfits and poses as small overlays and transforms.

## Files you may change

- `src/foundations/art/Mascot.tsx` (new)
- `src/foundations/art/mascot.css` (already started)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
