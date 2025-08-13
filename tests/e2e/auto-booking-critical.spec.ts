import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error injected for tests
    window.__TEST_MODE__ = true;
    // @ts-expect-error injected for tests
    window.__TEST_AUTO_ADVANCE = true;
  });
});

test('@critical wizard reaches review step', async ({ page }) => {
  await page.goto('/auto-booking/new');
  await expect(page.getByTestId('review-title')).toBeVisible({ timeout: 40000 });
});

