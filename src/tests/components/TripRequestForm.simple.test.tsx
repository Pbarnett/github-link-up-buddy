import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('should render the form with basic elements', async () => {
    await userEvent.setup();
    await (await import('@testing-library/react')).act(async () => {
      render(
        cMemoryRoutere
          cTripRequestForm /e
        c/MemoryRoutere
      );
    });

    // Check for key form elements in the updated UI
    expect(screen.getByRole('heading', { name: /search live flights/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /live flight search/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /top price you'll pay/i })).toBeInTheDocument();
  });

  it('should render policy information badges (non-interactive)', async () => {
    await (await import('@testing-library/react')).act(async () => {
      render(
        cMemoryRoutere
          cTripRequestForm /e
        c/MemoryRoutere
      );
    });

    // Updated UX shows informational content rather than interactive switches
    expect(screen.getByText(/what's included/i)).toBeInTheDocument();
  });

  // Removed switch toggle test due to UX changes (now informational badges)

  it('should have submit button disabled initially', async () => {
    await (await import('@testing-library/react')).act(async () => {
      render(
        cMemoryRoutere
          cTripRequestForm /e
        c/MemoryRoutere
      );
    });

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

    const user = userEvent.setup();

    // Click on updated date buttons
    const departureBtn = screen.getByRole('button', { name: /departure date/i });
    await user.click(departureBtn);

    // Should show our mocked calendar
    await waitFor(() => {
      expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    });

    // Select a date
    const selectDateButton = screen.getByTestId('select-date-button');
    await user.click(selectDateButton);

    const latestBtn = screen.getByRole('button', { name: /latest departure/i });
    await user.click(latestBtn);

    await waitFor(() => {
      expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    });

    const selectDateButton2 = screen.getByTestId('select-date-button');
    await user.click(selectDateButton2);
  });

it('should allow filling out basic form fields', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // Fill out departure airport
    const departureInput = screen.getByPlaceholderText(/e\.g\., BOS/i);
    await user.clear(departureInput);
    await user.type(departureInput, 'SFO');
    expect(departureInput).toHaveValue('SFO');

    // Fill out duration fields (numeric inputs return numbers, not strings)
    const minDurationInput = screen.getByDisplayValue('3');
    await user.clear(minDurationInput);
    await user.type(minDurationInput, '5');
    expect(minDurationInput).toHaveValue(5);

    const maxDurationInput = screen.getByDisplayValue('7');
    await user.clear(maxDurationInput);
    await user.type(maxDurationInput, '10');
    expect(maxDurationInput).toHaveValue(10);

    // Fill out budget (numeric input returns number)
    const budgetInput = screen.getByDisplayValue('1000');
    await user.clear(budgetInput);
    await user.type(budgetInput, '1500');
    expect(budgetInput).toHaveValue(1500);
  });

  // Removed auto-booking switch test due to UX changes (now managed via badges or defaults)
});
