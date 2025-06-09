import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { supabase } from '@/integrations/supabase/client';
import { FormProvider, useForm } from 'react-hook-form';
import { tripFormSchema, FormValues } from '@/types/form'; // Assuming FormValues is exported
import { zodResolver } from '@hookform/resolvers/zod';

// Mock hooks
vi.mock('@/hooks/useTravelerInfoCheck', () => ({
  useTravelerInfoCheck: () => ({ hasTravelerInfo: true })
}));

const mockPaymentMethods = [{ id: "pm_123", type: "card", card: { last4: "4242", brand: "Visa", exp_month: 12, exp_year: 2030 }}];
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: () => ({
    paymentMethods: mockPaymentMethods,
    isLoading: false,
    error: null
  })
}));

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ userId: 'user-123', isLoading: false, error: null })
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
const mockToast = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  toast: mockToast,
}));

// Supabase mock
let mockInsertChainFn;
let mockSingleFn;

describe('TripRequestForm - Auto-Booking Submission Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks();

    mockSingleFn = vi.fn().mockResolvedValue({ data: { id: 'trip-456-xyz' }, error: null });
    const mockSelectFn = vi.fn(() => ({ single: mockSingleFn }));
    mockInsertChainFn = vi.fn().mockReturnValue({ select: mockSelectFn });
    supabase.from = vi.fn(() => ({ insert: mockInsertChainFn })) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should submit with auto_book_enabled: true and preferred_payment_method_id when auto-book is toggled on', async () => {
    const user = userEvent.setup();

    // Need to wrap with FormProvider if TripRequestForm doesn't provide its own at the top level
    // Or pass defaultValues directly if the component supports it for testing
    // TripRequestForm itself creates the form provider.

    render(
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    );

    // Set dates: Assuming react-day-picker structure
    // Earliest Departure Date
    // The buttons to open calendars might not have "Earliest/Latest departure date" as accessible name directly.
    // They are inside a FieldControl. Let's find by role 'button' and assume order or more specific label if available from TripRequestForm.
    // Looking at DateRangeField and FormField, the label is passed to FormLabel.
    // The button itself in Calendar.tsx has "Pick a date". We need to be more specific.

    // Let's assume the label "Earliest departure date" is associated with the button trigger.
    // If not, we might need to use `screen.getAllByRole('button', { name: /pick a date/i })[0]`

    // It seems the label is "Earliest departure date" from TripRequestForm.tsx
    await user.click(screen.getByLabelText('Earliest departure date'));
    // Select a day in the future. This depends on the current month rendered.
    // To make it robust, we'd ideally navigate months, but for a smoke test:
    // Click "Next month" then a day.
    // Let's try to find a day in the current view first.
    // This will click the 15th of the currently displayed month.
    // Ensure test environment date is consistent or mock new Date() if calendar relies on it heavily for default views.
    // For now, assume '15' is available and in the future.
    // This might require the calendar to be already on a month where 15th is valid.
    // A more robust way:
    fireEvent.click(screen.getByRole('button', { name: /earliest departure date/i }));
    // Using a more general way to select a day, assuming the calendar shows some future days.
    // This example clicks the 11th day cell. Adjust if needed.
    await user.click(screen.getAllByRole('gridcell', { name: /11/i }).find(el => !el.hasAttribute('aria-disabled')) || await screen.findByRole('gridcell', {name: (content, element) => element.getAttribute('aria-label')?.includes('Jan 11 2025') || content === '11'}));

    fireEvent.click(screen.getByRole('button', { name: /latest departure date/i }));
    // This example clicks the 18th day cell. Adjust if needed.
    await user.click(screen.getAllByRole('gridcell', { name: /18/i }).find(el => !el.hasAttribute('aria-disabled')) || await screen.findByRole('gridcell', {name: (content, element) => element.getAttribute('aria-label')?.includes('Jan 18 2025') || content === '18'}));

    // Destination
    await user.type(screen.getByLabelText(/destination airport/i), 'LAX');

    // Departure airport (Other Departure Airport)
    await user.type(screen.getByLabelText(/other departure airport/i), 'JFK');

    await user.clear(screen.getByLabelText(/budget/i));
    await user.type(screen.getByLabelText(/budget/i), '1500');

    // Min/Max duration have default values, clear them first if needed
    // Default values are set in the form definition.
    await user.clear(screen.getByLabelText(/min duration \(days\)/i));
    await user.type(screen.getByLabelText(/min duration \(days\)/i), '3');
    await user.clear(screen.getByLabelText(/max duration \(days\)/i));
    await user.type(screen.getByLabelText(/max duration \(days\)/i), '7');

    // Toggle auto-book ON
    // The switch is inside AutoBookingToggle which has a label "Enable Auto-Booking"
    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await user.click(autoBookSwitch);

    // Fill auto-book specific fields
    const maxPriceInput = screen.getByLabelText(/max price/i);
    await user.clear(maxPriceInput);
    await user.type(maxPriceInput, '2000');

    // Select payment method
    // The PaymentMethodSelect component uses a Select Radix component.
    // The trigger will have a role of 'combobox'.
    await user.click(screen.getByRole('combobox', { name: /payment method/i }));
    // The option text would be like "Visa ending in 4242"
    await user.click(screen.getByRole('option', { name: /visa ending in 4242/i }));

    // Click submit button
    // The button text changes to "Enable Auto-Booking" or "Update Auto-Booking"
    // When auto-book is enabled and it's a new form, it should be "Enable Auto-Booking"
    // Let's find by a more generic role if text is too dynamic or use a test-id if available.
    // The button's text is "Enable Auto-Booking" when auto_book_enabled is true and no tripRequestId.
    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i });
    await user.click(submitButton);

    // Assertions
    await waitFor(() => {
      expect(mockInsertChainFn).toHaveBeenCalledTimes(1);
    });

    const submittedData = mockInsertChainFn.mock.calls[0][0][0];

    // Dates are tricky due to timezones and formatting. Check for presence or specific ISO part.
    expect(submittedData.earliest_departure_date).toBeDefined();
    expect(submittedData.latest_departure_date).toBeDefined();

    expect(submittedData).toMatchObject({
      user_id: 'user-123',
      // departure_airports: ['JFK'], // This depends on how "other_departure_airport" is processed
      destination_airport: 'LAX',
      budget: 1500,
      min_duration: 3,
      max_duration: 7,
      auto_book_enabled: true,
      max_price: 2000,
      preferred_payment_method_id: 'pm_123',
      // other_departure_airport: 'JFK', // Check if this is passed directly or part of departure_airports
    });

    // Check specific fields based on form logic for departure airports
    // The form logic merges nyc_airports and other_departure_airport into departure_airports
     expect(submittedData.departure_airports).toEqual(expect.arrayContaining(['JFK']));


    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Auto-booking enabled",
        description: "Your trip request has been submitted and auto-booking is active.",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/trip/trip-456-xyz');
    });
  });
});

// Helper component to wrap with FormProvider if needed for isolated testing
// const TestWrapper: React.FC<{ children: React.ReactNode; defaultValues?: Partial<FormValues> }> = ({ children, defaultValues }) => {
//   const methods = useForm<FormValues>({
//     resolver: zodResolver(tripFormSchema),
//     defaultValues: {
//       earliestDeparture: undefined, // Or some default
//       latestDeparture: undefined,   // Or some default
//       min_duration: 3,
//       max_duration: 7,
//       budget: 1000,
//       nonstop_required: true,
//       baggage_included_required: false,
//       auto_book_enabled: false,
//       ...defaultValues,
//     },
//   });
//   return <FormProvider {...methods}>{children}</FormProvider>;
// };
