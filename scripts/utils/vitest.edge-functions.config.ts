import path from 'path'
import { defineConfig } from 'vitest/config'

module.exports = defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Stub Deno imports for Node.js test environment
      'https://deno.land/std@0.168.0/http/server.ts': path.resolve(__dirname, './src/tests/stubs/denoServerStub.ts'),
      'https://deno.land/std@0.177.0/http/server.ts': path.resolve(__dirname, './src/tests/stubs/denoServerStub.ts'),
      'https://esm.sh/resend@3.2.0': path.resolve(__dirname, './src/tests/stubs/resendStub.ts'),
      'https://esm.sh/@supabase/supabase-js@2': path.resolve(__dirname, './src/tests/stubs/supabaseJsStub.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node', // Edge functions run in Node-like environment
    setupFiles: ['./src/tests/setupEdgeFunctionTests.ts'],
    include: ['supabase/functions/**/*.test.ts', 'tests/edge/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
      perFile: false
    }
  }
})
