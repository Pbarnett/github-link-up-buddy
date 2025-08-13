import { Page } from '@playwright/test';

// Test-only auth stub to simulate a signed-in session using Supabase's local storage keys.
// Adjust to your app's exact storage keys or add an endpoint for test sign-in if preferred.
export async function simulateAuth(page: Page, user: { id: string; email: string }) {
  // Seed a generic analytics + auth stub before any scripts run
  await page.addInitScript((u) => {
    try {
      const fakeSession = {
        currentSession: {
          access_token: 'test_access_token',
          token_type: 'bearer',
          user: {
            id: u.id,
            email: u.email,
          },
        },
      };
      // Set a predictable fallback key in case the app looks for it later
      localStorage.setItem('sb-test-auth-token', JSON.stringify(fakeSession));
      // Optionally flag test mode
      (window as any).__TEST_MODE__ = true;
    } catch (e) {
      console.warn('Failed to seed initial auth session in tests', e);
    }
  }, user);

  // After app has initialized, rewrite the actual Supabase auth key if present
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate((u) => {
    try {
      const fakeSession = {
        currentSession: {
          access_token: 'test_access_token',
          token_type: 'bearer',
          user: {
            id: u.id,
            email: u.email,
          },
        },
      };
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
      if (keys.length) {
        // Prefer the most recently touched key
        keys.forEach((k) => localStorage.setItem(k, JSON.stringify(fakeSession)));
      }
    } catch (e) {
      console.warn('Failed to update Supabase auth key in tests', e);
    }
  }, user);
}

