import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm'; // Adjust path as needed
import { supabase } from '@/lib/supabase'; // Assuming supabase client is imported like this
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Assuming custom hook
import { toast } from '@/components/ui/use-toast'; // Assuming toast is from here

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
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

describe('TripRequestForm - Filter Toggles Logic', () => {
  beforeEach(() => {
    // Reset mocks before each test in this suite
    vi.clearAllMocks();

    // Setup default mock implementations for this suite if needed
    (useCurrentUser as vi.Mock).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as vi.Mock).mockReturnValue(vi.fn());
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
  });

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as vi.Mock).mockReturnValue({
      insert: mockInsert,
    });
    const mockToast = vi.fn();
    (toast as vi.Mock).mockReturnValue(mockToast); // Corrected toast mock

    const mockToastFn = vi.fn();
    (toast as vi.Mock).mockImplementation((options) => {
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
