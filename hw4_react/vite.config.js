import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    host: true, // Разрешить доступ с других устройств
    // port: 3000, // Фиксированный порт
    open: true  // Автоматически открывать браузер
  }
})