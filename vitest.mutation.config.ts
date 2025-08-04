import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/utils/__tests__/call-with-retry.test.ts'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/**'
    ]
  }
})
