import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3000
  },
  proxy: {
    "/api": {
      target: import.meta.env.MODE === "production" ? "https://pawsisterssalestracker-production-529b.up.railway.app" : "http://localhost:5000",
      changeOrigin: true,
      secure: import.meta.env.MODE === "production",
    }


  }
})
