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
        manifest: {
          "short_name": "Meet App",
          "name": "Meet - Event Discovery App",
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
              "purpose": "maskable"
            },
            {
              "src": "vite.svg",
              "sizes": "512x512",
              "type": "image/svg+xml",
              "purpose": "maskable"
            }
          ],
          "start_url": "/",
          "display": "standalone",
          "theme_color": "#000000",
          "background_color": "#ffffff"
        },
        registerType: 'autoUpdate',
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /\/.*\.png$/, // Example pattern for caching png images
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 50,
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
