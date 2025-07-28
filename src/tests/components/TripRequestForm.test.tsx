import * as React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { TestWrapper, renderWithProviders } from '@/tests/utils/TestWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useTravelerInfoCheck } from '@/hooks/useTravelerInfoCheck';

// Import our new testing utilities
import {
  fillBaseFormFieldsWithDates,
  getFormErrors,
  waitForButtonEnabledAndClick,
} from '@/tests/utils/formTestHelpers';
import { TripRequestRepository } from '@/lib/repositories';

// Mock the Calendar component to provide test-friendly date selection
vi.mock('@/components/ui/calendar', () => {
  return {
    Calendar: ({ onSelect }: { onSelect?: (date: Date) => void }) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      return (
        <div data-testid="mock-day-picker" role="grid">
          <button
            onClick={() => onSelect && onSelect(tomorrow)}
            data-testid="calendar-day-tomorrow"
            type="button"
          >
            {tomorrow.getDate()}
          </button>
          <button
            onClick={() => onSelect && onSelect(nextWeek)}
            data-testid="calendar-day-next-week"
            type="button"
          >
            {nextWeek.getDate()}
          </button>
        </div>
      );
    },
  };
});

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockImplementation(table => {
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { id: 'new-trip-id' }, error: null }),
      };
      return mockQuery;
    }),
    functions: {
      invoke: vi
        .fn()
        .mockResolvedValue({ data: { success: true }, error: null }),
    },
  },
}));

// Mock Supabase client interactions
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: () => ({
      insert: () => ({ data: [{ id: 'trip-123' }], error: null }),
      select: () => ({ data: [{ iata: 'ATL' }], error: null }),
      single: () => ({ data: { id: 'trip-123' }, error: null }),
    }),
  },
}));

// Mock global fetch for Stripe calls
if (typeof global.fetch === 'undefined') {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
    text: vi.fn().mockResolvedValue(''),
  });
}

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

// Mock the TripRequestRepository using Vitest best practices
// Reference: https://vitest.dev/guide/mocking.html#modules
const mockCreateTripRequest = vi.fn();
const mockUpdateTripRequest = vi.fn();
const mockFindById = vi.fn();

vi.mock('@/lib/repositories', () => {
  // Create a mock class that properly handles constructor calls
  class MockTripRequestRepository {
    constructor(client: any) {
      // Mock constructor - accept any client
    }

    createTripRequest = mockCreateTripRequest;
    updateTripRequest = mockUpdateTripRequest;
    findById = mockFindById;
  }

  return {
    TripRequestRepository: MockTripRequestRepository,
  };
});

// Mock logger
vi.mock('@/lib/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock error handlers
vi.mock('@/lib/errors', () => ({
  handleError: vi.fn(error => ({
    code: 'GENERIC_ERROR',
    message: error.message || 'An error occurred',
    userMessage: 'Something went wrong. Please try again.',
  })),
  ValidationError: class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  },
}));

// Mock useFeatureFlag hook to prevent LaunchDarkly issues
vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn((flagName: string, defaultValue: boolean = false) => ({
    data: defaultValue,
    isLoading: false,
    isError: false,
    error: null,
  })),
  useFeatureFlagLegacy: vi.fn(
    (flagName: string, defaultValue: boolean = false) => defaultValue
  ),
  useClientFeatureFlag: vi.fn(
    (
      flagName: string,
      rolloutPercentage: number,
      defaultValue: boolean = false
    ) => defaultValue
  ),
}));

// Mock useMobile hook to prevent addEventListener errors
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn().mockReturnValue(false),
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
      data: [
        {
          id: 'pm_123',
          brand: 'Visa',
          last4: '4242',
          is_default: true,
          nickname: 'Work Card',
        },
      ],
      isLoading: false,
      error: null,
    });

    // Mock useTravelerInfoCheck to return expected structure
    (useTravelerInfoCheck as Mock).mockReturnValue({
      data: { has_traveler_info: true },
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  // --- Tests for FilterTogglesSection functionality within TripRequestForm ---

  it('should render "Nonstop flights only" switch checked by default', async () => {
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

    // First expand the collapsible filters section
    const expandButton = await screen.findByText(
      "What's Included",
      {},
      { timeout: 5000 }
    );
    await userEvent.click(expandButton);

    // Wait for the switch to appear
    const nonstopSwitch = await screen.findByRole(
      'switch',
      { name: /nonstop flights only/i },
      { timeout: 5000 }
    );
    expect(nonstopSwitch).toBeInTheDocument();
    expect(nonstopSwitch).toBeChecked();
  }, 8000);

  it('should render "Include carry-on + personal item" switch unchecked by default', async () => {
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

    // First expand the collapsible filters section
    const expandButton = await screen.findByText(
      "What's Included",
      {},
      { timeout: 5000 }
    );
    await userEvent.click(expandButton);

    // Wait for the switch to appear
    const baggageSwitch = await screen.findByRole(
      'switch',
      { name: /include carry-on \+ personal item/i },
      { timeout: 5000 }
    );
    expect(baggageSwitch).toBeInTheDocument();
    expect(baggageSwitch).not.toBeChecked();
  }, 8000);

  it('should update switch state when "Include carry-on + personal item" switch is toggled', async () => {
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

    // First expand the collapsible filters section
    const expandButton = await screen.findByText(
      "What's Included",
      {},
      { timeout: 5000 }
    );
    await userEvent.click(expandButton);

    // Wait for the switch to appear
    const baggageSwitch = await screen.findByRole(
      'switch',
      { name: /include carry-on \+ personal item/i },
      { timeout: 5000 }
    );
    expect(baggageSwitch).not.toBeChecked(); // Initial state

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).toBeChecked(); // After first click

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).not.toBeChecked(); // After second click
  }, 8000);

  // Simplified test for default Zod schema values affecting switches
  it('should reflect Zod schema default values for switches on initial render', async () => {
    // TripRequestForm uses useForm with Zod schema defaults:
    // nonstop_required: default(true)
    // baggage_included_required: default(false)
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

    // First expand the collapsible filters section
    const expandButton = await screen.findByText(
      "What's Included",
      {},
      { timeout: 5000 }
    );
    await userEvent.click(expandButton);

    // Wait for the switches to appear
    const nonstopSwitch = await screen.findByRole(
      'switch',
      { name: /nonstop flights only/i },
      { timeout: 5000 }
    );
    const baggageSwitch = await screen.findByRole(
      'switch',
      { name: /include carry-on \+ personal item/i },
      { timeout: 5000 }
    );

    expect(nonstopSwitch).toBeChecked();
    expect(baggageSwitch).not.toBeChecked();
    // This test implicitly covers the "editing an existing trip with prefilled filter values" if
    // the form.reset() in useEffect correctly populates these from fetched data.
    // A more direct test for "editing" would require mocking the fetchTripDetails call.
  }, 8000);

  // --- End of Tests for FilterTogglesSection functionality ---
});

describe('TripRequestForm - Submission Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock current user
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id',
    });

    // Mock navigate
    (useNavigate as Mock).mockReturnValue(vi.fn());

    // Mock usePaymentMethods and useTravelerInfoCheck
    (usePaymentMethods as Mock).mockReturnValue({
      data: [
        {
          id: 'pm_123',
          brand: 'Visa',
          last4: '4242',
          is_default: true,
          nickname: 'Work Card',
        },
      ],
      isLoading: false,
      error: null,
    });

    (useTravelerInfoCheck as Mock).mockReturnValue({
      data: { has_traveler_info: true },
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    // RESEARCH FIX: Configure mock return values properly
    mockCreateTripRequest.mockResolvedValue({
      id: 'new-trip-id',
      user_id: 'test-user-id',
      destination_airport: 'LAX',
      destination_location_code: 'LAX',
      departure_airports: ['SFO'],
      budget: 1200,
      auto_book_enabled: false,
      created_at: new Date().toISOString(),
    });

    // Mock Supabase functions
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: null,
    });

    const user = userEvent.setup();
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

    // RESEARCH FIX: Use enhanced form filling with validation timing
    console.log('TEST: Setting form values using research-based approach');

    // Fill form using our enhanced helper
    await fillBaseFormFieldsWithDates({
      destination: 'LAX',
      departureAirport: 'SFO',
      maxPrice: 1200,
      minDuration: 5,
      maxDuration: 10,
    });

    console.log('TEST: Form values set using enhanced helper');

    // RESEARCH FIX: Wait for form validation to complete using waitFor
    // This addresses the "formState.isValid updates on the next render" issue
    await waitFor(
      () => {
        const submitButton = screen.getByTestId('primary-submit-button');
        expect(submitButton).toBeEnabled();
      },
      { timeout: 5000 }
    );

    console.log('TEST: Submit button is enabled after validation');

    // RESEARCH FIX: Blur all form fields to ensure validation completes
    // This addresses "onBlur validation might not run" issue
    await user.click(document.body);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the submit button
    const submitButton = screen.getByTestId('primary-submit-button');
    console.log('TEST: Submit button found:', submitButton.textContent);

    // RESEARCH FIX: Use act() to ensure React flushes all state updates
    console.log('TEST: Clicking submit button with proper async handling');

    await act(async () => {
      await user.click(submitButton);
    });

    console.log('TEST: After click, waiting for async validation to complete');

    // RESEARCH FIX: Wait for async validation to complete before checking mocks
    // This addresses "all validation methods in RHF are treated as async" issue
    await waitFor(
      () => {
        console.log(
          'TEST: Checking mock calls:',
          mockCreateTripRequest.mock.calls.length
        );
        expect(mockCreateTripRequest).toHaveBeenCalled();
      },
      { timeout: 10000 }
    ); // Increased timeout for async validation

    // 3) Success - the mock was called, no need to wait for specific UI text
    expect(mockCreateTripRequest).toHaveBeenCalledTimes(1);
    console.log('TEST: Test completed successfully');
  }, 20_000);
});

// Enhanced helper function using our new utilities
const selectDestination = async (destinationCode: string) => {
  try {
    // Find the Select trigger button by its label
    const selectTrigger = screen.getByRole('combobox', {
      name: /destination/i,
    });

    // Open the select dropdown
    await userEvent.click(selectTrigger);

    // Wait for options to appear and select the desired option
    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: new RegExp(destinationCode, 'i') })
      ).toBeVisible();
    });

    const option = screen.getByRole('option', {
      name: new RegExp(destinationCode, 'i'),
    });
    await userEvent.click(option);

    // Wait for select to close
    await waitFor(() => {
      expect(
        screen.queryByRole('option', { name: new RegExp(destinationCode, 'i') })
      ).not.toBeInTheDocument();
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
    destination: 'MVY', // Use airport code which will match "Martha's Vineyard (MVY)"
    departureAirport: 'SFO',
    maxPrice: 1200,
    minDuration: 5,
    maxDuration: 10,
  });
};

// Helper for auto-booking OFF tests that doesn't set auto-booking fields
const fillBaseFormFieldsNoAutoBooking = async () => {
  // Use our enhanced helper but skip max_price for auto-booking OFF tests
  await fillBaseFormFieldsWithDates({
    destination: 'MVY', // Use airport code which will match "Martha's Vineyard (MVY)"
    departureAirport: 'SFO',
    minDuration: 5,
    maxDuration: 10,
    skipValidation: true, // Skip validation since we're not setting all fields
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
      userId: 'test-user-id',
    });

    mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    mockToastFn = vi.fn();
    (toast as Mock).mockImplementation(options => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    // Set up comprehensive Supabase mocks
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'new-trip-id', auto_book_enabled: true },
      error: null,
    });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ select: mockSelect });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });

    (supabase.from as Mock).mockReturnValue({
      insert: mockInsert,
      update: mockUpdate,
      select: mockSelect,
      eq: mockEq,
    });

    // Mock Supabase functions for flight search
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: null,
      error: null,
    });

    // Default mocks for auto-booking prerequisites
    mockUsePaymentMethods.mockReturnValue({
      data: [
        {
          id: 'pm_123',
          brand: 'Visa',
          last4: '4242',
          is_default: true,
          nickname: 'Work Card',
          exp_month: 12,
          exp_year: 2025,
          created_at: '2024-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
      refetch: vi.fn(),
      addPaymentMethod: vi.fn(),
      updatePaymentMethod: vi.fn(),
      deletePaymentMethod: vi.fn(),
      setDefaultPaymentMethod: vi.fn(),
    });
    mockUseTravelerInfoCheck.mockReturnValue({
      hasTravelerInfo: true,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Test 1: Rendering and Interaction
  it('should show payment method selection when auto-booking is enabled and prerequisites are met', async () => {
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

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
      const visaOption = screen.getByRole('option', {
        name: /Visa.*4242.*Default.*Work Card/i,
      });
      expect(visaOption).toBeVisible();
    });

    const visaOption = screen.getByRole('option', {
      name: /Visa.*4242.*Default.*Work Card/i,
    });
    await userEvent.click(visaOption);

    // Check if the value is set (indirectly, by checking if it's part of submission later or form state if possible)
    // For now, interaction is the key. The value selection will be verified in submission tests.
  });

  // Test 2.1: Zod Validation - Missing Payment Method
  it('should fail submission if auto-booking is enabled, max_price is set, but no payment method is selected', async () => {
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });
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
    const submitButtons = screen.getAllByRole('button', {
      name: /start auto-booking/i,
    });
    const submitButton =
      submitButtons.find(btn => !(btn as HTMLButtonElement).disabled) ||
      submitButtons[0];
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTripRequest).not.toHaveBeenCalled();
    });

    // Check for toast message related to payment method
    // The Zod refine path is 'preferred_payment_method_id', message "Maximum price and payment method are required for auto-booking"
    // React Hook Form might show this near the field or as a general toast.
    // Check that the form doesn't submit - the insert should not be called
    await waitFor(() => {
      expect(mockCreateTripRequest).not.toHaveBeenCalled();
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
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });
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
      const visaOption = screen.getByRole('option', {
        name: /Visa.*4242.*Default.*Work Card/i,
      });
      expect(visaOption).toBeVisible();
    });

    const visaOption = screen.getByRole('option', {
      name: /Visa.*4242.*Default.*Work Card/i,
    });
    await userEvent.click(visaOption);

    // Clear max_price from the main budget section using fireEvent
    const maxPriceInput = screen.getByDisplayValue('1200'); // Value set by fillBaseFormFields
    fireEvent.change(maxPriceInput, { target: { value: '' } });

    // When auto-booking is enabled, the button text changes to "Start Auto-Booking"
    const submitButtons = screen.getAllByRole('button', {
      name: /start auto-booking/i,
    });
    const submitButton =
      submitButtons.find(btn => !(btn as HTMLButtonElement).disabled) ||
      submitButtons[0];
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTripRequest).not.toHaveBeenCalled();
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
    await waitFor(
      () => {
        // The form validation should prevent submission, which we've already verified
        // Let's check for any validation-related error messages or form state
        const formErrors = getFormErrors();
        console.log('Form validation errors found:', formErrors);

        // The test is mainly that mockCreateTripRequest was not called, indicating validation worked
        // Additional validation message checking could include:
        // 1. Form field error messages
        // 2. Toast notifications
        // 3. Alert components

        // For now, the key assertion is that form submission was prevented
        expect(mockCreateTripRequest).not.toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  // Test 3: Successful Submission with Auto-Booking ON
  it('should submit successfully with auto-booking ON, payment method, and max_price', async () => {
    // RESEARCH FIX: Configure the global mock properly
    mockCreateTripRequest.mockResolvedValue({
      id: 'new-trip-id',
      user_id: 'test-user-id',
      destination_airport: 'MVY',
      destination_location_code: 'MVY',
      departure_airports: ['SFO'],
      budget: 2000,
      auto_book_enabled: true,
      max_price: 2000,
      preferred_payment_method_id: 'pm_123',
      created_at: new Date().toISOString(),
    });

    // Mock Supabase functions
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: null,
    });

    const user = userEvent.setup();
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

    // Fill form with auto-booking fields
    await fillBaseFormFieldsWithDates({
      destination: 'MVY',
      departureAirport: 'SFO',
      maxPrice: 2000,
      minDuration: 5,
      maxDuration: 10,
    });

    // Enable auto-booking
    await waitFor(
      () => {
        expect(
          screen.getByLabelText(/enable auto-booking/i)
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const autoBookSwitch = screen.getByLabelText(/enable auto-booking/i);
    await user.click(autoBookSwitch);

    // Select payment method
    await waitFor(
      () => {
        expect(screen.getByLabelText(/payment method/i)).toBeVisible();
      },
      { timeout: 3000 }
    );

    const paymentMethodSelect = screen.getByLabelText(/payment method/i);
    await user.click(paymentMethodSelect);

    await waitFor(
      () => {
        const visaOption = screen.getByRole('option', {
          name: /Visa.*4242.*Default.*Work Card/i,
        });
        expect(visaOption).toBeVisible();
      },
      { timeout: 3000 }
    );

    const visaOption = screen.getByRole('option', {
      name: /Visa.*4242.*Default.*Work Card/i,
    });
    await user.click(visaOption);

    // RESEARCH FIX: Wait for form validation to complete after all changes
    await waitFor(
      () => {
        const submitButton = screen.getByTestId('primary-submit-button');
        expect(submitButton).toBeEnabled();
      },
      { timeout: 5000 }
    );

    // RESEARCH FIX: Blur to ensure all validation completes
    await user.click(document.body);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Try to find enabled auto-booking button, or fallback to primary button
    let submitButton;
    try {
      const autoBookingButtons = screen.getAllByRole('button', {
        name: /start auto-booking/i,
      });
      submitButton =
        autoBookingButtons.find(btn => !(btn as HTMLButtonElement).disabled) ||
        screen.getByTestId('primary-submit-button');
    } catch {
      submitButton = screen.getByTestId('primary-submit-button');
    }

    // RESEARCH FIX: Use act() and wait for async validation
    await act(async () => {
      await user.click(submitButton);
    });

    // RESEARCH FIX: Increased timeout for async validation
    await waitFor(
      () => {
        expect(mockCreateTripRequest).toHaveBeenCalled();
      },
      { timeout: 10000 }
    );

    // 3) Success - the mock was called, no need to wait for specific UI text
    expect(mockCreateTripRequest).toHaveBeenCalledTimes(1);
  }, 15_000);

  // Test 4: Successful Submission with Auto-Booking OFF
  it('should submit successfully with auto-booking OFF', async () => {
    const mockTripSingle = vi
      .fn()
      .mockResolvedValue({ data: { id: 'new-trip-id' }, error: null });
    const mockTripSelect = vi.fn().mockReturnValue({ single: mockTripSingle });
    const mockTripInsert = vi.fn().mockResolvedValue({ data: [], error: null });

    const mockAirportsSelect = vi.fn().mockResolvedValue({
      data: [{ code: 'MVY', city: 'Marthas Vineyard' }],
      error: null,
    });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      switch (table) {
        case 'trip_requests':
          return { insert: mockTripInsert, select: mockTripSelect } as any;
        case 'airports':
          return { select: mockAirportsSelect } as any;
        default:
          throw new Error(`Unexpected table in test mock: ${table}`);
      }
    });

    const user = userEvent.setup();
    const { wrapper } = renderWithProviders(<TripRequestForm />);
    render(<TripRequestForm />, { wrapper });

    // Fill form WITHOUT auto-booking fields
    await fillBaseFormFieldsNoAutoBooking();

    // Use the primary submit button with testid
    await waitFor(
      () => {
        const submitButton = screen.getByTestId('primary-submit-button');
        expect(submitButton).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // 1) click inside act so React flushes all state
    await act(async () => {
      await user.click(screen.getByTestId('primary-submit-button'));
    });

    // 2) first ensure the trip_requests.insert was called
    await waitFor(() => expect(mockTripInsert).toHaveBeenCalled());

    // 3) Success - the mock was called, no need to wait for specific UI text
    expect(mockTripInsert).toHaveBeenCalledTimes(1);
  }, 10_000);
});
