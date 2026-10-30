# Brief: City Market yokai

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

The story now runs: **The Dojo** (learn hiragana and katakana, the basics of becoming a samurai; you spar with fellow trainees) → **Bamboo Thicket** (travel the road, greet people, say where you're from and going; forest yokai haunt the road; you meet travellers) → **City Market** (a wooden Edo-period town with food stalls and drink stands; you talk with vendors and fight the city yokai that haunt the streets at dusk).

Every foe is a battle opponent in `<Enemy kind=… state=…>` (`src/foundations/art/Enemy.tsx`): read `KitsuneArt` and `KasaObakeArt` there and match their structure exactly. Each is a component `({ state }: { state: EnemyState }) => ReactNode` drawing into a `0 0 100 100` viewBox, standing on the ground line around y 88 with a ground shadow, and handling every state: `idle` (a gentle loop that fits its character), `enter` (a ghostly fade-in, never a pop), `hit` (hurt eyes via `YokaiEyes`, plus `YokaiDamageFlash` with a silhouette), `attack` (a lunge or signature move toward the player, who is to the lower left) and `defeat` (its own KO). Import the shared helpers from `../Enemy` (`YokaiEyes`, `YokaiDamageFlash`, `spiralEyePath`, `INK`, `CREAM`, `SHINE`, and the `EnemyState` type). They are seen at 96–120 px and must read instantly in both themes.

Cultural accuracy matters to the owner. Base each design on the real folklore and history noted below, and put a short doc comment above each component naming the creature, its kanji and reading, and the folklore it draws on.

City yokai that haunt the market streets at dusk, straight out of Edo-period ghost stories (kaidan) and Toriyama Sekien's illustrated yokai catalogues (the kasa-obake already exists in `Enemy.tsx`; don't redraw it). Export four:

- `ChochinObakeArt`: **提灯お化け (ちょうちんおばけ)**, a tsukumogami (an object that comes alive after a hundred years): a paper lantern split open into a grinning mouth with a long tongue, one or two eyes in the paper, with the lantern's ribs, a black top and bottom rim, and a glowing candle inside. It floats and sways.
- `NopperaboArt`: **のっぺらぼう**, the faceless ghost (Lafcadio Hearn's "Mujina" on the Akasaka slope in Edo): an ordinary townsperson in a plain kimono whose face is a smooth blank egg. Hit state: no eyes to hurt, so show hurt with a squash and a sweat drop instead of `YokaiEyes`.
- `RokurokubiArt`: **ろくろ首 (ろくろくび)**, the woman whose neck stretches at night (in Sekien's art and Edo tales she looks like an ordinary woman by day): a chibi lady in a kimono with an Edo-style mage hairdo and a kanzashi, her neck in a long looping curve. Her attack stretches the neck toward the player (transform only: scale the neck group).
- `BakenekoArt`: **化け猫 (ばけねこ)**, the cat that becomes a yokai with age, from Edo towns (the Nabeshima cat legend; cats said to lick lamp oil and dance with a tenugui on their heads): a cat standing on its hind legs with a tenugui on its head, a forked tail (nekomata-style) and a lamp-oil dish. Its attack is a swipe with glowing claws.

Animations go in your own stylesheet `src/foundations/art/foes/city.css` (import it from your file), with class names prefixed by the foe id.

## Files you may change

- `src/foundations/art/foes/CityYokai.tsx` (new)
- `src/foundations/art/foes/city.css` (new)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
