import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: ['dotenv/config'],
    environment: 'jsdom',
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
