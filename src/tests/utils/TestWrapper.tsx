type ReactNode = React.ReactNode;
type FC<T = {}> = React.FC<T>;

import { vi } from 'vitest';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// Create a test-specific query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface TestWrapperProps {
  children: ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

// Mock providers that might be needed
const MockBusinessRulesProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const MockPersonalizationProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const MockLaunchDarklyProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const TestWrapper: FC<TestWrapperProps> = ({
  children,
  initialEntries = ['/'],
  queryClient = createTestQueryClient(),
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MockBusinessRulesProvider>
        <MockPersonalizationProvider>
          <MockLaunchDarklyProvider>
            <MemoryRouter initialEntries={initialEntries}>
              {children}
            </MemoryRouter>
          </MockLaunchDarklyProvider>
        </MockPersonalizationProvider>
      </MockBusinessRulesProvider>
    </QueryClientProvider>
  );
};

// Helper function to create a wrapper with specific route
export const createTestWrapper = (initialEntries: string[] = ['/']) => {
  return ({ children }: { children: ReactNode }) => (
    <TestWrapper initialEntries={initialEntries}>{children}</TestWrapper>
  );
};

// Helper function to render with all providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: {
    initialEntries?: string[];
    queryClient?: QueryClient;
  }
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestWrapper
      initialEntries={options?.initialEntries}
      queryClient={options?.queryClient}
    >
      {children}
    </TestWrapper>
  );

  return { wrapper: Wrapper };
};

export default TestWrapper;
