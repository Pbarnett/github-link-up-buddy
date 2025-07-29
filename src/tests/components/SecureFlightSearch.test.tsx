import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { SecureFlightSearch } from '@/components/flights/SecureFlightSearch';
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

  // Check for departure date input by looking for the date input with today's date
  const today = new Date().toISOString().split('T')[0];
  const departureInput = screen.getByDisplayValue(today);
  expect(departureInput).toBeVisible();
  expect(departureInput.getAttribute('type')).toBe('date');

  // Check for search button
  expect(screen.getByRole('button', { name: /search flights/i })).toBeVisible();

  // Check for other key form elements
  expect(screen.getByText('Round Trip')).toBeVisible();
  expect(screen.getByText('One Way')).toBeVisible();
  expect(screen.getByText('Adults')).toBeVisible();
  expect(screen.getByText('Cabin Class')).toBeVisible();
});
