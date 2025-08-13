import { test, expect } from '@playwright/test';
import { injectAnalyticsCapture } from './utils/analytics';
import { mockSupabaseFunctions } from './utils/mocks';
import { gotoReview } from './utils/review';

// Expect a 429 rate limit to surface a friendly banner on the Review step
test('@critical Review -> rate limited create-payment-session shows retry banner', async ({ page }) => {
  await injectAnalyticsCapture(page);
  await mockSupabaseFunctions(page, {
    captureRequests: true,
    createPaymentSession: { status: 429, body: { error: 'Too many requests. Please try again shortly.' } as any },
  });

  await gotoReview(page, undefined, { bypassAuth: true, timeoutMs: 20000 });

  // Click Book For Me to trigger the function
  await page.getByRole('button', { name: /book for me/i }).click();

  // Expect the retry banner text to appear (or generic fallback)
  const specific = page.getByText("You're doing that too often. Please wait a minute and try again.");
  const generic = page.getByText('Unable to start checkout right now. Please try again.');
  await Promise.race([
    specific.waitFor({ state: 'visible', timeout: 5000 }),
    generic.waitFor({ state: 'visible', timeout: 5000 })
  ]);
});

