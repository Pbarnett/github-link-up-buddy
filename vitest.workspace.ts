import { defineConfig, defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // Unit tests configuration
  {
    test: {
      name: 'unit',
      root: '.',
      environment: 'jsdom',
      include: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**/*.{ts,tsx}',
        'tests/unit/**/*.test.{ts,tsx}'
      ],
      exclude: [
        'src/tests/integration/**',
        'src/tests/auth/**',
        'supabase/functions/**',
        'tests/edge/**',
        '**/*.e2e.*'
      ],
      setupFiles: ['./src/tests/setupTests.ts', './vitest.setup.ts'],
      globals: true,
      unstubGlobals: true,
      testTimeout: 10000,
      hookTimeout: 15000,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: false,
          isolate: true
        }
      }
    },
    resolve: {
      alias: {
        '@': '/Users/parkerbarnett/github-link-up-buddy/src',
        '@shared': '/Users/parkerbarnett/github-link-up-buddy/packages/shared'
      }
    }
  },

  // Integration tests configuration
  {
    test: {
      name: 'integration',
      root: '.',
      environment: 'jsdom',
      include: [
        'src/tests/integration/**/*.test.{ts,tsx}',
        'src/tests/services/**/*.test.{ts,tsx}'
      ],
      setupFiles: ['./src/tests/setupTests.ts', './vitest.setup.ts'],
      globals: true,
      unstubGlobals: true,
      testTimeout: 15000,
      hookTimeout: 20000,
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: false,
          isolate: true
        }
      }
    },
    resolve: {
      alias: {
        '@': '/Users/parkerbarnett/github-link-up-buddy/src',
        '@shared': '/Users/parkerbarnett/github-link-up-buddy/packages/shared'
      }
    }
  },

  // Edge functions configuration
  {
    test: {
      name: 'edge',
      root: '.',
      environment: 'node',
      include: [
        'supabase/functions/**/*.test.{ts,js}',
        'tests/edge/**/*.test.{ts,js}'
      ],
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
      testTimeout: 10000,
      hookTimeout: 15000,
      pool: 'threads'
    },
    resolve: {
      alias: {
        '@': '/Users/parkerbarnett/github-link-up-buddy/src',
        'https://deno.land/std@0.168.0/http/server.ts': '/Users/parkerbarnett/github-link-up-buddy/src/tests/stubs/denoServerStub.ts',
        'https://deno.land/std@0.177.0/http/server.ts': '/Users/parkerbarnett/github-link-up-buddy/src/tests/stubs/denoServerStub.ts',
        'https://esm.sh/resend@3.2.0': '/Users/parkerbarnett/github-link-up-buddy/src/tests/stubs/resendStub.ts',
        'https://esm.sh/@supabase/supabase-js@2': '/Users/parkerbarnett/github-link-up-buddy/src/tests/stubs/supabaseJsStub.ts'
      }
    }
  },

  // AWS tests configuration
  {
    test: {
      name: 'aws',
      root: '.',
      environment: 'node',
      include: ['src/lib/aws-sdk-enhanced/__tests__/**/*.test.ts'],
      globals: true,
      testTimeout: 5000,
      hookTimeout: 10000
    },
    resolve: {
      alias: {
        '@': '/Users/parkerbarnett/github-link-up-buddy/src'
      }
    }
  }
])
