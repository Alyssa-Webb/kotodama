# 0010 — No toy aesthetic

- Context: looking at painted toy test art from the AI server, Ken said "I hate the toy aesthetic completely. The red and white and blue designs are fugly." Asked whether that includes the game's hariko plan, Ken answered "Yes. I hate all of it." Alyssa hasn't weighed in yet.
- Decision: hariko is out. This replaces the hariko part of ADR 0009 for Home, Town, Shop, gachapon and characters. New art and briefs don't use the toy look.
- What stands from ADR 0009: sumi-e for the Dojo and Musashi, ukiyo-e for the road and city regions, and a different style per area with shared UI chrome.
- Open: the style that replaces hariko in Home, Town, Shop and gachapon. Ken named Nine Sols, Kingdoms and Castles, Lil Guardsman, Ori and the Will of the Wisps, and Night in the Woods as the looks to learn from.
- The palette stays. Ken: "Honestly just the toy design was the problem", and "I like the light mode palette and how it blends."
- Consequences: the Town's hariko buildings (`src/features/town/buildings/`) stay until the replacement is chosen, then get redrawn. Don't start the Shop's hariko restyle, run `argon-outbox/kotodama-hariko-walk.zip` or reuse `.claude/skills/gemini-art/briefs/town-hariko.md`. ADR 0007's "toy stage" was already replaced by ADR 0008.
