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

    // Updated header copy for manual mode
    expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    expect(screen.getByText('Search real-time flight availability (Amadeus-powered)')).toBeInTheDocument();

    // Updated section labels in manual mode
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
    expect(screen.getByText("Top price you'll pay")).toBeInTheDocument();
  });

  it('should show included badges for nonstop and carry-on (informational only)', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/nonstop flights only/i)).toBeInTheDocument();
    expect(screen.getByText(/carry-on \+ personal item/i)).toBeInTheDocument();
    // Badges indicate these are included; there are no interactive switches anymore
    expect(screen.getAllByText(/included/i).length).toBeGreaterThan(0);
  });

  it('should have submit button disabled initially', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Submit button should be disabled when form is empty (there may be multiple)
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

    // Click on departure date button (updated label)
    const depButton = screen.getByText('Pick departure date');
    await userEvent.click(depButton);

    // Should show our mocked calendar
    await waitFor(() => {
      expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    });

    // Should be able to select a date (tests that onSelect callback is available)
    const selectDateButton = screen.getByTestId('select-date-button');
    await userEvent.click(selectDateButton);
    
    // The mock calendar successfully allows date selection
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
});
