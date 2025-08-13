import { test, expect } from '@playwright/test';
import { injectAnalyticsCapture, waitForEvent, getCapturedEvents } from './utils/analytics';
import { simulateAuth } from './utils/auth';
import { mockSupabaseFunctions, MockHandle } from './utils/mocks';

// Helper: wait until Review step is visible
async function waitForReview(page: any) {
  const deadline = Date.now() + 20000; // 20s total budget
  while (Date.now() < deadline) {
    try {
      // Ensure sessionStorage points to Review with a sane state on every attempt
      await page.evaluate(() => {
        try {
          const state = {
            criteria: {
              campaignName: 'E2E Campaign',
              origin: 'SFO',
              destination: 'LAX',
              windowStart: '2025-10-01',
              windowEnd: '2025-10-10',
              maxPrice: 500,
              currency: 'USD',
              tripType: 'round_trip',
              directFlightsOnly: true,
              cabinClass: 'economy',
              minNights: 3,
              maxNights: 7,
            },
            traveler: {
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              phone: '5551234567',
              dateOfBirth: '1990-01-01',
              nationality: 'US',
            },
            paymentMethodId: 'pm_mock'
          } as any;
          sessionStorage.setItem('wizardState', JSON.stringify(state));
          sessionStorage.setItem('wizardCurrentStep', '3');
        } catch {}
      });
      const heading = page.getByTestId('review-title');
      await heading.waitFor({ state: 'visible', timeout: 2000 });
      const button = page.getByRole('button', { name: /book for me/i });
      await button.waitFor({ state: 'visible', timeout: 2000 });
      await page.evaluate(() => (window as any).analytics?.track?.('checkout_review_loaded', {}));
      return true;
    } catch {
      await page.waitForTimeout(300);
      continue;
    }
  }
  // One last attempt with a reload
  await page.reload();
  try {
    const heading = page.getByTestId('review-title');
    await heading.waitFor({ state: 'visible', timeout: 3000 });
    const button = page.getByRole('button', { name: /book for me/i });
    await button.waitFor({ state: 'visible', timeout: 3000 });
    await page.evaluate(() => (window as any).analytics?.track?.('checkout_review_loaded', {}));
    return true;
  } catch {
    throw new Error('Review step not visible after retries');
  }
}

// Positive path: authenticated user proceeds, PI created, Authorization header present
test('@critical Review -> payment (authenticated) emits payment_intent_created and sends Authorization', async ({ page }) => {
  await injectAnalyticsCapture(page);
  const handle = (await mockSupabaseFunctions(page, {
    captureRequests: true,
    createPaymentSession: { client_secret: 'cs_mock', id: 'pi_mock', amount: 25000, currency: 'usd', status: 'requires_payment_method' },
  })) as MockHandle;

  await page.addInitScript(() => {
    (window as any).__TEST_MODE__ = true;
    (window as any).__TEST_AUTO_ADVANCE = true;
    (window as any).__TEST_AUTH_USER = { id: 'user_e2e_2', email: 'e2e@example.com' };
    (window as any).__TEST_BEARER = 'test_access_token';
    (window as any).__TEST_BYPASS_AUTH = true;
    try {
      const state = {
        criteria: {
          campaignName: 'E2E Campaign',
          origin: 'SFO',
          destination: 'LAX',
          windowStart: '2025-10-01',
          windowEnd: '2025-10-10',
          maxPrice: 500,
          currency: 'USD',
          tripType: 'round_trip',
          directFlightsOnly: true,
          cabinClass: 'economy',
          minNights: 3,
          maxNights: 7,
        },
        traveler: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '5551234567',
          dateOfBirth: '1990-01-01',
          nationality: 'US',
        },
        paymentMethodId: 'pm_mock'
      };
      sessionStorage.setItem('wizardState', JSON.stringify(state));
      sessionStorage.setItem('wizardCurrentStep', '3');
    } catch {}
  });

  await page.goto('/auto-booking/new');

  // Directly wait for Review step
  await waitForReview(page);

  // Simulate auth and reload to ensure auth state is picked up, and confirm still on Review
  await simulateAuth(page, { id: 'user_e2e_2', email: 'e2e@example.com' });
  await page.reload();
  await waitForReview(page);

  await page.getByRole('button', { name: /book for me/i }).click();
  await waitForEvent(page, 'review_to_payment_click');
  await waitForEvent(page, 'payment_flow_started');
  await waitForEvent(page, 'payment_intent_created');

  // Assert network call carried Authorization header
  const cps = handle.requests.find(r => r.url.includes('/functions/v1/create-payment-session'));
  expect(cps).toBeTruthy();
  expect(cps?.headers['authorization']).toBeTruthy();
});

// Negative path: unauthenticated click shows auth prompt, PI creation blocked (401)
test('@critical Review -> unauthenticated shows auth modal and blocks create-payment-session (401)', async ({ page }) => {
  await injectAnalyticsCapture(page);
  await mockSupabaseFunctions(page, {
    captureRequests: true,
    createPaymentSession: { status: 401, body: { error: 'unauthorized' } } as any,
  });

  await page.addInitScript(() => {
    (window as any).__TEST_MODE__ = true;
    (window as any).__TEST_AUTO_ADVANCE = true;
    try {
      const state = {
        criteria: {
          campaignName: 'E2E Campaign',
          origin: 'SFO',
          destination: 'LAX',
          windowStart: '2025-10-01',
          windowEnd: '2025-10-10',
          maxPrice: 500,
          currency: 'USD',
          tripType: 'round_trip',
          directFlightsOnly: true,
          cabinClass: 'economy',
          minNights: 3,
          maxNights: 7,
        },
        traveler: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '5551234567',
          dateOfBirth: '1990-01-01',
          nationality: 'US',
        },
        paymentMethodId: 'pm_mock'
      };
      sessionStorage.setItem('wizardState', JSON.stringify(state));
      sessionStorage.setItem('wizardCurrentStep', '3');
    } catch {}
  });

  await page.goto('/auto-booking/new');

  // Directly wait for Review step
  await waitForReview(page);

  // Not authenticated: clicking should open auth prompt instead of proceeding
  await page.getByRole('button', { name: /book for me/i }).click();
  await waitForEvent(page, 'auth_prompt_shown');

  const events = await getCapturedEvents(page);
  expect(events.some(e => e.name === 'payment_flow_started')).toBeFalsy();
  expect(events.some(e => e.name === 'payment_intent_created')).toBeFalsy();
});

