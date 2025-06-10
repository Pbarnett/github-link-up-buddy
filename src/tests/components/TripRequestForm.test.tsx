
/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm'; // Adjust path as needed
import { supabase } from '@/integrations/supabase/client'; // Fixed import path
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Assuming custom hook
// Remove direct import of toast, will use the shared mock via useToast or direct mock access
// import { toast } from '@/components/ui/use-toast';

// Shared mock implementation for toast, hoisted to be available for vi.mock factory
const { actualMockToastImplementation } = vi.hoisted(() => {
  return { actualMockToastImplementation: vi.fn() };
});

// Mock dependencies

vi.mock('@radix-ui/react-select', async () => {
  const actual = await vi.importActual('@radix-ui/react-select');
  const Select = ({ children, value, onValueChange, ...props }: any) => {
    // Mock a simple input field or a basic select for testing purposes
    // This allows us to control the value directly or type into it.
    return (
      <input
        data-testid={props['data-testid'] || "mock-radix-select"} // Pass through data-testid
        value={value || ''}
        onChange={(e) => onValueChange?.(e.target.value)}
        aria-label={props['aria-label'] || props.name || 'Mock Radix Select'} // Use name if aria-label not provided
        placeholder={props.placeholder}
      />
    );
  };
  const SelectTrigger = ({ children, ...props }: any) => <button {...props} type="button">{children || 'SelectTrigger'}</button>;
  const SelectValue = (props: any) => <span data-testid="mock-select-value">{props.placeholder || 'SelectValue'}</span>;
  const SelectContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  // For SelectItem, we'll make it a simple div that userEvent.click can interact with, returning its value via a data attribute
  const SelectItem = ({ children, value, ...props }: any) => (
    <div data-testid={`mock-select-item-${value}`} data-value={value} {...props} role="option">
      {children}
    </div>
  );

  return {
    ...actual, // Spread actual to keep any other exports not being mocked
    Select: Select, // Mock the main Select component (usually Select.Root)
    SelectRoot: Select, // Alias if components use Select.Root
    Root: Select,     // Alias if components use Root
    SelectTrigger: SelectTrigger,
    SelectValue: SelectValue,
    SelectContent: SelectContent,
    SelectItem: SelectItem,
  };
});

vi.mock('@/integrations/supabase/client', () => {
  const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'default-mock-id' }], error: null });
  const mockSelect = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockSingle = vi.fn().mockResolvedValue({ data: {}, error: null });
  // Add other methods if you know TripRequestForm uses them directly on mount/render

  const fromMock = vi.fn().mockImplementation(() => ({
    select: mockSelect,
    insert: mockInsert, // This specific mockInsert can be overridden per test if needed
    eq: mockEq,
    single: mockSingle,
    // Add other chainable methods here, e.g., order, limit, update
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  }));

  return {
    supabase: {
      from: fromMock,
      // If there are direct supabase client methods used, mock them too
      // e.g., auth: { getUser: vi.fn(), ... }
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
  useToast: () => ({ // Mock the hook
    toast: actualMockToastImplementation, // The hook's toast method uses the shared mock
  }),
  toast: actualMockToastImplementation, // The direct export also uses the shared mock
}));

// Mock custom hooks used by AutoBookingSection
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));

vi.mock('@/hooks/useTravelerInfoCheck', () => ({
  useTravelerInfoCheck: vi.fn(),
}));

describe('TripRequestForm - Filter Toggles Logic', () => {
  beforeEach(() => {
    // Reset mocks before each test in this suite
    vi.clearAllMocks();

    // Setup default mock implementations for this suite if needed
    (useCurrentUser as vi.Mock).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as vi.Mock).mockReturnValue(vi.fn());


    // Provide default mocks for hooks used by AutoBookingSection, even if not primary to this suite
    const mockedUsePaymentMethods = usePaymentMethods as vi.MockedFunction<typeof usePaymentMethods>;
    const mockedUseTravelerInfoCheck = useTravelerInfoCheck as vi.MockedFunction<typeof useTravelerInfoCheck>;

    mockedUsePaymentMethods.mockReset();
    mockedUsePaymentMethods.mockReturnValue({
      data: [{ id: 'pm_1', brand: 'Visa', last4: '4242', is_default: true, nickname: 'Test Card' }],
      isLoading: false,
    });

    mockedUseTravelerInfoCheck.mockReset();
    mockedUseTravelerInfoCheck.mockReturnValue({
      hasTravelerInfo: true,
      isLoading: false,
    });

  });
  // --- Tests for FilterTogglesSection functionality within TripRequestForm ---

  it('should render "Nonstop flights only" switch checked by default', () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
    expect(nonstopSwitch).toBeInTheDocument();
    expect(nonstopSwitch).toBeChecked();
  });

  it('should render "Include carry-on + personal item" switch unchecked by default', () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(baggageSwitch).toBeInTheDocument();
    expect(baggageSwitch).not.toBeChecked();
  });

  it('should update switch state when "Include carry-on + personal item" switch is toggled', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(baggageSwitch).not.toBeChecked(); // Initial state

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).toBeChecked(); // After first click

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).not.toBeChecked(); // After second click
  });

  // Simplified test for default Zod schema values affecting switches
  it('should reflect Zod schema default values for switches on initial render', () => {
    // TripRequestForm uses useForm with Zod schema defaults:
    // nonstop_required: default(true)
    // baggage_included_required: default(false)
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

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
    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    // Mock navigate
    (useNavigate as vi.Mock).mockReturnValue(vi.fn());

    // Provide default mocks for hooks used by AutoBookingSection for this suite too
    const mockedUsePaymentMethods = usePaymentMethods as vi.MockedFunction<typeof usePaymentMethods>;
    const mockedUseTravelerInfoCheck = useTravelerInfoCheck as vi.MockedFunction<typeof useTravelerInfoCheck>;

    mockedUsePaymentMethods.mockReset();
    mockedUsePaymentMethods.mockReturnValue({
      data: [{ id: 'pm_1', brand: 'Visa', last4: '4242', is_default: true, nickname: 'Test Card' }],
      isLoading: false,
    });

    mockedUseTravelerInfoCheck.mockReset();
    mockedUseTravelerInfoCheck.mockReturnValue({
      hasTravelerInfo: true,
      isLoading: false,
    });
  });

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as vi.Mock).mockReturnValue({
      insert: mockInsert,
    });
    // const mockToast = vi.fn(); // This was unused due to mockImplementation below
    // (toast as vi.Mock).mockReturnValue(mockToast); // Old way

    actualMockToastImplementation.mockClear();
    // const mockToastFn = vi.fn(); // Replaced by actualMockToastImplementation
    // (toast as vi.Mock).mockImplementation((options) => { // Old way - this line was the issue
    //     mockToastFn(options); // Capture toast options
    //     return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() }; // Return structure expected by use-toast
    // });
    const mockNavigate = useNavigate(); // Get the mocked navigate function instance

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Fill in the form based on TripRequestForm.tsx structure
    // EnhancedDestinationSection - Assuming a combobox for destination_airport
    // For simplicity, let's assume there's an input field that can be typed into for destination_airport
    // or that typing into a combobox input sets the value.
    // A more robust way would be to find the combobox, open it, and select an option if it's a real combobox.
    // Given EnhancedDestinationSection, it's likely a custom component.
    // Let's assume typing 'LAX' into an input with a label containing 'Destination Airport Code' works.
    // If it's a combobox, you might need to screen.getByRole('combobox', { name: /destination/i })
    // then userEvent.type(combobox, 'LAX'), then potentially click a matching option.
    // For this iteration, we'll assume a simpler input or that typing into combobox sets free text.
    // The combobox for destination is likely a Radix Select, now mocked as an input.
    // We need to ensure it can be found by its label "Destination"
    const destinationInput = screen.getByLabelText(/destination/i, { selector: 'input[data-testid="mock-radix-select"], input[aria-label="Destination"]' });
    await userEvent.clear(destinationInput); // Clear if it has a default mock value
    await userEvent.type(destinationInput, 'LAX');
    // No, EnhancedDestinationSection has a specific input for the airport code:
    // <Input {...field} placeholder="e.g., LAX, LHR, CDG" className="w-full" />
    // This input is part of a form field registered with RHF. Its label might be implicit.
    // Let's try finding by placeholder if label is not explicit or stable.
    // A better way is to use the label if available from the <FormField name="destination_airport">
    // Based on the RHF setup, it's likely linked to a label.
    // The section title is "Where do you want to go?". The input itself might not have a direct visible label.
    // Let's assume screen.getByPlaceholderText('e.g., LAX, LHR, CDG') is how we get destination_airport
    // await userEvent.type(screen.getByPlaceholderText(/e\.g\.\, LAX, LHR, CDG/i), 'LAX');
    // Actually, the combobox itself (from shadcn/ui) should be the input.
    // The name for the combobox seems to be "Destination" due to <Legend>Destination</Legend> in EnhancedDestinationSection.

    // DepartureAirportsSection - fill "Other departure airport"
    // It has <Legend>Where are you flying from?</Legend>
    // And an input with placeholder "e.g. SFO, BOS" for other_departure_airport
    const departureAirportInput = screen.getByLabelText(/Other Departure Airport \(IATA code\)/i);
    departureAirportInput.focus();
    await userEvent.type(departureAirportInput, 'SFO');

    // DateRangeField - "When do you want to travel?"
    // It has two date pickers. Let's assume they have accessible names.
    // Typically, these are complex. We'll try to set values directly.
    // Let's assume the inputs for dates can be found by labels "Earliest departure date" and "Latest departure date"
    // which are default labels in DateRangePicker.tsx used by DateRangeField.tsx
    fireEvent.change(screen.getByLabelText(/earliest departure date/i), { target: { value: '2024-08-15' } });
    fireEvent.change(screen.getByLabelText(/latest departure date/i), { target: { value: '2024-08-20' } });

    // EnhancedBudgetSection - "What's your budget?"
    // Input for budget, assume label "Budget" or similar. It uses InputWithSlider.
    // The input inside InputWithSlider has id="budget" and type="number".
    // Let's try to find it by role 'spinbutton' (for type number) or a label if one is associated.
    // The <Label htmlFor="budget">Budget</Label> exists.
    await userEvent.clear(screen.getByLabelText(/budget/i)); // Clear default value
    await userEvent.type(screen.getByLabelText(/budget/i), '1200');


    // TripDurationInputs - "How long is your trip?"
    // "Minimum trip duration (days)" and "Maximum trip duration (days)"
    // These are likely number inputs.
    await userEvent.clear(screen.getByLabelText(/minimum trip duration/i));
    await userEvent.type(screen.getByLabelText(/minimum trip duration/i), '5');
    await userEvent.clear(screen.getByLabelText(/maximum trip duration/i));
    await userEvent.type(screen.getByLabelText(/maximum trip duration/i), '10');

    // Ensure auto_book_enabled is false so buttonText is "Search Now"
    // Default is false, so no action needed unless it was changed by another test (unlikely with beforeEach clearMocks)

    // Find the submit button. For a new form, default buttonText is "Search Now".
    const submitButton = screen.getByRole('button', { name: /search now/i });
    expect(submitButton).toBeEnabled(); // Should be enabled after filling required fields
    await userEvent.click(submitButton);

    // Verification
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    const submittedPayload = mockInsert.mock.calls[0][0][0];

    expect(submittedPayload).toHaveProperty('destination_airport', 'LAX');
    expect(submittedPayload).toHaveProperty('destination_location_code', 'LAX'); // Key verification
    expect(submittedPayload).toHaveProperty('departure_airports', ['SFO']);
    expect(submittedPayload.earliest_departure).toMatch(/^2024-08-15T\d{2}:\d{2}:\d{2}\.\d{3}Z$/); // Check date format
    expect(submittedPayload.latest_departure).toMatch(/^2024-08-20T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(submittedPayload).toHaveProperty('budget', 1200);
    expect(submittedPayload).toHaveProperty('min_duration', 5);
    expect(submittedPayload).toHaveProperty('max_duration', 10);
    expect(submittedPayload).toHaveProperty('user_id', 'test-user-id');
    expect(submittedPayload).toHaveProperty('nonstop_required', true); // Default
    expect(submittedPayload).toHaveProperty('baggage_included_required', false); // Default
    expect(submittedPayload).toHaveProperty('auto_book_enabled', false); // Default

    // Verify navigation and toast
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id');
    });
    await waitFor(() => {
      expect(actualMockToastImplementation).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Trip request submitted",
          description: "Your trip request has been successfully submitted!",
        })
      );
    });
  });
});

// Helper function to fill the base form fields
const fillBaseFormFields = async () => {
  // Destination input (mocked Radix Select)
  // The FormLabel for Destination is "Destination". The mock input should pick this up via aria-label.
  const destinationInput = screen.getByLabelText(/destination/i, { selector: 'input[data-testid="mock-radix-select"], input[aria-label="Destination"]' });
  await userEvent.clear(destinationInput);
  await userEvent.type(destinationInput, 'LAX');

  const departureAirportInput = screen.getByLabelText(/Other Departure Airport \(IATA code\)/i);
  departureAirportInput.focus();
  await userEvent.type(departureAirportInput, 'SFO');
  fireEvent.change(screen.getByLabelText(/earliest departure date/i), { target: { value: '2024-10-15' } });
  fireEvent.change(screen.getByLabelText(/latest departure date/i), { target: { value: '2024-10-20' } });
  await userEvent.clear(screen.getByLabelText(/budget/i));
  await userEvent.type(screen.getByLabelText(/budget/i), '1200');
  await userEvent.clear(screen.getByLabelText(/minimum trip duration/i));
  await userEvent.type(screen.getByLabelText(/minimum trip duration/i), '5');
  await userEvent.clear(screen.getByLabelText(/maximum trip duration/i));
  await userEvent.type(screen.getByLabelText(/maximum trip duration/i), '10');
};


describe('TripRequestForm - Auto-Booking Logic', () => {
  let mockNavigate: vi.Mock;
  // let mockToastFn: vi.Mock; // Replaced by actualMockToastImplementation
  let mockInsert: vi.Mock;
  // Mock hooks from AutoBookingSection
  const mockUsePaymentMethods = vi.mocked(require('@/hooks/usePaymentMethods').usePaymentMethods);
  const mockUseTravelerInfoCheck = vi.mocked(require('@/hooks/useTravelerInfoCheck').useTravelerInfoCheck);


  beforeEach(() => {
    vi.clearAllMocks();

    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    mockNavigate = vi.fn();
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    actualMockToastImplementation.mockClear();
    // mockToastFn = vi.fn(); // Replaced
    // (toast as vi.Mock).mockImplementation((options) => { // Old way
    //   mockToastFn(options);
    //   return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    // });

    mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as vi.Mock).mockReturnValue({ insert: mockInsert });

    // Default mocks for auto-booking prerequisites

    mockedUsePaymentMethods.mockReturnValue({
      data: [{ id: 'pm_1', brand: 'Visa', last4: '4242', is_default: true, nickname: 'Test Card' }],
      isLoading: false,
    });
    mockedUseTravelerInfoCheck.mockReturnValue({
      hasTravelerInfo: true, // Consistent default

      isLoading: false,
    });
  });

  // Test 1: Rendering and Interaction
  it('should show payment method selection when auto-booking is enabled and prerequisites are met', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // Initially, payment method and max price should not be visible
    expect(screen.queryByLabelText(/maximum price \(usd\) for auto-booking/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/payment method for auto-booking/i)).not.toBeInTheDocument();

    // Enable auto-booking
    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      expect(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i)).toBeVisible();
      expect(screen.getByLabelText(/payment method for auto-booking/i)).toBeVisible();
    });

    // Select a payment method (mocked Radix Select, now an input)
    // The FormLabel for Payment Method is "Payment Method for Auto-Booking"
    const paymentMethodInput = screen.getByLabelText(/payment method for auto-booking/i, { selector: 'input[data-testid="mock-radix-select"], input[aria-label="Payment Method for Auto-Booking"]' });
    await userEvent.clear(paymentMethodInput);
    await userEvent.type(paymentMethodInput, 'pm_123'); // Type the value directly

    // Check if the value is set (indirectly, by checking if it's part of submission later or form state if possible)
    // For now, interaction is the key. The value selection will be verified in submission tests.
  });

  // Test 2.1: Zod Validation - Missing Payment Method
  it('should fail submission if auto-booking is enabled, max_price is set, but no payment method is selected', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      expect(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i)).toBeVisible();
    });
    await userEvent.type(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i), '1500');

    // Do NOT select/type a payment method - ensure the input is clear if it holds a value by default from mock
    const paymentMethodInput = screen.getByLabelText(/payment method for auto-booking/i, { selector: 'input[data-testid="mock-radix-select"], input[aria-label="Payment Method for Auto-Booking"]' });
    await userEvent.clear(paymentMethodInput);


    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i }); // Button text changes
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).not.toHaveBeenCalled();
    });

    // Check for toast message related to payment method
    // The Zod refine path is 'preferred_payment_method_id', message "Maximum price and payment method are required for auto-booking"
    // React Hook Form might show this near the field or as a general toast.
    // For now, checking the toast is a primary check.
    // The form also shows an Alert: "Select Payment Method"
    expect(await screen.findByText('Select Payment Method')).toBeVisible(); // From AutoBookingSection internal alert
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

    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
       expect(screen.getByLabelText(/payment method for auto-booking/i)).toBeVisible();
    });
    const paymentMethodInput = screen.getByLabelText(/payment method for auto-booking/i, { selector: 'input[data-testid="mock-radix-select"], input[aria-label="Payment Method for Auto-Booking"]' });
    await userEvent.clear(paymentMethodInput);
    await userEvent.type(paymentMethodInput, 'pm_123');


    // Do NOT fill max_price

    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i });
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
        const specificError = screen.queryByText("Maximum price and payment method are required for auto-booking");
        // This message might be associated with preferred_payment_method_id field.
        // For TripNumberField (max_price), its own Zod min/max errors like "Number must be greater/less than" would show.
        // The *specific* refine message "Maximum price and payment method are required for auto-booking"
        // is what we are interested in.
        // This error message might appear near the 'preferred_payment_method_id' field.
        // Or, if the form doesn't explicitly render this error, the test might need to inspect form.formState.errors.
        // For now, asserting no submission is key. The Zod schema *should* prevent it.
        // If the form is well-behaved, an error message tied to the 'path' of the refine should be visible.
        // This might require inspecting the DOM near the preferred_payment_method_id field.
        // For now, we'll rely on no submission and check if a relevant toast appears.
        // If the Zod error is caught by the global onSubmit catch, a generic error toast will show.
        // This might be "Error: Failed to create trip request. Please try again." or the Zod message.
        // The schema path was changed to "preferred_payment_method_id", so we expect the error message
        // "Maximum price and payment method are required for auto-booking" to be associated with that field.
        // Let's assume the component renders this error message.
        expect(screen.getByText("Maximum price and payment method are required for auto-booking")).toBeVisible();
     });
  });

  // Test 3: Successful Submission with Auto-Booking ON
  it('should submit successfully with auto-booking ON, payment method, and max_price', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      expect(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i)).toBeVisible();
      expect(screen.getByLabelText(/payment method for auto-booking/i)).toBeVisible();
    });

    await userEvent.type(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i), '2000');
    const paymentMethodInput = screen.getByLabelText(/payment method for auto-booking/i, { selector: 'input[data-testid="mock-radix-select"], input[aria-label="Payment Method for Auto-Booking"]' });
    await userEvent.clear(paymentMethodInput);
    await userEvent.type(paymentMethodInput, 'pm_123');

    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i });
    await userEvent.click(submitButton);

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));

    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('auto_book_enabled', true);
    expect(submittedPayload).toHaveProperty('max_price', 2000);
    expect(submittedPayload).toHaveProperty('preferred_payment_method_id', 'pm_123');

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id'));
    await waitFor(() => expect(actualMockToastImplementation).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Trip request submitted",
        description: "Your trip request has been successfully submitted! Auto-booking is enabled.",
      })
    ));
  });

  // Test 4: No Regression - Auto-Booking OFF (covered by existing test, but check payload here too)
  it('should submit successfully with auto-booking OFF, not sending auto-booking fields', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields(); // auto_book_enabled is false by default

    const submitButton = screen.getByRole('button', { name: /search now/i });
    await userEvent.click(submitButton);

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));

    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('auto_book_enabled', false);
    expect(submittedPayload.max_price).toBeNull(); // Or undefined, depending on how it's handled when not set
    expect(submittedPayload.preferred_payment_method_id).toBeNull(); // Or undefined

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id'));
    await waitFor(() => expect(actualMockToastImplementation).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Trip request submitted",
        description: "Your trip request has been successfully submitted!", // No auto-booking text
      })
    ));
  });
});
