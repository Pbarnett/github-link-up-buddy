import { Page, expect } from '@playwright/test';

// Helpers ------------------------------------------------------------------ //
export async function clearAuthState(page: Page) {
  await page.context().clearCookies();
  await page.goto('/');
}

interface OAuthOptions {
  forceExpiredCode?: boolean;
  simulatePopupBlock?: boolean;
  useBadRedirect?: boolean;
}

export async function signInWithGoogle(page: Page, opts: OAuthOptions = {}) {
  await page.goto('/login');
  
  // Intercept Google URL when running in mock mode
  if (process.env.MOCK_GOOGLE_OAUTH) {
    await page.route('https://accounts.google.com/**', route => {
      // Instead of using 302 redirect, just abort the request and navigate manually
      route.abort();
    });
  }
  
  if (opts.simulatePopupBlock) {
    await page.evaluate(() => /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.open = () => null);
  }

  // Wait for page to load and find the Google sign-in button
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000); // Give the page time to fully render
  
  // Try multiple selectors for the Google sign-in button
  const googleButton = page.locator('button').filter({ hasText: /google/i }).first();
  const signInButton = page.getByRole('button', { name: /sign.*google/i });
  const textButton = page.locator('text=Sign in with Google');
  
  // Try to find the button using multiple approaches
  let buttonFound = false;
  
  if (await googleButton.isVisible()) {
    await googleButton.click();
    buttonFound = true;
  } else if (await signInButton.isVisible()) {
    await signInButton.click();
    buttonFound = true;
  } else if (await textButton.isVisible()) {
    await textButton.click();
    buttonFound = true;
  }
  
  if (!buttonFound) {
    throw new Error('Could not find Google sign-in button');
  }

  if (opts.forceExpiredCode)
    await page.route('**/token', r => r.fulfill({ status: 400, body: 'invalid_grant' }));

  if (opts.useBadRedirect)
    await page.route('**/oauth2/v2/auth**', r => r.continue({ url: r.request().url() + '&redirect_uri=https://bad.example' }));
  
  // In mock mode, simulate the OAuth flow completion
  if (process.env.MOCK_GOOGLE_OAUTH) {
    await page.waitForTimeout(1000);
    // Navigate to a mock success page or back to home
    await page.goto('/');
  }
}

export async function assertSupabaseSession(page: Page) {
  // Wait for the auth state to be established
  await page.waitForTimeout(2000);
  
  // Check if user is redirected to the dashboard or authenticated area
  const currentUrl = page.url();
  console.log('Current URL after auth:', currentUrl);
  
  // Method 1: Check for successful navigation to authenticated route
  const isOnAuthenticatedPage = currentUrl.includes('auto-booking') || currentUrl.includes('dashboard');
  
  if (isOnAuthenticatedPage) {
    console.log('✅ User successfully navigated to authenticated page');
    return;
  }
  
  // Method 2: Check for Supabase session in localStorage
  const hasSupabaseSession = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const supabaseKeys = keys.filter(key => key.startsWith('sb-') && key.includes('auth-token'));
    return supabaseKeys.length > 0;
  });
  
  if (hasSupabaseSession) {
    console.log('✅ Supabase session found in localStorage');
    return;
  }
  
  // Method 3: Check for session via global Supabase client (if available)
  const globalSession = await page.evaluate(() => {
    if (typeof /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window !== 'undefined' && (/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window as any).supabase) {
      return (/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window as any).supabase.auth.getSession();
    }
    return null;
  }).catch(() => null);
  
  if (globalSession?.data?.session) {
    console.log('✅ Active Supabase session found via global client');
    return;
  }
  
  // If none of the methods succeeded, fail the test
  throw new Error('No valid authentication session found. User may not be properly authenticated.');
}
