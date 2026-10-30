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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <rect width="${s}" height="${s}" fill="${bg}"/>
  <g transform="translate(${padding} ${padding})">
    <rect x="0" y="0" width="${inner}" height="${inner}" rx="${inner * 0.16}" fill="${accent}"/>
    <rect x="${inner * 0.07}" y="${inner * 0.07}" width="${inner * 0.86}" height="${inner * 0.86}"
      rx="${inner * 0.11}" fill="none" stroke="${paper}" stroke-width="${inner * 0.028}"/>
    <text x="${inner / 2}" y="${inner * 0.735}" text-anchor="middle"
      font-family="Hiragino Mincho ProN, Hiragino Mincho Pro, serif" font-weight="600"
      font-size="${inner * 0.62}" fill="${paper}">言</text>
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
