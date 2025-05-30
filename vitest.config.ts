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
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', // Default pattern
      'src/tests/e2e/**/*.spec.ts', // Ensure E2E specs are included
      'src/tests/e2e/**/*.test.ts'  // And E2E tests if named that way
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/supabase/**',
      // Comments from previous version removed for clarity as include is now explicit
    ],
    env: {
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_SERVICE_ROLE_KEY: 'placeholder-e2e-service-key'
    }
  },
});
