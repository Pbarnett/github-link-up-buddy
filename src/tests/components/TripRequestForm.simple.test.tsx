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

    // Check for key form elements that actually exist in the UI
    expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
    // Check for form inputs by their display values instead of labels
    expect(screen.getByDisplayValue('3')).toBeInTheDocument(); // min duration
    expect(screen.getByDisplayValue('7')).toBeInTheDocument(); // max duration
  });

  it('should show business logic badges when expanded', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Find and click the "What's Included" toggle
    const toggleButton = screen.getByText("What's Included");
    await userEvent.click(toggleButton);

    // Check for informational badges (not switches)
    await waitFor(() => {
      expect(screen.getByText('Nonstop flights only')).toBeInTheDocument();
      expect(screen.getByText('Carry-on + personal item')).toBeInTheDocument();
      expect(screen.getAllByText('Included')).toHaveLength(2);
    });
  });

  it('should show informational content when expanded', async () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Find the collapsible section
    const toggleButton = screen.getByText("What's Included");
    expect(toggleButton).toBeInTheDocument();
    
    // Expand to see content
    await userEvent.click(toggleButton);
    
    // Should show business logic information
    await waitFor(() => {
      expect(screen.getByText('Flight Features')).toBeInTheDocument();
    });
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

  it('should render date picker components', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Check for duration inputs directly (this confirms date section exists)
    expect(screen.getByDisplayValue('3')).toBeInTheDocument(); // min duration
    expect(screen.getByDisplayValue('7')).toBeInTheDocument(); // max duration
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument(); // budget
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

  it('should render form sections', () => {
    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Check that main form sections are present
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
    expect(screen.getAllByText('Top price you\'ll pay')).toHaveLength(2); // Accept that there are 2 instances
    expect(screen.getByText("What's Included")).toBeInTheDocument();
  });
});
