
import '@testing-library/jest-dom';
import '@testing-library/jest-dom'; } from 'vitest';

// Mock the necessary APIs or components
vi.mock('@/services/flightSearchSecure', () => ({
  flightSearchServiceSecure: {
    searchFlights: vi.fn().mockResolvedValue({ data: [], meta: { count: 0 } }),
  },
}));

// Mock Supabase Auth
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(callback => ({
        data: { subscription: { unsubscribe: vi.fn() } },
        callback,
      })),
    },
  },
}));

// Component Test
it('renders flight search form correctly', () => {
  // Render the component
  render(<SecureFlightSearch onFlightSelect={vi.fn()} onError={vi.fn()} />);

  // Check for form fields
  expect(screen.getByPlaceholderText(/lax, new york, etc./i)).toBeVisible();
  expect(screen.getByPlaceholderText(/jfk, london, etc./i)).toBeVisible();

  // Check for departure date input by looking for date input type
  const departureInputs = screen.getAllByDisplayValue(/^\d{4}-\d{2}-\d{2}$/);
  expect(departureInputs.length).toBeGreaterThan(0);
  expect(departureInputs[0]).toBeVisible();
  expect(departureInputs[0].getAttribute('type')).toBe('date');

  // Check for search button
  expect(screen.getByRole('button', { name: /search flights/i })).toBeVisible();

  // Check for other key form elements
  expect(screen.getByText('Round Trip')).toBeVisible();
  expect(screen.getByText('One Way')).toBeVisible();
  expect(screen.getByText('Adults')).toBeVisible();
  expect(screen.getByText('Cabin Class')).toBeVisible();
});
