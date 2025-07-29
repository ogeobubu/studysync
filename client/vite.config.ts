import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.NODE_ENV === "production" ? "https://studysync-soto.onrender.com" : "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})