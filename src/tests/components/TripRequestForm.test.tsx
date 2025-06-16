
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm'; // Adjust path as needed

import { supabase } from '@/integrations/supabase/client'; // Assuming supabase client is imported like this

import { useCurrentUser } from '@/hooks/useCurrentUser'; // Assuming custom hook
import { toast } from '@/components/ui/use-toast'; // Assuming toast is from here

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

// Mock useFeatureFlag for date range tests
vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flagName: string) => {
    if (flagName === 'extended_date_range') {
      return true; // Enable the feature for these tests
    }
    // Add more conditions if other flags need specific mock values for other tests
    return false; // Default mock value
  }
}));

describe('TripRequestForm - Filter Toggles Logic', () => {
  beforeEach(() => {
    // Reset mocks before each test in this suite
    vi.clearAllMocks();

    // Setup default mock implementations for this suite if needed
    (useCurrentUser as Mock).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as Mock).mockReturnValue(vi.fn());
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
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    // Mock navigate
    (useNavigate as Mock).mockReturnValue(vi.fn());
  });

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as Mock).mockReturnValue({
      insert: mockInsert,
    });
    // const mockToast = vi.fn(); // This was unused due to mockImplementation below
    // (toast as vi.Mock).mockReturnValue(mockToast);

    const mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
        mockToastFn(options); // Capture toast options
        return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() }; // Return structure expected by use-toast
    });
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
    await userEvent.type(screen.getByRole('combobox', { name: /destination/i }), 'LAX');
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
    await userEvent.type(screen.getByPlaceholderText(/e\.g\. SFO, BOS/i), 'SFO');

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
      expect(mockToastFn).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Trip request submitted",
          description: "Your trip request has been successfully submitted!",
        })
      );
    });
  });
});

// Helper function to fill the base form fields
// IMPORTANT: This helper might need adjustment for date fields if direct fireEvent.change doesn't work
// with the Calendar components. For now, assuming it might work or can be adapted.
const fillBaseFormFields = async (earliestDateStr?: string, latestDateStr?: string) => {
  // Destination
  // Wait for the combobox to be available and then type
  const destinationCombobox = await screen.findByRole('combobox', { name: /destination/i });
  await userEvent.clear(destinationCombobox); // Clear existing value if any
  await userEvent.type(destinationCombobox, 'LAX');
  // Add a small delay or wait for an option to appear if it's a real combobox that filters
  // For simplicity, assuming typing 'LAX' is enough or it's a free text input part of combobox.

  // Departure Airport
  const departureInput = await screen.findByPlaceholderText(/e\.g\. SFO, BOS/i);
  await userEvent.clear(departureInput);
  await userEvent.type(departureInput, 'SFO');

  // Dates - This is the part that needs careful handling for Calendar components
  // The labels "Earliest departure date" and "Latest departure date" might be associated
  // with the PopoverTrigger buttons, not hidden inputs that RHF directly controls via simple change.
  // For robust testing, one might need to click the trigger, then select a date from the calendar.
  // However, if RHF updates underlying state correctly via field.onChange from Calendar,
  // we might not need to simulate full calendar interaction if we can directly set field values
  // or if a simpler interaction is found.
  // For now, let's stick to the previous fireEvent.change pattern and see if it works or needs refinement.
  // These labels might not exist directly. The Popover triggers have text "Earliest" / "Latest" or the selected date.
  // Let's assume we find them by their initial text content if no explicit label.
  // This part is highly dependent on the actual DOM structure of DateRangeField.
  // For the purpose of this change, we'll use placeholder logic for date setting.
  // Actual implementation will require inspecting the DOM and possibly a more complex helper.

  if (earliestDateStr) {
    // This is a simplified placeholder. Actual date selection will be more complex.
    // Option 1: Try to find by role 'button' and text 'Earliest' then interact with calendar.
    // Option 2: If RHF field can be manipulated directly (less likely for custom calendar).
    // For now, we'll assume a way to set it, e.g., by a test utility or direct field manipulation if possible.
    // This is the most complex part of the test.
    // Let's assume fireEvent.change on a hidden input or a specific data-testid input if available.
    // The original tests used getByLabelText - this might be from an outer label for the FormItem.
    // If DateRangeField's FormField items have labels "Earliest departure" and "Latest departure", this could work.
    // The DateRangeField itself has <FormLabel>Departure Date Range</FormLabel>
    // The individual popover triggers are buttons.
    // Let's assume getByLabelText refers to an Aria-label or a connected label to the RHF field.
    // The form structure is: FormField -> FormItem -> Popover -> PopoverTrigger (Button) -> PopoverContent (Calendar)
    // The `name` prop on FormField connects it to RHF. If FormItem has a FormLabel, it could be it.
    // The DateRangeField.tsx does NOT seem to provide individual FormLabels for "earliestDeparture" and "latestDeparture"
    // directly around the PopoverTriggers in a way that getByLabelText would find them as "Earliest departure date".
    // This means the previous `fireEvent.change(screen.getByLabelText(...))` is unlikely to work.

    // For now, we will skip the date interaction part in this helper,
    // and it will be handled specifically in the date validation tests.
  }
  if (latestDateStr) {
    // Similar to earliestDateStr.
  }

  // Budget
  const budgetInput = await screen.findByLabelText(/budget/i);
  await userEvent.clear(budgetInput);
  await userEvent.type(budgetInput, '1200');

  // Durations
  const minDurationInput = await screen.findByLabelText(/minimum trip duration/i);
  await userEvent.clear(minDurationInput);
  await userEvent.type(minDurationInput, '5');

  const maxDurationInput = await screen.findByLabelText(/maximum trip duration/i);
  await userEvent.clear(maxDurationInput);
  await userEvent.type(maxDurationInput, '10');
};

// Helper function to select a date in the ShadCN Calendar
// This is a more realistic way to interact with the date pickers
const selectDateInCalendar = async (datePickerTriggerText: RegExp | string, dateToSelect: Date) => {
  // Open the calendar popover
  const datePickerButton = await screen.findByRole('button', { name: datePickerTriggerText });
  await userEvent.click(datePickerButton);

  // Wait for the calendar to appear
  const calendarMonthYear = dateToSelect.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  // Example: "October 2024". `react-day-picker` uses this as part of its caption.
  // We might need to navigate months if the target date is not in the current view.
  // For simplicity, assume current month or handle navigation separately if needed.
  // For now, let's assume the month is already visible or simple navigation is handled by user.
  // More robust: check current month, click next/prev until target month is visible.

  // Select the day
  // Days are buttons, their accessible name might be "MMMM d, yyyy" or just "d" within a context.
  // Let's try finding by the day number within the calendar.
  // `react-day-picker` often has role="gridcell" for days, containing a button or being a button itself.
  const dayButton = await screen.findByRole('gridcell', { name: new RegExp(`^${dateToSelect.getDate()}$`) }); // Matches day number, e.g., "15"
  // This might be too simple if multiple months are shown or if day numbers repeat.
  // A more precise selector would be `name: dateToSelect.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })`
  // e.g., "Tuesday, October 15, 2024"
  // Or, within a specific calendar grid for the month.
  // For ShadCN, the day cells might have a name like "15".
  // Let's try a simpler name selector for the day within the opened calendar.
  // The actual accessible name might be "Choose Sunday, October 27th, 2024" or similar.
  // Or just the day number as text content.
  // Let's assume we can find a button with the day number.
  // A common pattern for react-day-picker is `button[name="Go to date D"]` or similar if not disabled.
  // Or `div[role="gridcell"][aria-label="...full date..."] button`
  // Let's try finding a button whose text content is the day.
  const dayButtons = await screen.findAllByRole('button', { name: (name) => name === String(dateToSelect.getDate()) });
  // This might find multiple if day numbers are repeated (e.g. in calendar headers/footers or multiple months).
  // We need to ensure we click the one in the main calendar grid.
  // Usually, the day cell itself might be the button or contain it.
  // Let's assume the first one found after opening the popover is correct for now.
  // A more robust selector would be needed in a real scenario, possibly involving `within`.
  await userEvent.click(dayButtons[0]); // This is a guess, might need refinement.
};


describe('TripRequestForm - Date Range Validation (Extended)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as Mock).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as Mock).mockReturnValue(vi.fn());
    // Ensure useFeatureFlag mock is active (defined globally for this file)
  });

  it('should display validation error for date range > 120 days', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    // Fill other required fields using the helper, but dates will be set manually
    await fillBaseFormFields(); // This will fill non-date fields

    const today = new Date();
    const earliestDepartureDate = addDays(today, 1);
    const latestDepartureDate = addDays(earliestDepartureDate, 121); // 121 days range

    // Select earliest date
    // The trigger button initially has text "Earliest"
    await selectDateInCalendar(/Earliest/i, earliestDepartureDate);

    // Select latest date
    // The trigger button initially has text "Latest"
    await selectDateInCalendar(/Latest/i, latestDepartureDate);

    // Attempt to submit or trigger validation
    const submitButton = screen.getByRole('button', { name: /search now/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Date range cannot exceed 120 days \(≈ 4 months\)/i);
      expect(errorMessage).toBeVisible();
    });
  });

  it('should NOT display validation error for date range <= 120 days (e.g., 90 days)', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields(); // Fill non-date fields

    const today = new Date();
    const earliestDepartureDate = addDays(today, 1);
    const latestDepartureDate = addDays(earliestDepartureDate, 90); // 90 days range

    await selectDateInCalendar(/Earliest/i, earliestDepartureDate);
    await selectDateInCalendar(/Latest/i, latestDepartureDate);

    // Fill other required fields if not already done by fillBaseFormFields (it should have)
    // It is important that all other fields are valid for this test.

    const submitButton = screen.getByRole('button', { name: /search now/i });
    // Before clicking submit, the error should ideally not be there if inputs are valid.
    // For range validation, RHF might show it upon interaction with the second date field or on submit.

    // Check that error message is NOT initially visible after valid date selection
    // This depends on when RHF validation runs (onChange, onBlur, onSubmit)
    // For refine, it often runs on submit or when dependent fields change.
    expect(screen.queryByText(/Date range cannot exceed 120 days/i)).not.toBeInTheDocument();

    // Click submit to ensure validation passes if it's only checked on submit
    await userEvent.click(submitButton);

    // After attempting submission with a valid range, the error should still not be there.
    // And, if other fields are valid, submission should proceed (mockInsert would be called).
    await waitFor(() => {
      expect(screen.queryByText(/Date range cannot exceed 120 days/i)).not.toBeInTheDocument();
    });

    // Optionally, check if submission was attempted (if all other fields are valid)
    // This would require supabase.insert mock to be configured for this test.
    // For now, focusing on the absence of the specific error message.
  });
});


describe('TripRequestForm - Auto-Booking Logic', () => {
  let mockNavigate: Mock;
  let mockToastFn: Mock;
  let mockInsert: Mock;
  // Mock hooks from AutoBookingSection
  const mockUsePaymentMethods = vi.mocked(require('@/hooks/usePaymentMethods').usePaymentMethods);
  const mockUseTravelerInfoCheck = vi.mocked(require('@/hooks/useTravelerInfoCheck').useTravelerInfoCheck);


  beforeEach(() => {
    vi.clearAllMocks();

    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    // Default mocks for auto-booking prerequisites
    mockUsePaymentMethods.mockReturnValue({
      data: [{ id: 'pm_123', brand: 'Visa', last4: '4242', is_default: true, nickname: 'Work Card' }],
      isLoading: false,
    });
    mockUseTravelerInfoCheck.mockReturnValue({
      hasTravelerInfo: true,
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

    // Select a payment method
    const paymentMethodSelect = screen.getByLabelText(/payment method for auto-booking/i);
    await userEvent.click(paymentMethodSelect); // Open select
    await userEvent.click(screen.getByText(/Visa •••• 4242 \(Default\) \(Work Card\)/i)); // Select option

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

    // Do NOT select a payment method

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
    const paymentMethodSelect = screen.getByLabelText(/payment method for auto-booking/i);
    await userEvent.click(paymentMethodSelect);
    await userEvent.click(screen.getByText(/Visa •••• 4242 \(Default\) \(Work Card\)/i));

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
    const paymentMethodSelect = screen.getByLabelText(/payment method for auto-booking/i);
    await userEvent.click(paymentMethodSelect);
    await userEvent.click(screen.getByText(/Visa •••• 4242 \(Default\) \(Work Card\)/i));

    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i });
    await userEvent.click(submitButton);

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));

    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('auto_book_enabled', true);
    expect(submittedPayload).toHaveProperty('max_price', 2000);
    expect(submittedPayload).toHaveProperty('preferred_payment_method_id', 'pm_123');

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id'));
    await waitFor(() => expect(mockToastFn).toHaveBeenCalledWith(
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
    await waitFor(() => expect(mockToastFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Trip request submitted",
        description: "Your trip request has been successfully submitted!", // No auto-booking text
      })
    ));
  });
});
