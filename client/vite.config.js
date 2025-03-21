import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

const isProduction = process.env.NODE_ENV === "production"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3000
  },
  proxy: {
    "/api": {
      target: isProduction ? "https://pawsisterssalestracker-production-529b.up.railway.app" : "http://localhost:5000",
      changeOrigin: true,
      secure: isProduction,
    }


  }
})
