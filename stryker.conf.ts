import { StrykerOptions } from '@stryker-mutator/api/core';

const config: StrykerOptions = {
  packageManager: 'pnpm',
  reporters: ['clear-text', 'html', 'json'],
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  mutate: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/**/*.spec.ts',
    '!src/**/*.spec.tsx',
    '!src/**/*.d.ts',
    '!src/tests/**/*',
    '!src/**/__tests__/**/*',
    '!src/types/ambient.ts'
  ],
  thresholds: {
    high: 70,
    low: 50,
    break: 70
  },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  buildCommand: 'pnpm build',
  vitest: {
    configFile: 'vitest.config.ts'
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.stryker-tmp',
    'tests',
    '**/*.config.*',
    'vite.config.ts',
    'playwright.config.ts'
  ],
  timeoutMS: 60000,
  timeoutFactor: 1.5,
  maxConcurrentTestRunners: 2,
  logLevel: 'info',
  fileLogLevel: 'warn',
  allowConsoleColors: true,
  dashboard: {
    reportType: 'mutationScore'
  },
  htmlReporter: {
    fileName: 'reports/mutation/mutation.html'
  },
  jsonReporter: {
    fileName: 'reports/mutation/mutation.json'
  }
};

export default config;
