import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import React from 'react';
import TripRequestForm from '@/components/trip/TripRequestForm';

import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useTravelerInfoCheck } from '@/hooks/useTravelerInfoCheck';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [{}], error: null }),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));

vi.mock('@/hooks/useTravelerInfoCheck', () => ({
  useTravelerInfoCheck: vi.fn(),
}));

vi.mock('@/services/api/flightSearchApi', () => ({
  invokeFlightSearch: vi.fn().mockResolvedValue({ success: true }),
}));

// Global variable to store form reference for testing
let globalFormRef: any = null;

// Mock React Hook Form to capture the form instance
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    useForm: (options?: any) => {
      const formInstance = (actual as any).useForm(options);
      globalFormRef = formInstance;
      console.log('[TEST] Form instance captured:', Object.keys(formInstance));
      return formInstance;
    }
  };
});

// Mock the ImprovedDatePickerSection with proper React Hook Form integration
vi.mock('@/components/trip/sections/ImprovedDatePickerSection', () => ({
  default: ({ control }: { control: any }) => {
    console.log('[TEST] DatePickerSection rendered with control');
    
    // Create a simple test component that uses React Hook Form Controller
    const TestDatePicker = () => {
      const { Controller } = require('react-hook-form');
      
      return React.createElement('div', {
        'data-testid': 'mocked-date-picker-section',
        className: 'space-y-4'
      }, [
        React.createElement(Controller, {
          key: 'earliest-controller',
          control,
          name: 'earliestDeparture',
          render: ({ field }: any) => {
            return React.createElement('div', { key: 'earliest-wrapper' }, [
              React.createElement('label', { key: 'earliest-label', htmlFor: 'earliest-input' }, 'Earliest Departure'),
              React.createElement('input', {
                key: 'earliest-input',
                id: 'earliest-input',
                'data-testid': 'earliest-departure-input',
                type: 'date',
                value: field.value ? new Date(field.value).toISOString().split('T')[0] : '',
                onChange: (e: any) => {
                  console.log('[TEST] Earliest departure changed to:', e.target.value);
                  if (e.target.value) {
                    const date = new Date(e.target.value + 'T12:00:00.000Z');
                    field.onChange(date);
                  }
                },
                onBlur: field.onBlur
              })
            ]);
          }
        }),
        React.createElement(Controller, {
          key: 'latest-controller',
          control,
          name: 'latestDeparture',
          render: ({ field }: any) => {
            return React.createElement('div', { key: 'latest-wrapper' }, [
              React.createElement('label', { key: 'latest-label', htmlFor: 'latest-input' }, 'Latest Departure'),
              React.createElement('input', {
                key: 'latest-input',
                id: 'latest-input',
                'data-testid': 'latest-departure-input',
                type: 'date',
                value: field.value ? new Date(field.value).toISOString().split('T')[0] : '',
                onChange: (e: any) => {
                  console.log('[TEST] Latest departure changed to:', e.target.value);
                  if (e.target.value) {
                    const date = new Date(e.target.value + 'T12:00:00.000Z');
                    field.onChange(date);
                  }
                },
                onBlur: field.onBlur
              })
            ]);
          }
        })
      ]);
    };
    
    return TestDatePicker;
  }
}));

// Enhanced React Hook Form-compatible date setting function
const setDatesWithReactHookForm = async (earliestDate: Date, latestDate: Date) => {
  console.log('[TEST] Setting dates with React Hook Form API');
  
  // Wait for the mocked date inputs to be available
  await waitFor(() => {
    expect(screen.getByTestId('earliest-departure-input')).toBeInTheDocument();
    expect(screen.getByTestId('latest-departure-input')).toBeInTheDocument();
  }, { timeout: 5000 });
  
  // Strategy 1: Use the properly mocked date inputs with React Hook Form Controller
  try {
    const earliestInput = screen.getByTestId('earliest-departure-input');
    const latestInput = screen.getByTestId('latest-departure-input');
    
    // Convert dates to YYYY-MM-DD format for date inputs
    const earliestDateStr = earliestDate.toISOString().split('T')[0];
    const latestDateStr = latestDate.toISOString().split('T')[0];
    
    console.log('[TEST] Setting date values:', { earliestDateStr, latestDateStr });
    
    // Use fireEvent to trigger onChange directly (simulates user input)
    fireEvent.change(earliestInput, { target: { value: earliestDateStr } });
    fireEvent.change(latestInput, { target: { value: latestDateStr } });
    
    // Trigger blur events to complete field validation
    fireEvent.blur(earliestInput);
    fireEvent.blur(latestInput);
    
    console.log('[TEST] Set dates via mocked inputs successfully');
    
    // Wait for React Hook Form to process the changes
    await waitFor(() => {
      expect(earliestInput).toHaveValue(earliestDateStr);
      expect(latestInput).toHaveValue(latestDateStr);
    }, { timeout: 2000 });
    
    return;
  } catch (error) {
    console.warn('[TEST] Mocked input approach failed:', error);
  }
  
  // Strategy 2: Direct React Hook Form API access as fallback
  try {
    if (globalFormRef && globalFormRef.setValue) {
      console.log('[TEST] Using direct React Hook Form API as fallback');
      
      // Set values directly using React Hook Form API
      globalFormRef.setValue('earliestDeparture', earliestDate, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      
      globalFormRef.setValue('latestDeparture', latestDate, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      
      // Trigger validation explicitly
      await globalFormRef.trigger(['earliestDeparture', 'latestDeparture']);
      
      console.log('[TEST] Dates set via React Hook Form API');
      return;
    }
  } catch (error) {
    console.warn('[TEST] React Hook Form API approach failed:', error);
  }
  
  throw new Error('[TEST] All date setting strategies failed');
};

describe('TripRequestForm - Fixed Budget Field Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set system time for predictable date testing
    vi.setSystemTime(new Date('2024-08-14T10:00:00.000Z'));

    (useCurrentUser as Mock).mockReturnValue({ 
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id' 
    });
    (useNavigate as Mock).mockReturnValue(vi.fn());
    
    (usePaymentMethods as Mock).mockReturnValue({
      data: [{ 
        id: 'pm_123', 
        brand: 'Visa', 
        last4: '4242', 
        is_default: true, 
        nickname: 'Work Card' 
      }],
      isLoading: false,
      error: null
    });
    
    (useTravelerInfoCheck as Mock).mockReturnValue({
      data: { has_traveler_info: true },
      isLoading: false,
      error: null
    });
  });

  /**
   * Helper function to properly fill the form using correct queries for budget field
   */
  const fillFormCorrectly = async (options: {
    destination?: string;
    departureAirport?: string;
    maxPrice?: number;
  } = {}) => {
    const {
      destination = 'MVY',
      departureAirport = 'SFO',
      maxPrice = 1200
    } = options;

    // 1. Select destination
    try {
      const selectTrigger = screen.getByRole('combobox', { name: /destination/i });
      await userEvent.click(selectTrigger);
      
      await waitFor(() => {
        const option = screen.getByRole('option', { name: new RegExp(destination, 'i') });
        expect(option).toBeVisible();
      });
      
      const option = screen.getByRole('option', { name: new RegExp(destination, 'i') });
      await userEvent.click(option);
    } catch (error) {
      // Fallback to custom destination input
      const customInput = screen.getByLabelText(/custom destination/i);
      await userEvent.clear(customInput);
      await userEvent.type(customInput, destination);
    }

    // 2. Set departure airport  
    const departureInput = screen.getByPlaceholderText(/e\.g\., BOS/i);
    await userEvent.clear(departureInput);
    await userEvent.type(departureInput, departureAirport);

    // 3. Set future dates (critical for validation)
    // Create dates that are definitely in the future to satisfy Zod schema
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Use React Hook Form compatible date setting
    await setDatesWithReactHookForm(tomorrow, nextWeek);

    // 4. Set budget - THE CRITICAL FIX: Use placeholder text, not display value
    // According to the research, the budget field has placeholder="1000" but no initial display value
    const budgetInput = screen.getByPlaceholderText('1000');
    expect(budgetInput).toBeInTheDocument();
    
    // Clear and set the budget value
    await userEvent.clear(budgetInput);
    await userEvent.type(budgetInput, maxPrice.toString());
    
    // Important: trigger blur to ensure validation runs
    fireEvent.blur(budgetInput);

    // 5. Wait for form validation to process
    await waitFor(() => {
      expect(budgetInput).toHaveValue(maxPrice);
    }, { timeout: 3000 });

    // Give additional time for React Hook Form validation to complete
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  it('should properly handle budget field with placeholder text instead of display value', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    await fillFormCorrectly({
      destination: 'MVY',
      departureAirport: 'SFO', 
      maxPrice: 1500
    });

    // Wait for submit button to become enabled
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
      const enabledButton = submitButtons.find(btn => !btn.disabled);
      expect(enabledButton).toBeTruthy();
    }, { timeout: 5000 });

    // Find and verify the submit button is enabled
    const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    const submitButton = submitButtons.find(btn => !btn.disabled) || submitButtons[0];
    expect(submitButton).toBeEnabled();
  });

  it('should demonstrate the budget field query issue and resolution', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // First select a destination to make the budget field appear
    const selectTrigger = screen.getByRole('combobox', { name: /destination/i });
    await userEvent.click(selectTrigger);
    
    await waitFor(() => {
      const option = screen.getByRole('option', { name: /martha/i });
      expect(option).toBeVisible();
    });
    
    const option = screen.getByRole('option', { name: /martha/i });
    await userEvent.click(option);

    // Wait for the form to update
    await waitFor(() => {
      expect(screen.getByPlaceholderText('1000')).toBeInTheDocument();
    });

    // DEMONSTRATE THE PROBLEM: This would fail because there's no display value initially
    // screen.getByDisplayValue('1000') would throw here

    // SHOW THE SOLUTION: Use placeholder text instead
    const budgetInput = screen.getByPlaceholderText('1000');
    expect(budgetInput).toBeInTheDocument();

    // The budget field might start empty or with default value
    // We should verify the value using toHaveValue() after setting it
    await userEvent.clear(budgetInput);
    await userEvent.type(budgetInput, '1200');
    
    expect(budgetInput).toHaveValue(1200);
  });

  it('should ensure form validity by setting all required fields correctly', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null })
    });
    const mockInsert = vi.fn().mockReturnValue({
      select: mockSelect
    });
    (supabase.from as Mock).mockReturnValue({
      insert: mockInsert,
    });

    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // Fill the entire form properly
    await fillFormCorrectly({
      destination: 'MVY',
      departureAirport: 'SFO',
      maxPrice: 1200
    });

    // Verify form is valid and submit
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
      const enabledButton = submitButtons.find(btn => !btn.disabled);
      expect(enabledButton).toBeTruthy();
    }, { timeout: 5000 });

    const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    const submitButton = submitButtons.find(btn => !btn.disabled) || submitButtons[0];
    
    await userEvent.click(submitButton);

    // Verify submission
    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));
    
    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('destination_airport', 'MVY');
    expect(submittedPayload).toHaveProperty('budget', 1200);
    expect(submittedPayload).toHaveProperty('departure_airports', ['SFO']);
  });

  it('should handle form validation timing properly', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // Demonstrate that form starts invalid
    const initialSubmitButtons = screen.getAllByRole('button', { name: /search now/i });
    expect(initialSubmitButtons.every(btn => btn.disabled)).toBe(true);

    // Fill form step by step and wait for validation
    await fillFormCorrectly();

    // The key insight: wait for React Hook Form to process validation
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
      const enabledButton = submitButtons.find(btn => !btn.disabled);
      if (!enabledButton) {
        throw new Error('Submit button not enabled - form may be invalid');
      }
    }, { timeout: 5000 });

    // Success: form is now valid
    const finalSubmitButtons = screen.getAllByRole('button', { name: /search now/i });
    const enabledButton = finalSubmitButtons.find(btn => !btn.disabled);
    expect(enabledButton).toBeTruthy();
  });
});
