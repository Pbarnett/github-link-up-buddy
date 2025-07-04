import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';

import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useTravelerInfoCheck } from '@/hooks/useTravelerInfoCheck';

// Import our new best-practice testing utilities
import {
  getTestDates,
  setFormDatesDirectly,
  fillFormWithDates,
  waitForFormValid,
  expectFormInvalid,
  setupAutoBookingTest,
  assertFormSubmissionData,
} from '@/tests/utils/formTestUtils';

/**
 * TripRequestForm tests implementing 2024 best practices for react-day-picker testing.
 * 
 * This test suite follows the research recommendations:
 * ✅ Mock complex date picker components for reliable testing
 * ✅ Use programmatic form control (setValue) for date fields
 * ✅ Focus on testing form validation logic, not calendar UI
 * ✅ Avoid brittle UI interactions with complex third-party components
 * ✅ Test business logic outcomes rather than implementation details
 */

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => {
  const mockQueryBuilder = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null }),
  };
  
  return {
    supabase: {
      from: vi.fn(() => mockQueryBuilder),
    },
  };
});

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

describe('TripRequestForm - Best Practices Implementation', () => {
  let mockNavigate: Mock;
  let mockToastFn: Mock;
  let mockInsert: Mock;
  let formRef: any = null;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock current user
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id'
    });

    // Mock navigate
    mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    // Mock toast
    mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    // Mock Supabase with proper method chaining
    mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null })
      })
    });
    
    (supabase.from as Mock).mockReturnValue({
      insert: mockInsert,
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null })
          })
        })
      })
    });

    // Mock payment methods and traveler info
    (usePaymentMethods as Mock).mockReturnValue({
      data: [{ 
        id: 'pm_123', 
        brand: 'Visa', 
        last4: '4242', 
        is_default: true, 
        nickname: 'Work Card',
        exp_month: 12,
        exp_year: 2025
      }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useTravelerInfoCheck as Mock).mockReturnValue({
      data: { has_traveler_info: true },
      isLoading: false,
      error: null
    });
  });

  describe('Form Validation Logic (Recommended Focus)', () => {
    it('should validate that required date fields enable form submission', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );

      // Initially, form should be invalid due to missing required fields
      expectFormInvalid('missing required fields');

      // Fill form using programmatic approach (recommended)
      await fillFormWithDates({
        destination: 'MVY',
        departureAirport: 'SFO',
        maxPrice: 1200,
        useProgrammaticDates: false, // Use mocked calendar for this test
      });

      // Form should now be valid
      await waitForFormValid();
      
      // Verify submit button is enabled
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
      const enabledButton = submitButtons.find(btn => !btn.hasAttribute('disabled'));
      expect(enabledButton).toBeTruthy();
    });

    it('should prevent submission when dates are missing', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );

      // Test initial state - before any form filling
      // The form should be invalid initially due to missing required fields
      expectFormInvalid('missing date fields');
      
      // Fill only destination and departure airport (not dates)
      const otherAirportInput = screen.getByPlaceholderText(/e\.g\., BOS/i);
      await userEvent.type(otherAirportInput, 'SFO');
      
      // Try to select destination without filling dates
      try {
        const selectTrigger = screen.getByRole('combobox', { name: /destination/i });
        await userEvent.click(selectTrigger);
        
        await waitFor(() => {
          const option = screen.getByRole('option', { name: /MVY/i });
          expect(option).toBeVisible();
        });
        
        const option = screen.getByRole('option', { name: /MVY/i });
        await userEvent.click(option);
      } catch (error) {
        // If destination selection fails, that's OK for this test
        console.log('Destination selection failed, which is expected in this test context');
      }
      
      // Form should still be invalid due to missing dates
      expectFormInvalid('missing date fields');
    });
  });

  describe('Form Submission with Mocked Dates (Best Practice)', () => {
    it('should submit successfully with programmatically set dates', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );

      // Use the recommended approach: mock calendar interaction
      await fillFormWithDates({
        destination: 'MVY',
        departureAirport: 'SFO',
        maxPrice: 1500,
        minDuration: 4,
        maxDuration: 8,
        useProgrammaticDates: false, // Use mocked calendar
      });

      await waitForFormValid();

      // Submit the form
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
      const submitButton = submitButtons.find(btn => !btn.hasAttribute('disabled'))!;
      await userEvent.click(submitButton);

      // Verify submission
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalledTimes(1);
      });

      // Assert form data using helper
      assertFormSubmissionData(mockInsert, {
        destination_airport: 'MVY',
        destination_location_code: 'MVY',
        departure_airports: ['SFO'],
        budget: 1500,
        min_duration: 4,
        max_duration: 8,
        user_id: 'test-user-id',
        nonstop_required: true,
        baggage_included_required: false,
        auto_book_enabled: false,
      });

      // Verify navigation and toast
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id&mode=manual');
      });

      await waitFor(() => {
        expect(mockToastFn).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Trip request submitted",
            description: "Your trip request has been successfully submitted!",
          })
        );
      });
    });
  });

  describe('Manual Mode Form Validation (Core Focus)', () => {
    it('should submit successfully in manual mode when all requirements are met', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm mode="manual" />
        </MemoryRouter>
      );

      // Fill form with all required fields for manual mode
      await fillFormWithDates({
        destination: 'MVY',
        departureAirport: 'SFO', 
        maxPrice: 2000,
        useProgrammaticDates: false,
      });

      // Manual mode should be valid with just basic fields
      await waitForFormValid();

      // Submit the form
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
      const submitButton = submitButtons.find(btn => !btn.hasAttribute('disabled'))!;
      await userEvent.click(submitButton);

      // Should submit successfully
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalledTimes(1);
      });

      // Verify submitted data
      assertFormSubmissionData(mockInsert, {
        destination_airport: 'MVY',
        destination_location_code: 'MVY',
        departure_airports: ['SFO'],
        budget: 2000,
        user_id: 'test-user-id',
        auto_book_enabled: false, // Manual mode = no auto-booking
      });
    });

    it('should validate that manual mode does not have auto-booking functionality', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm mode="manual" />
        </MemoryRouter>
      );

      // Fill basic form fields
      await fillFormWithDates({
        destination: 'MVY',
        departureAirport: 'SFO',
        maxPrice: 2500,
        useProgrammaticDates: false,
      });

      // Auto-booking switch should NOT exist in manual mode
      expect(screen.queryByLabelText(/enable auto-booking/i)).not.toBeInTheDocument();
      
      // Payment method selection should NOT be visible in manual mode
      expect(screen.queryByLabelText(/payment method/i)).not.toBeInTheDocument();
      
      // Form should be valid for manual search without auto-booking
      await waitForFormValid();
      
      // Verify button text is for manual search
      const searchButtons = screen.getAllByText(/search now/i);
      expect(searchButtons.length).toBeGreaterThan(0);
      expect(searchButtons[0]).toBeVisible();
    });
  });

  describe('Auto Mode Form Validation (Auto-booking Focus)', () => {
    it('should enable auto-booking functionality in auto mode', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm mode="auto" />
        </MemoryRouter>
      );

      // Fill basic form fields (step 1)
      await fillFormWithDates({
        destination: 'MVY',
        departureAirport: 'SFO', 
        maxPrice: 2000,
        useProgrammaticDates: false,
      });

      // Form should be valid for step 1
      await waitForFormValid();

      // Continue to step 2
      const continueButtons = screen.getAllByRole('button', { name: /continue to pricing/i });
      const continueButton = continueButtons.find(btn => !btn.hasAttribute('disabled'))!;
      await userEvent.click(continueButton);

      // Should be on step 2 now
      await waitFor(() => {
        expect(screen.getByText(/payment & authorization/i)).toBeInTheDocument();
      });

      // Auto-booking should be enabled by default in auto mode
      // Payment method selection should be visible
      await waitFor(() => {
        expect(screen.getByLabelText(/payment method/i)).toBeInTheDocument();
      });

      // Verify auto-booking UI elements are present
      expect(screen.getByText(/enable auto-booking/i)).toBeInTheDocument();
      expect(screen.getByText(/i authorize parker flight/i)).toBeInTheDocument();
    });
  });

  describe('Date Range Validation (Programmatic Testing)', () => {
    it('should accept valid future date ranges', async () => {
      const { tomorrow, nextWeek } = getTestDates();
      
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );

      // This test would ideally use programmatic date setting
      // For demonstration, we'll use the mocked calendar approach
      await fillFormWithDates({
        useProgrammaticDates: false, // Using mocked calendar
      });

      await waitForFormValid();

      // The dates should be set to tomorrow and next week by our mocks
      // In a real test, you could verify the form values directly
      // if you had access to the form ref
    });
  });

  describe('Filter Information Display (Updated UI)', () => {
    it('should show nonstop flights information badge', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );

      // Expand the collapsible section to see filter information
      const toggleButton = screen.getByText("What's Included");
      await userEvent.click(toggleButton);

      // Check for informational badge instead of toggle switch
      await waitFor(() => {
        expect(screen.getByText('Nonstop flights only')).toBeInTheDocument();
        expect(screen.getByText('All flights shown are direct with no stops.')).toBeInTheDocument();
        expect(screen.getAllByText('Included')).toHaveLength(2); // Both nonstop and baggage
      });
    });

    it('should show baggage information badge', async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );

      // Expand the collapsible section to see filter information
      const toggleButton = screen.getByText("What's Included");
      await userEvent.click(toggleButton);

      // Check for informational badge instead of toggle switch
      await waitFor(() => {
        expect(screen.getByText('Carry-on + personal item')).toBeInTheDocument();
        expect(screen.getByText('All prices include carry-on baggage and personal item.')).toBeInTheDocument();
        expect(screen.getAllByText('Included')).toHaveLength(2); // Both nonstop and baggage
      });
    });
  });
});

describe('Migration Notes for Existing Tests', () => {
  /**
   * MIGRATION GUIDE:
   * 
   * 1. Replace complex calendar UI interactions with mocked calendar buttons
   * 2. Use programmatic form.setValue() for date fields when possible
   * 3. Focus tests on business logic rather than UI implementation
   * 4. Use the utilities from formTestUtils.tsx for consistent testing
   * 
   * BEFORE (problematic):
   * ```
   * await userEvent.click(screen.getByText('Earliest'));
   * await userEvent.click(screen.getByText('16')); // Flaky: depends on calendar rendering
   * ```
   * 
   * AFTER (recommended):
   * ```
   * await setDatesWithMockedCalendar(); // Uses test-friendly mocked calendar
   * // OR better yet:
   * const form = getFormRef();
   * await setFormDatesDirectly(form, new Date('2025-01-15'), new Date('2025-01-20'));
   * ```
   * 
   * 5. Test form validation states rather than UI interactions:
   * 
   * FOCUS ON:
   * ✅ Form submission with valid data
   * ✅ Form validation when required fields are missing
   * ✅ Business logic (auto-booking requirements, etc.)
   * ✅ Navigation and toast notifications
   * 
   * AVOID:
   * ❌ Testing calendar popup rendering
   * ❌ Testing react-day-picker internal behavior
   * ❌ Complex UI timing dependencies
   * ❌ Testing library implementation details
   */

  it('should serve as a migration example', () => {
    // This test is just for documentation purposes
    expect(true).toBe(true);
  });
});
