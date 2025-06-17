import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const isProduction = process.env.NODE_ENV === "production"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: "autoUpdate",
    includeAssets: ['favicon/favicon.ico', 'favicon/apple-touch-icon.png'],
    manifest: {
      name: "Pawsisters Sales Tracker",
      short_name: "Pawsisters ST",
      start_url: '/',
      display: "standalone",
      background_color: '#ffffff',
      theme_color: "#ff69b4",
      icons: [
        {
          src: '/favicon/web-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/favicon/web-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }

      ]

    }

  })],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: isProduction ? "https://pawsisterssalestracker-production-529b.up.railway.app" : "http://localhost:5000",
        changeOrigin: true,
        secure: isProduction,
      }


    }

  },


})
