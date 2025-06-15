
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/components/ui/use-toast';
import { fillBaseFormFields } from './TripRequestForm.testUtils';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [{}], error: null }),
  }
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
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));
vi.mock('@/hooks/useTravelerInfoCheck', () => ({
  useTravelerInfoCheck: vi.fn(),
}));

describe('TripRequestForm - Auto-Booking Logic', () => {
  let mockNavigate: Mock;
  let mockToastFn: Mock;
  let mockInsert: Mock;
  // Mock hooks from AutoBookingSection
  const mockUsePaymentMethods = vi.mocked(require('@/hooks/usePaymentMethods').usePaymentMethods);
  const mockUseTravelerInfoCheck = vi.mocked(require('@/hooks/useTravelerInfoCheck').useTravelerInfoCheck);

  beforeEach(() => {
    vi.clearAllMocks();
    (useCurrentUser as Mock).mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    mockToastFn = vi.fn();
    (toast as Mock).mockImplementation((options) => {
      mockToastFn(options);
      return { id: 'test-toast-id', dismiss: vi.fn(), update: vi.fn() };
    });

    mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-trip-id' }], error: null });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    mockUsePaymentMethods.mockReturnValue({
      data: [{ id: 'pm_123', brand: 'Visa', last4: '4242', is_default: true, nickname: 'Work Card' }],
      isLoading: false,
    });
    mockUseTravelerInfoCheck.mockReturnValue({
      hasTravelerInfo: true,
      isLoading: false,
    });
  });

  // Test 1: Rendering and Interaction
  it('should show payment method selection when auto-booking is enabled and prerequisites are met', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    expect(screen.queryByLabelText(/maximum price \(usd\) for auto-booking/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/payment method for auto-booking/i)).not.toBeInTheDocument();

    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      expect(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i)).toBeVisible();
      expect(screen.getByLabelText(/payment method for auto-booking/i)).toBeVisible();
    });

    const paymentMethodSelect = screen.getByLabelText(/payment method for auto-booking/i);
    await userEvent.click(paymentMethodSelect);
    await userEvent.click(screen.getByText(/Visa •••• 4242 \(Default\) \(Work Card\)/i));
  });

  it('should fail submission if auto-booking is enabled, max_price is set, but no payment method is selected', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      expect(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i)).toBeVisible();
    });
    await userEvent.type(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i), '1500');

    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).not.toHaveBeenCalled();
    });

    expect(await screen.findByText('Select Payment Method')).toBeVisible();
  });

  it('should fail submission if auto-booking is enabled, payment method is set, but max_price is missing', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      expect(screen.getByLabelText(/payment method for auto-booking/i)).toBeVisible();
    });
    const paymentMethodSelect = screen.getByLabelText(/payment method for auto-booking/i);
    await userEvent.click(paymentMethodSelect);
    await userEvent.click(screen.getByText(/Visa •••• 4242 \(Default\) \(Work Card\)/i));

    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const specificError = screen.queryByText("Maximum price and payment method are required for auto-booking");
      expect(screen.getByText("Maximum price and payment method are required for auto-booking")).toBeVisible();
    });
  });

  it('should submit successfully with auto-booking ON, payment method, and max_price', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const autoBookSwitch = screen.getByRole('switch', { name: /enable auto-booking/i });
    await userEvent.click(autoBookSwitch);

    await waitFor(() => {
      expect(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i)).toBeVisible();
      expect(screen.getByLabelText(/payment method for auto-booking/i)).toBeVisible();
    });

    await userEvent.type(screen.getByLabelText(/maximum price \(usd\) for auto-booking/i), '2000');
    const paymentMethodSelect = screen.getByLabelText(/payment method for auto-booking/i);
    await userEvent.click(paymentMethodSelect);
    await userEvent.click(screen.getByText(/Visa •••• 4242 \(Default\) \(Work Card\)/i));

    const submitButton = screen.getByRole('button', { name: /enable auto-booking/i });
    await userEvent.click(submitButton);

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));
    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('auto_book_enabled', true);
    expect(submittedPayload).toHaveProperty('max_price', 2000);
    expect(submittedPayload).toHaveProperty('preferred_payment_method_id', 'pm_123');

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id'));
    await waitFor(() => expect(mockToastFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Trip request submitted",
        description: "Your trip request has been successfully submitted! Auto-booking is enabled.",
      })
    ));
  });

  it('should submit successfully with auto-booking OFF, not sending auto-booking fields', async () => {
    render(<MemoryRouter><TripRequestForm /></MemoryRouter>);
    await fillBaseFormFields();

    const submitButton = screen.getByRole('button', { name: /search now/i });
    await userEvent.click(submitButton);

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));
    const submittedPayload = mockInsert.mock.calls[0][0][0];
    expect(submittedPayload).toHaveProperty('auto_book_enabled', false);
    expect(submittedPayload.max_price).toBeNull();
    expect(submittedPayload.preferred_payment_method_id).toBeNull();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/trip/offers?id=new-trip-id'));
    await waitFor(() => expect(mockToastFn).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Trip request submitted",
        description: "Your trip request has been successfully submitted!",
      })
    ));
  });
});
