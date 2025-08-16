import { describe, it, expect } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import TripRequestForm from '@/components/trip/TripRequestForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.post('/api/trips', async () => {
    return HttpResponse.json({ id: 'trip-123', auto_book_enabled: false }, { status: 200 });
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

describe('TripRequestForm submit integration (MSW) - 500 retry path', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('shows error toast on 500 after retry', async () => {
    // First two calls fail with 500, third would succeed
    let callCount = 0;
    server.use(
      http.post('/api/trips', async () => {
        callCount++;
        if (callCount <= 2) {
          return new HttpResponse('Internal Server Error', { status: 500 });
        }
        return HttpResponse.json({ id: 'trip-123', auto_book_enabled: false }, { status: 200 });
      }),
    );

    render(wrapper(<TripRequestForm mode="manual" />));

    const submit = await screen.findByTestId('primary-submit-button');
    await act(async () => {
      (submit as HTMLButtonElement).click();
    });

    await waitFor(() => {
      // Expect an error alert after retries
      const alert = screen.getByRole('alert');
      expect(alert.textContent || '').toMatch(/error|failed|retry/i);
    });
  });
});

