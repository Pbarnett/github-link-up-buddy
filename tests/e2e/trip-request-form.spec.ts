import { test, expect } from '@playwright/test';

test.describe.skip('TripRequestForm E2E', () => {
  // TODO(e2e-refresh): Replace legacy /trip-request and /trip/new flows with current routes
  // and add stable data-testid selectors.
  test.beforeEach(async ({ page }) => {
    // Navigate to trip request form
    await page.goto('/');
    
    // Look for sign in/up first
    const signinButton = page.getByRole('button', { name: /sign in|login/i }).first();
    if (await signinButton.isVisible()) {
      await signinButton.click();
      // Fill in test credentials if needed
      const emailInput = page.getByRole('textbox', { name: /email/i });
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        const passwordInput = page.getByLabel(/password/i);
        await passwordInput.fill('test123');
        await page.getByRole('button', { name: /sign in/i }).click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Navigate to trip request
    await page.goto('/trip/new');
    await page.waitForLoadState('networkidle');
  });

  test('TripRequestForm renders correctly', async ({ page }) => {
    // Verify form is rendered
    await expect(page.locator('form')).toBeVisible();
    
    // Check for key form elements
    await expect(page.getByText(/destination/i)).toBeVisible();
    await expect(page.getByText(/departure/i)).toBeVisible();
    await expect(page.getByText(/date/i)).toBeVisible();
    
    // Verify submit button exists
    const submitButton = page.getByTestId('primary-submit-button');
    if (await submitButton.isVisible()) {
      await expect(submitButton).toBeVisible();
    } else {
      // Alternative: look for button with submit text
      await expect(page.getByRole('button', { name: /search|submit/i })).toBeVisible();
    }
  });

  test('TripRequestForm validates required fields', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.getByTestId('primary-submit-button').or(
      page.getByRole('button', { name: /search|submit/i })
    );
    
    await submitButton.click();
    
    // Should show validation errors
    await expect(page.locator('[role="alert"]').or(page.locator('.error')).or(page.getByText(/required/i))).toBeVisible();
  });

  test('TripRequestForm accepts valid input and submits', async ({ page }) => {
    // Fill destination
    const destInput = page.getByRole('combobox', { name: /destination/i }).or(
      page.getByRole('textbox', { name: /destination/i })
    ).or(
      page.locator('input[name*="destination"]')
    ).first();
    
    if (await destInput.isVisible()) {
      await destInput.fill('LAX');
      await page.keyboard.press('Tab');
    }
    
    // Fill departure airport (try NYC airports checkbox or other input)
    const nycCheckbox = page.getByRole('checkbox', { name: /JFK|LGA|EWR/i }).first();
    if (await nycCheckbox.isVisible()) {
      await nycCheckbox.check();
    } else {
      const departureInput = page.getByRole('textbox', { name: /departure|from/i }).or(
        page.locator('input[name*="departure"]')
      ).first();
      if (await departureInput.isVisible()) {
        await departureInput.fill('JFK');
      }
    }
    
    // Fill dates if visible
    const dateInputs = page.locator('input[type="date"]');
    const dateCount = await dateInputs.count();
    
    if (dateCount > 0) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const dateString = futureDate.toISOString().split('T')[0];
      
      await dateInputs.first().fill(dateString);
      
      if (dateCount > 1) {
        const laterDate = new Date();
        laterDate.setDate(laterDate.getDate() + 37);
        const laterDateString = laterDate.toISOString().split('T')[0];
        await dateInputs.nth(1).fill(laterDateString);
      }
    }
    
    // Set budget if visible
    const budgetInput = page.locator('input[name*="price"], input[name*="budget"]').first();
    if (await budgetInput.isVisible()) {
      await budgetInput.fill('1000');
    }
    
    // Submit form
    const submitButton = page.getByTestId('primary-submit-button').or(
      page.getByRole('button', { name: /search|submit/i })
    );
    
    await submitButton.click();
    
    // Wait for navigation or success message
    await page.waitForLoadState('networkidle');
    
    // Should either navigate to results page or show success message
    const hasNavigated = page.url().includes('/offers') || page.url().includes('/results');
    const hasSuccessMessage = await page.getByText(/success|created|submitted/i).isVisible();
    
    expect(hasNavigated || hasSuccessMessage).toBeTruthy();
  });

  test('TripRequestForm config-driven version loads defaults correctly', async ({ page }) => {
    // Check if the form has config-driven indicator
    const configIndicator = page.getByText(/config-driven|business rules/i);
    
    if (await configIndicator.isVisible()) {
      // Verify default values are set
      const nonstopCheckbox = page.getByRole('checkbox', { name: /nonstop/i });
      if (await nonstopCheckbox.isVisible()) {
        await expect(nonstopCheckbox).toBeChecked();
      }
      
      // Check that budget has a default value
      const budgetInput = page.locator('input[name*="price"], input[name*="budget"]').first();
      if (await budgetInput.isVisible()) {
        const value = await budgetInput.inputValue();
        expect(parseInt(value) || 0).toBeGreaterThan(0);
      }
    }
  });
});
