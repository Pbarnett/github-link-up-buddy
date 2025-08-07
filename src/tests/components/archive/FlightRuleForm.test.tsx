
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,

import userEvent from '@testing-library/user-event';
import userEvent from '@testing-library/user-event'; } from './FlightRuleForm';
./FlightRuleForm';

describe('FlightRuleForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders all form fields', () => {
    // Use minimal defaultValues to avoid date validation issues
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

    // Check all form fields are rendered
    expect(screen.getByLabelText(/origin airports/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/earliest outbound/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/latest return/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cabin class/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

    // Get inputs
    const originInput = screen.getByLabelText(/origin airports/i);
    const destinationInput = screen.getByLabelText(/destination/i);

    // For onChange mode, we need to actually type and delete to trigger validation
    await user.type(originInput, 'JFK');
    fireEvent.change(originInput, { target: { value: '' } }); // Clear the field

    await user.type(destinationInput, 'LAX');
    fireEvent.change(destinationInput, { target: { value: '' } }); // Clear the field

    // With onChange mode, errors should appear immediately
    expect(
      await screen.findByText('At least one departure airport must be selected')
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Please provide a destination')
    ).toBeInTheDocument();

    // Form submission should be blocked
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: tomorrow,
      latestReturn: nextWeek,
      cabinClass: 'economy',
      budget: 800,
    };

    render(
      <FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />
    );

    // submit using fireEvent.submit directly on the form
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // wait for form submission
    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: ['JFK'],
        destination: 'LAX',
        cabinClass: 'economy',
        budget: 800,
        autoBookEnabled: false,
        earliestOutbound: expect.any(Date),
        latestReturn: expect.any(Date),
      })
    );
  });

  it('validates return date is after outbound date', async () => {
    const user = userEvent.setup(); // real timers

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const today = new Date();

    const defaultValues = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: tomorrow, // outbound after return
      latestReturn: today, // return before outbound (invalid)
      cabinClass: 'economy' as const,
      budget: 800,
    };

    render(
      <FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />
    );

    // submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // wait for validation error - using exact text from Zod schema
    expect(
      await screen.findByText(
        'Latest return date must be after earliest outbound date'
      )
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('allows selection of different cabin classes', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const defaultValues = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: tomorrow,
      latestReturn: nextWeek,
      cabinClass: 'economy' as const,
      budget: 800,
    };

    render(
      <FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />
    );

    // Check if we can find the cabin class selection
    const cabinSelect = screen.getByLabelText(/cabin class/i);
    expect(cabinSelect).toBeInTheDocument();

    // Check that the default value is displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue(/economy/i)).toBeInTheDocument();
    });
  });

  it('validates budget is within acceptable range', async () => {
    const user = userEvent.setup();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    render(
      <FlightRuleForm
        onSubmit={mockOnSubmit}
        defaultValues={{ earliestOutbound: tomorrow, latestReturn: nextWeek }}
      />
    );

    // Fill required fields
    const originInput = screen.getByLabelText(/origin airports/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const budgetInput = screen.getByLabelText(/budget/i);

    fireEvent.change(originInput, { target: { value: 'JFK' } });
    fireEvent.change(destinationInput, { target: { value: 'LAX' } });

    // Test minimum budget validation with onChange mode
    // Use fireEvent.change to directly set the value
    fireEvent.change(budgetInput, { target: { value: '50' } });

    // With onChange mode, error should appear immediately after typing
    expect(
      await screen.findByText('Budget must be at least $100')
    ).toBeInTheDocument();

    // Form submission should be blocked
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('populates form with default values correctly', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK', 'LGA'],
      destination: 'SFO',
      earliestOutbound: tomorrow,
      latestReturn: nextWeek,
      cabinClass: 'business',
      budget: 2000,
      autoBookEnabled: true,
    };

    render(
      <FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />
    );

    expect(screen.getByDisplayValue(/SFO/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/2000/i)).toBeInTheDocument();
  });

  it('handles auto-booking enabled state', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      autoBookEnabled: true,
      paymentMethodId: 'pm_test_123',
      earliestOutbound: tomorrow,
      latestReturn: nextWeek,
    };

    render(
      <FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />
    );

    // When auto-booking is enabled, form should show this state
    // (This test would be expanded based on how auto-booking UI is implemented)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('prevents submission with dates in the past', async () => {
    const user = userEvent.setup();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    render(
      <FlightRuleForm
        onSubmit={mockOnSubmit}
        defaultValues={{ earliestOutbound: tomorrow, latestReturn: nextWeek }}
      />
    );

    // Fill required fields
    const originInput = screen.getByLabelText(/origin airports/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const outboundInput = screen.getByLabelText(/earliest outbound/i);

    fireEvent.change(originInput, { target: { value: 'JFK' } });
    fireEvent.change(destinationInput, { target: { value: 'LAX' } });

    // Set a past date (invalid)
    fireEvent.change(outboundInput, { target: { value: '2020-01-01' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    expect(
      await screen.findByText('Earliest outbound date must be in the future')
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
