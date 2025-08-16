import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vitest.config.ts',
    test: {
      name: 'unit',
      include: [
        'tests/unit/**/*.test.ts?(x)',
        'src/**/__tests__/**/*.test.ts?(x)',
        'src/**/*.unit.test.ts?(x)'
      ],
      exclude: [
        'src/tests/**',
        'tests/integration/**',
        'tests/e2e/**',
        'supabase/functions/**',
        '**/*integration*.test.ts?(x)'
      ]
    }
  },
  {
    extends: 'vitest.config.ts',
    test: {
      name: 'integration',
      include: [
        'tests/integration/**/*.test.ts?(x)',
        'src/tests/**/*.test.ts?(x)'
      ],
      exclude: [
        'tests/e2e/**',
        'supabase/functions/**'
      ]
    }
  }
])

