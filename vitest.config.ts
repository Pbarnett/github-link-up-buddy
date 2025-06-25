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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
      exclude: [
        'src/integrations/supabase/types.generated.ts',
      ],
    },

    setupFiles: ['src/tests/setupTests.ts', 'src/tests/setupEdgeFunctions.ts'],
    types: ['@testing-library/jest-dom'],

  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Map npm: imports to actual npm packages for testing
      'npm:resend': path.resolve(__dirname, 'node_modules/resend'),
      // Map Deno imports to mocks for testing
      'https://deno.land/std@0.177.0/http/server.ts': path.resolve(__dirname, 'src/tests/mocks/deno-server.ts'),
      'https://esm.sh/@supabase/supabase-js@2': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
    },
  },
  define: {
    // Mock Deno environment for edge function tests
    'typeof Deno': '"object"',
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
