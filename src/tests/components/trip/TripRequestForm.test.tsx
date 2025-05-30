
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { createTripRequest } from '@/services/tripService';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { toast } from '@/components/ui/use-toast';
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

describe('TripRequestForm Auto-Booking Tests', () => {
  const mockPaymentMethods = [{ id: 'pm-uuid-123', brand: 'Visa', last4: '4242', nickname: 'Personal Card' }];

  beforeEach(() => {
    vi.clearAllMocks();

    (useCurrentUser as vi.Mock).mockReturnValue({
      user: { id: 'user-uuid-test', email: 'test@example.com' },
      userId: 'user-uuid-test',
      loading: false,
    });

    (createTripRequest as vi.Mock).mockResolvedValue({
      tripRequest: { id: 'trip-uuid-generated', auto_book: false },
      offers: [],
      offersCount: 0,
    });

    (usePaymentMethods as vi.Mock).mockReturnValue({
      paymentMethods: mockPaymentMethods,
      loading: false,
      error: null,
    });
  });

  // Helper to fill basic always-required fields
  const fillBasicFields = async () => {
    const user = userEvent.setup();

    const earliestDepartureInput = screen.getByRole('textbox', { name: /Earliest Departure/i });
    const latestDepartureInput = screen.getByRole('textbox', { name: /Latest Departure/i });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const fiveDaysLater = new Date(tomorrow);
    fiveDaysLater.setDate(tomorrow.getDate() + 5);

    fireEvent.change(earliestDepartureInput, { target: { value: tomorrow.toLocaleDateString('en-CA') } });
    fireEvent.change(latestDepartureInput, { target: { value: fiveDaysLater.toLocaleDateString('en-CA') } });

    await user.type(screen.getByLabelText(/Min Duration/i), '3');
    await user.type(screen.getByLabelText(/Max Duration/i), '7');
    await user.type(screen.getByLabelText(/Budget/i), '1200');
    
    await user.type(screen.getByPlaceholderText('Enter departure airport code (e.g. JFK)'), 'LAX');
    await user.type(screen.getByPlaceholderText('Enter destination (e.g. Paris, London)'), 'CDG');
  };

  it('shows validation error if auto_book is ON, payment selected, but max_price empty', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    await user.click(autoBookSwitch);

    const paymentMethodSelectTrigger = await screen.findByRole('combobox', { name: /Payment Method/i });
    await user.click(paymentMethodSelectTrigger);
    const paymentOption = await screen.findByText(/Visa •••• 4242/i);
    await user.click(paymentOption);

    const maxPriceInput = screen.getByLabelText(/Maximum Price/i);
    await user.clear(maxPriceInput);

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);
    
    expect(await screen.findByText("Maximum price and payment method are required for auto-booking", {}, {timeout: 5000})).toBeInTheDocument();
    expect(createTripRequest).not.toHaveBeenCalled();
  });

  it('shows validation error if auto_book is ON, max_price filled, but payment empty', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    await user.click(autoBookSwitch); 

    const maxPriceInput = await screen.findByLabelText(/Maximum Price/i);
    await user.type(maxPriceInput, '1500');

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);
    
    expect(await screen.findByText("Maximum price and payment method are required for auto-booking", {}, {timeout: 5000})).toBeInTheDocument();
    expect(createTripRequest).not.toHaveBeenCalled();
  });
  
  it('submits successfully if auto_book is ON and both max_price and payment method are provided', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    await user.click(autoBookSwitch);

    const maxPriceInput = await screen.findByLabelText(/Maximum Price/i);
    await user.type(maxPriceInput, '1500');

    const paymentMethodSelectTrigger = screen.getByRole('combobox', { name: /Payment Method/i });
    await user.click(paymentMethodSelectTrigger);
    const paymentOption = await screen.findByText(/Visa •••• 4242/i);
    await user.click(paymentOption);
    
    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createTripRequest).toHaveBeenCalled();
    });
    expect(screen.queryByText("Maximum price and payment method are required for auto-booking")).toBeNull();
  });

  it('submits successfully when auto-booking is OFF and max_price/payment method are empty', async () => {
    renderTripRequestForm();
    await fillBasicFields();
    const user = userEvent.setup();

    const autoBookSwitch = screen.getByRole('switch', { name: /Enable Auto-Booking/i });
    expect(autoBookSwitch).not.toBeChecked();

    expect(screen.queryByLabelText(/Maximum Price/i)).toBeNull();
    expect(screen.queryByRole('combobox', { name: /Payment Method/i })).toBeNull();

    const submitButton = screen.getByRole('button', { name: /Create Trip Request/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createTripRequest).toHaveBeenCalled();
    });
    
    expect(screen.queryByText("Maximum price and payment method are required for auto-booking")).toBeNull();
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/trip/offers'));
    });
  });
});
