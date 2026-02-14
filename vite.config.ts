import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // セキュリティ設定: このホストからのアクセスを許可します
    allowedHosts: ['noda2-2.onrender.com']
  }
})
