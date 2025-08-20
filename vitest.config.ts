import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadEnv } from 'vite'

// Ensure robust alias resolution for both src and packages/shared
// Use process.cwd() to ensure the project root is used even if import.meta.url resolves oddly
const rootDir = process.cwd()

export default defineConfig({
  // Use explicit aliases only for test-time resolution (avoid tsconfig-paths to remove ambiguity)
  plugins: [],
  resolve: {
    // preserveSymlinks: false ensures aliases resolve to actual files in monorepo-ish setups
    preserveSymlinks: false,
    alias: [
      // Ensure prefix-with-slash aliases like "@/" are handled predictably
      { find: /^@\//, replacement: path.resolve(rootDir, 'src/') + '/' },
      { find: /^@shared\//, replacement: path.resolve(rootDir, 'packages/shared/') + '/' },
      // Also provide plain directory aliases for direct "@types/..." style imports
      { find: '@', replacement: path.resolve(rootDir, 'src') },
      { find: '@components', replacement: path.resolve(rootDir, 'src/components') },
      { find: '@lib', replacement: path.resolve(rootDir, 'src/lib') },
      { find: '@hooks', replacement: path.resolve(rootDir, 'src/hooks') },
      { find: '@types', replacement: path.resolve(rootDir, 'src/types') },
      { find: '@utils', replacement: path.resolve(rootDir, 'src/utils') },
      { find: '@services', replacement: path.resolve(rootDir, 'src/services') },
      { find: '@stores', replacement: path.resolve(rootDir, 'src/stores') },
      { find: '@contexts', replacement: path.resolve(rootDir, 'src/contexts') },
      { find: '@integrations', replacement: path.resolve(rootDir, 'src/integrations') },
      { find: '@pages', replacement: path.resolve(rootDir, 'src/pages') },
      { find: '@tests', replacement: path.resolve(rootDir, 'src/tests') },
      { find: '@shared', replacement: path.resolve(rootDir, 'packages/shared') },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    // Explicitly allow the project root and shared package paths to be served
    fs: { allow: [rootDir, path.resolve(rootDir, 'packages/shared')] }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@shared': path.resolve(rootDir, 'packages/shared'),
      '@tests': path.resolve(rootDir, 'src/tests'),
      '@integrations': path.resolve(rootDir, 'src/integrations'),
      '@types': path.resolve(rootDir, 'src/types'),
      '@components': path.resolve(rootDir, 'src/components'),
      '@lib': path.resolve(rootDir, 'src/lib'),
      '@hooks': path.resolve(rootDir, 'src/hooks'),
      '@utils': path.resolve(rootDir, 'src/utils'),
      '@services': path.resolve(rootDir, 'src/services'),
      '@stores': path.resolve(rootDir, 'src/stores'),
      '@contexts': path.resolve(rootDir, 'src/contexts'),
      '@pages': path.resolve(rootDir, 'src/pages'),
    },
    env: {
      ...loadEnv('test', process.cwd(), ''),
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_ANON_KEY: 'local-test-anon-key'
    },
    setupFiles: ['./src/tests/setupTests.ts', './vitest.setup.ts'],
    reporters: [
      [
        'default',
        {
          summary: true
        }
      ]
    ],
    exclude: [
      'tests/e2e/**',      // Playwright
      'playwright/**',     // any other PW dirs
      '**/*.pw.ts',        // if you suffix PW files
      '**/*.e2e.ts',       // e2e test files
      '**/node_modules/**'
    ],
    coverage: {
      provider: 'v8',
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
      perFile: false  // Global thresholds only
    },
    // Define projects inline (replaces deprecated workspace file usage)
    projects: [
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
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
          ],
          alias: {
            '@': path.resolve(rootDir, 'src'),
            '@shared': path.resolve(rootDir, 'packages/shared'),
            '@tests': path.resolve(rootDir, 'src/tests'),
            '@integrations': path.resolve(rootDir, 'src/integrations'),
            '@types': path.resolve(rootDir, 'src/types'),
            '@components': path.resolve(rootDir, 'src/components'),
            '@lib': path.resolve(rootDir, 'src/lib'),
            '@hooks': path.resolve(rootDir, 'src/hooks'),
            '@utils': path.resolve(rootDir, 'src/utils'),
            '@services': path.resolve(rootDir, 'src/services'),
            '@stores': path.resolve(rootDir, 'src/stores'),
            '@contexts': path.resolve(rootDir, 'src/contexts'),
            '@pages': path.resolve(rootDir, 'src/pages'),
          },
          setupFiles: [
            './src/tests/setupTests.ts',
            './vitest.setup.ts'
          ]
        }
      },
      {
        test: {
          name: 'integration',
          globals: true,
          environment: 'jsdom',
          include: [
            'tests/integration/**/*.test.ts?(x)'
          ],
          exclude: [
            'tests/e2e/**',
            'supabase/functions/**'
          ],
          testTimeout: 20000,
          alias: {
            '@': path.resolve(rootDir, 'src'),
            '@shared': path.resolve(rootDir, 'packages/shared'),
            '@tests': path.resolve(rootDir, 'src/tests'),
            '@integrations': path.resolve(rootDir, 'src/integrations'),
            '@types': path.resolve(rootDir, 'src/types'),
            '@components': path.resolve(rootDir, 'src/components'),
            '@lib': path.resolve(rootDir, 'src/lib'),
            '@hooks': path.resolve(rootDir, 'src/hooks'),
            '@utils': path.resolve(rootDir, 'src/utils'),
            '@services': path.resolve(rootDir, 'src/services'),
            '@stores': path.resolve(rootDir, 'src/stores'),
            '@contexts': path.resolve(rootDir, 'src/contexts'),
            '@pages': path.resolve(rootDir, 'src/pages'),
          },
          setupFiles: [
            './src/tests/setupTests.ts',
            './vitest.setup.ts',
            './tests/integration/setup/integration.setup.ts'
          ]
        }
      }
    ]
  }
})
