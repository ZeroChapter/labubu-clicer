import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    // assetsDir: 'assets', // Можно убрать, т.к. все ресурсы в public/
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Для скомпилированных JS/CSS файлов
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'css/[name].css'
      }
    }
  },
  publicDir: 'public'
})