

import React from 'react';
import PoolLayout from '../PoolLayout';

// Mock the hook
vi.mock('@/hooks/usePoolsSafe', () => ({
  usePoolsSafe: vi.fn(() => ({
    pool1: [],
    pool2: [],
    pool3: [],
    budget: 1000,
    maxBudget: 3000,
    dateRange: { from: '2024-01-01', to: '2024-01-05' },
    bumpsUsed: 0,
    bumpBudget: vi.fn(),
    mode: 'manual',
    isLoading: false,
    hasError: false,
    errorMessage: '',
    refreshPools: vi.fn(),
    isUsingFallback: false,
  })),
}));

const mockedUsePoolsSafe = usePoolsSafe as MockedFunction<typeof usePoolsSafe>;

// Mock the utility
vi.mock('@/utils/getPoolDisplayName', () => ({
  getPoolDisplayName: vi.fn((mode: string, index: number) => {
    const names: Record<string, string[]> = {
      manual: ['Best Value', 'Low Cost', 'Premium'],
    };
    return names[mode]?.[index - 1] || `Pool ${index}`;
  }),
}));

describe('PoolLayout', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('renders three pool sections', () => {
    renderWithRouter(<PoolLayout tripId="test-trip-id" />);

    expect(screen.getByText('Best Value')).toBeInTheDocument();
    expect(screen.getByText('Low Cost')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    mockedUsePoolsSafe.mockReturnValue({
      pool1: [],
      pool2: [],
      pool3: [],
      budget: 1000,
      maxBudget: 3000,
      dateRange: { from: '2024-01-01', to: '2024-01-05' },
      bumpsUsed: 0,
      bumpBudget: vi.fn(),
      mode: 'manual',
      isLoading: true,
      hasError: false,
      errorMessage: '',
      refreshPools: vi.fn(),
      isUsingFallback: false,
    });

    renderWithRouter(<PoolLayout tripId="test-trip-id" />);

    // Check for skeleton elements (they should have specific classes)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error message when there is an error', () => {
    mockedUsePoolsSafe.mockReturnValue({
      pool1: [],
      pool2: [],
      pool3: [],
      budget: 1000,
      maxBudget: 3000,
      dateRange: { from: '2024-01-01', to: '2024-01-05' },
      bumpsUsed: 0,
      bumpBudget: vi.fn(),
      mode: 'manual',
      isLoading: false,
      hasError: true,
      errorMessage: 'Test error message',
      refreshPools: vi.fn(),
      isUsingFallback: false,
    });

    renderWithRouter(<PoolLayout tripId="test-trip-id" />);

    expect(
      screen.getByText('Error loading offers: Test error message')
    ).toBeInTheDocument();
  });
});
