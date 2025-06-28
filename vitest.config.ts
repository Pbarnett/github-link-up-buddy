import { defineConfig } from 'vitest/config';
import path from 'path';
import deno from '@deno/vite-plugin';

export default defineConfig({
  test: {
    // Use different environments based on test file patterns
    environment: 'jsdom', // Default to jsdom for React tests
    globals: true, // Allow global Vi functions for easier testing
    testTimeout: 10000, // Increase timeout to 10 seconds
    hookTimeout: 10000, // Increase hook timeout
    
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'supabase/functions/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
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
    
    deps: {
      interopDefault: true, // Ensures default exports of ESM are handled correctly
    },
    
    // Use Node environment for Edge Function tests specifically
    environmentMatchGlobs: [
      ['supabase/functions/**/*.test.ts', 'node'],
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Map npm: imports to actual npm packages for testing
      'npm:resend': path.resolve(__dirname, 'node_modules/resend'),
      // Map Deno imports to mocks for testing
      'https://deno.land/std@0.168.0/http/server.ts': path.resolve(__dirname, 'src/tests/mocks/deno-server.ts'),
      'https://deno.land/std@0.177.0/http/server.ts': path.resolve(__dirname, 'src/tests/mocks/deno-server.ts'),
      // Supabase JS CDN to local package
      'https://esm.sh/@supabase/supabase-js@2': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
      // Stripe CDN to local Stripe package (CRITICAL FIX)
      'https://esm.sh/stripe@14.21.0': path.resolve(__dirname, 'node_modules/stripe'),
    },
  },
  plugins: [
    deno(), // Enable Deno plugin to handle remote imports seamlessly
  ],
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
