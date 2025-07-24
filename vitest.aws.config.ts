import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    // No setupFiles - run tests in isolation
    include: ['src/lib/aws-sdk-enhanced/__tests__/**/*.test.ts'],
    testTimeout: 5000,
    hookTimeout: 10000,
  }
})
