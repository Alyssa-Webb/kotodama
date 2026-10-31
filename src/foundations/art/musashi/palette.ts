/**
 * Theme-safe colour recipes and shared types for Miyamoto Musashi (宮本武蔵).
 * Uses only CSS custom properties from design/tokens.json plus the avatar skin hex (#f1d3b6).
 */

export type MusashiPose = 'idle' | 'bow' | 'ready';

export const SKIN = '#f1d3b6';
export const SKIN_SHADE = 'color-mix(in srgb, #f1d3b6 72%, var(--c-hud-bg))';
export const SKIN_WARM = 'color-mix(in srgb, #f1d3b6 66%, var(--c-accent))';

export const INK = 'var(--c-hud-bg)';
export const CREAM = 'var(--c-hud-ink)';
export const CREAM_SHADE = 'color-mix(in srgb, var(--c-hud-ink) 74%, var(--c-hud-bg))';
export const SHINE = 'var(--c-coin-shine)';

/** Wild black ronin hair with subtle indigo cast in both light and dark themes. */
export const HAIR_BACK = 'color-mix(in srgb, var(--c-hud-bg) 90%, var(--c-secondary))';
export const HAIR_MID = 'color-mix(in srgb, var(--c-hud-bg) 83%, var(--c-secondary))';
export const HAIR_FRONT = 'color-mix(in srgb, var(--c-hud-bg) 77%, var(--c-secondary))';
export const HAIR_SHINE = 'color-mix(in srgb, var(--c-secondary) 50%, var(--c-hud-ink))';

/** Dark indigo kimono, rust-orange obi, and dark umber-brown hakama. */
export const KIMONO = 'color-mix(in srgb, var(--c-secondary) 52%, var(--c-hud-bg))';
export const KIMONO_SHADE = 'color-mix(in srgb, var(--c-secondary) 28%, var(--c-hud-bg))';
export const KIMONO_FOLD = 'color-mix(in srgb, var(--c-secondary) 38%, var(--c-hud-bg))';

export const OBI = 'color-mix(in srgb, var(--c-lacquer) 70%, var(--c-glow))';
export const OBI_SHADE = 'color-mix(in srgb, var(--c-lacquer) 72%, var(--c-hud-bg))';

const CHESTNUT = 'color-mix(in srgb, var(--c-lacquer) 55%, var(--c-panel-edge))';
export const HAKAMA = `color-mix(in srgb, var(--c-hud-bg) 56%, ${CHESTNUT})`;
export const HAKAMA_SHADE = 'color-mix(in srgb, var(--c-hud-bg) 80%, var(--c-lacquer))';
export const HAKAMA_PLEAT = 'color-mix(in srgb, var(--c-hud-bg) 86%, var(--c-lacquer))';

/** Black-lacquer daisho scabbards, bronze-rimmed iron guards, and polished steel blades. */
export const SAYA = 'color-mix(in srgb, var(--c-hud-bg) 86%, var(--c-secondary))';
export const TSUBA_RIM = 'color-mix(in srgb, var(--c-panel-edge) 72%, var(--c-hud-bg))';
export const CORD_GOLD = 'var(--c-panel-edge)';
export const CORD_SHADE = 'color-mix(in srgb, var(--c-gold) 60%, var(--c-hud-bg))';
export const STEEL = 'color-mix(in srgb, var(--c-hud-ink) 84%, var(--c-secondary))';
export const STEEL_SHADE = 'color-mix(in srgb, var(--c-secondary) 48%, var(--c-hud-bg))';
