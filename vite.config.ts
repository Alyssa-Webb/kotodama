import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tokens from './design/tokens.json' with { type: 'json' };

const BASE = '/kotodama/';

/** Injects theme colors from design/tokens.json into index.html so nothing is hard-coded. */
function themeHtml(): Plugin {
  return {
    name: 'kotodama-theme-html',
    transformIndexHtml(html) {
      return html
        .replaceAll('%KOTO_BG_LIGHT%', tokens.colors.light.bg)
        .replaceAll('%KOTO_BG_DARK%', tokens.colors.dark.bg)
        .replaceAll('%KOTO_INK_LIGHT%', tokens.colors.light.ink)
        .replaceAll('%KOTO_INK_DARK%', tokens.colors.dark.ink);
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    themeHtml(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/apple-touch-icon.png', 'icons/seal.svg'],
      manifest: {
        id: BASE,
        name: 'Kotodama 言霊',
        short_name: 'Kotodama',
        description: 'Learn Japanese as a hardcore game. Offline, free, forever.',
        lang: 'en',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'portrait',
        theme_color: tokens.colors.light.bg,
        background_color: tokens.colors.light.bg,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
        navigateFallback: `${BASE}index.html`,
        cleanupOutdatedCaches: true,
        // Voice clips are many and small: fetched when first spoken, then kept for offline play.
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith(`${BASE}voice/`) && url.pathname.endsWith('.mp3'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'kotodama-voice',
              expiration: { maxEntries: 4000 },
            },
          },
        ],
      },
    }),
  ],
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
});
