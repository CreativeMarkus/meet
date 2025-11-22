import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: '/',
    plugins: [
      react(),
      VitePWA({
        devOptions: {
          enabled: true,
          type: 'module'
        },
        includeAssets: ['favicon.ico', 'vite.svg'],
        manifest: {
          "short_name": "Meet App",
          "name": "Meet - Event Discovery App",
          "description": "Discover events in your city with Meet App",
          "icons": [
            {
              "src": "vite.svg",
              "sizes": "any",
              "type": "image/svg+xml",
              "purpose": "any"
            },
            {
              "src": "vite.svg",
              "sizes": "192x192",
              "type": "image/svg+xml",
              "purpose": "any maskable"
            },
            {
              "src": "vite.svg",
              "sizes": "512x512",
              "type": "image/svg+xml",
              "purpose": "any maskable"
            }
          ],
          "start_url": "/",
          "scope": "/",
          "display": "standalone",
          "orientation": "portrait-primary",
          "theme_color": "#000000",
          "background_color": "#ffffff",
          "categories": ["social", "utilities"],
          "lang": "en"
        },
        registerType: 'prompt',
        mode: 'development',
        injectRegister: 'auto',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
              },
            },
            {
              urlPattern: /\/.*\.png$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
          ],
        },
      })
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  }
})
