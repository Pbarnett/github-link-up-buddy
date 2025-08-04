const config = {
  packageManager: 'pnpm',
  reporters: ['clear-text'],
  testRunner: 'vitest',
  coverageAnalysis: 'off',
  plugins: ['@stryker-mutator/vitest-runner'],
  disableTypeChecks: false,
  mutate: [
    'src/utils/call-with-retry.ts'
  ],
  vitest: {
    configFile: 'vitest.mutation.config.ts'
  },
  testRunnerNodeArgs: ['--experimental-vm-modules'],
  thresholds: {
    high: 80,
    low: 70,
    break: 70
  },
  timeoutMS: 300000,
  timeoutFactor: 2,
  concurrency: 1,
  logLevel: 'info'
};

module.exports = config;
