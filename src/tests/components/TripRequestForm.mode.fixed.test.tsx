import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { test, expect, vi, beforeEach, describe } from 'vitest';
import TripRequestForm from '@/components/trip/TripRequestForm';

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
      <MemoryRouter>
        {children}
      </MemoryRouter>
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

    expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    expect(screen.getByText('Search real-time flight availability (Amadeus-powered)')).toBeInTheDocument();
    expect(screen.getByTestId('primary-submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('primary-submit-button')).toHaveTextContent('Search Now');
  });

  test('should show manual mode UI when mode=manual', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="manual" />
      </TestWrapper>
    );

    expect(screen.getByText('Search Live Flights')).toBeInTheDocument();
    expect(screen.getByTestId('primary-submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('primary-submit-button')).toHaveTextContent('Search Now');
  });

  test('should show auto mode UI when mode=auto', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // In auto mode step 1, the title should be "Trip Basics" - use getAllByText since it appears multiple times
    const tripBasicsElements = screen.getAllByText('Trip Basics');
    expect(tripBasicsElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Tell us where and when you want to travel.')).toBeInTheDocument();
    
    // Use getAllByText since there are multiple Continue → Pricing buttons
    const continuePricingElements = screen.getAllByText('Continue → Pricing');
    expect(continuePricingElements.length).toBeGreaterThan(0);
  });

  test('should show step indicator in auto mode', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Step indicator should be present - "Trip Basics" appears in both title and stepper
    const tripBasicsElements = screen.getAllByText('Trip Basics');
    expect(tripBasicsElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText('Price & Payment')).toBeInTheDocument();
  });

  test('should show different sections in auto mode step 1', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Should show destination and date fields in step 1
    expect(screen.getByText('Destination')).toBeInTheDocument();
    expect(screen.getByText('Trip length')).toBeInTheDocument(); // Note: lowercase 'length'
    
    // Should NOT show auto-booking section in step 1
    expect(screen.queryByText('Maximum Price')).not.toBeInTheDocument();
    expect(screen.queryByText('Payment & Authorization')).not.toBeInTheDocument();
  });
});
