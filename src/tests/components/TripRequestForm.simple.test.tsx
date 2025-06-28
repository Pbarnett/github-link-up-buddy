import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';

// Mock react-day-picker at the top level to avoid complex interactions
vi.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect }: any) => (
    <div data-testid="mock-calendar" role="grid">
      <button 
        onClick={() => onSelect && onSelect(new Date('2024-08-15'))}
        data-testid="select-date-button"
      >
        Select Date
      </button>
    </div>
  ),
}));

// Mock Calendar component
vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) => (
    <div data-testid="mock-calendar" role="grid">
      <button 
        onClick={() => onSelect && onSelect(new Date('2024-08-15'))}
        data-testid="select-date-button"
      >
        Select Date
      </button>
    </div>
  ),
}));

describe('TripRequestForm - Basic Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form with basic elements', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Check for key form elements
    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
    expect(screen.getByText('Travel Details')).toBeInTheDocument();
    expect(screen.getByText('Trip Length')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
  });

  it('should render filter toggles with correct default values', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Check nonstop flights toggle (should be checked by default)
    const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
    expect(nonstopSwitch).toBeInTheDocument();
    expect(nonstopSwitch).toBeChecked();

    // Check baggage toggle (should be unchecked by default)
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    expect(baggageSwitch).toBeInTheDocument();
    expect(baggageSwitch).not.toBeChecked();
  });

  it('should toggle switches when clicked', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });
    
    // Initial state
    expect(baggageSwitch).not.toBeChecked();
    
    // Click to enable
    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).toBeChecked();
    
    // Click to disable
    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).not.toBeChecked();
  });

  it('should have submit button disabled initially', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Submit button should be disabled when form is empty (there are multiple, check they're all disabled)
    const submitButtons = screen.getAllByRole('button', { name: /search now/i });
    submitButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should show calendar when date buttons are clicked', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Click on earliest departure button
    const earliestButton = screen.getByText('Earliest');
    await userEvent.click(earliestButton);

    // Should show our mocked calendar
    await waitFor(() => {
      expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    });

    // Should be able to select a date (tests that onSelect callback is available)
    const selectDateButton = screen.getByTestId('select-date-button');
    await userEvent.click(selectDateButton);
    
    // The mock calendar successfully allows date selection
    // (In real implementation, the calendar would close, but our mock stays open)
    expect(selectDateButton).toBeInTheDocument();
  });

  it('should allow filling out basic form fields', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Fill out departure airport
    const departureInput = screen.getByPlaceholderText(/e\.g\., BOS/i);
    fireEvent.change(departureInput, { target: { value: 'SFO' } });
    expect(departureInput).toHaveValue('SFO');

    // Fill out duration fields (numeric inputs return numbers, not strings)
    const minDurationInput = screen.getByDisplayValue('3');
    fireEvent.change(minDurationInput, { target: { value: '5' } });
    expect(minDurationInput).toHaveValue(5);

    const maxDurationInput = screen.getByDisplayValue('7');
    fireEvent.change(maxDurationInput, { target: { value: '10' } });
    expect(maxDurationInput).toHaveValue(10);

    // Fill out budget (numeric input returns number)
    const budgetInput = screen.getByDisplayValue('1000');
    fireEvent.change(budgetInput, { target: { value: '1500' } });
    expect(budgetInput).toHaveValue(1500);
  });

  it('should enable auto-booking toggle', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Find auto-booking switch
    const autoBookingSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    expect(autoBookingSwitch).not.toBeChecked();

    // Enable auto-booking
    await userEvent.click(autoBookingSwitch);
    expect(autoBookingSwitch).toBeChecked();
  });
});
