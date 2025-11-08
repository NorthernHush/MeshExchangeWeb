import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({mode})=>{
  const backend = process.env.VITE_BACKEND || 'http://localhost:4001'
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': { target: backend, changeOrigin: true, secure: false },
        '/uploads': { target: backend, changeOrigin: true, secure: false }
      }
    }
  }
})
