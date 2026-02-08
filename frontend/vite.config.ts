import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true
    }
  },
  // @ts-ignore - Vitest types require setup but this works for runtime
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts'
  }
})