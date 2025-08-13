import { Page, expect } from '@playwright/test';

export type ReviewStateOverrides = Partial<{
  criteria: any;
  traveler: any;
  paymentMethodId: string;
}>;

const defaultState = {
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
  paymentMethodId: 'pm_mock',
};

export async function seedWizardSession(page: Page, overrides?: ReviewStateOverrides) {
  await page.addInitScript((state) => {
    try {
      (window as any).__TEST_MODE__ = true;
      const merged = {
        ...state,
        criteria: { ...(state as any).criteria },
        traveler: { ...(state as any).traveler },
      };
      sessionStorage.setItem('wizardState', JSON.stringify(merged));
      sessionStorage.setItem('wizardCurrentStep', '3');
    } catch {}
  }, { ...defaultState, ...(overrides || {}) });
}

export async function gotoReview(
  page: Page,
  overrides?: ReviewStateOverrides,
  opts?: { bypassAuth?: boolean; timeoutMs?: number }
) {
  const timeout = opts?.timeoutMs ?? 20000;
  // Optionally bypass auth to ensure review step isn't blocked
  if (opts?.bypassAuth) {
    await page.addInitScript(() => {
      (window as any).__TEST_BYPASS_AUTH = true;
      (window as any).__TEST_BEARER = 'test_access_token';
      (window as any).__TEST_MODE__ = true;
    });
  }
  await seedWizardSession(page, overrides);
  await page.goto('/auto-booking/new');
  await page.getByTestId('review-title').waitFor({ state: 'visible', timeout });
  await page.getByRole('button', { name: /book for me/i }).waitFor({ state: 'visible', timeout });
  await expect(page.getByTestId('review-title')).toBeVisible();
}
