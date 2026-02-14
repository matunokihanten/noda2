import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // どのURLからのアクセスも許可する設定にします
    allowedHosts: true
  },
  server: {
    allowedHosts: true
  }
})
