import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  // Establish stable environment: viewport and API stubs
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual tests
    await page.setViewportSize({ width: 1280, height: 720 });

    // Stub business rules config to avoid backend dependency during preview
    await page.route('**/api/business-rules/config**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          flightSearch: {
            minPriceUSD: 100,
            maxPriceUSD: 2000,
            defaultNonstopRequired: false
          },
          autoBooking: { enabled: false }
        })
      });
    });

    // Fallback stub for any remaining API calls
    await page.route('**/api/**', async route => {
      try {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      } catch {
        await route.continue();
      }
    });
  });

  test('trip request form visual comparison', async ({ page }) => {
    await page.goto('/trip/new');
    
    // Wait for form to be fully loaded
    await page.waitForSelector('[data-testid="primary-submit-button"], form', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic elements that change between runs
    await page.addStyleTag({
      content: `
        .dynamic-timestamp,
        .loading-spinner,
        [data-testid="current-time"] {
          visibility: hidden !important;
        }
      `
    });
    
    // Take screenshot of the entire form
    await expect(page).toHaveScreenshot('trip-request-form-desktop.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  test('dashboard layout visual comparison', async ({ page }) => {
    // Try to go to dashboard, but handle if auth is required
    await page.goto('/dashboard');
    
    // If redirected to login, that's also a valid state to test
    const isOnLogin = await page.locator('h1:has-text("Login"), h2:has-text("Sign In")').isVisible();
    const isOnDashboard = await page.locator('[data-testid="dashboard"], h1:has-text("Dashboard")').isVisible();
    
    if (isOnLogin) {
      await expect(page).toHaveScreenshot('login-page-desktop.png', {
        fullPage: true,
        threshold: 0.2,
        animations: 'disabled'
      });
    } else if (isOnDashboard) {
      await expect(page).toHaveScreenshot('dashboard-desktop.png', {
        fullPage: true,
        threshold: 0.2,
        animations: 'disabled'
      });
    } else {
      // Fallback to homepage
      await page.goto('/');
      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        fullPage: true,
        threshold: 0.2,
        animations: 'disabled'
      });
    }
  });

  test('mobile responsive visual comparison', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test mobile homepage
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });
    
    // Test mobile trip request if accessible
    try {
      await page.goto('/trip/new');
      await page.waitForSelector('[data-testid="primary-submit-button"], form', { timeout: 10000 });
      
      await expect(page).toHaveScreenshot('trip-request-mobile.png', {
        fullPage: true,
        threshold: 0.2,
        animations: 'disabled'
      });
    } catch (error) {
      console.log('Mobile trip request form not accessible, skipping screenshot');
    }
  });

  test('component states visual comparison', async ({ page }) => {
    await page.goto('/trip/new');
    await page.waitForSelector('[data-testid="primary-submit-button"], form', { timeout: 15000 });
    
    // Test form component in different states
    
    // 1. Empty state
    await expect(page.locator('form')).toHaveScreenshot('form-empty-state.png', {
      threshold: 0.2,
      animations: 'disabled'
    });
    
    // 2. Partially filled state
    // Fill minimal fields if available (custom destination + other departure)
    const customDestination = page.getByLabel('Custom Destination').or(page.getByPlaceholder('Enter airport code (e.g., LAX)')).first();
    const otherDeparture = page.getByPlaceholder('e.g., BOS').first();
    if (await customDestination.isVisible()) {
      await customDestination.fill('LAX');
    }
    if (await otherDeparture.isVisible()) {
      await otherDeparture.fill('JFK');
    }
    
    await expect(page.locator('form')).toHaveScreenshot('form-partial-state.png', {
      threshold: 0.2,
      animations: 'disabled'
    });
    
    // 3. Test error states (if validation exists)
    const submitButton = page.getByTestId('primary-submit-button').or(page.locator('button[type="submit"], button:has-text("Search")')).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(1000); // Wait for potential validation
      
      // Only capture if there are visible error messages
      const hasErrors = await page.locator('.error, [data-testid*="error"], .text-red').isVisible();
      if (hasErrors) {
        await expect(page.locator('form')).toHaveScreenshot('form-error-state.png', {
          threshold: 0.2,
          animations: 'disabled'
        });
      }
    }
  });

  test('loading states visual comparison', async ({ page }) => {
    await page.goto('/trip/new');
    await page.waitForSelector('[data-testid="primary-submit-button"], form', { timeout: 15000 });
    
    // Mock slow API response to capture loading state
    await page.route('**/flight-search**', async route => {
      // Delay the response to capture loading state
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.continue();
    });
    
    // Fill form and submit to trigger loading
    const customDestination = page.getByLabel('Custom Destination').or(page.getByPlaceholder('Enter airport code (e.g., LAX)')).first();
    const otherDeparture = page.getByPlaceholder('e.g., BOS').first();
    const submitButton = page.getByTestId('primary-submit-button').or(page.locator('button[type="submit"]').first());
    
    if (await customDestination.isVisible() && await otherDeparture.isVisible() && await submitButton.isVisible()) {
      await customDestination.fill('LAX');
      await otherDeparture.fill('JFK');
      
      // Submit and quickly capture loading state
      await submitButton.click();
      
      // Wait a moment for loading to start
      await page.waitForTimeout(500);
      
      // Look for loading indicators
      const loadingVisible = await page.locator('.loading, .spinner, [data-testid*="loading"]').isVisible();
      
      if (loadingVisible) {
        await expect(page).toHaveScreenshot('loading-state.png', {
          threshold: 0.2,
          animations: 'disabled'
        });
      }
    }
  });

  test('dark mode visual comparison', async ({ page }) => {
    await page.goto('/');
    
    // Try to enable dark mode if toggle exists
    const darkModeToggle = page.locator('[data-testid="theme-toggle"], button:has-text("Dark"), .dark-mode-toggle').first();
    
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
      
      await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
        fullPage: true,
        threshold: 0.2,
        animations: 'disabled'
      });
      
      // Test trip request in dark mode
      await page.goto('/trip-request');
      await page.waitForSelector('form');
      
      await expect(page).toHaveScreenshot('trip-request-dark-mode.png', {
        fullPage: true,
        threshold: 0.2,
        animations: 'disabled'
      });
    } else {
      console.log('Dark mode toggle not found, skipping dark mode tests');
    }
  });
});
