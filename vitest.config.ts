import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    // Increase test timeout to avoid timeout issues
    testTimeout: 30000, // 30 seconds
    // Set up proper test isolation
    isolate: true,
    // Configure retry attempts for flaky tests
    retry: 1,
    // Default include pattern is ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    // This will correctly include files like src/tests/e2e/**/*.spec.ts
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // Removed '**/supabase/**' to allow testing supabase functions
      // Ensure old e2e test patterns that might have been here are removed
      // For example, if there was an '**/e2e-tests/**' or specific '*.e2e.ts' exclusions
    ],
    // Configure code coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/tests/**',
      ],
    },
    // Environment variables for tests
    env: {
      // Supabase configuration
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      // Stripe configuration
      STRIPE_SECRET_KEY: 'sk_test_mock_key',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_key',
      // API endpoints
      API_URL: 'http://localhost:8080',
      NEXT_PUBLIC_API_URL: 'http://localhost:8080',
      // App configuration
      NODE_ENV: 'test'
    },
    // Mock browser globals for tests
    environmentOptions: {
      jsdom: {
        // Custom jsdom options
        url: 'http://localhost',
      },
    },
    // Make tests output more verbose
    reporters: ['verbose'],
    // Disable watch mode in CI environments
    watch: process.env.CI !== 'true',
  },
});
