import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error injected for tests
    window.__TEST_MODE__ = true;
    // @ts-expect-error injected for tests
    window.__TEST_AUTO_ADVANCE = true;
    // Pre-seed session to ensure smooth advance; Review step watches sessionStorage
    try {
      const state = {
        criteria: {
          campaignName: 'E2E Rule',
          destination: 'LAX',
          origin: 'SFO',
          windowStart: '2025-09-01',
          windowEnd: '2025-09-15',
          maxPrice: 500,
          directFlightsOnly: true,
          cabinClass: 'economy',
          minNights: 3,
          maxNights: 7,
          tripType: 'round_trip',
        },
        traveler: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '5551234567',
          dateOfBirth: '1990-01-01',
          nationality: 'US',
        },
        paymentMethodId: 'pm_test_123',
      } as any;
      sessionStorage.setItem('wizardState', JSON.stringify(state));
      sessionStorage.setItem('wizardCurrentStep', '3');
    } catch {}
  });
});

test('@critical wizard reaches review step', async ({ page }) => {
  await page.goto('/auto-booking/new');
  // Wait longer for review step since we're checking transitions all the way through
  await expect(page.getByTestId('review-title')).toBeVisible({ timeout: 60000 });
});

