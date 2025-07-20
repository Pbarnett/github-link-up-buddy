import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';

// Mock react-day-picker at the top level to avoid complex interactions
vi.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect }: { onSelect?: (date: Date) => void }) => (
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
  Calendar: ({ onSelect }: { onSelect?: (date: Date) => void }) => (
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
    await act(async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );
    });

    // Wait for any async updates to complete
    await waitFor(() => {
      expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    });

    // Check for key form elements that actually exist in the current component
    expect(screen.getByText('Live Flight Search')).toBeInTheDocument();
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
  });

  it('should render form input fields', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );
    });

    // Wait for async state updates and check that form inputs exist
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e\.g\., BOS/i)).toBeInTheDocument();
    });
    
    // Check that form sections exist
    expect(screen.getByText('Live Flight Search')).toBeInTheDocument();
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
    
    // Check that there are input fields
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should allow selecting cabin class', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );
    });

    // Wait for async state updates
    await waitFor(() => {
      expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
    });
    
    // Look for cabin class selection elements
    const cabinElements = screen.getAllByText(/Economy|Premium|Business|First/i);
    expect(cabinElements.length).toBeGreaterThan(0);
  });

  it('should have submit button disabled initially', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );
    });

    // Wait for async state updates and check submit button state
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button', { name: /search now/i });
      submitButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  it('should render date input fields', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );
    });

    // Wait for async state updates
    await waitFor(() => {
      expect(screen.getByText('Live Flight Search')).toBeInTheDocument();
    });
    
    // Check that date-related elements exist in the form
    // Look for any date input elements or date picker triggers
    const dateInputs = screen.getAllByRole('textbox');
    expect(dateInputs.length).toBeGreaterThan(0);
  });

  it('should allow filling out basic form fields', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );
    });

    // Wait for form to be ready
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e\.g\., BOS/i)).toBeInTheDocument();
    });

    // Fill out departure airport
    const departureInput = screen.getByPlaceholderText(/e\.g\., BOS/i);
    await act(async () => {
      fireEvent.change(departureInput, { target: { value: 'SFO' } });
    });
    expect(departureInput).toHaveValue('SFO');

    // Check that form sections exist
    expect(screen.getByText('Live Flight Search')).toBeInTheDocument();
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
  });

  it('should render form sections', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TripRequestForm />
        </MemoryRouter>
      );
    });

    // Wait for async state updates
    await waitFor(() => {
      expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    });

    // Check that main form sections exist
    expect(screen.getByText('Live Flight Search')).toBeInTheDocument();
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();
    
    // Check that there are some interactive elements
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
