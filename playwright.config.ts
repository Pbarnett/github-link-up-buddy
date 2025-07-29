import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000, // 30 seconds per test
  expect: {
    // Global expect timeout
    timeout: 5000,
    // Screenshot comparison threshold
    threshold: 0.2,
    // Path template for screenshots and snapshots
    pathTemplate: '{testDir}/{projectName}/{testFileDir}/{testFileName}-{arg}{ext}',
  },
  reporter: [
    ['html', { 
      outputFolder: 'tests/reports/html',
      open: process.env.CI ? 'never' : 'on-failure' 
    }],
    ['json', { outputFile: 'tests/reports/report.json' }],
    ['junit', { outputFile: 'tests/reports/junit.xml' }],
    // Add blob reporter for trace storage
    process.env.CI ? ['blob'] : ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    // Enhanced tracing configuration
    trace: process.env.CI ? 'on-first-failure' : 'on-first-retry',
    // Video recording on failures
    video: process.env.CI ? 'on-first-failure' : 'retain-on-failure',
    // Screenshot on failure
    screenshot: 'only-on-failure',
    // Action timeout
    actionTimeout: 10000,
    // Navigation timeout
    navigationTimeout: 15000,
    // Ignore HTTPS errors in development
    ignoreHTTPSErrors: !process.env.CI,
    // Enable modern browser features
    contextOptions: {
      // Respect OS-level reduced motion preference
      reducedMotion: process.env.CI ? 'reduce' : 'no-preference',
      // Enable strict CSP compliance
      strictSelectors: true,
    },
  },
  projects: [
    {
      name: 'integration',
      testMatch: '**/external-services.test.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Use new headless mode for better reliability
        channel: process.env.CI ? 'chrome' : undefined,
      },
    },
    {
      name: 'chromium',
      testIgnore: '**/external-services.test.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Use new headless mode for better reliability
        channel: process.env.CI ? 'chrome' : undefined,
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing projects
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    // Accessibility testing project
    {
      name: 'accessibility',
      testMatch: /.*\\.a11y\\.spec\\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Slow down for accessibility testing
        actionTimeout: 15000,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
    // Remove health check since /health endpoint may not exist
    // Graceful shutdown
    gracefulShutdown: {
      signal: 'SIGTERM',
      timeout: 5000,
    },
  },
  // Global setup for auth, test data, etc.
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
  
  // Setup files to run before tests
  setupFiles: './tests/playwright.setup.ts',
  
  // Prevent conflicts with other test runners
  testIgnore: [
    '**/node_modules/**',
    '**/*.test.{ts,tsx,js,jsx}', // Exclude Vitest files
    '**/vitest.config.ts',
    'src/**/__tests__/**',
    'src/tests/setupTests.ts', // Exclude Vitest setup
    '**/vitest.*.ts' // Exclude all Vitest config files
  ],
  // Test output directory
  outputDir: 'tests/test-results',
  // Capture git information for reports
  captureGitInfo: process.env.CI ? { commit: true, diff: false } : false,
});
