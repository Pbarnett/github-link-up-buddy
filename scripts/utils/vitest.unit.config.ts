import path from 'path'
import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

/**
 * Vitest configuration specifically for unit tests in the tests/ directory
 * This is separate from the main Vitest config to avoid conflicts with Playwright
 */
module.exports = defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/integrations': path.resolve(__dirname, './src/integrations'),
      '@shared': path.resolve(__dirname, './packages/shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.ts'],
    
    // Environment variables loaded properly
    env: {
      ...loadEnv('test', process.cwd(), ''),
      NODE_ENV: 'test',
      VITEST: 'true',
      VITE_LAUNCHDARKLY_CLIENT_ID: 'test-client-id',
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_ANON_KEY: 'local-test-anon-key',
    },
    
    // Test file patterns - only tests/unit directory
    include: [
      'tests/unit/**/*.test.{ts,tsx,js,jsx}'
    ],
    
    exclude: [
      'tests/integration/**', // Playwright integration tests
      'tests/e2e/**',         // Playwright e2e tests
      'tests/auth/**',        // Playwright auth tests
      'tests/fixtures/**',    // Playwright fixtures
      'tests/global-*.ts',    // Playwright global setup/teardown
      'tests/playwright.setup.ts', // Playwright setup
      'playwright/**',
      '**/*.pw.ts',
      '**/*.e2e.ts',
      '**/*.spec.ts',
      '**/node_modules/**',
      '**/playwright.config.ts',
      '**/playwright.*.config.ts',
    ],
    
    // Proper timeout configuration
    testTimeout: 10000,
    hookTimeout: 15000,
    
    // Modern Vitest features for better isolation and cleanup
    unstubGlobals: true,
    unstubEnvs: true,
    clearMocks: true,
    restoreMocks: true,
    
    // Better error reporting
    reporters: process.env.CI
      ? ['default', 'junit', 'json']
      : ['default', 'verbose'],
      
    outputFile: process.env.CI ? {
      junit: './test-results/unit-junit.xml',
      json: './test-results/unit-results.json'
    } : undefined
  }
})
