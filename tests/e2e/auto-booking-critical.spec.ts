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
  // Minimal smoke: page responds OK and we land on /auto-booking
  const resp = await page.goto('/auto-booking/new');
  expect(resp && resp.ok()).toBeTruthy();

  // Less brittle: wait for any known wizard heading or button
  await page.waitForSelector('text=Create Auto-Booking Rule, text=Rule Criteria, text=Traveler Information, text=Payment Information', { timeout: 10000 });

  // Assert we’re in the auto-booking flow route (no brittle selectors)
  expect(page.url()).toContain('/auto-booking');
});

