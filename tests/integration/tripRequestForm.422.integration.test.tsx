import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// MSW server setup
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

let callCount = 0;
const server = setupServer(
  // 422 validation error simulation
  http.post('/api/trips', async () => {
    callCount++;
    return HttpResponse.json({
      errors: [
        { field: 'destination_airport', message: 'Destination is required' },
      ],
    }, { status: 422 });
  }),
);

function wrapper(children: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('TripRequestForm submit integration (MSW)', () => {
  beforeAll(() => server.listen());
  afterEach(() => { callCount = 0; server.resetHandlers(); });
  afterAll(() => server.close());

  it('performs submit and handles 422 response gracefully (no crash, shows form)', async () => {
    render(wrapper(<TripRequestForm mode="manual" />));

    const submit = await screen.findByTestId('primary-submit-button');
    await act(async () => {
      (submit as HTMLButtonElement).click();
    });

    await waitFor(() => expect(callCount).toBeGreaterThanOrEqual(1));

    // The page should still be present and render the header; errors might be in toasts (not text-matched)
    expect(await screen.findByRole('heading', { name: /Search Live Flights/i })).toBeInTheDocument();
  });
});

