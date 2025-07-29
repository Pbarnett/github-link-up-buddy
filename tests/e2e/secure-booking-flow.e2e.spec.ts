/**
 * End-to-End Tests for Secure Flight Booking Flow
 * 
 * Tests the complete user journey from flight search to booking confirmation
 * with secure authentication, payment processing, and error handling.
 */

import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { test as extendedTest } from '../fixtures/extendedTest';

// Test configuration
const TEST_BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

// Test user data
const testUser = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01',
};

// Test flight search data
const testSearchData = {
  origin: 'LAX',
  destination: 'JFK',
  departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  adults: 1,
};

test.describe('Secure Flight Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto(TEST_BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Authentication Flow', () => {
    test('should display OAuth login options', async ({ page }) => {
      await page.goto(`${TEST_BASE_URL}/auth/login`);
      
      // Check for OAuth provider buttons
      await expect(page.locator('text=Continue with Google')).toBeVisible();
      await expect(page.locator('text=Continue with GitHub')).toBeVisible();
      await expect(page.locator('text=Continue with Discord')).toBeVisible();
      
      // Verify security notice
      await expect(page.locator('text=Secure authentication powered by AWS Secrets Manager')).toBeVisible();
    });

    test('should handle OAuth redirect flow', async ({ page }) => {
      // Mock OAuth for testing
      await page.route('**/auth/callback/**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            user: {
              id: 'test-user-id',
              email: testUser.email,
              full_name: `${testUser.firstName} ${testUser.lastName}`,
            },
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
            },
          }),
        });
      });

      await page.goto(`${TEST_BASE_URL}/auth/login`);
      await page.click('text=Continue with Google');
      
      // Should redirect and show authenticated state
      await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: TEST_TIMEOUT });
    });
  });

  test.describe('Flight Search Flow', () => {
    test('should display flight search form', async ({ page }) => {
      // Use the test-booking route that bypasses authentication
      await page.goto(`${TEST_BASE_URL}/test-booking`);
      
      // Wait for the page to load and render client-side content
      await page.waitForLoadState('networkidle');
      
      // Wait for React components to render
      await page.waitForTimeout(1000);
      
      // Wait for the form to be visible
      await page.waitForSelector('form', { timeout: 10000 });
      
      // Verify all form elements are present based on actual component structure
      // Origin input with placeholder "LAX, New York, etc."
      await expect(page.locator('input[placeholder*="LAX, New York"]')).toBeVisible({ timeout: 5000 });
      
      // Destination input with placeholder "JFK, London, etc."
      await expect(page.locator('input[placeholder*="JFK, London"]')).toBeVisible();
      
      // Departure date input
      await expect(page.locator('input[type="date"]').first()).toBeVisible();
      
      // Adults selector
      await expect(page.locator('select').first()).toBeVisible();
      
      // Search button
      await expect(page.locator('button[type="submit"]:has-text("Search Flights")')).toBeVisible();
      
      // Verify form labels are present
      await expect(page.locator('text=From (Origin)')).toBeVisible();
      await expect(page.locator('text=To (Destination)')).toBeVisible();
      await expect(page.locator('text=Departure Date')).toBeVisible();
      await expect(page.locator('text=Adults')).toBeVisible();
      
      // Verify test page header
      await expect(page.locator('text=Test Flight Booking')).toBeVisible();
    });

    test('should validate search form inputs', async ({ page }) => {
      await page.goto(`${TEST_BASE_URL}/test-booking`);
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=Origin is required')).toBeVisible();
      await expect(page.locator('text=Destination is required')).toBeVisible();
    });

    extendedTest('should perform flight search and display results', async ({ authenticatedPage }) => {
      // Mock flight search API
      await authenticatedPage.route('**/functions/v1/**flight**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 'flight-123',
                price: {
                  total: '299.99',
                  currency: 'USD',
                },
                itineraries: [
                  {
                    duration: 'PT5H30M',
                    segments: [
                      {
                        departure: {
                          iataCode: 'LAX',
                          at: '2024-03-15T10:00:00',
                        },
                        arrival: {
                          iataCode: 'JFK',
                          at: '2024-03-15T15:30:00',
                        },
                        carrierCode: 'AA',
                        number: '1234',
                      },
                    ],
                  },
                ],
                validatingAirlineCodes: ['AA'],
                provider: 'amadeus',
              },
            ],
            meta: { count: 1 },
          }),
        });
      });

      await authenticatedPage.goto(`${TEST_BASE_URL}/booking`);
      
      // Fill in search form
      await authenticatedPage.fill('input[placeholder*="LAX"]', testSearchData.origin);
      await authenticatedPage.fill('input[placeholder*="JFK"]', testSearchData.destination);
      await authenticatedPage.fill('input[type="date"]', testSearchData.departureDate);
      
      // Submit search
      await authenticatedPage.click('button[type="submit"]');
      
      // Wait for results
      await expect(authenticatedPage.locator('text=Flight Results')).toBeVisible({ timeout: TEST_TIMEOUT });
      await expect(authenticatedPage.locator('text=LAX → JFK')).toBeVisible();
      await expect(authenticatedPage.locator('text=$299.99')).toBeVisible();
      await expect(authenticatedPage.locator('text=AMADEUS')).toBeVisible();
    });

    extendedTest('should handle flight search errors gracefully', async ({ authenticatedPage }) => {
      // Mock flight search API error
      await authenticatedPage.route('**/functions/v1/**flight**', route => {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'No flights found for the selected criteria',
          }),
        });
      });

      await authenticatedPage.goto(`${TEST_BASE_URL}/booking`);
      
      // Fill in search form
      await authenticatedPage.fill('input[placeholder*="LAX"]', 'INVALID');
      await authenticatedPage.fill('input[placeholder*="JFK"]', 'CODE');
      await authenticatedPage.fill('input[type="date"]', testSearchData.departureDate);
      
      // Submit search
      await authenticatedPage.click('button[type="submit"]');
      
      // Should show error message
      await expect(authenticatedPage.locator('text=Search Error')).toBeVisible({ timeout: TEST_TIMEOUT });
      await expect(authenticatedPage.locator('text=No flights found')).toBeVisible();
    });
  });

  test.describe('Complete Booking Flow', () => {
    test('should complete full booking process', async ({ page }) => {
      // Mock all required APIs
      await mockAllAPIs(page);
      
      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Step 1: Search for flights
      await performFlightSearch(page);
      
      // Step 2: Select flight
      await page.click('[data-testid="flight-card"]');
      await expect(page.locator('text=Selected Flight')).toBeVisible();
      await page.click('text=Continue');
      
      // Step 3: Fill passenger information
      await fillPassengerInfo(page);
      await page.click('text=Continue to Payment');
      
      // Step 4: Process payment
      await expect(page.locator('text=Payment')).toBeVisible();
      await expect(page.locator('text=Demo mode')).toBeVisible(); // Test card notice
      await page.click('text=Pay $299.99');
      
      // Step 5: Confirm booking
      await expect(page.locator('text=Booking Confirmed!')).toBeVisible({ timeout: TEST_TIMEOUT });
      await expect(page.locator('text=FB-')).toBeVisible(); // Booking reference
      
      // Verify security notice
      await expect(page.locator('text=Secure booking powered by AWS Secrets Manager & Stripe')).toBeVisible();
    });

    test('should handle payment failures gracefully', async ({ page }) => {
      // Mock APIs with payment failure
      await mockAPIsWithPaymentFailure(page);
      
      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Complete steps up to payment
      await performFlightSearch(page);
      await page.click('[data-testid="flight-card"]');
      await page.click('text=Continue');
      await fillPassengerInfo(page);
      await page.click('text=Continue to Payment');
      
      // Try to process payment
      await page.click('text=Pay $299.99');
      
      // Should show payment error
      await expect(page.locator('text=Payment processing failed')).toBeVisible({ timeout: TEST_TIMEOUT });
    });

    test('should validate passenger information', async ({ page }) => {
      await mockAllAPIs(page);
      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Complete flight search and selection
      await performFlightSearch(page);
      await page.click('[data-testid="flight-card"]');
      await page.click('text=Continue');
      
      // Try to continue without filling passenger info
      await page.click('text=Continue to Payment');
      
      // Should show validation errors
      await expect(page.locator('text=First name is required')).toBeVisible();
      await expect(page.locator('text=Last name is required')).toBeVisible();
      await expect(page.locator('text=Date of birth is required')).toBeVisible();
    });

    test('should handle back navigation correctly', async ({ page }) => {
      await mockAllAPIs(page);
      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Complete steps and navigate back
      await performFlightSearch(page);
      await page.click('[data-testid="flight-card"]');
      await expect(page.locator('text=Selected Flight')).toBeVisible();
      
      // Go back to search
      await page.click('text=Back to Search');
      await expect(page.locator('button[type="submit"]:has-text("Search Flights")')).toBeVisible();
      
      // Search again
      await page.click('button[type="submit"]');
      await page.click('[data-testid="flight-card"]');
      await page.click('text=Continue');
      
      // Go back to flight details
      await page.click('text=Back');
      await expect(page.locator('text=Selected Flight')).toBeVisible();
    });
  });

  test.describe('Progressive Enhancement', () => {
    test('should work with JavaScript disabled', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        Object.defineProperty(/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window, 'fetch', {
          value: undefined,
          writable: false,
        });
      });

      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Basic form should still be accessible
      await expect(page.locator('input[placeholder*="LAX"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should handle slow network connections', async ({ page }) => {
      // Throttle network
      await page.route('**/*', route => {
        setTimeout(() => {
          route.continue();
        }, 2000); // 2 second delay
      });

      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Form should still be interactive during loading
      await page.fill('input[placeholder*="LAX"]', testSearchData.origin);
      await expect(page.locator('input[placeholder*="LAX"]')).toHaveValue(testSearchData.origin);
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Tab through form elements
      await page.keyboard.press('Tab'); // Origin input
      await expect(page.locator('input[placeholder*="LAX"]')).toBeFocused();
      
      await page.keyboard.press('Tab'); // Destination input
      await expect(page.locator('input[placeholder*="JFK"]')).toBeFocused();
      
      await page.keyboard.press('Tab'); // Date input
      await expect(page.locator('input[type="date"]')).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Check for proper labels and ARIA attributes
      await expect(page.locator('label:has-text("From (Origin)")')).toBeVisible();
      await expect(page.locator('label:has-text("To (Destination)")')).toBeVisible();
      await expect(page.locator('label:has-text("Departure Date")')).toBeVisible();
      
      // Check for error announcements
      await page.click('button[type="submit"]');
      await expect(page.locator('[role="alert"]:has-text("Origin is required")')).toBeVisible();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${TEST_BASE_URL}/booking`);
      
      // Form should be responsive
      await expect(page.locator('input[placeholder*="LAX"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Elements should not be cut off
      const searchButton = page.locator('button[type="submit"]');
      const boundingBox = await searchButton.boundingBox();
      expect(boundingBox?.x).toBeGreaterThan(0);
      expect(boundingBox?.x! + boundingBox?.width!).toBeLessThan(375);
    });
  });
});

// Helper functions
async function mockAllAPIs(page: Page) {
  // Mock successful flight search
  await page.route('**/functions/v1/**flight**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: 'flight-123',
            price: { total: '299.99', currency: 'USD' },
            itineraries: [
              {
                duration: 'PT5H30M',
                segments: [
                  {
                    departure: { iataCode: 'LAX', at: '2024-03-15T10:00:00' },
                    arrival: { iataCode: 'JFK', at: '2024-03-15T15:30:00' },
                    carrierCode: 'AA',
                    number: '1234',
                  },
                ],
              },
            ],
            validatingAirlineCodes: ['AA'],
            provider: 'amadeus',
          },
        ],
        meta: { count: 1 },
      }),
    });
  });

  // Mock successful payment
  await page.route('**/functions/v1/**payment**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        clientSecret: 'pi_mock_client_secret',
        paymentIntent: {
          id: 'pi_mock_payment_intent',
          status: 'succeeded',
        },
      }),
    });
  });

  // Mock user authentication
  await page.route('**/auth/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          id: 'test-user-id',
          email: testUser.email,
          full_name: `${testUser.firstName} ${testUser.lastName}`,
        },
      }),
    });
  });
}

async function mockAPIsWithPaymentFailure(page: Page) {
  // Mock successful flight search
  await mockAllAPIs(page);
  
  // Override payment mock with failure
  await page.route('**/functions/v1/**payment**', route => {
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: 'Payment processing failed',
      }),
    });
  });
}

async function performFlightSearch(page: Page) {
  await page.fill('input[placeholder*="LAX"]', testSearchData.origin);
  await page.fill('input[placeholder*="JFK"]', testSearchData.destination);
  await page.fill('input[type="date"]', testSearchData.departureDate);
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Flight Results')).toBeVisible({ timeout: TEST_TIMEOUT });
}

async function fillPassengerInfo(page: Page) {
  await page.fill('input[placeholder*="First"]', testUser.firstName);
  await page.fill('input[placeholder*="Last"]', testUser.lastName);
  await page.fill('input[type="date"]', testUser.dateOfBirth);
  await page.fill('input[type="email"]', testUser.email);
  await page.fill('input[type="tel"]', testUser.phone);
}
