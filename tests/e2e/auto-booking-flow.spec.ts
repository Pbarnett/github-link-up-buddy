import { test, expect } from '@playwright/test';

test.describe('Auto Booking E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up environment variables for testing
    await page.addInitScript(() => {
      window.ENV = {
        AUTO_BOOKING_PIPELINE_ENABLED: 'true',
        STRIPE_PUBLISHABLE_KEY: 'pk_test_mock_key_for_testing',
        DUFFEL_API_TOKEN: 'test_token',
        SUPABASE_URL: 'http://localhost:54321',
        SUPABASE_ANON_KEY: 'test_anon_key'
      };
    });

    // Mock external services
    await page.route('**/duffel-search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'test-offer-1',
              total_amount: '299.99',
              total_currency: 'USD',
              slices: [
                {
                  segments: [
                    {
                      origin: { iata_code: 'LAX' },
                      destination: { iata_code: 'JFK' },
                      departure_at: '2025-08-01T10:00:00Z',
                      arrival_at: '2025-08-01T18:00:00Z',
                      duration: 'PT8H',
                      marketing_carrier: { iata_code: 'AA' }
                    }
                  ]
                }
              ]
            }
          ],
          meta: { count: 1 }
        })
      });
    });

    await page.route('**/stripe/payment_intents', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'pi_test_123',
          client_secret: 'pi_test_123_secret_test',
          status: 'requires_confirmation'
        })
      });
    });

    await page.route('**/resend/emails', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'email_test_123',
          to: ['test@example.com']
        })
      });
    });
  });

  test('should complete basic flight search form', async ({ page }) => {
    // Navigate to the test booking page
    await page.goto('/test-booking');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for the form elements to be available
    await page.waitForSelector('input[placeholder*="LAX"]', { timeout: 15000 });

    // Fill out flight search form
    await page.fill('input[placeholder*="LAX"]', 'LAX');
    await page.fill('input[placeholder*="JFK"]', 'JFK');
    
    // Set departure date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', tomorrowStr);

    // Set up dialog handler before clicking submit
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Flight search completed');
      dialog.accept();
    });

    // Submit search
    await page.click('button[type="submit"]');

    // Wait a bit for the alert to appear and be handled
    await page.waitForTimeout(3000);
  });

  test('should handle auto-booking failure gracefully', async ({ page }) => {
    // Mock a Duffel API failure
    await page.route('**/duffel/orders', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ message: 'Offer expired' }]
        })
      });
    });

    await page.goto('/test-booking');

    // Complete search and selection flow
    await page.fill('input[placeholder*="LAX"]', 'LAX');
    await page.fill('input[placeholder*="JFK"]', 'JFK');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', tomorrowStr);

    await page.check('input[name="auto_book_enabled"]');
    await page.fill('input[name="max_price"]', '500');
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-testid="flight-offers"]')).toBeVisible();
    await page.click('[data-testid="select-offer-0"]');

    // Fill required information
    await page.fill('input[name="passenger_name"]', 'John Doe');
    await page.fill('input[name="passenger_email"]', 'john.doe@example.com');
    await page.fill('input[name="card_number"]', '4242424242424242');
    await page.fill('input[name="card_expiry"]', '12/25');
    await page.fill('input[name="card_cvc"]', '123');

    await page.click('button[data-testid="confirm-booking"]');

    // Verify error handling
    await expect(page.locator('[data-testid="booking-error"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="booking-error"]')).toContainText('booking failed');

    // Verify refund is initiated
    await expect(page.locator('[data-testid="refund-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="refund-status"]')).toContainText('refund');
  });

  test('should respect auto-booking disabled flag', async ({ page }) => {
    // Override auto-booking flag to be false
    await page.addInitScript(() => {
      window.ENV.AUTO_BOOKING_PIPELINE_ENABLED = 'false';
    });

    await page.goto('/test-booking');

    // Auto-booking checkbox should not be available or should be disabled
    const autoBookCheckbox = page.locator('input[name="auto_book_enabled"]');
    await expect(autoBookCheckbox).not.toBeVisible();
  });

  test('should validate offer expiry before booking', async ({ page }) => {
    // Mock an expired offer
    await page.route('**/duffel-search', async route => {
      const expiredDate = new Date();
      expiredDate.setMinutes(expiredDate.getMinutes() - 1); // 1 minute ago
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'expired-offer-1',
              total_amount: '299.99',
              total_currency: 'USD',
              expires_at: expiredDate.toISOString(),
              slices: [
                {
                  segments: [
                    {
                      origin: { iata_code: 'LAX' },
                      destination: { iata_code: 'JFK' },
                      departure_at: '2025-08-01T10:00:00Z',
                      arrival_at: '2025-08-01T18:00:00Z'
                    }
                  ]
                }
              ]
            }
          ],
          meta: { count: 1 }
        })
      });
    });

    await page.goto('/test-booking');

    // Complete search flow
    await page.fill('input[placeholder*="LAX"]', 'LAX');
    await page.fill('input[placeholder*="JFK"]', 'JFK');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', tomorrowStr);

    await page.click('button[type="submit"]');

    // Attempt to select expired offer
    await expect(page.locator('[data-testid="flight-offers"]')).toBeVisible();
    await page.click('[data-testid="select-offer-0"]');

    // Should show expiry error
    await expect(page.locator('[data-testid="offer-expired"]')).toBeVisible();
    await expect(page.locator('[data-testid="offer-expired"]')).toContainText('expired');
  });

  test('should track booking metrics', async ({ page }) => {
    let metricsRequests: any[] = [];
    
    // Intercept metrics calls
    await page.route('**/metrics', async route => {
      const request = route.request();
      const body = await request.postData();
      metricsRequests.push({ url: request.url(), body });
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'recorded' })
      });
    });

    await page.goto('/test-booking');

    // Complete successful booking flow
    await page.fill('input[placeholder*="LAX"]', 'LAX');
    await page.fill('input[placeholder*="JFK"]', 'JFK');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('input[type="date"]', tomorrow.toISOString().split('T')[0]);

    await page.check('input[name="auto_book_enabled"]');
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-testid="flight-offers"]')).toBeVisible();
    await page.click('[data-testid="select-offer-0"]');

    await page.fill('input[name="passenger_name"]', 'John Doe');
    await page.fill('input[name="passenger_email"]', 'john.doe@example.com');
    await page.fill('input[name="card_number"]', '4242424242424242');
    await page.fill('input[name="card_expiry"]', '12/25');
    await page.fill('input[name="card_cvc"]', '123');

    await page.click('button[data-testid="confirm-booking"]');
    await expect(page.locator('[data-testid="booking-confirmed"]')).toBeVisible();

    // Verify metrics were recorded
    expect(metricsRequests.length).toBeGreaterThan(0);
    
    const successMetric = metricsRequests.find(req => 
      req.body?.includes('auto_booking_success_total')
    );
    expect(successMetric).toBeTruthy();
  });
});
