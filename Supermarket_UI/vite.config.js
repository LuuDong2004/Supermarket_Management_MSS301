import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server proxies /api to the Spring Cloud Gateway so the browser can talk
// to the backend without CORS hassle. Override the target with VITE_API_TARGET.
export default defineConfig(() => {
  const target = process.env.VITE_API_TARGET || 'http://localhost:8080'
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target, changeOrigin: true },
      },
    },
  }
})
