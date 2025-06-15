
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';
import { addDays } from "date-fns";
import { fillBaseFormFields, selectDateInCalendar } from './TripRequestForm.testUtils';

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
vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flagName: string) => flagName === "extended_date_range",
}));

describe('TripRequestForm - Submission Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });
    (useNavigate as Mock).mockReturnValue(vi.fn());
  });

  it('should populate destination_location_code from destination_airport if omitted', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as Mock).mockReturnValue({
      insert: mockInsert,
    });
    const mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
        mockToastFn(options);
        return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });
    const mockNavigate = useNavigate();

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );
    await userEvent.type(screen.getByRole('combobox', { name: /destination/i }), 'LAX');
    await userEvent.type(screen.getByPlaceholderText(/e\.g\. SFO, BOS/i), 'SFO');
    fireEvent.change(screen.getByLabelText(/earliest departure date/i), { target: { value: '2024-08-15' } });
    fireEvent.change(screen.getByLabelText(/latest departure date/i), { target: { value: '2024-08-20' } });
    await userEvent.clear(screen.getByLabelText(/budget/i));
    await userEvent.type(screen.getByLabelText(/budget/i), '1200');
    await userEvent.clear(screen.getByLabelText(/minimum trip duration/i));
    await userEvent.type(screen.getByLabelText(/minimum trip duration/i), '5');
    await userEvent.clear(screen.getByLabelText(/maximum trip duration/i));
    await userEvent.type(screen.getByLabelText(/maximum trip duration/i), '10');

    const submitButton = screen.getByRole('button', { name: /search now/i });
    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('destination_airport', 'LAX');
    expect(submittedPayload).toHaveProperty('destination_location_code', 'LAX');
    expect(submittedPayload).toHaveProperty('departure_airports', ['SFO']);
    expect(submittedPayload.earliest_departure).toMatch(/^2024-08-15T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(submittedPayload.latest_departure).toMatch(/^2024-08-20T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(submittedPayload).toHaveProperty('budget', 1200);
    expect(submittedPayload).toHaveProperty('min_duration', 5);
    expect(submittedPayload).toHaveProperty('max_duration', 10);
    expect(submittedPayload).toHaveProperty('user_id', 'test-user-id');
    expect(submittedPayload).toHaveProperty('nonstop_required', true);
    expect(submittedPayload).toHaveProperty('baggage_included_required', false);
    expect(submittedPayload).toHaveProperty('auto_book_enabled', false);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id');
    });
    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Trip request submitted",
          description: "Your trip request has been successfully submitted!",
        })
      );
    });
  });
});

// --- Date range validation tests (separated block!) ---
describe('TripRequestForm - Date Range Validation (Extended)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as Mock).mockReturnValue({ user: { id: 'test-user-id' } });
    (useNavigate as Mock).mockReturnValue(vi.fn());
  });

  it('should display validation error for date range > 120 days', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const today = new Date();
    const earliestDepartureDate = addDays(today, 1);
    const latestDepartureDate = addDays(earliestDepartureDate, 121);

    await selectDateInCalendar(/Earliest/i, earliestDepartureDate);
    await selectDateInCalendar(/Latest/i, latestDepartureDate);

    const submitButton = screen.getByRole('button', { name: /search now/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Date range cannot exceed 120 days/i);
      expect(errorMessage).toBeVisible();
    });
  });

  it('should NOT display validation error for date range <= 120 days (e.g., 90 days)', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const today = new Date();
    const earliestDepartureDate = addDays(today, 1);
    const latestDepartureDate = addDays(earliestDepartureDate, 90);

    await selectDateInCalendar(/Earliest/i, earliestDepartureDate);
    await selectDateInCalendar(/Latest/i, latestDepartureDate);

    const submitButton = screen.getByRole('button', { name: /search now/i });
    expect(screen.queryByText(/Date range cannot exceed 120 days/i)).not.toBeInTheDocument();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Date range cannot exceed 120 days/i)).not.toBeInTheDocument();
    });
  });
});
