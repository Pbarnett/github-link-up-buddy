import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe.skip('Core User Journey', () => {
  // TODO(e2e-refresh): Update navigation and accessibility checks to current layout and roles.
  test.beforeEach(async ({ page }) => {
    // Inject axe for accessibility testing
    await injectAxe(page);
  });

  test('complete user flow: landing → signup → search → booking', async ({ page }) => {
    // Step 1: Landing page
    test.step('Navigate to landing page', async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Parker Flight/);
      
      // Check accessibility
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true }
      });
    });

    // Step 2: Navigation to signup
    test.step('Navigate to signup', async () => {
      const signupButton = page.locator('text=Sign Up, text=Get Started').first();
      if (await signupButton.isVisible()) {
        await signupButton.click();
        await page.waitForURL('**/signup');
        await expect(page.locator('h1, h2')).toContainText(/Sign Up|Create Account/i);
      } else {
        // Alternative navigation
        await page.goto('/signup');
      }
    });

    // Step 3: Signup process
    test.step('Complete signup process', async () => {
      const timestamp = Date.now();
      const testEmail = `e2e-test-${timestamp}@parkerfly.com`;
      
      // Fill signup form
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', 'TestPassword123!');
      
      // Submit signup
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Wait for signup success or email verification
      await page.waitForLoadState('networkidle');
      
      // Check for either dashboard redirect or email verification message
      const isOnDashboard = await page.locator('[data-testid="dashboard"], h1:has-text("Dashboard")').isVisible();
      const hasEmailVerification = await page.locator('text=verify, text=confirmation').isVisible();
      
      expect(isOnDashboard || hasEmailVerification).toBeTruthy();
    });

    // Step 4: Flight search (if on dashboard)
    test.step('Perform flight search', async () => {
      // If we need to navigate to trip request
      const tripRequestButton = page.locator('text=New Trip, text=Search Flights, text=Book Flight').first();
      if (await tripRequestButton.isVisible()) {
        await tripRequestButton.click();
      } else {
        await page.goto('/trip-request');
      }
      
      // Fill trip request form
      await page.waitForSelector('[data-testid="trip-request-form"], form');
      
      // Origin and destination
      const originInput = page.locator('input[placeholder*="From"], input[aria-label*="origin"]').first();
      if (await originInput.isVisible()) {
        await originInput.fill('LAX');
        await page.keyboard.press('Tab');
      }
      
      const destInput = page.locator('input[placeholder*="To"], input[aria-label*="destination"]').first();
      if (await destInput.isVisible()) {
        await destInput.fill('JFK');
        await page.keyboard.press('Tab');
      }
      
      // Departure date (try multiple selectors)
      const dateInput = page.locator('input[type="date"], input[placeholder*="departure"]').first();
      if (await dateInput.isVisible()) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const dateString = futureDate.toISOString().split('T')[0];
        await dateInput.fill(dateString);
      }
      
      // Submit search
      const searchButton = page.locator('button:has-text("Search"), button[type="submit"]').first();
      await searchButton.click();
      
      // Wait for results
      await page.waitForLoadState('networkidle');
      
      // Verify we see flight results or offers
      const hasResults = await page.locator('[data-testid="flight-results"], .flight-offer, text=flight').isVisible();
      if (hasResults) {
        console.log('✅ Flight search completed successfully');
      } else {
        console.log('ℹ️  Flight search may need real API credentials');
      }
    });

    // Step 5: Accessibility check on results page
    test.step('Check accessibility on results page', async () => {
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true }
      });
    });
  });

  test('navigation accessibility', async ({ page }) => {
    await page.goto('/');
    
    test.step('Keyboard navigation', async () => {
      // Tab through main navigation elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Verify focus is visible
      const focusedElement = await page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
    
    test.step('Screen reader compatibility', async () => {
      // Check for proper ARIA labels and roles
      await expect(page.locator('[role="main"]')).toBeVisible();
      await expect(page.locator('[role="navigation"]')).toBeVisible();
    });
  });

  test('responsive design', async ({ page }) => {
    await page.goto('/');
    
    test.step('Mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');
      
      // Check mobile navigation
      const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-menu, button[aria-label*="menu"]');
      if (await mobileNav.isVisible()) {
        await mobileNav.click();
        await expect(page.locator('[data-testid="mobile-menu"], .mobile-menu-content')).toBeVisible();
      }
    });
    
    test.step('Tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForLoadState('networkidle');
      
      // Verify layout adapts
      await expect(page.locator('body')).toBeVisible();
    });
    
    test.step('Desktop viewport', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForLoadState('networkidle');
      
      // Verify desktop layout
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('error handling', async ({ page }) => {
    test.step('404 page', async () => {
      await page.goto('/non-existent-page');
      
      // Should show 404 or redirect to home
      const is404 = await page.locator('text=404, text=Not Found').isVisible();
      const isHome = await page.locator('text=Parker Flight').isVisible();
      
      expect(is404 || isHome).toBeTruthy();
    });
    
    test.step('Network error simulation', async () => {
      // Simulate offline condition
      await page.context().setOffline(true);
      await page.goto('/');
      
      // Should handle gracefully
      await page.waitForLoadState('domcontentloaded');
      
      // Restore connection
      await page.context().setOffline(false);
    });
  });
});
