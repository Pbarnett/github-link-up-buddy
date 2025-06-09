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

describe('TripRequestForm - Destination Location Code Mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });
    (useNavigate as vi.Mock).mockReturnValue(vi.fn());
  });

  it('should populate destination_location_code from destination_airport when submitting', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ 
      data: [{ id: 'new-trip-id', destination_location_code: 'LAX' }], 
      error: null 
    });
    (supabase.from as vi.Mock).mockReturnValue({
      insert: mockInsert,
    });

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Fill in required form fields
    const earliestDateInput = screen.getByLabelText(/earliest departure/i);
    const latestDateInput = screen.getByLabelText(/latest departure/i);
    const budgetInput = screen.getByLabelText(/budget/i);
    
    fireEvent.change(earliestDateInput, { target: { value: '2024-08-15T10:00' } });
    fireEvent.change(latestDateInput, { target: { value: '2024-08-20T10:00' } });
    fireEvent.change(budgetInput, { target: { value: '1500' } });

    // Select departure and destination
    const nycCheckbox = screen.getByRole('checkbox', { name: /jfk/i });
    await userEvent.click(nycCheckbox);
    
    const destinationSelect = screen.getByRole('combobox', { name: /destination/i });
    await userEvent.click(destinationSelect);
    const laxOption = screen.getByText('LAX - Los Angeles');
    await userEvent.click(laxOption);

    const submitButton = screen.getByRole('button', { name: /search now/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    const submittedData = mockInsert.mock.calls[0][0][0];
    
    // Verify that destination_location_code is properly set
    expect(submittedData).toHaveProperty('destination_airport', 'LAX');
    expect(submittedData).toHaveProperty('destination_location_code', 'LAX');
    expect(submittedData).toHaveProperty('user_id', 'test-user-id');
    
    console.log('Submitted data verification:', submittedData);
  });

  it('should handle custom destination airport correctly', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ 
      data: [{ id: 'new-trip-id', destination_location_code: 'SFO' }], 
      error: null 
    });
    (supabase.from as vi.Mock).mockReturnValue({
      insert: mockInsert,
    });

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Fill required fields and custom destination
    const customDestinationInput = screen.getByPlaceholderText(/enter airport code/i);
    await userEvent.type(customDestinationInput, 'SFO');

    // Fill other required fields
    const earliestDateInput = screen.getByLabelText(/earliest departure/i);
    fireEvent.change(earliestDateInput, { target: { value: '2024-08-15T10:00' } });

    const submitButton = screen.getByRole('button', { name: /search now/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    const submittedData = mockInsert.mock.calls[0][0][0];
    
    // Verify both destination_airport and destination_location_code are set to the custom value
    expect(submittedData).toHaveProperty('destination_airport', 'SFO');
    expect(submittedData).toHaveProperty('destination_location_code', 'SFO');
  });
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

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Fill in the form (adjust field labels/roles as per actual component)
    // Assuming standard input fields. If using custom components, adjust selectors.
    await userEvent.type(screen.getByLabelText(/departure airport/i), 'SFO');
    await userEvent.type(screen.getByLabelText(/destination airport/i), 'LAX');
    // For date inputs, direct value setting might be needed if userEvent.type is problematic
    fireEvent.change(screen.getByLabelText(/departure date/i), { target: { value: '2024-08-15' } });
    fireEvent.change(screen.getByLabelText(/return date/i), { target: { value: '2024-08-20' } });
    await userEvent.type(screen.getByLabelText(/number of travelers/i), '1');

    // Find the submit button - assuming it's a button with type="submit" or specific text
    // Let's assume the button has text "Create Trip" or "Submit"
    const submitButton = screen.getByRole('button', { name: /create trip/i }); // Adjust name if different
    await userEvent.click(submitButton);

    // Verification
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    const submittedData = mockInsert.mock.calls[0][0][0]; // Get the first argument of the first call, which is the submitted object

    expect(submittedData).toHaveProperty('destination_airport', 'LAX');
    expect(submittedData).toHaveProperty('destination_location_code', 'LAX'); // Key verification
    expect(submittedData).toHaveProperty('departure_airport', 'SFO');
    expect(submittedData).toHaveProperty('departure_date', '2024-08-15');
    expect(submittedData).toHaveProperty('return_date', '2024-08-20');
    expect(submittedData).toHaveProperty('num_travelers', 1); // Assuming the field name in schema is num_travelers
    expect(submittedData).toHaveProperty('user_id', 'test-user-id');

    // Verify navigation and toast
    await waitFor(() => {
      expect(useNavigate()()).toHaveBeenCalledTimes(1); // Check if navigate was called
      // expect(toast().toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' })); // Check toast
    });
  });
});
