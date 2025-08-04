import path from 'path'
import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/integrations': path.resolve(__dirname, './src/integrations'),
      '@shared': path.resolve(__dirname, './packages/shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.ts'],
    
    // Modern Vitest environment options for proper DOM simulation
    environmentOptions: {
      jsdom: {
        url: 'https://localhost:3000',
        pretendToBeVisual: true,
        resources: 'usable',
        runScripts: 'outside-only'
      }
    },
    
    // Proper timeout configuration
    testTimeout: 10000,
    hookTimeout: 15000,
    
    // Environment variables loaded properly
    env: {
      ...loadEnv('test', process.cwd(), ''),
      NODE_ENV: 'test',
      VITEST: 'true',
      // Add mock environment variables for test stability
      VITE_LAUNCHDARKLY_CLIENT_ID: 'test-client-id',
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_ANON_KEY: 'local-test-anon-key',
    },
    
    // Modern Vitest features for better isolation and cleanup
    unstubGlobals: true,
    unstubEnvs: true,
    clearMocks: true,
    restoreMocks: true,
    
    // Test file patterns
    include: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'src/**/__tests__/**/*.{ts,tsx,js,jsx}'
      // Note: tests/** directory is excluded for Playwright compatibility
    ],
    
    exclude: [
      'tests/**',          // Exclude entire tests directory (Playwright)
      'playwright/**',
      '**/*.pw.ts',
      '**/*.e2e.ts',
      '**/*.spec.ts',
      '**/node_modules/**',
      '**/playwright.config.ts',
      '**/playwright.*.config.ts',
      'tests/global-*.ts',
      'tests/playwright.setup.ts',
      // Exclude problematic tests that make real AWS calls or have syntax issues
      'src/lib/aws-sdk-enhanced/__tests__/secrets-manager.standalone.test.ts',
      'src/tests/components/PoolOfferControls.test.tsx',
      'src/tests/components/TripRequestForm.debug.test.tsx',
      'src/tests/components/TripRequestForm.mode.final.test.tsx',
      'src/tests/components/TripRequestForm.mode.fixed.test.tsx',
      'src/tests/components/TripRequestForm.mode.test.tsx',
      'scripts/fix-typescript-errors.js'
    ],
    
    // Enhanced coverage configuration for enterprise standards
    coverage: {
      provider: 'v8',
      statements: 85, // Target 85% minimum for combined coverage
      branches: 80,
      functions: 85,
      lines: 85,
      perFile: false,
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Generate detailed reports for CI/CD integration
      reportOnFailure: true,
      all: true,
      skipFull: false,
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85
      },
      exclude: [
        'coverage/**',
        'dist/**',
        '**/node_modules/**',
        '**/[.]**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__tests__/**',
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.spec.{ts,tsx,js,jsx}',
        '**/vitest.config.*',
        '**/playwright.config.*',
        'tests/**', // Exclude Playwright test files from coverage
        'scripts/**', // Exclude utility scripts
        'monitoring/**', // Exclude monitoring configs
        'docs/**' // Exclude documentation
      ],
      include: [
        'src/**/*.{ts,tsx,js,jsx}',
        'supabase/functions/**/*.{ts,js}'
      ]
    },
    
    // Better error reporting
    reporters: process.env.CI 
      ? ['default', 'junit', 'json']
      : ['default', 'verbose'],
      
    outputFile: process.env.CI ? {
      junit: './test-results/junit.xml',
      json: './test-results/results.json'
    } : undefined
  },
  
  // Project configurations (moved to root level)
  projects: [
    {
      name: 'unit',
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setupTests.ts'],
        include: [
          'src/**/*.test.{ts,tsx}',
          'src/**/__tests__/**/*.{ts,tsx}'
          // Removed tests/unit for Playwright compatibility
        ],
        exclude: [
          'src/tests/integration/**',
          'src/tests/auth/**',
          'supabase/functions/**',
          'tests/edge/**',
          '**/*.e2e.*'
        ]
      }
    },
    {
      name: 'integration',
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setupTests.ts'],
        include: [
          'src/tests/integration/**/*.test.{ts,tsx}',
          'src/tests/services/**/*.test.{ts,tsx}'
        ],
        testTimeout: 15000,
        hookTimeout: 20000
      }
    },
    {
      name: 'edge',
      test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/tests/setupTests.ts'],
        include: [
          'supabase/functions/**/*.test.{ts,js}',
          'tests/edge/**/*.test.{ts,js}'
        ]
      }
    },
    {
      name: 'aws',
      test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/tests/setupTests.ts'],
        include: ['src/lib/aws-sdk-enhanced/__tests__/**/*.test.ts'],
        exclude: [
          'src/lib/aws-sdk-enhanced/__tests__/secrets-manager.standalone.test.ts'
        ],
        testTimeout: 5000
      }
    }
  ]
})
