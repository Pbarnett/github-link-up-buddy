
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';

import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useTravelerInfoCheck } from '@/hooks/useTravelerInfoCheck';

// Import our new testing utilities
import { fillBaseFormFieldsWithDates, getFormErrors } from '@/tests/utils/formTestHelpers';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [{}], error: null }), // Default mock for insert
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

// Mock custom hooks used by AutoBookingSection
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));

vi.mock('@/hooks/useTravelerInfoCheck', () => ({
  useTravelerInfoCheck: vi.fn(),
}));

vi.mock('@/services/api/flightSearchApi', () => ({
  invokeFlightSearch: vi.fn().mockResolvedValue({ success: true }),
}));

describe('TripRequestForm - Filter Toggles Logic', () => {
  beforeEach(() => {
    // Reset mocks before each test in this suite
    vi.clearAllMocks();

    // Setup default mock implementations for this suite if needed
    (useCurrentUser as Mock).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as Mock).mockReturnValue(vi.fn());
    
    // Mock usePaymentMethods to return expected structure
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
    
    // Mock useTravelerInfoCheck to return expected structure
    (useTravelerInfoCheck as Mock).mockReturnValue({
      data: { has_traveler_info: true },
      isLoading: false,
      error: null
    });
  });
  // --- Tests for FilterTogglesSection functionality within TripRequestForm ---

  it('should render "Nonstop flights only" switch checked by default', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    
    // First expand the collapsible filters section
    const expandButton = screen.getByText("What's Included");
    await userEvent.click(expandButton);
    
    // Wait for the switch to appear
    await waitFor(() => {
      const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
      expect(nonstopSwitch).toBeInTheDocument();
    });
    
    const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
    expect(nonstopSwitch).toBeInTheDocument();
    expect(nonstopSwitch).toBeChecked();
  });

  it('should render "Include carry-on + personal item" switch unchecked by default', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    
    // First expand the collapsible filters section
    const expandButton = screen.getByText("What's Included");
    await userEvent.click(expandButton);
    
    // Wait for the switch to appear
    await waitFor(() => {
      const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
      expect(baggageSwitch).toBeInTheDocument();
    });
    
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(baggageSwitch).toBeInTheDocument();
    expect(baggageSwitch).not.toBeChecked();
  });

  it('should update switch state when "Include carry-on + personal item" switch is toggled', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    
    // First expand the collapsible filters section
    const expandButton = screen.getByText("What's Included");
    await userEvent.click(expandButton);
    
    // Wait for the switch to appear
    await waitFor(() => {
      const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
      expect(baggageSwitch).toBeInTheDocument();
    });
    
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(baggageSwitch).not.toBeChecked(); // Initial state

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).toBeChecked(); // After first click

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).not.toBeChecked(); // After second click
  });

  // Simplified test for default Zod schema values affecting switches
  it('should reflect Zod schema default values for switches on initial render', async () => {
    // TripRequestForm uses useForm with Zod schema defaults:
    // nonstop_required: default(true)
    // baggage_included_required: default(false)
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // First expand the collapsible filters section
    const expandButton = screen.getByText("What's Included");
    await userEvent.click(expandButton);
    
    // Wait for the switches to appear
    await waitFor(() => {
      const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
      const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
      expect(nonstopSwitch).toBeInTheDocument();
      expect(baggageSwitch).toBeInTheDocument();
    });

    const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });

    expect(nonstopSwitch).toBeChecked();
    expect(baggageSwitch).not.toBeChecked();
    // This test implicitly covers the "editing an existing trip with prefilled filter values" if
    // the form.reset() in useEffect correctly populates these from fetched data.
    // A more direct test for "editing" would require mocking the fetchTripDetails call.
  });

  // --- End of Tests for FilterTogglesSection functionality ---
});

describe('TripRequestForm - Submission Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock current user
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id'
    });

    // Mock navigate
    (useNavigate as Mock).mockReturnValue(vi.fn());
    
    // Mock usePaymentMethods and useTravelerInfoCheck
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

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { id: 'new-trip-id' }, error: null })
    });
    const mockInsert = vi.fn().mockReturnValue({
      select: mockSelect
    });
    (supabase.from as Mock).mockReturnValue({
      insert: mockInsert,
    });

    // Set system time for predictable date testing
    vi.setSystemTime(new Date('2024-08-14T10:00:00.000Z'));

    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // Set user before form interactions
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id'
    });

    // Mock navigation
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    // Mock toast
    const mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    // Use enhanced form helpers with proper validation
    await fillBaseFormFieldsWithDates({
      destination: 'MVY',
      departureAirport: 'SFO',
      maxPrice: 1200,
      minDuration: 5,
      maxDuration: 10
    });

    // Verify the form is in a valid state before attempting submission
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    const enabledButton = submitButtons.find(btn => !(btn as HTMLButtonElement).disabled);
      expect(enabledButton).toBeTruthy();
    }, { timeout: 5000 });

    // Find the submit button
    const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    const submitButton = submitButtons.find(btn => !(btn as HTMLButtonElement).disabled) || submitButtons[0];
    
    // Debug: Check form state if button is still disabled
    if ((submitButton as HTMLButtonElement).disabled) {
      const errors = getFormErrors();
      console.warn('Form validation errors:', errors);
      console.warn('Form values might not be set correctly');
    }
    
    expect(submitButton).toBeEnabled(); // Should be enabled after filling required fields
    await userEvent.click(submitButton);

    // Wait for submission to complete
    await waitFor(() => {
      try {
        expect(mockInsert).toHaveBeenCalledTimes(1);
      } catch (e) {
        const errors = getFormErrors();
        console.warn('Form validation errors during submission:', errors);
        console.warn('Submit button state:', (submitButton as HTMLButtonElement).disabled);
        throw e;
      }
    }, { timeout: 10000 });
    
    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('destination_airport', 'MVY');
    expect(submittedPayload).toHaveProperty('destination_location_code', 'MVY'); // Key verification
    expect(submittedPayload).toHaveProperty('departure_airports', ['SFO']);
    // Check that dates are in correct ISO format (tomorrow and next week from current date)
    expect(submittedPayload.earliest_departure).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // ISO format
    expect(submittedPayload.latest_departure).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // ISO format
    
    // Verify dates are in the future and latest is after earliest
    const earliestDate = new Date(submittedPayload.earliest_departure);
    const latestDate = new Date(submittedPayload.latest_departure);
    expect(earliestDate.getTime()).toBeLessThan(latestDate.getTime());
    expect(earliestDate.getTime()).toBeGreaterThan(Date.now() - 24 * 60 * 60 * 1000); // Should be recent
    expect(submittedPayload).toHaveProperty('budget', 1200); // Backend still expects budget field
    expect(submittedPayload).toHaveProperty('min_duration', 5);
    expect(submittedPayload).toHaveProperty('max_duration', 10);
    expect(submittedPayload).toHaveProperty('user_id', 'test-user-id');
    expect(submittedPayload).toHaveProperty('nonstop_required', true); // Default
    expect(submittedPayload).toHaveProperty('baggage_included_required', false); // Default
    expect(submittedPayload).toHaveProperty('auto_book_enabled', false); // Default

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

// Enhanced helper function using our new utilities
const selectDestination = async (destinationCode: string) => {
  try {
    // Find the Select trigger button by its label
    const selectTrigger = screen.getByRole('combobox', { name: /destination/i });
    
    // Open the select dropdown
    await userEvent.click(selectTrigger);
    
    // Wait for options to appear and select the desired option
    await waitFor(() => {
      expect(screen.getByRole('option', { name: new RegExp(destinationCode, 'i') })).toBeVisible();
    });
    
    const option = screen.getByRole('option', { name: new RegExp(destinationCode, 'i') });
    await userEvent.click(option);
    
    // Wait for select to close
    await waitFor(() => {
      expect(screen.queryByRole('option', { name: new RegExp(destinationCode, 'i') })).not.toBeInTheDocument();
    });
  } catch {
    console.warn('Destination selection failed, using fallback approach');
    // Fallback: use custom destination input
    const customInput = screen.getByLabelText(/custom destination/i);
    fireEvent.change(customInput, { target: { value: 'MVY' } });
  }
};

// Mark as potentially unused but keep for future use
void selectDestination;

// Enhanced helper function using mocked calendar
const fillBaseFormFields = async () => {
  // Use our enhanced helper that handles date mocking
  await fillBaseFormFieldsWithDates({
    destination: 'Martha',
    departureAirport: 'SFO',
    maxPrice: 1200,
    minDuration: 5,
    maxDuration: 10
  });
};


describe('TripRequestForm - Auto-Booking Logic', () => {
  let mockNavigate: Mock;
  let mockToastFn: Mock;
  let mockInsert: Mock;
  // Get mocked hooks
  const mockUsePaymentMethods = vi.mocked(usePaymentMethods);
  const mockUseTravelerInfoCheck = vi.mocked(useTravelerInfoCheck);


  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set a consistent date for testing
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));

    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id'
    });

    mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ 
        data: { id: 'new-trip-id', auto_book_enabled: true }, 
        error: null 
      })
    });
    mockInsert = vi.fn().mockReturnValue({
      select: mockSelect
    });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    // Default mocks for auto-booking prerequisites
    mockUsePaymentMethods.mockReturnValue({
      data: [{ id: 'pm_123', brand: 'Visa', last4: '4242', is_default: true, nickname: 'Work Card', exp_month: 12, exp_year: 2025, created_at: '2024-01-01T00:00:00.000Z' }],
      isLoading: false,
      refetch: vi.fn(),
    });
    mockUseTravelerInfoCheck.mockReturnValue({
      hasTravelerInfo: true,
      isLoading: false,
    });
  });

  // Test 1: Rendering and Interaction
  it('should show payment method selection when auto-booking is enabled and prerequisites are met', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // Initially, auto-booking fields should not be visible since auto-booking is disabled
    expect(screen.queryByLabelText(/payment method/i)).not.toBeInTheDocument();

    // Enable auto-booking - look for the switch by its label text
    const autoBookSwitch = screen.getByLabelText(/enable auto-booking/i);
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      // AutoBookingSection shows Payment Method (not with "for auto-booking" suffix)
      expect(screen.getByLabelText(/payment method/i)).toBeVisible();
    });

    // Select a payment method
    const paymentMethodSelect = screen.getByLabelText(/payment method/i);
    await userEvent.click(paymentMethodSelect); // Open select
    
    // Handle multiple "Visa" elements by specifically selecting the option element
    await waitFor(() => {
      const visaOption = screen.getByRole('option', { name: /Visa.*4242.*Default.*Work Card/i });
      expect(visaOption).toBeVisible();
    });
    
    const visaOption = screen.getByRole('option', { name: /Visa.*4242.*Default.*Work Card/i });
    await userEvent.click(visaOption);

    // Check if the value is set (indirectly, by checking if it's part of submission later or form state if possible)
    // For now, interaction is the key. The value selection will be verified in submission tests.
  });

  // Test 2.1: Zod Validation - Missing Payment Method
  it('should fail submission if auto-booking is enabled, max_price is set, but no payment method is selected', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    // Wait for auto-booking section to appear after form is filled
    await waitFor(() => {
      expect(screen.getByLabelText(/enable auto-booking/i)).toBeInTheDocument();
    });
    
    const autoBookSwitch = screen.getByLabelText(/enable auto-booking/i);
    await userEvent.click(autoBookSwitch);

    // Note: AutoBookingSection doesn't have a max price input, 
    // it just shows the max_price value from the main budget section
    // The payment method selection should be visible
    await waitFor(() => {
      expect(screen.getByLabelText(/payment method/i)).toBeVisible();
    });

    // Do NOT select a payment method

    // When auto-booking is enabled, the button text changes to "Start Auto-Booking"
    const submitButtons = screen.getAllByRole('button', { name: /start auto-booking/i });
    const submitButton = submitButtons.find(btn => !(btn as HTMLButtonElement).disabled) || submitButtons[0];
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).not.toHaveBeenCalled();
    });

    // Check for toast message related to payment method
    // The Zod refine path is 'preferred_payment_method_id', message "Maximum price and payment method are required for auto-booking"
    // React Hook Form might show this near the field or as a general toast.
    // Check that the form doesn't submit - the insert should not be called
    await waitFor(() => {
      expect(mockInsert).not.toHaveBeenCalled();
    });
    
    // The form should show validation errors when submission is attempted
    // This could be through FormMessage components or form field errors
    // The actual Zod error might be tricky to assert directly on a field without inspecting RHF's error state.
    // The toast from onSubmit's catch block might not fire if Zod prevents submission at schema level.
    // Let's ensure the specific toast for validation failure from Zod is shown by RHF.
    // This often requires the form to attempt submission and then RHF displays errors.
    // The refine message is "Maximum price and payment method are required for auto-booking".
    // This message is associated with path "preferred_payment_method_id".
    // It is possible that RHF doesn't show a toast for this, but rather an inline error.
    // However, the provided schema error path is what we changed.
    // Let's assume the custom alert in AutoBookingSection is the primary UI feedback for this.
    // If there's a toast from a general validation error handler, that can be checked too.
    // For now, the Alert and no submission is a good test.
  });

  // Test 2.2: Zod Validation - Missing Max Price
  it('should fail submission if auto-booking is enabled, payment method is set, but max_price is missing', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    // Wait for auto-booking section to appear after form is filled
    await waitFor(() => {
      expect(screen.getByLabelText(/enable auto-booking/i)).toBeInTheDocument();
    });
    
    const autoBookSwitch = screen.getByLabelText(/enable auto-booking/i);
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
       expect(screen.getByLabelText(/payment method/i)).toBeVisible();
    });
    const paymentMethodSelect = screen.getByLabelText(/payment method/i);
    await userEvent.click(paymentMethodSelect);
    
    // Wait for options to appear and select the correct one
    await waitFor(() => {
      const visaOption = screen.getByRole('option', { name: /Visa.*4242.*Default.*Work Card/i });
      expect(visaOption).toBeVisible();
    });
    
    const visaOption = screen.getByRole('option', { name: /Visa.*4242.*Default.*Work Card/i });
    await userEvent.click(visaOption);

    // Clear max_price from the main budget section using fireEvent
    const maxPriceInput = screen.getByDisplayValue('1200'); // Value set by fillBaseFormFields
    fireEvent.change(maxPriceInput, { target: { value: '' } });

    // When auto-booking is enabled, the button text changes to "Start Auto-Booking"
    const submitButtons = screen.getAllByRole('button', { name: /start auto-booking/i });
    const submitButton = submitButtons.find(btn => !(btn as HTMLButtonElement).disabled) || submitButtons[0];
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).not.toHaveBeenCalled();
    });
    // Expect some error message. The Zod refine is on "preferred_payment_method_id", but message covers both.
    // RHF might show the error near the first field mentioned in the path, or a general one.
    // The message is "Maximum price and payment method are required for auto-booking"
    // We'd expect a field error near max_price or preferred_payment_method_id or a toast.
    // Since path is preferred_payment_method_id, error should be there or general.
    // Let's check for a toast with this specific message if it's a global validation summary.
    // It's more likely that react-hook-form will show an error associated with the field.
    // For testing, if the submit button is disabled or an error message appears, it's a pass.
    // The form an `Alert` might not show for max_price.
    // We expect RHF to set an error on form.formState.errors.max_price or form.formState.errors.preferred_payment_method_id
    // And this should be rendered by the Field component. TripNumberField should show error.
    // Let's check if the submit button is re-enabled, or if a toast appears from the catch.
    // Supabase is not called, so the error is client side.
     await waitFor(() => {
        // The form validation should prevent submission, which we've already verified
        // Let's check for any validation-related error messages or form state
        const formErrors = getFormErrors();
        console.log('Form validation errors found:', formErrors);
        
        // The test is mainly that mockInsert was not called, indicating validation worked
        // Additional validation message checking could include:
        // 1. Form field error messages
        // 2. Toast notifications 
        // 3. Alert components
        
        // For now, the key assertion is that form submission was prevented
        expect(mockInsert).not.toHaveBeenCalled();
     }, { timeout: 3000 });
  });

  // Test 3: Successful Submission with Auto-Booking ON
  it('should submit successfully with auto-booking ON, payment method, and max_price', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    
    // Use enhanced form helpers with date setting
    await fillBaseFormFieldsWithDates({
      destination: 'MVY',
      departureAirport: 'SFO',
      maxPrice: 2000, // Higher price for auto-booking test
      minDuration: 5,
      maxDuration: 10
    });

    // Wait for auto-booking section to appear after form is filled
    await waitFor(() => {
      expect(screen.getByLabelText(/enable auto-booking/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    
    const autoBookSwitch = screen.getByLabelText(/enable auto-booking/i);
    await userEvent.click(autoBookSwitch);

    // Wait for payment method section to become visible
    await waitFor(() => {
      expect(screen.getByLabelText(/payment method/i)).toBeVisible();
    }, { timeout: 3000 });
    
    // Select payment method using role-based selection
    const paymentMethodSelect = screen.getByLabelText(/payment method/i);
    await userEvent.click(paymentMethodSelect);
    
    // Wait for options to appear and select the Visa option
    await waitFor(() => {
      const visaOption = screen.getByRole('option', { name: /Visa.*4242.*Default.*Work Card/i });
      expect(visaOption).toBeVisible();
    }, { timeout: 3000 });
    
    const visaOption = screen.getByRole('option', { name: /Visa.*4242.*Default.*Work Card/i });
    await userEvent.click(visaOption);
    
    // In manual mode, consent checkbox is not shown, but form validation still requires it
    // We need to programmatically set the consent value when auto-booking is enabled
    // This simulates the UI behavior where enabling auto-booking implies consent in manual mode
    try {
      const consentCheckbox = screen.getByLabelText(/I authorize Parker Flight/i);
      if (!(consentCheckbox as HTMLInputElement).checked) {
        await userEvent.click(consentCheckbox);
      }
    } catch {
      // In manual mode, consent checkbox is not rendered but we need to set the form value
      // Use direct form manipulation to set consent value
      console.log('Consent checkbox not found - setting consent programmatically for manual mode');
      
      // Since we can't access the form ref directly, we'll trigger a form event that sets consent
      // This simulates what the AutoBookingSection would do when auto-booking is enabled in manual mode
      const hiddenConsentInput = document.querySelector('input[name="auto_book_consent"]');
      if (hiddenConsentInput) {
        fireEvent.change(hiddenConsentInput, { target: { checked: true } });
      }
    }
    
    // Wait for form to be valid before attempting submission
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button', { name: /start auto-booking/i });
      const enabledButton = submitButtons.find(btn => !(btn as HTMLButtonElement).disabled);
      expect(enabledButton).toBeTruthy();
    }, { timeout: 5000 });

    // When auto-booking is enabled, the button text changes to "Start Auto-Booking"
    const submitButtons = screen.getAllByRole('button', { name: /start auto-booking/i });
    const submitButton = submitButtons.find(btn => !(btn as HTMLButtonElement).disabled) || submitButtons[0];
    
    // Debug form state if submission fails
    if ((submitButton as HTMLButtonElement).disabled) {
      const errors = getFormErrors();
      console.warn('Auto-booking form validation errors:', errors);
    }
    
    await userEvent.click(submitButton);

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));

    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('auto_book_enabled', true);
    expect(submittedPayload).toHaveProperty('max_price', 2000);
    expect(submittedPayload).toHaveProperty('preferred_payment_method_id', 'pm_123');

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id&mode=manual'));
    await waitFor(() => expect(mockToastFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Trip request submitted",
        description: "Your trip request has been successfully submitted! Auto-booking is enabled.",
      })
    ));
  });

  // Test 4: No Regression - Auto-Booking OFF (covered by existing test, but check payload here too)
  it('should submit successfully with auto-booking OFF, not sending auto-booking fields', async () => {
    // Override the mock for this specific test to return auto_book_enabled: false
    const mockSelectOff = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ 
        data: { id: 'new-trip-id', auto_book_enabled: false }, 
        error: null 
      })
    });
    const mockInsertOff = vi.fn().mockReturnValue({
      select: mockSelectOff
    });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsertOff });
    
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields(); // auto_book_enabled is false by default

    // For auto-booking OFF mode, the button text should be "Search Now"
    const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    const submitButton = submitButtons.find(btn => !(btn as HTMLButtonElement).disabled) || submitButtons[0];
    await userEvent.click(submitButton);

    await waitFor(() => {
      try {
        expect(mockInsertOff).toHaveBeenCalledTimes(1);
      } catch (e) {
        const errors = getFormErrors();
        console.warn('Form validation errors during submission (auto-booking OFF):', errors);
        console.warn('Submit button state:', (submitButton as HTMLButtonElement).disabled);
        throw e;
      }
    }, { timeout: 10000 });

    const submittedPayload = mockInsertOff.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('auto_book_enabled', false);
    expect(submittedPayload.max_price).toBeNull(); // Or undefined, depending on how it's handled when not set
    expect(submittedPayload.preferred_payment_method_id).toBeNull(); // Or undefined

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id&mode=manual'));
    await waitFor(() => expect(mockToastFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Trip request submitted",
        description: "Your trip request has been successfully submitted!", // No auto-booking text
      })
    ));
  });
});
