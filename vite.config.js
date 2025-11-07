import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  //base: '/sentinelpulse/', // Uncomment for GitHub Pages deployment
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    // Proxy only works in development - production uses VITE_API_BASE_URL
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})