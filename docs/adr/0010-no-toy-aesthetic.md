# 0010 — No toy aesthetic

- Context: looking at painted toy test art from the AI server, Ken said "I hate the toy aesthetic completely. The red and white and blue designs are fugly." Asked whether that includes the game's hariko plan, Ken answered "Yes. I hate all of it." Alyssa hasn't weighed in yet.
- Decision: hariko is out. This replaces the hariko part of ADR 0009 for Home, Town, Shop, gachapon and characters. New art and briefs don't use the toy look.
- What stands from ADR 0009: sumi-e for the Dojo and Musashi, ukiyo-e for the road and city regions, and a different style per area with shared UI chrome.
- Town: low-poly isometric, drawn as flat 2D SVG facets (no 3D, so ADR 0008 stands). Ken: "I think the polymetric designs from Kingdoms and castles are good. The highlight of it is its simplicity yet complexity in design." One building gets tested first.
- Principle: simple overall shapes with rich detail placed on purpose. Ken named Nine Sols, Kingdoms and Castles, Lil Guardsman, Ori and the Will of the Wisps, and Night in the Woods as the looks to learn from, and Musashi as the level of character detail.
- Open: the look for Home, Shop and gachapon, and whether Alyssa agrees.
- The palette stays. Ken: "Honestly just the toy design was the problem", and "I like the light mode palette and how it blends."
- Consequences: the Town's hariko buildings (`src/features/town/buildings/`) stay until the replacement is chosen, then get redrawn. Don't start the Shop's hariko restyle, run `argon-outbox/kotodama-hariko-walk.zip` or reuse `.claude/skills/gemini-art/briefs/town-hariko.md`. ADR 0007's "toy stage" was already replaced by ADR 0008.
