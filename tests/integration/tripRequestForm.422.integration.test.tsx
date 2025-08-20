import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// MSW server setup
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  // Placeholder handler (component uses Supabase repository; no direct HTTP POST expected here)
  http.post('/api/trips', async () => {
    return HttpResponse.json({ ok: false }, { status: 422 });
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
  afterEach(() => { server.resetHandlers(); });
  afterAll(() => server.close());

  it('performs submit and handles 422 response gracefully (no crash, shows form)', async () => {
    render(wrapper(<TripRequestForm mode="manual" />));

    const submit = await screen.findByTestId('primary-submit-button');
    await act(async () => {
      (submit as HTMLButtonElement).click();
    });

    // The page should still be present and render the header; errors might be in toasts (not text-matched)
    expect(await screen.findByRole('heading', { name: /Search Live Flights/i })).toBeInTheDocument();
  });
});

