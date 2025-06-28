import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/tests/edge-functions-setup.ts'],
    include: ['supabase/functions/tests/**/*.test.ts'],
    alias: {
      // Mock Deno modules with Node.js equivalents
      'https://deno.land/std@0.168.0/http/server.ts': resolve(__dirname, 'src/tests/mocks/deno-server.ts'),
      'https://esm.sh/@supabase/supabase-js@2.45.0': '@supabase/supabase-js',
      'https://esm.sh/stripe@14.21.0': resolve(__dirname, 'src/tests/mocks/stripe.ts'),
    },
    define: {
      // Mock Deno globals
      'Deno.env.get': 'process.env',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
