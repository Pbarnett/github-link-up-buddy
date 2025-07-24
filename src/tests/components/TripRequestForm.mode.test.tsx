import { test, expect, vi, beforeEach, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import type { ReactNode } from 'react';
import TripRequestForm from '@/components/trip/TripRequestForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock the hooks
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ userId: 'test-user' }),
}));

vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: () => ({
    data: [],
    isLoading: false,
    error: undefined,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => false,
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

const TestWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TripRequestForm Mode Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should show manual mode UI by default', () => {
    render(
      <TestWrapper>
        <TripRequestForm />
      </TestWrapper>
    );

    // Check for current UI text elements
    expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    expect(screen.getByText('Live Flight Search')).toBeInTheDocument();
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();

    // Check for submit buttons
    const searchButtons = screen.getAllByRole('button', {
      name: /search now/i,
    });
    expect(searchButtons.length).toBeGreaterThan(0);
  });

  test('should show manual mode UI when mode=manual', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="manual" />
      </TestWrapper>
    );

    // Check for current UI text elements
    expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    expect(screen.getByText('Live Flight Search')).toBeInTheDocument();
    expect(screen.getByText('Travelers & Cabin')).toBeInTheDocument();

    // Check for submit buttons
    const searchButtons = screen.getAllByRole('button', {
      name: /search now/i,
    });
    expect(searchButtons.length).toBeGreaterThan(0);
  });

  test('should show auto mode UI when mode=auto', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // In auto mode step 1, check for specific elements
    expect(
      screen.getByRole('heading', { name: 'Trip Basics' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Tell us where and when you want to travel.')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Continue → Pricing')).toHaveLength(2);
  });

  test('should show step indicator in auto mode', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Step indicator should be present (there are multiple elements with this text)
    expect(screen.getAllByText('Trip Basics')).toHaveLength(2);
    expect(screen.getByText('Price & Payment')).toBeInTheDocument();
  });

  test('should show different sections in auto mode step 1', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Should show destination field
    expect(screen.getByText('Destination')).toBeInTheDocument();

    // Should show the continue button for auto mode
    expect(screen.getAllByText('Continue → Pricing').length).toBeGreaterThan(0);

    // Should NOT show auto-booking section in step 1
    expect(screen.queryByText('Maximum Price')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Payment & Authorization')
    ).not.toBeInTheDocument();
  });
});
