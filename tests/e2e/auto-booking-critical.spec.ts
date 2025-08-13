import { test, expect } from '@playwright/test';

// Critical path smoke: ensure the auto-booking wizard loads and reaches the Review step
// Uses test-mode auto-advance helpers wired in the app to avoid real Stripe/OAuth.

test.beforeEach(async ({ page }) => {
  // Enable lightweight test mode flags before any scripts run
  await page.addInitScript(() => {
    // @ts-expect-error injected for tests
    window.__TEST_MODE__ = true;
    // @ts-expect-error injected for tests
    window.__TEST_AUTO_ADVANCE = true;
  });
});

test('@critical wizard reaches review step', async ({ page }) => {
  await page.goto('/auto-booking/new');

  // The app should auto-fill and advance through Criteria, Traveler, and Payment steps
  // Wait for the Review step to be visible
  await expect(page.getByTestId('review-title')).toBeVisible({ timeout: 40000 });
});

