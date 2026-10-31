# Tripo prompts for reference models

Models are **reference only** (ADR 0009): I render each from ten angles into `design/reference/<name>/` and Gemini 4 Argon draws the 2D art from those images.

**Face limit:** about 40k for characters and props, 70k for buildings, 100k for dioramas.

## What we learned from round 1 (2026-10-31)

- **Never use templates.** `[BUILDING]` and `[DESCRIPTION]` were pasted as-is and produced a "snowman" and two blank blobs. Every prompt below is complete.
- **One subject, at most three key features, the defining one first.** The bamboo road listed seven things and came back with no bamboo at all.
- **Say what you want, not what you don't.** "No text" still gave fake carved kanji; ask for "a blank, smooth stone face".
- **Proportions first, in plain shape terms** ("super-deformed chibi, head as big as the whole body"), and the key feature as geometry ("the neck curves in a big S like a question mark"). The rokurokubi came back with a straight pole and adult proportions.
- **Name a real object when one exists.** "Hariko maneki-neko" gave a genuine folk toy.
- Results worth keeping: the road diorama, dojo hall, market street and hariko maneki-neko. The "snowman" turned out to be a lovely hariko figure and is kept as a style reference.

**Negative prompt for everything:**

```text
photorealistic, glossy plastic, shiny metal, modern objects, cars, electric wires, logos, base plate, background
```

## Round 2: complete prompts

### Bamboo Thicket road (70k)

```text
Dense green bamboo forest with a narrow stone-paved path running straight through the middle: tall bamboo stalks with leaf sprays packed close on both sides of the path, a small moss-covered stone Jizo statue with a red bib at the path's edge. Clean simple shapes, matte surfaces.
```

### Border landmarks, blank stone (40k)

```text
Old Japanese crossroads set on a short dirt road: a red wooden torii gate over the road, a wooden kido town gate with a small tiled roof and open doors beside it, and a weathered stone waymarker post with a blank, smooth stone face. Chunky simple shapes, matte surfaces.
```

### Rokurokubi (40k)

```text
Super-deformed chibi yokai rokurokubi, head as big as her whole body: a cute young woman in a red kimono with a gold obi and an Edo-style hairdo with a hairpin; her very long, thin neck curves up in one big S shape like a question mark, so her head floats high above her body. Both arms tucked into her sleeves. Mischievous smile. Matte toy-like shapes.
```

### The hariko Town, one building each (70k)

```text
Small railway station with a platform and a little steam engine, made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base hand-painted in vermilion red, indigo and gold.
```

```text
Wooden teahouse with a noren curtain and a bench outside, made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base hand-painted in vermilion red, indigo and gold.
```

```text
Small Shinto shrine with a red torii gate in front, made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base hand-painted in vermilion red, indigo and gold.
```

```text
Covered Japanese shopping street with three tiny shopfronts under one roof, made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base hand-painted in vermilion red, indigo and gold.
```

```text
Japanese public bathhouse with a tall chimney and a noren curtain, made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base hand-painted in vermilion red, indigo and gold.
```

```text
Small wooden Edo-period village school with a bell on a post, made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base hand-painted in vermilion red, indigo and gold.
```

```text
Red capsule toy vending machine with a crank handle and a clear dome full of capsules, made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base hand-painted in vermilion red, indigo and gold.
```

### Battle foes, one each (40k)

```text
Super-deformed chibi kappa, head as big as its whole body: a green river imp with a round water-filled dish on top of its head, a turtle shell on its back and a small yellow beak. Mischievous grin. Matte toy-like shapes.
```

```text
Super-deformed chibi karasu-tengu, head as big as its whole body: a crow goblin with a black beak, two black feathered wings and a mountain monk's checked robe with a small black cap. Proud look. Matte toy-like shapes.
```

```text
Super-deformed chibi bake-danuki, head as big as its whole body: a round tanuki raccoon dog with a big round belly, a striped tail and a green leaf balanced on its head. Cheeky grin. Matte toy-like shapes.
```

```text
Super-deformed chibi bakeneko, head as big as its whole body: a cat yokai standing on its hind legs with a tenugui towel tied on its head, a tail that splits into two at the tip, and a small oil dish in one paw. Sly smile. Matte toy-like shapes.
```

## Round 1 prompts (kept for the record)

```text
photorealistic, glossy plastic, shiny metal, modern objects, cars, electric wires, signs with text, logos, people (unless asked), base plate, background
```

## 1. The journey (the Path is missing these)

**1a. The whole road as one diorama** (100k): how the areas connect.

```text
Tabletop diorama of one continuous winding dirt road through old Edo-period Japan, seen from above at an angle, in four connected sections from front to back: a small wooden dojo with a tiled roof and a training yard at the start; the road entering a dense bamboo grove with a stone Jizo statue and a small log bridge over a stream; the road leaving the bamboo through a wooden town gate into a market street of two-storey wooden machiya shops with hanging lanterns and food stall carts; and in the far back a white castle on a stone base above town roofs. The road is one clear path through all four sections, with gentle bends and short transition zones between them. Simple matte painted surfaces, chunky stylized shapes, no people.
```

**1b. Border landmarks between areas** (40k each), so every region change has a gate:

```text
Stylized old Japanese road marker set: a weathered stone michishirube waymarker post, a small red wooden torii gate over a dirt path, and a wooden kido town gate with a little tiled roof and open doors, all standing on short sections of dirt road. Chunky simple shapes, matte painted surfaces.
```

## 2. Area sets (reference for scenes and backdrops)

**2a. Dojo hall, outside and in** (70k, the Dojo, drawn as sumi-e):

```text
Small traditional Japanese kendo dojo, cutaway so the inside is visible: dark tiled kawara roof, wooden walls and a raised wooden veranda, a noren curtain at the entrance; inside, polished floorboards, a kamiza alcove with a hanging scroll at the back, a wall rack of wooden practice swords, a straw makiwara striking post, and a large taiko drum on a stand. Clean simple shapes, matte surfaces.
```

**2b. Bamboo road segment** (70k, the Bamboo Thicket, drawn as ukiyo-e):

```text
Short stretch of an old Japanese country road through a dense bamboo thicket: tall bamboo stalks with leaf sprays on both sides, a stone-paved path, a small moss-covered Jizo statue with a red bib, a stone waymarker post, and a narrow log bridge over a shallow stream with smooth stones. Clean simple shapes, matte surfaces.
```

**2c. Market street segment** (70k, the City Market, drawn as ukiyo-e):

```text
Short stretch of an Edo-period Japanese market street at dusk: two-storey wooden machiya townhouses with lattice windows and tiled roofs on both sides, a wooden food stall cart (yatai) with a noren curtain, a dango stand with a red umbrella, a sake shop with a round cedar sugidama ball hanging over the door, stacked straw-wrapped sake barrels, red paper lanterns along the eaves. Clean simple shapes, matte surfaces, no signs with text.
```

## 3. The hariko Town (Home, Town and Shop)

One building per model (70k), each as a hand-painted folk toy. Swap the bracket:

```text
[BUILDING] made as a traditional Japanese hariko papier-mache folk toy: rounded chunky hand-made shapes, matte chalky white base painted by hand in vermilion red, indigo and gold, simple brushed patterns, slightly uneven toy-like proportions, on a small round dirt patch.
```

Buildings: `a small railway station with a platform and a little steam engine`, `a wooden teahouse cafe with a noren curtain and benches outside`, `a Shinto shrine with a red torii gate and a small hall`, `a covered shopping street (shotengai) with three tiny shopfronts`, `a public bathhouse (sento) with a tall chimney and a noren`, `a small wooden village school (terakoya) with a bell`, and `a red gachapon capsule toy machine with a crank handle`.

## 4. Characters that need polish

**4a. Rokurokubi** (40k): Argon's first neck read as an arm.

```text
Chibi Japanese yokai rokurokubi, cute toy figure: a young woman in a red kimono with a gold obi and an Edo-style mage hairdo with a kanzashi hairpin, standing; her neck stretches up in one long, thin, smooth S-shaped loop so her head floats well above her body, the neck clearly a neck and both arms tucked into her sleeves. Friendly mischievous face. Two-heads-tall body proportions. Matte simple shapes.
```

**4b. The two Dojo trainees** (40k each):

```text
Chibi young kendo trainee, cute toy figure, two-heads-tall proportions: white keikogi jacket, dark indigo hakama, bare feet, a white hachimaki headband with a red circle, holding an oak wooden practice sword in a centre guard stance, determined friendly face. Matte simple shapes.
```

```text
Chibi senior kendo student (senpai), cute toy figure, two-heads-tall proportions: topknot hairstyle, red hachimaki headband, white keikogi jacket, dark charcoal hakama, a wooden practice sword resting on one shoulder, confident smirk. Matte simple shapes.
```

**4c. Koto, retried as a real hariko** (40k): the first try came out as glossy vinyl.

```text
Traditional Japanese hariko papier-mache maneki-neko lucky cat folk toy, hand-painted: matte chalky white body, one paw raised beckoning, short pointed ears painted red inside, a red headband with a round gold bead, a small gold flame shape on top of the head, big round black painted eyes, pink cheeks, a red bib-like robe with a square white seal on the chest, gold-leaf accents, slightly uneven hand-made shape. Matte, no gloss.
```

## 5. Battle foes that would gain from turnarounds

Same pattern as 4a (40k each, chibi, matte):

- `kappa river imp with a water-filled dish on its head, turtle shell and beak`
- `karasu-tengu crow goblin with a beak, black wings and a yamabushi monk outfit`
- `bake-danuki shapeshifting raccoon dog with a big round belly and a leaf on its head`
- `bakeneko cat yokai standing on its hind legs with a tenugui towel on its head, a forked tail and an oil dish`
