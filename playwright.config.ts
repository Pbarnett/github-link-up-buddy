import { defineConfig, devices } from '@playwright/test';

// Read baseURL from environment (GitHub Actions sets E2E_BASE_URL)
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // Let Playwright manage the server lifecycle in all environments
  webServer: {
    command: process.env.PLAYWRIGHT_SERVER_CMD || 'pnpm preview -- --host 0.0.0.0 --strictPort --port 3000',
    url: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Optional: global teardown script for cleaning up artifacts
  // globalTeardown: './tests/e2e/global-teardown.ts',
});

