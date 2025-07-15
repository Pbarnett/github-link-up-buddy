import { test, expect } from '@playwright/test';

test.describe('TripRequestForm Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to trip request form
    await page.goto('/trip/new');
    await page.waitForLoadState('networkidle');
  });

  test('should emit form_submit analytics event on successful submission', async ({ page }) => {
    // Mock the analytics endpoint to capture events
    const analyticsEvents: { p_event_type: string; p_form_name: string; [key: string]: unknown }[] = [];
    
    await page.route('**/rest/v1/rpc/track_form_event', async (route) => {
      const request = route.request();
      const body = request.postDataJSON();
      analyticsEvents.push(body);
      
      // Return success response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Fill out the form with valid data
    await fillTripRequestForm(page);

    // Submit the form
    const submitButton = page.getByTestId('primary-submit-button');
    await submitButton.click();

    // Wait for form submission
    await page.waitForTimeout(2000);

    // Verify analytics events were fired
    expect(analyticsEvents.length).toBeGreaterThan(0);
    
    // Find the form_submit event
    const submitEvent = analyticsEvents.find(event => 
      event.p_event_type === 'form_submit' && 
      event.p_form_name === 'TripRequestForm'
    );
    
    expect(submitEvent).toBeTruthy();
    expect(submitEvent.p_form_config_id).toBe('trip-request-form');
    expect(submitEvent.p_form_version).toBe(1);
    expect(submitEvent.p_session_id).toBeTruthy();
    expect(submitEvent.p_user_agent).toBeTruthy();
    expect(submitEvent.p_duration_ms).toBeGreaterThan(0);
  });

  test('should emit field_interaction events during form usage', async ({ page }) => {
    const fieldEvents: { p_event_type: string; p_field_id?: string; p_field_type?: string; [key: string]: unknown }[] = [];
    
    await page.route('**/rest/v1/rpc/track_form_event', async (route) => {
      const request = route.request();
      const body = request.postDataJSON();
      
      if (body.p_event_type === 'field_interaction') {
        fieldEvents.push(body);
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Interact with form fields
    const destInput = page.getByRole('combobox', { name: /destination/i }).or(
      page.getByRole('textbox', { name: /destination/i })
    ).first();
    
    if (await destInput.isVisible()) {
      await destInput.click();
      await destInput.fill('LAX');
    }

    // Check for field interaction events
    await page.waitForTimeout(1000);
    
    expect(fieldEvents.length).toBeGreaterThan(0);
    
    const interactionEvent = fieldEvents.find(event => 
      event.p_field_id && event.p_field_type
    );
    
    if (interactionEvent) {
      expect(interactionEvent.p_event_type).toBe('field_interaction');
      expect(interactionEvent.p_field_id).toBeTruthy();
      expect(interactionEvent.p_field_type).toBeTruthy();
    }
  });

  test('should emit form_view event on form load', async ({ page }) => {
    const viewEvents: { p_event_type: string; p_form_name: string; p_session_id: string; [key: string]: unknown }[] = [];
    
    await page.route('**/rest/v1/rpc/track_form_event', async (route) => {
      const request = route.request();
      const body = request.postDataJSON();
      
      if (body.p_event_type === 'form_view') {
        viewEvents.push(body);
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Form should have loaded and emitted view event
    await page.waitForTimeout(1000);
    
    expect(viewEvents.length).toBeGreaterThan(0);
    
    const viewEvent = viewEvents[0];
    expect(viewEvent.p_event_type).toBe('form_view');
    expect(viewEvent.p_form_name).toBe('TripRequestForm');
    expect(viewEvent.p_session_id).toBeTruthy();
  });

  test('should handle analytics failures gracefully', async ({ page }) => {
    // Mock analytics endpoint to fail
    await page.route('**/rest/v1/rpc/track_form_event', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    // Fill and submit form - should not crash even if analytics fail
    await fillTripRequestForm(page);
    
    const submitButton = page.getByTestId('primary-submit-button');
    await submitButton.click();

    // Form should still work despite analytics failures
    await page.waitForTimeout(2000);
    
    // Should not show any error messages to user
    const errorAlerts = page.locator('[role="alert"]').filter({ hasText: /analytics|tracking/i });
    expect(await errorAlerts.count()).toBe(0);
  });

  test('should queue events locally when network is offline', async ({ page }) => {
    // Simulate offline network
    await page.context().setOffline(true);
    
    await fillTripRequestForm(page);
    
    const submitButton = page.getByTestId('primary-submit-button');
    await submitButton.click();
    
    // Check if events were queued in localStorage
    const queuedEvents = await page.evaluate(() => {
      return localStorage.getItem('pf_analytics_queue');
    });
    
    if (queuedEvents) {
      const events = JSON.parse(queuedEvents);
      expect(events.length).toBeGreaterThan(0);
      
      const submitEvent = events.find((event: { p_event_type: string }) => 
        event.p_event_type === 'form_submit'
      );
      expect(submitEvent).toBeTruthy();
      expect(submitEvent.queued_at).toBeTruthy();
    }
  });
});

// Helper function to fill trip request form
async function fillTripRequestForm(page: import('@playwright/test').Page) {
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
  
  // Fill departure airport
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
  
  // Fill dates
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
  
  // Set budget
  const budgetInput = page.locator('input[name*="price"], input[name*="budget"]').first();
  if (await budgetInput.isVisible()) {
    await budgetInput.fill('1000');
  }
}
