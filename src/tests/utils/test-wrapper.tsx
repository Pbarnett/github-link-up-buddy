import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BusinessRulesProvider } from '@/hooks/useBusinessRules';

interface TestWrapperProps {
  children: ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

export function TestWrapper({ children, initialEntries = ['/'], queryClient }: TestWrapperProps) {
  const testQueryClient = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const mockBusinessRulesConfig = {
    environment: 'test' as const,
    version: '1.0.0',
    autoBookingEnabled: true,
    priceConstraints: {
      minimumPrice: 100,
      maximumPrice: 5000,
      currency: 'USD',
    },
    allowedCabinClasses: ['economy', 'business', 'first'],
    features: {
      analyticsEnabled: true,
      legacyAdapterEnabled: true,
    },
  };

  return (
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <BusinessRulesProvider config={mockBusinessRulesConfig as any}>
          {children}
        </BusinessRulesProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

export function createTestWrapper(props: Omit<TestWrapperProps, 'children'> = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <TestWrapper {...props}>{children}</TestWrapper>;
  };
}
