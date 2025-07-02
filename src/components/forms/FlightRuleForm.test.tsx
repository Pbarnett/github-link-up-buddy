import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlightRuleForm } from './FlightRuleForm';
import { UnifiedFlightRuleForm } from '@/types/form';

// Mock the date inputs to avoid timezone issues in tests
const mockDate = new Date('2024-07-15T12:00:00.000Z');

// Helper to get future dates
const getFutureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const formatDateForInput = (date) => date.toISOString().split('T')[0];

describe('FlightRuleForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

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

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least one departure airport must be selected/i)).toBeInTheDocument();
      expect(screen.getByText(/please provide a destination/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const futureOutbound = getFutureDate(7); // 7 days from now
    const futureReturn = getFutureDate(14); // 14 days from now
    
    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: futureOutbound,
      latestReturn: futureReturn,
      cabinClass: 'economy',
      budget: 800,
    };

    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: ['JFK'],
          destination: 'LAX',
          cabinClass: 'economy',
          budget: 800,
          autoBookEnabled: false,
          earliestOutbound: expect.any(Date),
          latestReturn: expect.any(Date),
        }),
        expect.any(Object) // The form event object
      );
    });
  });

  it('validates return date is after outbound date', async () => {
    const user = userEvent.setup();
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

    const futureOutbound = getFutureDate(14); // 14 days from now
    const earlierReturn = getFutureDate(7); // 7 days from now (before outbound)

    // Set outbound date to a later future date
    const outboundInput = screen.getByLabelText(/earliest outbound/i);
    await user.clear(outboundInput);
    await user.type(outboundInput, formatDateForInput(futureOutbound));

    // Set return date to an earlier future date
    const returnInput = screen.getByLabelText(/latest return/i);
    await user.clear(returnInput);
    await user.type(returnInput, formatDateForInput(earlierReturn));

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/latest return date must be after earliest outbound date/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('allows selection of different cabin classes', async () => {
    const user = userEvent.setup();
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

    const cabinSelect = screen.getByRole('combobox');
    await user.click(cabinSelect);

    const businessOption = screen.getByRole('option', { name: /business/i });
    await user.click(businessOption);

    expect(screen.getByDisplayValue(/business/i)).toBeInTheDocument();
  });

  it('validates budget is within acceptable range', async () => {
    const user = userEvent.setup();
    
    // Test with separate renders to avoid state conflicts
    const futureOutbound = getFutureDate(7); 
    const futureReturn = getFutureDate(14); 
    
    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: futureOutbound,
      latestReturn: futureReturn,
      cabinClass: 'economy',
      budget: 50, // Start with invalid budget below minimum
    };

    const { unmount } = render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Test minimum budget validation
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/budget must be at least \$100/i)).toBeInTheDocument();
    });

    unmount();

    // Test maximum budget validation with a new render
    const maxDefaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: futureOutbound,
      latestReturn: futureReturn,
      cabinClass: 'economy',
      budget: 15000, // Start with invalid budget above maximum
    };

    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={maxDefaultValues} />);
    
    const submitButton2 = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton2);

    await waitFor(() => {
      expect(screen.getByText(/budget cannot exceed \$10,000/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('populates form with default values correctly', () => {
    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK', 'LGA'],
      destination: 'SFO',
      cabinClass: 'business',
      budget: 2000,
      autoBookEnabled: true,
    };

    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByDisplayValue(/SFO/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/2000/i)).toBeInTheDocument();
  });

  it('handles auto-booking enabled state', () => {
    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      autoBookEnabled: true,
      paymentMethodId: 'pm_test_123',
    };

    render(<FlightRuleForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    // When auto-booking is enabled, form should show this state
    // (This test would be expanded based on how auto-booking UI is implemented)
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('prevents submission with dates in the past', async () => {
    const user = userEvent.setup();
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

    const outboundInput = screen.getByLabelText(/earliest outbound/i);
    await user.clear(outboundInput);
    await user.type(outboundInput, '2020-01-01');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/earliest outbound date must be in the future/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
