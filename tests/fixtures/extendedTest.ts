import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { testData, testHelpers } from './testData';

// Define custom fixture types
export interface TestFixtures {
  authenticatedPage: Page;
  flightSearchData: typeof testData.flights.domestic;
  testUserEmail: string;
}

export interface WorkerFixtures {
  authenticatedContext: BrowserContext;
}

// Extend Playwright test with custom fixtures
export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Worker-scoped authenticated context (shared across tests in same worker)
  authenticatedContext: [async ({ browser }, use) => {
    // Create a new context for authentication
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Perform authentication
      await page.goto('/login');
      
      // Use modern selectors for login
      const emailInput = page.getByRole('textbox', { name: /email/i });
      const passwordInput = page.getByLabel(/password/i);
      const loginButton = page.getByRole('button', { name: /sign in|login/i });

      // Fill in test credentials
      await emailInput.fill(testData.users.testUser.email);
      await passwordInput.fill(testData.users.testUser.password);
      await loginButton.click();

      // Wait for successful authentication
      await expect(page.getByText(/dashboard|welcome/i).first()).toBeVisible({ timeout: 10000 });

      await use(context);
    } catch (error) {
      console.warn('Authentication setup failed, tests may need to handle login manually:', error);
      await use(context);
    } finally {
      await context.close();
    }
  }, { scope: 'worker' }],

  // Page with pre-authenticated user
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
  },

  // Dynamic flight search data
  flightSearchData: async ({}, use) => {
    const dynamicData = {
      ...testData.flights.domestic,
      dates: {
        departure: testHelpers.getFutureDate(30),
        return: testHelpers.getFutureDate(37)
      }
    };
    await use(dynamicData);
  },

  // Unique test user email
  testUserEmail: async ({}, use) => {
    const email = testHelpers.generateTestEmail();
    await use(email);
  }
});

// Enhanced expect with custom matchers
export { expect } from '@playwright/test';

// Custom test step helpers
export const testSteps = {
  navigateAndWait: async (page: Page, url: string, waitForSelector?: string) => {
    await test.step(`Navigate to ${url}`, async () => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      if (waitForSelector) {
        await expect(page.locator(waitForSelector)).toBeVisible();
      }
    });
  },

  fillForm: async (page: Page, formData: Record<string, string>, formSelector?: string) => {
    await test.step('Fill form with data', async () => {
      const form = formSelector ? page.locator(formSelector) : page.locator('form').first();
      
      for (const [fieldName, value] of Object.entries(formData)) {
        // Try modern selector approaches first
        const field = page.getByLabel(new RegExp(fieldName, 'i'))
          .or(page.getByPlaceholder(new RegExp(fieldName, 'i')))
          .or(page.locator(`input[name*="${fieldName}"]`))
          .or(page.locator(`select[name*="${fieldName}"]`))
          .first();

        await expect(field).toBeVisible();
        await field.fill(value);
      }
    });
  },

  verifyAccessibility: async (page: Page, context: string = '') => {
    await test.step(`Verify accessibility${context ? ' - ' + context : ''}`, async () => {
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        // Should have exactly one h1
        await expect(page.locator('h1')).toHaveCount(1);
      }

      // Check for main landmark
      await expect(page.getByRole('main').or(page.locator('main'))).toBeVisible();

      // Verify focus indicators on interactive elements
      const interactiveElements = page.getByRole('button').or(page.getByRole('link')).or(page.getByRole('textbox'));
      const elementCount = Math.min(await interactiveElements.count(), 5);

      for (let i = 0; i < elementCount; i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          await element.focus();
          await expect(element).toBeFocused();
        }
      }
    });
  },

  submitAndWaitForResponse: async (page: Page, submitSelector: string, responsePattern: string) => {
    await test.step('Submit form and wait for response', async () => {
      const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes(responsePattern)),
        page.getByRole('button', { name: new RegExp(submitSelector, 'i') })
          .or(page.locator(submitSelector))
          .click()
      ]);

      expect(response.status()).toBeLessThan(400);
      await page.waitForLoadState('networkidle');
    });
  },

  takeScreenshotOnFailure: async (page: Page, testInfo: any) => {
    if (testInfo.status === 'failed') {
      const screenshot = await page.screenshot();
      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  }
};

// Export everything needed for tests
export default test;
