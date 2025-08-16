import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// MSW server setup
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  // 422 validation error simulation
  http.post('/api/trips', async () => {
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
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('shows field error mapping on 422 response', async () => {
    render(wrapper(<TripRequestForm mode="manual" />));

    // Try to submit immediately -> should trigger validation + network 422 mapping
    const submit = await screen.findByTestId('primary-submit-button');
    await act(async () => {
      (submit as HTMLButtonElement).click();
    });

    await waitFor(() => {
      // Expect a destructive toast or field error to be visible; we assert the generic validation message
      const alert = screen.getByRole('alert');
      expect(alert.textContent || '').toMatch(/error/i);
    });
  });
});

