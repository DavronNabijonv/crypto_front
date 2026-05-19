import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/encrypt': 'http://localhost:8000',
      '/decrypt': 'http://localhost:8000',
      '/share': 'http://localhost:8000',
    },
  },
})
