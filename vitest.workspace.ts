import { defineWorkspace } from 'vitest/config'
import path from 'path'

export default defineWorkspace([
  // Unit tests (React components, utilities, pure functions)
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**/*.{ts,tsx}'
      ],
      exclude: [
        'src/tests/integration/**',
        'src/tests/auth/**',
        'supabase/functions/**',
        '**/*.e2e.*'
      ]
    }
  },
  
  // Integration tests (services, external APIs, database interactions)
  {
    extends: './vitest.config.ts',
    test: {
      name: 'integration',
      environment: 'jsdom',
      include: [
        'src/tests/integration/**/*.test.{ts,tsx}',
        'src/tests/services/**/*.test.{ts,tsx}',
        'src/tests/auth/**/*.test.{ts,tsx}'
      ],
      testTimeout: 15000,
      hookTimeout: 20000
    }
  },
  
  // Edge function tests (Supabase functions, Deno runtime)
  {
    extends: './vitest.config.ts',
    test: {
      name: 'edge',
      environment: 'node',
      include: [
        'supabase/functions/**/*.test.{ts,js}',
        'supabase/functions/_shared/__tests__/**/*.spec.{ts,js}'
      ]
    }
  },
  
  // AWS SDK tests (Node.js specific)
  {
    extends: './vitest.config.ts',
    test: {
      name: 'aws',
      environment: 'node',
      include: ['src/lib/aws-sdk-enhanced/__tests__/**/*.test.ts'],
      testTimeout: 5000
    }
  }
])
