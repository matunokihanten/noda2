import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    // RenderのURLからのアクセスを許可します
    allowedHosts: ['noda2-2.onrender.com']
  }
})
