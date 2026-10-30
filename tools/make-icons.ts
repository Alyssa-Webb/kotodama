/**
 * Renders the 言 seal mark (an original hanko-style stamp) to SVG and the PNG icon sizes.
 * Run with: npx tsx tools/make-icons.ts  (output is committed; re-run after changing the mark)
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';
import tokens from '../design/tokens.json' with { type: 'json' };

const { accent, bg } = tokens.colors.light;
const paper = tokens.colors.light.surface;

function seal(padding: number): string {
  const s = 512;
  const inner = s - padding * 2;
  const scale = +(inner / 400).toFixed(4);
  const {
    surfaceAlt,
    border,
    ink,
    secondary,
    gold,
    glow,
    panelEdge,
    lacquer,
    petal,
    coinShine,
    firefly,
  } = tokens.colors.light;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <rect width="${s}" height="${s}" fill="${bg}"/>
  <g transform="translate(${padding} ${padding}) scale(${scale})">
    <!-- Warm sun-halo medallion backdrop so the chibi spirit pops at 32px -->
    <circle cx="200" cy="204" r="188" fill="${firefly}"/>
    <circle cx="200" cy="212" r="172" fill="${panelEdge}"/>
    <circle cx="200" cy="202" r="172" fill="${glow}"/>
    <ellipse cx="128" cy="96" rx="48" ry="18" transform="rotate(-32 128 96)" fill="${coinShine}"/>
    <circle cx="200" cy="208" r="150" fill="${ink}"/>
    <circle cx="200" cy="198" r="150" fill="${secondary}"/>
    <ellipse cx="136" cy="112" rx="40" ry="15" transform="rotate(-30 136 112)" fill="${coinShine}" opacity="0.24"/>

    <!-- Floating kotodama spirit orbs -->
    <circle cx="72" cy="184" r="11" fill="${panelEdge}"/>
    <circle cx="72" cy="180" r="11" fill="${glow}"/>
    <circle cx="69" cy="177" r="4.5" fill="${coinShine}"/>
    <circle cx="328" cy="172" r="9.5" fill="${panelEdge}"/>
    <circle cx="328" cy="168" r="9.5" fill="${glow}"/>
    <circle cx="325" cy="165" r="3.8" fill="${coinShine}"/>

    <!-- Plump kitsune/kotodama spirit ears with darker bottom shade & vermilion tips -->
    <path d="M78 134 C66 78 82 36 108 34 C132 32 156 66 162 114 Z" fill="${border}"/>
    <path d="M78 126 C66 70 82 28 108 26 C132 24 156 58 162 106 Z" fill="${paper}"/>
    <path d="M76 76 C79 45 91 27 108 26 C123 25 139 42 148 70 Q112 84 76 76 Z" fill="${lacquer}"/>
    <path d="M76 71 C79 42 91 27 108 26 C123 25 138 40 147 66 Q112 79 76 71 Z" fill="${accent}"/>
    <path d="M96 112 C90 86 98 64 110 63 C121 62 132 80 135 104 Z" fill="${petal}"/>

    <path d="M322 134 C334 78 318 36 292 34 C268 32 244 66 238 114 Z" fill="${border}"/>
    <path d="M322 126 C334 70 318 28 292 26 C268 24 244 58 238 106 Z" fill="${paper}"/>
    <path d="M324 76 C321 45 309 27 292 26 C277 25 261 42 252 70 Q288 84 324 76 Z" fill="${lacquer}"/>
    <path d="M324 71 C321 42 309 27 292 26 C277 25 262 40 253 66 Q288 79 324 71 Z" fill="${accent}"/>
    <path d="M304 112 C310 86 302 64 290 63 C279 62 268 80 265 104 Z" fill="${petal}"/>

    <!-- Golden kotodama spirit flame tuft on top of head -->
    <path d="M200 18 C226 40 230 68 200 76 C170 68 174 40 200 18 Z" fill="${gold}"/>
    <path d="M200 12 C226 34 230 62 200 70 C170 62 174 34 200 12 Z" fill="${glow}"/>
    <ellipse cx="195" cy="44" rx="9" ry="14" transform="rotate(-12 195 44)" fill="${coinShine}"/>

    <!-- Tiny chibi body & stubby feet -->
    <ellipse cx="150" cy="376" rx="28" ry="15" fill="${border}"/>
    <ellipse cx="150" cy="370" rx="28" ry="14" fill="${paper}"/>
    <ellipse cx="250" cy="376" rx="28" ry="15" fill="${border}"/>
    <ellipse cx="250" cy="370" rx="28" ry="14" fill="${paper}"/>
    <rect x="114" y="236" width="172" height="134" rx="60" fill="${ink}"/>
    <rect x="114" y="228" width="172" height="130" rx="58" fill="${secondary}"/>
    <path d="M162 228 L200 272 L238 228 Z" fill="${paper}"/>

    <!-- Big round chibi mochi-spirit head with darker bottom shade bands & top-left highlight -->
    <rect x="68" y="68" width="264" height="188" rx="92" fill="${border}"/>
    <rect x="68" y="60" width="264" height="184" rx="92" fill="${surfaceAlt}"/>
    <rect x="68" y="52" width="264" height="176" rx="88" fill="${paper}"/>
    <ellipse cx="136" cy="84" rx="46" ry="20" transform="rotate(-16 136 84)" fill="${coinShine}"/>

    <!-- Festive vermilion shimenawa headband & golden suzu bell -->
    <path d="M84 108 Q200 126 316 108" stroke="${lacquer}" stroke-width="16" stroke-linecap="round" fill="none"/>
    <path d="M84 103 Q200 121 316 103" stroke="${accent}" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="200" cy="116" r="16" fill="${gold}"/>
    <circle cx="200" cy="111" r="16" fill="${glow}"/>
    <ellipse cx="194" cy="105" rx="6" ry="4" transform="rotate(-20 194 105)" fill="${coinShine}"/>
    <circle cx="200" cy="116" r="4" fill="${ink}"/>

    <!-- Expressive chibi face: rosy cheeks, big glossy eyes, happy smile -->
    <ellipse cx="110" cy="176" rx="23" ry="13.5" fill="${petal}"/>
    <ellipse cx="290" cy="176" rx="23" ry="13.5" fill="${petal}"/>

    <ellipse cx="142" cy="156" rx="21" ry="24" fill="${ink}"/>
    <circle cx="134" cy="146" r="8.5" fill="${paper}"/>
    <circle cx="149" cy="165" r="4.2" fill="${paper}"/>

    <ellipse cx="258" cy="156" rx="21" ry="24" fill="${ink}"/>
    <circle cx="250" cy="146" r="8.5" fill="${paper}"/>
    <circle cx="265" cy="165" r="4.2" fill="${paper}"/>

    <path d="M178 166 C178 196 222 196 222 166 Z" fill="${lacquer}"/>
    <ellipse cx="200" cy="182" rx="14" ry="8.5" fill="${petal}"/>

    <!-- Giant chunky vermilion 言 hanko seal held in front -->
    <rect x="108" y="218" width="184" height="168" rx="36" fill="${lacquer}"/>
    <rect x="108" y="204" width="184" height="164" rx="36" fill="${accent}"/>
    <ellipse cx="152" cy="226" rx="28" ry="10" transform="rotate(-16 152 226)" fill="${coinShine}" opacity="0.5"/>
    <rect x="124" y="218" width="152" height="136" rx="24" fill="none" stroke="${paper}" stroke-width="9"/>

    <!-- Bold geometric 言 glyph (darker bottom shade + crisp paper strokes, no font dependency) -->
    <g fill="${lacquer}">
      <rect x="174" y="237" width="52" height="13" rx="6.5"/>
      <rect x="144" y="255" width="112" height="14" rx="7"/>
      <rect x="162" y="275" width="76" height="12" rx="6"/>
      <rect x="162" y="293" width="76" height="12" rx="6"/>
      <rect x="156" y="311" width="88" height="34" rx="10"/>
    </g>
    <g fill="${paper}">
      <rect x="174" y="233" width="52" height="13" rx="6.5"/>
      <rect x="144" y="251" width="112" height="14" rx="7"/>
      <rect x="162" y="271" width="76" height="12" rx="6"/>
      <rect x="162" y="289" width="76" height="12" rx="6"/>
      <path fill-rule="evenodd" d="M166 307 H234 A10 10 0 0 1 244 317 V331 A10 10 0 0 1 234 341 H166 A10 10 0 0 1 156 331 V317 A10 10 0 0 1 166 307 Z M170 319 V329 H230 V319 Z"/>
    </g>

    <!-- Stubby round chibi paws hugging both sides of the 言 seal -->
    <ellipse cx="106" cy="296" rx="26" ry="22" fill="${border}"/>
    <ellipse cx="106" cy="288" rx="26" ry="21" fill="${paper}"/>
    <ellipse cx="98" cy="280" rx="10" ry="5.5" transform="rotate(-20 98 280)" fill="${coinShine}"/>

    <ellipse cx="294" cy="296" rx="26" ry="22" fill="${border}"/>
    <ellipse cx="294" cy="288" rx="26" ry="21" fill="${paper}"/>
    <ellipse cx="286" cy="280" rx="10" ry="5.5" transform="rotate(-20 286 280)" fill="${coinShine}"/>
  </g>
</svg>`;
}

const standard = seal(40);
const maskable = seal(96);
writeFileSync('public/icons/seal.svg', standard);

const out = async (svg: string, size: number, file: string) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/icons/${file}`);

await out(standard, 192, 'icon-192.png');
await out(standard, 512, 'icon-512.png');
await out(standard, 180, 'apple-touch-icon.png');
await out(standard, 64, 'favicon-64.png');
await out(maskable, 512, 'icon-maskable-512.png');
console.log('icons written to public/icons/');
