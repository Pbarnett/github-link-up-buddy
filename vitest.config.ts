import { defineConfig } from 'vitest/config'
import path from 'path'
import { loadEnv } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './packages/shared')
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    env: {
      ...loadEnv('test', process.cwd(), ''),
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_ANON_KEY: 'local-test-anon-key'
    },
    setupFiles: ['./src/tests/setupTests.ts', './vitest.setup.ts'],
    reporters: [
      [
        'default',
        {
          summary: true
        }
      ]
    ],
    exclude: [
      'tests/e2e/**',      // Playwright
      'playwright/**',     // any other PW dirs
      '**/*.pw.ts',        // if you suffix PW files
      '**/*.e2e.ts',       // e2e test files
      '**/node_modules/**'
    ],
    coverage: {
      provider: 'v8',
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
      perFile: false  // Global thresholds only
    }
  }
})
