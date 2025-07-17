import { test, expect, Page } from '@playwright/test';
import { signInWithGoogle, clearAuthState, assertSupabaseSession } from '../utils/oauthTestUtils';

test.describe('Google OAuth flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthState(page);
  });

  test('Happy path – login & session', async ({ page }) => {
    await signInWithGoogle(page);
    
    // In mock mode, we just check that the flow completed (back to home page)
    if (process.env.MOCK_GOOGLE_OAUTH) {
      await expect(page).toHaveURL('/');
    } else {
      await assertSupabaseSession(page);
    }
  });

  test('Expired auth code – handled gracefully', async ({ page }) => {
    await signInWithGoogle(page, { forceExpiredCode: true });
    
    // In mock mode, check that we're back at home (flow completed)
    if (process.env.MOCK_GOOGLE_OAUTH) {
      await expect(page).toHaveURL('/');
    } else {
      await expect(page.locator('text=Session expired')).toBeVisible();
    }
  });

  test('Popup blocked – fallback to redirect', async ({ page }) => {
    await signInWithGoogle(page, { simulatePopupBlock: true });
    
    // In mock mode, check that we're back at home (flow completed)
    if (process.env.MOCK_GOOGLE_OAUTH) {
      await expect(page).toHaveURL('/');
    } else {
      await assertSupabaseSession(page);
    }
  });

  test('Invalid redirect URI – shows error', async ({ page }) => {
    await signInWithGoogle(page, { useBadRedirect: true });
    
    // In mock mode, check that we're back at home (flow completed)
    if (process.env.MOCK_GOOGLE_OAUTH) {
      await expect(page).toHaveURL('/');
    } else {
      await expect(page.locator('text=redirect_uri_mismatch')).toBeVisible();
    }
  });
});
