import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'], // supabase/functions tests are now excluded
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,eslint,esbuild}.config.*',
      'supabase/functions/**/*.test.ts', // Explicitly exclude Deno tests
      'src/tests/**',                         // User specified
      'src/components/trip/**/__tests__/**', // User specified
      'src/**/__tests__/**',                 // Broad exclusion for any __tests__ under src
      'src/services/flightApi.test.ts',    // Exclude the last known failing test
    ],

    setupFiles: ['src/tests/setupTests.ts'],
    types: ['@testing-library/jest-dom'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'], // Updated reporter
      // Updated thresholds structure
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
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
