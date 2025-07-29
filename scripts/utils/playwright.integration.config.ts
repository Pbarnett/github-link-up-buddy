import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration specifically for integration tests
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/integration',
  timeout: 60000, // Longer timeout for external service calls
  expect: {
    timeout: 10000,
  },
  fullyParallel: false, // Run integration tests sequentially to avoid rate limits
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retry failed tests in CI
  workers: process.env.CI ? 1 : 1, // Single worker to avoid hitting API rate limits
  
  /* Global setup for integration tests without Vitest conflicts */
  globalSetup: './tests/global-setup.ts',
  setupFiles: './tests/playwright.setup.ts',
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/integration-results.json' }],
    ['html', { outputFolder: 'playwright-report/integration' }],
  ],
  use: {
    /* Base URL for testing against local/staging environments */
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'integration-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/external-services.test.ts',
      testIgnore: [
        '**/*vitest*',
        '**/*integration.test.ts', // Exclude Vitest integration tests
        '**/src/**', // Exclude anything from src directory
      ],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
