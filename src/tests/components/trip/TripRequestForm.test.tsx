import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { createTripRequest } from '@/services/tripService';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { toast } from '@/components/ui/use-toast'; // Corrected path if needed
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocks
vi.mock('@/hooks/useCurrentUser');
vi.mock('@/services/tripService');
vi.mock('@/hooks/usePaymentMethods');
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const queryClient = new QueryClient();

const renderTripRequestForm = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TripRequestForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TripRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      userId: 'test-user-id',
      loading: false,
    });

    (createTripRequest as vi.Mock).mockResolvedValue({
      tripRequest: { id: 'trip-uuid-123', auto_book: false },
      offers: [],
      offersCount: 0,
    });

    (usePaymentMethods as vi.Mock).mockReturnValue({
      paymentMethods: [{ id: 'pm-123', brand: 'Visa', last4: '4242', nickname: 'Personal' }],
      loading: false,
      error: null,
    });
  });

  // Helper to fill basic required fields to avoid unrelated validation errors
  const fillBasicFields = async () => {
    const earliestDepartureInput = screen.getByLabelText(/Earliest Departure/i);
    const latestDepartureInput = screen.getByLabelText(/Latest Departure/i);
    const minDurationInput = screen.getByLabelText(/Min Duration/i);
    const maxDurationInput = screen.getByLabelText(/Max Duration/i);
    const budgetInput = screen.getByLabelText(/Budget/i);
    // For departure/destination, let's use custom inputs to simplify
    const otherDepartureInput = screen.getByPlaceholderText('Enter departure airport code (e.g. JFK)');
    const destinationOtherInput = screen.getByPlaceholderText('Enter destination (e.g. Paris, London)');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // React Hook Form uses specific event format for date pickers, but for text input:
    fireEvent.change(earliestDepartureInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    // Need to wait for the date picker to update the underlying value if it's a custom component
    // For Shadcn date picker, direct input might not work, but let's assume basic input for now or that it's handled.
    // A more robust way would be to click the calendar and select dates.
    // For simplicity, we'll assume direct change works or the component handles it.
    await screen.findByDisplayValue(tomorrow.toISOString().split('T')[0]);


    fireEvent.change(latestDepartureInput, { target: { value: dayAfterTomorrow.toISOString().split('T')[0] } });
    await screen.findByDisplayValue(dayAfterTomorrow.toISOString().split('T')[0]);
    
    fireEvent.change(minDurationInput, { target: { value: '3' } });
    fireEvent.change(maxDurationInput, { target: { value: '7' } });
    fireEvent.change(budgetInput, { target: { value: '1000' } });
    fireEvent.change(otherDepartureInput, { target: { value: 'LAX' } });
    fireEvent.change(destinationOtherInput, { target: { value: 'Tokyo' } });
  };


  it('Test Case 1: max_price becomes required when auto-booking is enabled', async () => {
    renderTripRequestForm();
    await fillBasicFields();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    fireEvent.click(autoBookSwitch); // Enable auto-booking

    // Wait for conditional fields to appear
    await screen.findByText('Payment Method'); 
    
    // Select a payment method (assuming the first one from mock)
    const paymentMethodSelect = screen.getByRole('combobox', { name: /Payment Method/i });
    fireEvent.mouseDown(paymentMethodSelect); // Open the select
    const option = await screen.findByText(/Visa •••• 4242/i); // Find by display text
    fireEvent.click(option);

    // Ensure max_price is empty (it should be by default or clear it)
    const maxPriceInput = screen.getByLabelText(/Maximum Price/i);
    fireEvent.change(maxPriceInput, { target: { value: '' } });
    
    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    fireEvent.click(submitButton);

    // Assert validation error: Zod refine message is generic
    // The path for this refine is ["max_price"], so error might appear near it or as general.
    // The message from Zod schema is "Maximum price and payment method are required for auto-booking"
    expect(await screen.findByText(/Maximum price and payment method are required for auto-booking/i, {}, {timeout: 3000})).toBeInTheDocument();
    expect(createTripRequest).not.toHaveBeenCalled();
  });

  it('Test Case 2: max_price is NOT required and form submits if auto-booking is disabled', async () => {
    renderTripRequestForm();
    await fillBasicFields();

    // Ensure auto-booking switch is off (default)
    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    expect(autoBookSwitch).not.toBeChecked();

    // Ensure max_price input is empty (or not even visible)
    // If it's not visible, getByLabelText would fail, which is fine for this test's purpose.
    // If it is visible but empty, that's also fine.

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createTripRequest).toHaveBeenCalled();
    });
    
    // Check for navigation or success toast
    // Based on TripRequestForm, it calls navigateToConfirmation(result.tripRequest.id, result.offers);
    // So, mockNavigate should be called.
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/trip/confirmation'));
    });

    // Ensure no max_price validation error
    expect(screen.queryByText(/Maximum price and payment method are required for auto-booking/i)).toBeNull();
  });
});
```
