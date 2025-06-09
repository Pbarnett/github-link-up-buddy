
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [{}], error: null }),
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
    vi.clearAllMocks();
    (useCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());
  });

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
    expect(baggageSwitch).not.toBeChecked();

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).toBeChecked();

    await userEvent.click(baggageSwitch);
    expect(baggageSwitch).not.toBeChecked();
  });

  it('should reflect Zod schema default values for switches on initial render', () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);

    const nonstopSwitch = screen.getByRole('switch', { name: /nonstop flights only/i });
    const baggageSwitch = screen.getByRole('switch', { name: /include carry-on \+ personal item/i });

    expect(nonstopSwitch).toBeChecked();
    expect(baggageSwitch).not.toBeChecked();
  });
});

describe('TripRequestForm - Destination Location Code Mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());
  });

  it('should populate destination_location_code from destination_airport when submitting', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ 
      data: [{ id: 'new-trip-id', destination_location_code: 'LAX' }], 
      error: null 
    });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: mockInsert,
    });

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    const earliestDateInput = screen.getByLabelText(/earliest departure/i);
    const latestDateInput = screen.getByLabelText(/latest departure/i);
    const budgetInput = screen.getByLabelText(/budget/i);
    
    fireEvent.change(earliestDateInput, { target: { value: '2024-08-15T10:00' } });
    fireEvent.change(latestDateInput, { target: { value: '2024-08-20T10:00' } });
    fireEvent.change(budgetInput, { target: { value: '1500' } });

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
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: mockInsert,
    });

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    const customDestinationInput = screen.getByPlaceholderText(/enter airport code/i);
    await userEvent.type(customDestinationInput, 'SFO');

    const earliestDateInput = screen.getByLabelText(/earliest departure/i);
    fireEvent.change(earliestDateInput, { target: { value: '2024-08-15T10:00' } });

    const submitButton = screen.getByRole('button', { name: /search now/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    const submittedData = mockInsert.mock.calls[0][0][0];
    
    expect(submittedData).toHaveProperty('destination_airport', 'SFO');
    expect(submittedData).toHaveProperty('destination_location_code', 'SFO');
  });
});

describe('TripRequestForm - Submission Logic', () => {
  let mockNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();

    (useCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: mockInsert,
    });
    const mockToast = vi.fn();
    (toast as ReturnType<typeof vi.fn>).mockImplementation(mockToast);

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/departure airport/i), 'SFO');
    await userEvent.type(screen.getByLabelText(/destination airport/i), 'LAX');
    fireEvent.change(screen.getByLabelText(/departure date/i), { target: { value: '2024-08-15' } });
    fireEvent.change(screen.getByLabelText(/return date/i), { target: { value: '2024-08-20' } });
    await userEvent.type(screen.getByLabelText(/number of travelers/i), '1');

    const submitButton = screen.getByRole('button', { name: /create trip/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    const submittedData = mockInsert.mock.calls[0][0][0];

    expect(submittedData).toHaveProperty('destination_airport', 'LAX');
    expect(submittedData).toHaveProperty('destination_location_code', 'LAX');
    expect(submittedData).toHaveProperty('departure_airport', 'SFO');
    expect(submittedData).toHaveProperty('departure_date', '2024-08-15');
    expect(submittedData).toHaveProperty('return_date', '2024-08-20');
    expect(submittedData).toHaveProperty('num_travelers', 1);
    expect(submittedData).toHaveProperty('user_id', 'test-user-id');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
