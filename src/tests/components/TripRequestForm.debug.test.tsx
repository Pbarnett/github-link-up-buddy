import { render } from '@testing-library/react';
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

describe('TripRequestForm Debug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debug: check what renders in auto mode', () => {
    const { container } = render(
      <TestWrapper>
        <TripRequestForm mode="auto" />
      </TestWrapper>
    );
    
    // Debug: log what's actually being rendered
    console.log('Container HTML length:', container.innerHTML.length);
    
    // Count elements
    const h1Elements = container.querySelectorAll('h1');
    const h2Elements = container.querySelectorAll('h2');
    console.log('H1 count:', h1Elements.length);
    console.log('H2 count:', h2Elements.length);
    
    // Check for key text
    const allText = container.textContent || '';
    console.log('Contains Trip Basics:', allText.includes('Trip Basics'));
    console.log('Contains Plan Your Trip:', allText.includes('Plan Your Trip'));
    console.log('Contains Where & When:', allText.includes('Where & When'));
    console.log('Contains Travel Details:', allText.includes('Travel Details'));
    console.log('Text content length:', allText.length);
    
    // Let's see what H1 elements contain
    h1Elements.forEach((h1, index) => {
      console.log(`H1 ${index}:`, h1.textContent);
    });
    
    // This test should pass - just for debugging
    expect(container).toBeInTheDocument();
  });

  test('debug: check manual mode', () => {
    const { container } = render(
      <TestWrapper>
        <TripRequestForm mode="manual" />
      </TestWrapper>
    );
    
    const allText = container.textContent || '';
    console.log('Manual mode - Contains Plan Your Trip:', allText.includes('Plan Your Trip'));
    console.log('Manual mode - Text length:', allText.length);
    
    expect(container).toBeInTheDocument();
  });
});
