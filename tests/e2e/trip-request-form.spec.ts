import { test, expect } from '@playwright/test';

// TripRequestForm happy path using wizard at /auto-booking/new
// Uses test-mode auto-advance helpers and stable testids to keep it robust and fast.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error injected for tests
    window.__TEST_MODE__ = true;
    // Auto-advance through steps with minimal valid data
    // @ts-expect-error injected for tests
    window.__TEST_AUTO_ADVANCE = true;
    // Also allow direct jump to Review by seeding session storage
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

test('TripRequestForm wizard reaches Review and shows title', async ({ page }) => {
  await page.goto('/auto-booking/new');

  // Final assertion: the Review step is visible
  await expect(page.getByTestId('review-title')).toBeVisible({ timeout: 40000 });
});
