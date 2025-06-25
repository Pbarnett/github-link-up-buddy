
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

    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
    expect(screen.getByText('Enter the parameters for your trip below.')).toBeInTheDocument();
    expect(screen.getByText('Search Now')).toBeInTheDocument();
  });

  test('should show manual mode UI when mode=manual', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="manual" />
      </TestWrapper>
    );

    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
    expect(screen.getByText('Search Now')).toBeInTheDocument();
  });

  test('should show auto mode UI when mode=auto', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    expect(screen.getByText('Set Up Auto-Booking')).toBeInTheDocument();
    expect(screen.getByText('Configure your travel preferences and booking criteria below.')).toBeInTheDocument();
    expect(screen.getByText('Start Auto-Booking')).toBeInTheDocument();
  });

  test('should show auto-booking section in auto mode', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    expect(screen.getByText('Auto-Booking')).toBeInTheDocument();
    expect(screen.getByText('Configure automatic booking when flights match your criteria')).toBeInTheDocument();
    expect(screen.getByText('Maximum Price')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
  });

  test('should require max_price and payment method in auto mode', () => {
    render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );

    // Check for required field indicators
    const maxPriceLabel = screen.getByText('Maximum Price');
    const paymentMethodLabel = screen.getByText('Payment Method');
    
    expect(maxPriceLabel.parentElement).toHaveTextContent('*');
    expect(paymentMethodLabel.parentElement).toHaveTextContent('*');
  });
});
