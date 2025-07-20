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
    unstubGlobals: true, // Ensure globals are properly cleaned up
    // Configure JSDOM environment with modern browser features
    environmentOptions: {
      jsdom: {
        url: 'https://localhost:3000',
        pretendToBeVisual: true,
        resources: 'usable',
        runScripts: 'outside-only'
      }
    },
    testTimeout: 10000,  // Reduce timeout to 10 seconds
    hookTimeout: 15000,  // Reduce hook timeout to 15 seconds
    env: {
      ...loadEnv('test', process.cwd(), ''),
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_ANON_KEY: 'local-test-anon-key',
      VITE_LD_CLIENT_ID: 'test-client-id',  // Add LaunchDarkly test client ID
      VITE_GOOGLE_CLIENT_ID: 'test-google-client-id.apps.googleusercontent.com',
      NODE_ENV: 'test',
      VITEST: 'true'
    },
setupFiles: ['./src/tests/setupTests.ts', './vitest.setup.ts'],
    exclude: [
      'tests/auth/**',     // Playwright auth tests
      'tests/e2e/**',      // Playwright
      'playwright/**',     // any other PW dirs
      '**/*.pw.ts',        // if you suffix PW files
      '**/*.e2e.ts',       // e2e test files
      '**/*.spec.ts',      // Playwright spec files
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
