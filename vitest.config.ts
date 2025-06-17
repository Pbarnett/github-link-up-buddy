import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'supabase/functions/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // '**/supabase/**', // Allow tests from supabase/functions
      // '**/supabase/functions/**', // Specifically allowing this by removing it
    ],

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
