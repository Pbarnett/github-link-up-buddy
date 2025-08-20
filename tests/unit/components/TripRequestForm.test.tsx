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

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
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

    // Check for manual mode title and description
    expect(screen.getAllByText('Search Live Flights').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Search real-time flight availability (Amadeus-powered)').length).toBeGreaterThan(0);
  }, 10000);

  test('should show manual mode UI when mode=manual', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="manual" />
      </TestWrapper>
    );

    // Check for manual mode title and description
    expect(screen.getAllByText('Search Live Flights').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Search real-time flight availability (Amadeus-powered)').length).toBeGreaterThan(0);
  }, 10000);

  test('should show auto mode UI when mode=auto', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // In auto mode step 1, the title should be "Trip Basics" (appears in both title and stepper)
    const tripBasicsElements = screen.getAllByText('Trip Basics');
    expect(tripBasicsElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText('Tell us where and when you want to travel.')).toBeInTheDocument();
    // Component has multiple "Continue → Pricing" buttons (main form + sticky actions)
    const continueButtons = screen.getAllByText('Continue → Pricing');
    expect(continueButtons.length).toBeGreaterThan(0);
  }, 10000);

  test('should show step indicator in auto mode', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Step indicator should be present - "Trip Basics" appears in both title and stepper
    const tripBasicsElements = screen.getAllByText('Trip Basics');
    expect(tripBasicsElements.length).toBeGreaterThan(0);
    
    expect(screen.getAllByText('Price & Payment').length).toBeGreaterThan(0);
  }, 10000);

  test('should show different sections in auto mode step 1', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Should show actual section labels from the components
    expect(screen.getAllByText('Destination').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Departure Airports').length).toBeGreaterThan(0);
    
    // Check for the specific heading instead of generic 'travel' text
    const basicsHeadings = screen.getAllByRole('heading', { name: /Trip Basics/i });
    expect(basicsHeadings.length).toBeGreaterThan(0);
    // Or check for specific travel-related labels
    expect(screen.getAllByText(/When do you want to travel\?/i).length).toBeGreaterThan(0);
    
    // Should NOT show auto-booking section in step 1
    expect(screen.queryByText('Maximum Price')).not.toBeInTheDocument();
    expect(screen.queryByText('Payment & Authorization')).not.toBeInTheDocument();
  }, 10000);
});
