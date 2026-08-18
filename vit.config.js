import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // usamos nuestro manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,png}']
      }
    })
  ]
});
