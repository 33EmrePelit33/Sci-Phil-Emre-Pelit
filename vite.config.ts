import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/',
          name: 'Sci-Phi: Bilim ve Felsefe Portalı',
          short_name: 'Sci-Phi',
          description: 'Emre Pelit tarafından hazırlanan bilim, fizik, zihin felsefesi ve epistemoloji portalı.',
          theme_color: '#020617',
          background_color: '#020617',
          display: 'standalone',
          start_url: '/?source=pwa',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
          globPatterns: ['**/*.{css,ico,png,svg,woff2}'],
          globIgnores: ['**/assets/aistudio/**', '**/blogger-catalog-*.js', '**/*.ttf', '**/*.woff'],
          navigateFallback: null,
          runtimeCaching: [
            {
              urlPattern: /\/assets\/.*\.(?:js|css|woff2)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'sciphi-static-assets-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/api\/analytics\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'sciphi-analytics-api-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 10000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('bloggerCatalog.json')) {
              return 'blogger-catalog';
            }
            if (id.includes('node_modules')) {
              if (id.includes('katex')) return 'vendor-katex';
              if (id.includes('lucide-react')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio to prevent WebSocket connection errors in the preview iframe.
      hmr: false,
      watch: null,
    },
  };
});
