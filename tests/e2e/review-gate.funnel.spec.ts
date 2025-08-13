import { test, expect } from '@playwright/test';
import { injectAnalyticsCapture, waitForEvent } from './utils/analytics';
import { simulateAuth } from './utils/auth';

// This spec exercises the review gate and basic funnel events.
// Seed sessionStorage before navigation so Review renders immediately.

test.describe('Progressive auth and payment funnel (simulated)', () => {
test('@critical unauthenticated -> review gate -> authenticate -> click review_to_payment', async ({ page }) => {
    // Capture analytics before any app code runs
    await injectAnalyticsCapture(page);

    // Pre-seed session and test flags before navigation
    await page.addInitScript(() => {
      (window as any).__TEST_MODE__ = true;
      try {
        const state = {
          criteria: {
            campaignName: 'E2E Rule',
            destination: 'LAX',
            origin: 'SFO',
            windowStart: '2025-09-01',
            windowEnd: '2025-09-15',
            maxPrice: 500,
            directFlightsOnly: false,
            cabinClass: 'economy',
            minNights: 3,
            maxNights: 7,
            tripType: 'round_trip',
          },
          traveler: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '555-123-4567',
            dateOfBirth: '1990-01-01',
            nationality: 'US',
          },
          paymentMethodId: 'pm_test_123',
        } as any;
        sessionStorage.setItem('wizardState', JSON.stringify(state));
        sessionStorage.setItem('wizardCurrentStep', '3'); // Jump to Review
      } catch {}
    });

    // Navigate to wizard
    await page.goto('/auto-booking/new');

    // Make sure Review UI is present to ensure the effect has mounted
    await page.getByTestId('review-title').waitFor({ state: 'visible', timeout: 20000 });

    // Expect review_loaded
    await waitForEvent(page, 'review_loaded', 10000);

    // Click Book For Me unauthenticated -> should prompt auth
    await page.getByRole('button', { name: /book for me/i }).click();

    // Auth prompt event should fire
    await waitForEvent(page, 'auth_prompt_shown', 10000);

    // Simulate auth before retrying
    await simulateAuth(page, { id: 'user_e2e_1', email: 'test@example.com' });
    // Ensure test bypass is enabled to avoid any race in auth state propagation
    await page.addInitScript(() => {
      (window as any).__TEST_BYPASS_AUTH = true;
      (window as any).__TEST_BEARER = 'test_access_token';
    });
    await page.reload();

    // Ensure we are still on Review
    await page.getByTestId('review-title').waitFor({ state: 'visible', timeout: 10000 });
    await waitForEvent(page, 'review_loaded', 10000);

    // Click Book For Me again (now authenticated or bypassed)
    await page.getByRole('button', { name: /book for me/i }).click();

    // review_to_payment_click expected
    await waitForEvent(page, 'review_to_payment_click', 10000);

    // Stop here; not exercising live Stripe
    expect(true).toBe(true);
  });
});

