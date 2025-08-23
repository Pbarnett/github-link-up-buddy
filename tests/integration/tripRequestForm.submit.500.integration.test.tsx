import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
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

    // As an extra guard in CI/jsdom, set hidden date inputs explicitly and blur
    const earliestInput = await screen.findByTestId('earliest-departure-input');
    const latestInput = await screen.findByTestId('latest-departure-input');
    const tomorrowISO = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const nextWeekISO = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    fireEvent.change(earliestInput, { target: { value: tomorrowISO } });
    fireEvent.change(latestInput, { target: { value: nextWeekISO } });
    fireEvent.blur(earliestInput);
    fireEvent.blur(latestInput);

    // Re-wait for validity after explicit date set
    await waitForFormValid(10000);

    // Prefer primary button, fall back to sticky if present
    let submit: HTMLButtonElement | null = (await screen.findByTestId('primary-submit-button')) as HTMLButtonElement;
    const sticky = screen.queryByTestId('sticky-submit-button') as HTMLButtonElement | null;
    if (!submit && sticky) submit = sticky;

    // Wait until the chosen button is enabled
    await waitFor(() => {
      if (!submit) throw new Error('Submit button not found');
      expect(submit).not.toHaveAttribute('disabled');
    }, { timeout: 5000 });

    await act(async () => {
      submit!.click();
    });

    // Navigates to offers even if flight search fails
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalled();
    }, { timeout: 5000 });

    // Shows the non-blocking fallback toast
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: expect.stringMatching(/search in progress/i),
    }));
    warnSpy.mockRestore();
  }, 20000);
});
