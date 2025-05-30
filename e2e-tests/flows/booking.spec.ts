import { test as base, expect, Page } from '@playwright/test';

// Define a custom fixture for authentication
type TestFixtures = {
  authenticatedPage: Page;
};

// Extend the base test with our custom fixture
const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Simulate a login process
    await page.goto('/login');
    
    // This would be your actual login form - modify as needed
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete - adjust the selector to your app
    await page.waitForSelector('.user-avatar', { state: 'visible' });
    
    // Use the authenticated page in the test
    await use(page);
  },
});

// Test the full booking flow
test('should complete the booking flow successfully', async ({ authenticatedPage: page }) => {
  // 1. Navigate to the trip request page
  await page.goto('/trip/request');
  
  // Fill out the trip request form
  await page.fill('input[name="destination"]', 'New York');
  await page.fill('input[name="departure_date"]', '2024-12-01');
  await page.fill('input[name="return_date"]', '2024-12-05');
  await page.selectOption('select[name="adults"]', '1');
  
  // Submit the form
  await page.click('button:has-text("Find Flights")');
  
  // Assert we've navigated to the offers page
  await expect(page).toHaveURL(/\/trip\/offers/, { timeout: 10000 });
  
  // Wait for offers to load
  await page.waitForSelector('.trip-offer-card', { state: 'visible', timeout: 15000 });
  
  // 2. Select an offer
  await page.locator('.trip-offer-card .select-offer-button').first().click();
  
  // Assert navigation to the confirmation page
  await expect(page).toHaveURL(/\/trip\/confirm\?id=.+&airline=.+/, { timeout: 10000 });
  
  // 3. Set up route interception for booking request
  const fakeCheckoutUrl = '/fake-checkout-page?session_id=fake_session_123&booking_request_id=br_fake_e2e_123';
  await page.route('**/functions/v1/create-booking-request', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: { url: fakeCheckoutUrl, data: { success: true } },
    });
  });
  
  // Ensure we're on the confirmation page
  await expect(page.locator('h1:has-text("Confirm Your Flight")')).toBeVisible();
  
  // Click the Pay & Book button
  await Promise.all([
    page.waitForResponse('**/functions/v1/create-booking-request'),
    page.click('button:has-text("Pay & Book")')
  ]);
  
  // In a real app, this might redirect to Stripe. For the test, we'll
  // intercept the window.location.href change by evaluating in the page context
  const redirectUrl = await page.evaluate(() => {
    return document.querySelector('[data-testid="redirect-url"]')?.textContent || '';
  });
  
  expect(redirectUrl).toContain(fakeCheckoutUrl);
  
  // 4. Simulate the return from payment processor
  await page.goto('/trip/confirm?session_id=fake_session_123');
  
  // 5. Mock the process-booking function response
  await page.route('**/functions/v1/process-booking', async route => {
    await route.fulfill({ 
      status: 200, 
      json: { success: true } 
    });
  });
  
  // Assert the processing state is shown
  await expect(page.locator('text=Processing payment...')).toBeVisible({ timeout: 5000 });
  
  // Mock a Supabase realtime update to simulate booking confirmation
  await page.evaluate(() => {
    // This would normally come from Supabase realtime
    window.dispatchEvent(new CustomEvent('booking-status-update', { 
      detail: { status: 'done' }
    }));
  });
  
  // Assert successful booking message appears
  await expect(page.locator('text=✅ Your flight is booked!')).toBeVisible({ timeout: 10000 });
  
  // Wait for and verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
});
