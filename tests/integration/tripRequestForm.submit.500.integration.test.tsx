import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { fillBaseFormFieldsWithDates, waitForFormValid } from '@/tests/utils/formTestHelpers';
import { useMsw } from './setup/msw.server';

useMsw();

// Mocks
vi.mock('@/integrations/supabase/client', () => {
  const singleOk = vi.fn().mockResolvedValue({ data: { id: 'new-trip-id', auto_book_enabled: false }, error: null });
  const select = vi.fn().mockReturnValue({ single: singleOk });
  const insert = vi.fn().mockReturnValue({ select });
  return {
    supabase: {
      from: vi.fn(() => ({ insert })),
      functions: { invoke: vi.fn() },
    },
  };
});

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ userId: 'test-user-id', user: { id: 'test-user-id' } }),
}));

vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: () => ({
    data: [{ id: 'pm_123', brand: 'visa', last4: '4242', is_default: true }],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

const toastSpy = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  toast: (...args: any[]) => toastSpy(...args),
}));

// Force the flight search to fail to exercise the error path
vi.mock('@/services/api/flightSearchApi', () => ({
  invokeFlightSearch: vi.fn().mockRejectedValue(new Error('HTTP 500: internal error')),
}));

// Provide a lightweight repository mock so submission doesn't depend on Supabase chain shape
const createTripRequestMock = vi.fn().mockResolvedValue({ id: 'new-trip-id', auto_book_enabled: false });
vi.mock('@/lib/repositories', async () => {
  const actual = await vi.importActual<any>('@/lib/repositories');
  return {
    ...actual,
    TripRequestRepository: vi.fn().mockImplementation(() => ({
      createTripRequest: createTripRequestMock,
      updateTripRequest: vi.fn(),
    })),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

function wrapper(children: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('TripRequestForm submit (integration) — flight search 500 path', () => {
  let navigateMock: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(navigateMock);
  });

  it('still navigates and shows fallback toast when flight search fails', async () => {
    // Suppress known benign warnings from robust helpers (combobox/calendar fallbacks)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(wrapper(<TripRequestForm mode="manual" />));

    // Use MVY (in POPULAR_DESTINATIONS) to avoid combobox fallback warnings
    await fillBaseFormFieldsWithDates({ destination: 'MVY', departureAirport: 'JFK', maxPrice: 1200 });
    await waitForFormValid(10000);

    const submit = await screen.findByTestId('primary-submit-button');
    await act(async () => {
      (submit as HTMLButtonElement).click();
    });

    // Navigates to offers even if flight search fails
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalled();
    });

    // Shows the non-blocking fallback toast
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: expect.stringMatching(/search in progress/i),
    }));
    warnSpy.mockRestore();
  }, 20000);
});
