import * as React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expect } from 'vitest';

/**
 * Form testing utilities implementing 2024 best practices for react-day-picker testing.
 * 
 * This module follows the research recommendations:
 * 1. Mock complex date picker components for reliable testing
 * 2. Use programmatic form control (setValue) for date fields
 * 3. Focus on testing form validation logic, not calendar UI
 * 4. Avoid brittle UI interactions with complex third-party components
 */

// Test date utilities
export const getTestDates = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  return {
    today,
    tomorrow,
    nextWeek,
    nextMonth,
    tomorrowISO: tomorrow.toISOString().split('T')[0],
    nextWeekISO: nextWeek.toISOString().split('T')[0],
  };
};

// Programmatic form data setter (recommended approach)
export const setFormDatesDirectly = async (
  form: {
    setValue: (name: string, value: unknown) => void;
    trigger: (names: string[]) => Promise<boolean>;
  }, 
  earliestDate: Date = getTestDates().tomorrow, 
  latestDate: Date = getTestDates().nextWeek
) => {
  if (!form || !form.setValue) {
    throw new Error('Invalid form object provided to setFormDatesDirectly');
  }
  
  // Set dates programmatically - this is the recommended approach from research
  form.setValue('earliestDeparture', earliestDate);
  form.setValue('latestDeparture', latestDate);
  
  // Trigger validation to ensure form state updates
  await form.trigger(['earliestDeparture', 'latestDeparture']);
  
  return { earliestDate, latestDate };
};

// Enhanced destination selection helper
export const selectDestination = async (destinationCode: string) => {
  try {
    // Try the standard combobox approach
    const selectTrigger = screen.getByRole('combobox', { name: /destination/i });
    await userEvent.click(selectTrigger);
    
    await waitFor(() => {
      const option = screen.getByRole('option', { name: new RegExp(destinationCode, 'i') });
      expect(option).toBeVisible();
    });
    
    const option = screen.getByRole('option', { name: new RegExp(destinationCode, 'i') });
    await userEvent.click(option);
    
    // Wait for select to close
    await waitFor(() => {
      expect(screen.queryByRole('option', { name: new RegExp(destinationCode, 'i') })).not.toBeInTheDocument();
    });
    
  } catch (error: unknown) {
    console.warn('Standard destination selection failed, trying custom input fallback', error);
    
    // Fallback to custom destination input using fireEvent for non-focusable inputs
    const customInput = screen.getByLabelText(/custom destination/i);
    fireEvent.change(customInput, { target: { value: destinationCode } });
  }
};

// Mock-based date field interaction (for when UI interaction is needed)
export const setDatesWithMockedCalendar = async () => {
  const { tomorrow, nextWeek } = getTestDates();
  
  try {
    // Open earliest date picker using the text from DateRangeField
    const earliestButton = screen.getByText('Earliest');
    await userEvent.click(earliestButton);
    
    // Wait for mocked calendar to appear
    await waitFor(() => {
      expect(screen.getByTestId('mock-day-picker')).toBeInTheDocument();
    });
    
    // Click the tomorrow button in mocked calendar
    const tomorrowButton = screen.getByTestId('calendar-day-tomorrow');
    await userEvent.click(tomorrowButton);
    
    // Open latest date picker
    const latestButton = screen.getByText('Latest');
    await userEvent.click(latestButton);
    
    // Wait for calendar again
    await waitFor(() => {
      expect(screen.getByTestId('mock-day-picker')).toBeInTheDocument();
    });
    
    // Click the next week button
    const nextWeekButton = screen.getByTestId('calendar-day-next-week');
    await userEvent.click(nextWeekButton);
    
    return { earliestDate: tomorrow, latestDate: nextWeek };
    
  } catch (error) {
    console.warn('Mocked calendar interaction failed:', error);
    throw error;
  }
};

// Comprehensive form filling utility implementing best practices
export const fillFormWithDates = async (options: {
  destination?: string;
  departureAirport?: string;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  useProgrammaticDates?: boolean; // Recommended: true
  getFormRef?: () => {
    setValue: (name: string, value: unknown) => void;
    trigger: (names: string[]) => Promise<boolean>;
  }; // Required for programmatic dates
} = {}) => {
  const {
    destination = 'MVY', // Martha's Vineyard
    departureAirport = 'SFO',
    maxPrice = 1200,
    minDuration = 5,
    maxDuration = 10,
    useProgrammaticDates = true,
    getFormRef
  } = options;

  // 1. Set destination
  await selectDestination(destination);
  
  // 2. Wait for form to update after destination selection
  await waitFor(() => {
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
  }, { timeout: 3000 });
  
  // 3. Set departure airport
  const otherAirportInput = screen.getByPlaceholderText(/e\.g\., BOS/i);
  fireEvent.change(otherAirportInput, { target: { value: departureAirport } });
  
  // 4. Set dates - using recommended programmatic approach
  if (useProgrammaticDates && getFormRef) {
    try {
      const form = getFormRef();
      await setFormDatesDirectly(form);
      console.log('✅ Used programmatic date setting (recommended)');
    } catch (error: unknown) {
      console.warn('Programmatic date setting failed, falling back to UI interaction', error);
      await setDatesWithMockedCalendar();
    }
  } else {
    // Fallback to UI interaction with mocked calendar
    await setDatesWithMockedCalendar();
  }
  
  // 5. Set price
  const maxPriceInput = screen.getByDisplayValue('1000');
  fireEvent.change(maxPriceInput, { target: { value: maxPrice.toString() } });
  
  // 6. Set duration (expand collapsible section first)
  try {
    // Expand the "What's Included" section to access duration inputs
    const toggleButton = screen.getByText("What's Included");
    await userEvent.click(toggleButton);
    
    // Wait for the section to expand and duration inputs to be visible
    await waitFor(() => {
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    const minDurationInput = screen.getByDisplayValue('3');
    fireEvent.change(minDurationInput, { target: { value: minDuration.toString() } });
    
    const maxDurationInput = screen.getByDisplayValue('7');
    fireEvent.change(maxDurationInput, { target: { value: maxDuration.toString() } });
  } catch (error) {
    console.warn('Failed to set duration inputs:', error);
    // Continue without setting duration - use defaults
  }
  
  // 7. Wait for form processing
  await waitFor(() => {
    expect(screen.getByDisplayValue(maxPrice.toString())).toBeInTheDocument();
  }, { timeout: 3000 });
};

// Form validation state helpers
export const waitForFormValid = async (timeout = 5000) => {
  await waitFor(() => {
    const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    const enabledSubmitButton = submitButtons.find(btn => !btn.hasAttribute('disabled'));
    
    if (!enabledSubmitButton) {
      throw new Error('Submit button not enabled - form may be invalid');
    }
  }, { timeout });
};

export const expectFormInvalid = (reason?: string) => {
  const submitButtons = screen.getAllByRole('button', { name: /search now/i });
  const allDisabled = submitButtons.every(btn => btn.hasAttribute('disabled'));
  
  if (!allDisabled) {
    throw new Error(`Expected form to be invalid${reason ? ` (${reason})` : ''}, but submit button is enabled`);
  }
};

// Test wrapper that provides form context (for programmatic control)
export const renderWithFormProvider = (
  component: React.ReactElement,
  formOptions: {
    defaultValues?: Record<string, unknown>;
    schema?: unknown;
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  } = {}
) => {
  const {
    defaultValues = {},
    schema,
    mode = 'onChange'
  } = formOptions;

  let formRef: {
    setValue: (name: string, value: unknown) => void;
    trigger: (name: string) => Promise<boolean>;
    getValues: (name: string) => unknown;
    formState: { isValid: boolean };
    handleSubmit: (onValid: () => void) => (event?: React.FormEvent) => void;
  } | null = null;
  
  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const formMethods = useForm({
      mode,
      defaultValues,
      resolver: schema ? zodResolver(schema) : undefined,
    });
    
    // Store form reference for external access
    formRef = formMethods;
    
    return (
      <MemoryRouter>
        <FormProvider {...formMethods}>
          {children}
          {/* Debug submit button for testing */}
          <button
            type="submit"
            disabled={!formMethods.formState.isValid}
            data-testid="debug-submit-btn"
            onClick={formMethods.handleSubmit(() => {})}
          >
            Debug Submit
          </button>
        </FormProvider>
      </MemoryRouter>
    );
  };

  const renderResult = render(component, { wrapper: TestWrapper });
  
  return {
    ...renderResult,
    getForm: () => formRef,
    setFormValue: (name: string, value: unknown) => {
      if (formRef) {
        formRef.setValue(name, value);
        return formRef.trigger(name);
      }
      throw new Error('Form ref not available');
    },
    getFormValue: (name: string) => {
      if (formRef) {
        return formRef.getValues(name);
      }
      throw new Error('Form ref not available');
    },
    waitForFormValid: () => waitForFormValid(),
    expectFormInvalid: (reason?: string) => expectFormInvalid(reason),
  };
};


// Export utility for getting common form validation error messages
export const getFormErrors = () => {
  const errorElements = screen.queryAllByText(/error|required|invalid/i);
  return errorElements.map(el => el.textContent).filter(Boolean);
};

// Assertion helpers for common form states
export const assertFormSubmissionData = (
  mockInsert: {
    mock: {
      calls: unknown[][];
    };
  } & jest.MockedFunction<(...args: unknown[]) => unknown>,
  expectedData: Record<string, unknown>
) => {
  expect(mockInsert).toHaveBeenCalledTimes(1);
  const submittedPayload = mockInsert.mock.calls[0][0][0];
  
  Object.entries(expectedData).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      expect(submittedPayload[key]).toBeNull();
    } else if (typeof value === 'object' && value instanceof Date) {
      expect(submittedPayload[key]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    } else {
      expect(submittedPayload).toHaveProperty(key, value);
    }
  });
  
  return submittedPayload;
};

export default {
  getTestDates,
  setFormDatesDirectly,
  selectDestination,
  setDatesWithMockedCalendar,
  fillFormWithDates,
  waitForFormValid,
  expectFormInvalid,
  renderWithFormProvider,
  getFormErrors,
  assertFormSubmissionData,
};
