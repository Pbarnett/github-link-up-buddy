import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Ignore flaky legacy suites until rebuild is complete
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/supabase/**', // Exclude supabase functions from client-side tests
      '**/supabase/functions/**', // Explicitly exclude edge functions
      'src/components/trip/**/__tests__/**',
      'src/tests/**',
      'supabase/functions/**/__tests__/**',
    ],
    coverage: {
      reporter: ['text', 'json', 'lcov'],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },

    setupFiles: ['src/tests/setupTests.ts'],
    types: ['@testing-library/jest-dom'],

  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-select',
      '@radix-ui/react-label',
      '@radix-ui/react-switch',
      '@radix-ui/react-popover',
      '@radix-ui/react-dialog',
      '@hookform/resolvers',
      'zod',
    ],
  },
});
