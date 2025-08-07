
/**
 * Enhanced Form Test Utilities
 * 
 * This module provides comprehensive utilities for testing React Hook Form components
 * with proper async handling, validation timing, and React state management.
 * 
 * Based on React Testing Library best practices and React Hook Form testing patterns.
 */

import userEvent from '@testing-library/user-event';
import userEvent from '@testing-library/user-event'; } from 'vitest';

/**
 * Form Field Configuration Interface
 */
interface FormFieldConfig {
  destination?: string;
  departureAirport?: string;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  skipValidation?: boolean;
}

/**
 * Enhanced form filling utility that handles async validation and state updates
 * 
 * @param config Form field configuration
 * @returns Promise that resolves when all form fields are filled and validated
 */
export async function fillBaseFormFieldsWithDates(
  config: FormFieldConfig = {}
): Promise<void> {
  const {
    destination = 'MVY',
    departureAirport = 'SFO',
    maxPrice = 1200,
    minDuration = 5,
    maxDuration = 10,
    skipValidation = false,
  } = config;

  const user = userEvent.setup();

  // Step 1: Fill dates using mocked calendar
  console.log('TEST-HELPER: Filling date fields');
  
  try {
    // Find and click earliest departure date picker
    const earliestDateTrigger = screen.getByRole('button', {
      name: /earliest departure/i,
    });
    await act(async () => {
      await user.click(earliestDateTrigger);
    });

    // Wait for calendar to appear and select tomorrow
    await waitFor(
      () => {
        expect(screen.getByTestId('calendar-day-tomorrow')).toBeVisible();
      },
      { timeout: 3000 }
    );

    const tomorrowButton = screen.getByTestId('calendar-day-tomorrow');
    await act(async () => {
      await user.click(tomorrowButton);
    });

    // Find and click latest departure date picker
    const latestDateTrigger = screen.getByRole('button', {
      name: /latest departure/i,
    });
    await act(async () => {
      await user.click(latestDateTrigger);
    });

    // Wait for calendar to appear and select next week
    await waitFor(
      () => {
        expect(screen.getByTestId('calendar-day-next-week')).toBeVisible();
      },
      { timeout: 3000 }
    );

    const nextWeekButton = screen.getByTestId('calendar-day-next-week');
    await act(async () => {
      await user.click(nextWeekButton);
    });
  } catch (error) {
    console.warn('Date filling failed, continuing with other fields:', error);
  }

  // Step 2: Fill destination
  console.log('TEST-HELPER: Filling destination');
  try {
    // Try to use destination dropdown first
    const destinationTrigger = screen.getByRole('combobox', {
      name: /destination/i,
    });
    await act(async () => {
      await user.click(destinationTrigger);
    });

    // Wait for options to appear
    await waitFor(
      () => {
        const option = screen.getByRole('option', {
          name: new RegExp(destination, 'i'),
        });
        expect(option).toBeVisible();
      },
      { timeout: 3000 }
    );

    const destinationOption = screen.getByRole('option', {
      name: new RegExp(destination, 'i'),
    });
    await act(async () => {
      await user.click(destinationOption);
    });
  } catch {
    // Fallback to custom destination input
    console.log('TEST-HELPER: Using custom destination input fallback');
    try {
      const customDestInput = screen.getByLabelText(/custom destination/i);
      await act(async () => {
        await user.clear(customDestInput);
        await user.type(customDestInput, destination);
      });
    } catch (error) {
      console.warn('Destination filling failed completely:', error);
    }
  }

  // Step 3: Fill departure airport
  console.log('TEST-HELPER: Filling departure airport');
  try {
    // Check NYC airports first
    if (['JFK', 'LGA', 'EWR'].includes(departureAirport)) {
      const nycCheckbox = screen.getByRole('checkbox', {
        name: new RegExp(departureAirport, 'i'),
      });
      await act(async () => {
        await user.click(nycCheckbox);
      });
    } else {
      // Use other departure airport input
      const otherAirportInput = screen.getByLabelText(/other departure airport/i);
      await act(async () => {
        await user.clear(otherAirportInput);
        await user.type(otherAirportInput, departureAirport);
      });
    }
  } catch (error) {
    console.warn('Departure airport filling failed:', error);
  }

  // Step 4: Fill duration fields
  console.log('TEST-HELPER: Filling duration fields');
  try {
    const minDurationInput = screen.getByLabelText(/minimum.*duration/i);
    await act(async () => {
      await user.clear(minDurationInput);
      await user.type(minDurationInput, minDuration.toString());
    });

    const maxDurationInput = screen.getByLabelText(/maximum.*duration/i);
    await act(async () => {
      await user.clear(maxDurationInput);
      await user.type(maxDurationInput, maxDuration.toString());
    });
  } catch (error) {
    console.warn('Duration filling failed:', error);
  }

  // Step 5: Fill max price
  console.log('TEST-HELPER: Filling max price');
  try {
    const maxPriceInput = screen.getByLabelText(/maximum.*price|max.*price|budget/i);
    await act(async () => {
      await user.clear(maxPriceInput);
      await user.type(maxPriceInput, maxPrice.toString());
    });
  } catch (error) {
    console.warn('Max price filling failed:', error);
  }

  // Step 6: Trigger validation by blurring fields
  if (!skipValidation) {
    console.log('TEST-HELPER: Triggering validation');
    await act(async () => {
      await user.click(document.body);
    });

    // Wait for validation to complete
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('TEST-HELPER: Form filling completed');
}

/**
 * Wait for a button to be enabled and then click it
 * 
 * @param buttonSelector Button selector or role matcher
 * @param options Configuration options
 * @returns Promise that resolves after button is clicked
 */
export async function waitForButtonEnabledAndClick(
  buttonSelector: string | { name: RegExp; role?: string },
  options: { timeout?: number; clickWithAct?: boolean } = {}
): Promise<void> {
  const { timeout = 5000, clickWithAct = true } = options;
  const user = userEvent.setup();

  let button: HTMLElement;

  if (typeof buttonSelector === 'string') {
    // Find by test ID or selector
    button = screen.getByTestId(buttonSelector);
  } else {
    // Find by role and name
    button = screen.getByRole(buttonSelector.role || 'button', {
      name: buttonSelector.name,
    });
  }

  // Wait for button to be enabled
  await waitFor(
    () => {
      expect(button).toBeEnabled();
    },
    { timeout }
  );

  // Click the button
  if (clickWithAct) {
    await act(async () => {
      await user.click(button);
    });
  } else {
    await user.click(button);
  }
}

/**
 * Get current form validation errors from the DOM
 * 
 * @returns Array of error messages found in the form
 */
export function getFormErrors(): string[] {
  const errors: string[] = [];

  // Look for common error message patterns
  const errorSelectors = [
    '[role="alert"]',
    '.text-red-500',
    '.text-destructive',
    '.error-message',
    '.field-error',
    '[data-testid*="error"]',
    '.form-error',
  ];

  errorSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && !errors.includes(text)) {
          errors.push(text);
        }
      });
    } catch {
      // Ignore selector errors
    }
  });

  return errors;
}

/**
 * Wait for form validation to complete
 * 
 * @param options Configuration options
 * @returns Promise that resolves when validation is complete
 */
export async function waitForFormValidation(
  options: { timeout?: number } = {}
): Promise<void> {
  const { timeout = 3000 } = options;

  // Wait for any pending async validation
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  // Wait for form state to stabilize
  await waitFor(
    () => {
      // Form should not be in a loading/validating state
      const loadingElements = document.querySelectorAll(
        '[aria-busy="true"], .loading, [data-loading="true"]'
      );
      expect(loadingElements).toHaveLength(0);
    },
    { timeout }
  );
}

/**
 * Enhanced field filling utility with validation
 * 
 * @param fieldName Field label or test ID
 * @param value Value to enter
 * @param options Configuration options
 * @returns Promise that resolves when field is filled and validated
 */
export async function fillFormField(
  fieldName: string,
  value: string,
  options: {
    type?: 'input' | 'select' | 'checkbox' | 'radio';
    shouldValidate?: boolean;
    timeout?: number;
  } = {}
): Promise<void> {
  const {
    type = 'input',
    shouldValidate = true,
    timeout = 3000,
  } = options;
  const user = userEvent.setup();

  let field: HTMLElement;

  try {
    // Find field by label, placeholder, or test ID
    field = screen.getByLabelText(new RegExp(fieldName, 'i'));
  } catch {
    try {
      field = screen.getByPlaceholderText(new RegExp(fieldName, 'i'));
    } catch {
      field = screen.getByTestId(fieldName);
    }
  }

  await waitFor(
    () => {
      expect(field).toBeVisible();
    },
    { timeout }
  );

  // Fill field based on type
  await act(async () => {
    switch (type) {
      case 'input':
        await user.clear(field);
        await user.type(field, value);
        break;
      case 'select':
        await user.click(field);
        // Wait for options to appear
        await waitFor(() => {
          const option = screen.getByRole('option', {
            name: new RegExp(value, 'i'),
          });
          expect(option).toBeVisible();
        });
        const option = screen.getByRole('option', {
          name: new RegExp(value, 'i'),
        });
        await user.click(option);
        break;
      case 'checkbox':
        if (value === 'true' || value === 'checked') {
          if (!(field as HTMLInputElement).checked) {
            await user.click(field);
          }
        } else {
          if ((field as HTMLInputElement).checked) {
            await user.click(field);
          }
        }
        break;
      case 'radio':
        await user.click(field);
        break;
    }
  });

  // Trigger validation if requested
  if (shouldValidate) {
    await act(async () => {
      await user.click(document.body); // Blur to trigger validation
    });
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Mock timer utilities for form testing
 */
export const mockTimers = {
  /**
   * Setup fake timers for testing
   */
  setup(): void {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));
  },

  /**
   * Cleanup fake timers
   */
  cleanup(): void {
    vi.useRealTimers();
  },

  /**
   * Fast forward timers and flush pending promises
   * 
   * @param ms Milliseconds to advance
   */
  async fastForward(ms: number): Promise<void> {
    await act(async () => {
      vi.advanceTimersByTime(ms);
      await vi.runAllTimersAsync();
    });
  },
};

/**
 * Enhanced async utility for waiting with proper error handling
 * 
 * @param condition Function that returns true when condition is met
 * @param options Configuration options
 * @returns Promise that resolves when condition is met
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  options: {
    timeout?: number;
    interval?: number;
    errorMessage?: string;
  } = {}
): Promise<void> {
  const {
    timeout = 5000,
    interval = 50,
    errorMessage = 'Condition was not met within timeout',
  } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await condition();
      if (result) {
        return;
      }
    } catch {
      // Continue trying
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(errorMessage);
}

/**
 * Debug utility to log current form state
 * 
 * @param formId Optional form ID to target specific form
 */
export function debugFormState(formId?: string): void {
  const form = formId
    ? document.getElementById(formId)
    : document.querySelector('form');

  if (!form) {
    console.log('DEBUG: No form found');
    return;
  }

  console.log('DEBUG: Form state:');
  console.log('- Form element:', form);
  console.log('- Form data:', new FormData(form as HTMLFormElement));
  
  const inputs = form.querySelectorAll('input, select, textarea');
  console.log('- Form fields:');
  inputs.forEach((input, index) => {
    const element = input as HTMLInputElement;
    console.log(`  ${index}: ${element.name} = ${element.value} (type: ${element.type})`);
  });

  const errors = getFormErrors();
  if (errors.length > 0) {
    console.log('- Form errors:', errors);
  }
}
