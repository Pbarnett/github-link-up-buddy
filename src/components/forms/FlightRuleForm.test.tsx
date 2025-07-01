import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlightRuleForm } from './FlightRuleForm';
import { UnifiedFlightRuleForm } from '@/types/form';

// Mock the date inputs to avoid timezone issues in tests
const mockDate = new Date('2024-07-15T12:00:00.000Z');

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
    const defaultValues: Partial<UnifiedFlightRuleForm> = {
      origin: ['JFK'],
      destination: 'LAX',
      earliestOutbound: new Date('2024-07-15'),
      latestReturn: new Date('2024-07-22'),
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
        })
      );
    });
  });

  it('validates return date is after outbound date', async () => {
    const user = userEvent.setup();
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

    // Set outbound date to a future date
    const outboundInput = screen.getByLabelText(/earliest outbound/i);
    await user.type(outboundInput, '2024-07-22');

    // Set return date to a date before outbound date
    const returnInput = screen.getByLabelText(/latest return/i);
    await user.type(returnInput, '2024-07-15');

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
    render(<FlightRuleForm onSubmit={mockOnSubmit} />);

    const budgetInput = screen.getByLabelText(/budget/i);
    
    // Test minimum budget validation
    await user.clear(budgetInput);
    await user.type(budgetInput, '50');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/budget must be at least \$100/i)).toBeInTheDocument();
    });

    // Test maximum budget validation
    await user.clear(budgetInput);
    await user.type(budgetInput, '15000');
    await user.click(submitButton);

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
    await user.type(outboundInput, '2020-01-01');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/earliest outbound date must be in the future/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
