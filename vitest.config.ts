
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/supabase/**', // Exclude supabase functions from client-side tests
      '**/supabase/functions/**', // Explicitly exclude edge functions
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
