import { test, expect, testSteps } from '../fixtures/extendedTest';
import { testData, testHelpers } from '../fixtures/testData';

test.describe('Enhanced Trip Request Form', () => {
  test.beforeEach(async ({ page }) => {
    await testSteps.navigateAndWait(page, '/');
    
    // Handle authentication with modern selectors and error handling
    const signinButton = page.getByRole('button', { name: /sign in|login/i }).first();
    if (await signinButton.isVisible()) {
      await test.step('Authenticate user', async () => {
        await signinButton.click();
        
        const emailInput = page.getByRole('textbox', { name: /email/i });
        if (await emailInput.isVisible()) {
          await emailInput.fill(testData.users.testUser.email);
          await page.getByLabel(/password/i).fill(testData.users.testUser.password);
          await page.getByRole('button', { name: /sign in/i }).click();
          await testHelpers.waitForNetworkIdle(page);
        }
      });
    }
    
    // Navigate to search page which actually has the TripRequestForm
    await testSteps.navigateAndWait(page, '/search', 'form, [data-testid="primary-submit-button"]');
  });

  test('form renders with proper accessibility', async ({ page }) => {
    await test.step('Verify form structure and accessibility', async () => {
      // Modern web-first assertions
      await expect(page.getByRole('form').or(page.locator('form'))).toBeVisible();
      
      // Check essential form elements with enhanced selectors
      await expect(page.getByLabel(/destination/i)).toBeVisible();
      await expect(page.getByLabel(/departure|from/i)).toBeVisible();
      await expect(page.getByLabel(/date/i).first()).toBeVisible();
      
      // Verify submit button with multiple selector strategies
      const submitButton = page.getByTestId('primary-submit-button')
        .or(page.getByRole('button', { name: /search|submit/i }));
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();
    });

    await testSteps.verifyAccessibility(page, 'form rendering');
  });

  test('validates required fields with proper error messages', async ({ page }) => {
    await test.step('Submit empty form', async () => {
      const submitButton = page.getByTestId('primary-submit-button')
        .or(page.getByRole('button', { name: /search|submit/i }));
      
      await submitButton.click();
    });

    await test.step('Verify validation errors', async () => {
      // Modern assertion patterns for error messages
      await expect(
        page.getByRole('alert')
          .or(page.locator('[aria-live="assertive"]'))
          .or(page.locator('[aria-live="polite"]'))
          .or(page.getByText(testData.validation.errors.requiredField))
      ).toBeVisible({ timeout: 5000 });

      // Check that error messages have proper ARIA associations
      const errorMessages = page.getByRole('alert');
      const errorCount = await errorMessages.count();

      for (let i = 0; i < errorCount; i++) {
        const errorMessage = errorMessages.nth(i);
        await expect(errorMessage).toContainText(testData.validation.errors.requiredField);
        
        // Verify error is accessible
        const errorId = await errorMessage.getAttribute('id');
        if (errorId) {
          const associatedField = page.locator(`[aria-describedby*="${errorId}"]`);
          expect(await associatedField.count()).toBeGreaterThan(0);
        }
      }
    });
  });

  test('accepts valid input using test data fixtures', async ({ 
    page, 
    flightSearchData
  }) => {
    await test.step('Fill flight search form with test data', async () => {
      // Use modern getBy* selectors consistently
      const originField = page.getByLabel(/departure|from/i)
        .or(page.getByPlaceholder(/from|departure/i))
        .first();
      
      const destinationField = page.getByLabel(/destination|to/i)
        .or(page.getByPlaceholder(/to|destination/i))
        .first();

      // Fill origin
      if (await originField.isVisible()) {
        await originField.fill(flightSearchData.origin);
        await expect(originField).toHaveValue(flightSearchData.origin);
      }

      // Fill destination  
      if (await destinationField.isVisible()) {
        await destinationField.fill(flightSearchData.destination);
        await expect(destinationField).toHaveValue(flightSearchData.destination);
      }

      // Handle date inputs with dynamic dates
      const dateFields = page.getByLabel(/date/i);
      const dateCount = await dateFields.count();

      if (dateCount > 0) {
        await dateFields.first().fill(flightSearchData.dates.departure);
        
        if (dateCount > 1) {
          await dateFields.nth(1).fill(flightSearchData.dates.return);
        }
      }

      // Handle budget field
      const budgetField = page.getByLabel(/budget|price/i)
        .or(page.locator('input[name*="budget"], input[name*="price"]'))
        .first();

      if (await budgetField.isVisible()) {
        await budgetField.fill(flightSearchData.budget.toString());
      }
    });

    await test.step('Submit form and verify success', async () => {
      const submitButton = page.getByTestId('primary-submit-button')
        .or(page.getByRole('button', { name: /search|submit/i }));

      // Enhanced submit with network monitoring
      const [response] = await Promise.all([
        page.waitForResponse(res => 
          res.url().includes('/api/flights') || 
          res.url().includes('/api/search') ||
          res.url().includes('/offers'), 
          { timeout: 15000 }
        ).catch(() => null), // Allow to fail gracefully
        submitButton.click()
      ]);

      await page.waitForLoadState('networkidle');

      // Verify success with multiple possible outcomes
      const hasNavigated = page.url().includes('/offers') || 
                          page.url().includes('/results') ||
                          page.url().includes('/search-results');
      
      const hasSuccessMessage = await page
        .getByText(testData.validation.success.flightSearch)
        .isVisible();

      const hasFlightResults = await page
        .getByTestId('flight-results')
        .or(page.locator('.flight-offer, .search-results'))
        .isVisible();

      expect(
        hasNavigated || hasSuccessMessage || hasFlightResults,
        'Form submission should result in navigation, success message, or results display'
      ).toBeTruthy();

      // Verify API response if available
      if (response && response.status() < 400) {
        console.log('✅ API request successful:', response.status());
      }
    });
  });

  test('handles NYC airports selection properly', async ({ page }) => {
    await test.step('Select NYC airports using modern selectors', async () => {
      // Check for NYC airports checkboxes
      const nycCheckboxes = testData.airports.nyc.map(code => 
        page.getByRole('checkbox', { name: new RegExp(code, 'i') })
      );

      let nycOptionSelected = false;

      for (const checkbox of nycCheckboxes) {
        if (await checkbox.isVisible()) {
          await checkbox.check();
          await expect(checkbox).toBeChecked();
          nycOptionSelected = true;
          break;
        }
      }

      // Alternative: text input for departure airport
      if (!nycOptionSelected) {
        const departureInput = page.getByLabel(/departure|from/i).first();
        if (await departureInput.isVisible()) {
          await departureInput.fill('JFK');
          await expect(departureInput).toHaveValue('JFK');
        }
      }
    });

    await test.step('Verify accessibility of airport selection', async () => {
      const selectedCheckbox = page.getByRole('checkbox', { checked: true }).first();
      if (await selectedCheckbox.isVisible()) {
        await expect(selectedCheckbox).toHaveAccessibleName();
      }
    });
  });

  test('config-driven defaults load correctly', async ({ page }) => {
    await test.step('Check for config-driven indicator', async () => {
      const configIndicator = page.getByText(/config-driven|business rules/i);
      
      if (await configIndicator.isVisible()) {
        console.log('✅ Config-driven form detected');
      } else {
        test.skip('Config-driven form not present');
      }
    });

    await test.step('Verify default values are set', async () => {
      // Check nonstop preference default
      const nonstopCheckbox = page.getByRole('checkbox', { name: /nonstop/i });
      if (await nonstopCheckbox.isVisible()) {
        await expect(nonstopCheckbox).toBeChecked();
      }

      // Verify budget has default value
      const budgetField = page.getByLabel(/budget|price/i).first();
      if (await budgetField.isVisible()) {
        const budgetValue = await budgetField.inputValue();
        expect(parseInt(budgetValue) || 0).toBeGreaterThan(0);
      }
    });
  });

  test('form accessibility compliance - WCAG 2.2 AA', async ({ page }) => {
    await test.step('Verify form labeling', async () => {
      const formControls = page.getByRole('textbox')
        .or(page.getByRole('combobox'))
        .or(page.getByRole('checkbox'))
        .or(page.getByRole('button'));

      const controlCount = await formControls.count();

      for (let i = 0; i < controlCount; i++) {
        const control = formControls.nth(i);
        
        if (await control.isVisible()) {
          // Check for accessible name
          await expect(control).toHaveAccessibleName(/\w+/);
          
          // Check focus indicator
          await control.focus();
          await expect(control).toBeFocused();
          
          // Verify focus is visible (not just programmatic)
          const focusStyle = await control.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              outline: computed.outline,
              boxShadow: computed.boxShadow
            };
          });
          
          const hasFocusIndicator = 
            focusStyle.outline !== 'none' || 
            focusStyle.boxShadow !== 'none';
          
          expect(hasFocusIndicator, 'Control should have visible focus indicator').toBeTruthy();
        }
      }
    });

    await test.step('Verify keyboard navigation', async () => {
      // Test tab order
      await page.keyboard.press('Tab');
      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Tab through several elements to verify logical order
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        focusedElement = page.locator(':focus');
        
        if (await focusedElement.isVisible()) {
          const tagName = await focusedElement.evaluate(el => el.tagName);
          console.log(`Tab ${i + 1}: ${tagName}`);
        }
      }
    });
  });
});
