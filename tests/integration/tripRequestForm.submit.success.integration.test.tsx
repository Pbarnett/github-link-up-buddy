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
      functions: { invoke: vi.fn().mockResolvedValue({ data: { ok: true }, error: null }) },
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

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/services/api/flightSearchApi', () => ({
  invokeFlightSearch: vi.fn().mockResolvedValue({
    success: true,
    requestsProcessed: 1,
    matchesInserted: 1,
    totalDurationMs: 10,
    relaxedCriteriaUsed: false,
    exactDestinationOnly: true,
    details: [],
    message: 'ok',
    pool1: [], pool2: [], pool3: [], inserted: 0,
  }),
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

describe('TripRequestForm submit (integration) — success path', () => {
  let navigateMock: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(navigateMock);
  });

  it('submits form, creates trip, triggers flight search, and navigates to offers', async () => {
    // Suppress known benign warnings from robust helpers (combobox fallbacks)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(wrapper(<TripRequestForm mode="manual" />));

    // Fill the minimal valid set of fields (robust helper)
    // Use MVY (in POPULAR_DESTINATIONS) to avoid combobox fallback warnings
    await fillBaseFormFieldsWithDates({ destination: 'MVY', departureAirport: 'JFK', maxPrice: 1200 });

    // Form becomes valid and enables submit
    await waitForFormValid(10000);

    const submit = await screen.findByTestId('primary-submit-button');
    await act(async () => {
      (submit as HTMLButtonElement).click();
    });

    // Navigates to offers page with created id
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalled();
    });
    const navArg = (navigateMock.mock.calls[0] || [])[0] as string;
    expect(navArg).toMatch(/\/trip\/offers\?id=new-trip-id/);
    warnSpy.mockRestore();
  }, 20000);
});
