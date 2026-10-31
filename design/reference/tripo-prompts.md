# Tripo prompts for reference models

Models are **reference only** (ADR 0009): I render each from eight angles into `design/reference/<name>/` and Gemini 4 Argon draws the 2D art from those images. Drop finished `.glb` files in Downloads and send them over.

**Triangle budget (100,000 max):** set Tripo's face limit to about **40k for characters and props**, **70k for buildings**, and **100k only for the two dioramas**. Shapes matter more than detail here.

**Style words:** 3D can't really be ukiyo-e or sumi-e, so for those areas the prompts ask for clean, matte, simple forms; Argon adds the style. Only the hariko (Home and Town) prompts ask for the folk-toy look directly.

**Negative prompt for everything:**

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
