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
    // Default include pattern is ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    // This will correctly include files like src/tests/e2e/**/*.spec.ts
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // Removed '**/supabase/**' to allow testing supabase functions
      // Ensure old e2e test patterns that might have been here are removed
      // For example, if there was an '**/e2e-tests/**' or specific '*.e2e.ts' exclusions
    ],
    env: {
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_SERVICE_ROLE_KEY: 'placeholder-e2e-service-key'
    }
  },
});
