import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlightRuleForm } from './FlightRuleForm';
import { UnifiedFlightRuleForm } from './FlightRuleForm';

// Helper to get future dates
const getFutureDate = (daysFromNow) => {
  const date = new Date('2025-01-01');
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const formatDateForInput = (date) => date.toISOString().split('T')[0];

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
    
    // Check key form fields are rendered (updated labels)
    expect(screen.getByLabelText(/origin airports/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByText(/trip window/i)).toBeInTheDocument();
    expect(screen.getByText(/min nights/i)).toBeInTheDocument();
    expect(screen.getByText(/cabin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
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
    await user.clear(originInput); // This should trigger validation for empty array
    
    await user.type(destinationInput, 'LAX');
    await user.clear(destinationInput); // This should trigger validation for empty string

    // With onChange mode, errors should appear immediately
    expect(
      await screen.findByText('At least one departure airport must be selected')
    ).toBeInTheDocument();
    
    expect(await screen.findByText('Please provide a destination')).toBeInTheDocument();

    // Form submission should be blocked
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it.skip('submits form with valid data', async () => {
    const user = userEvent.setup();           // real timers
    
    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: new Date('2025-07-15'),
      latestReturn: new Date('2025-07-22'),
      cabinClass: 'economy',
      budget: 800,
    };

    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

// Ensure dates are set in the future relative to now before submitting
    const futureOutbound = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const futureReturn = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000);
    const outboundInput = screen.getByLabelText(/earliest outbound/i);
    const returnInput = screen.getByLabelText(/latest return/i);
    fireEvent.change(outboundInput, { target: { value: futureOutbound.toISOString().substring(0,10) } });
    fireEvent.change(returnInput, { target: { value: futureReturn.toISOString().substring(0,10) } });

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

  it.skip('validates return date is after outbound date', async () => {
    const user = userEvent.setup();           // real timers
    
    const defaultValues = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: new Date('2025-07-15'),  // outbound after return
      latestReturn: new Date('2025-07-10'),     // return before outbound (invalid)
      cabinClass: 'economy',
      budget: 800,
    };
    
    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);
    
    // submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // wait for validation error - using exact text from Zod schema
    expect(await screen.findByText('Latest return date must be after earliest outbound date')).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it.skip('allows selection of different cabin classes', async () => {
    const defaultValues = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: new Date('2025-07-15'),
      latestReturn: new Date('2025-07-22'),
      cabinClass: 'economy',
      budget: 800,
    };
    
    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues}/>);
    
    // Check if we can find the cabin class selection
    // In the new UI, cabin is a segmented button group; assert presence of options
    expect(screen.getByText(/economy/i)).toBeInTheDocument();
  });

  it('validates budget is within acceptable range', async () => {
    const user = userEvent.setup();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={{ earliestOutbound: tomorrow, latestReturn: nextWeek }}/>);
    
    // Fill required fields
    const originInput = screen.getByLabelText(/origin airports/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const budgetInput = screen.getByLabelText(/max price/i);
    
    await user.clear(originInput);
    await user.type(originInput, 'JFK');
    await user.clear(destinationInput);
    await user.type(destinationInput, 'LAX');
    
    // Test minimum budget validation with onChange mode
    // Use fireEvent.change to directly set the value
    fireEvent.change(budgetInput, { target: { value: '50' } });

    // With onChange mode, error should appear immediately after typing
    expect(await screen.findByText('Budget must be at least $100')).toBeInTheDocument();

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

    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

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

    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    // When auto-booking is enabled, form should show this state
    // (This test would be expanded based on how auto-booking UI is implemented)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it.skip('prevents submission with dates in the past', async () =e {
    const user = userEvent.setup();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={{ earliestOutbound: tomorrow, latestReturn: nextWeek }}/>);
    
    // Fill required fields
    const originInput = screen.getByLabelText(/origin airports/i);
    const destinationInput = screen.getByLabelText(/destination/i);
    const outboundInput = screen.getByLabelText(/earliest outbound/i);
    
    await user.clear(originInput);
    await user.type(originInput, 'JFK');
    await user.clear(destinationInput);
    await user.type(destinationInput, 'LAX');
    
    // Set a past date (invalid)
    fireEvent.change(outboundInput, { target: { value: '2020-01-01' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    await user.click(submitButton);

    expect(await screen.findByText('Earliest outbound date must be in the future')).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
