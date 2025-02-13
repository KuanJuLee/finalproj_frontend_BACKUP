import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {   //設定 manualChunks，手動將大型依賴拆開，打包時，vendor.js、ui.js、charts.js 會分開載入，減少主程式檔案大小
    outDir: 'dist', // 輸出目錄
    rollupOptions: {
      input: 'index.html', // 入口文件
      output: {
        manualChunks: {
          "vendor": ["vue", "vue-router", "pinia"],  // ✅ Vue 核心拆分
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true, // 或 '0.0.0.0' 
    port: 5173, // 你可以自定義 port
  }
})
