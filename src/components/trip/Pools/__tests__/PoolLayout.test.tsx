
import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PoolLayout from '../PoolLayout';
import { useTripOffersPools } from '@/hooks/useTripOffers';

// Mock the hook
vi.mock('@/hooks/useTripOffers', () => ({
  useTripOffersPools: vi.fn(() => ({
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
  })),
}));

const mockedUseTripOffersPools = useTripOffersPools as MockedFunction<typeof useTripOffersPools>;

// Mock the utility
vi.mock('@/utils/getPoolDisplayName', () => ({
  getPoolDisplayName: vi.fn((mode: string, index: number) => {
    const names = { manual: ['Best Value', 'Low Cost', 'Premium'] };
    return names[mode][index - 1];
  }),
}));

describe('PoolLayout', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  it('renders three pool sections', () => {
    renderWithRouter(<PoolLayout tripId="test-trip-id" />);
    
    expect(screen.getByText('Best Value')).toBeInTheDocument();
    expect(screen.getByText('Low Cost')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    mockedUseTripOffersPools.mockReturnValue({
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
    });

    renderWithRouter(<PoolLayout tripId="test-trip-id" />);
    
    // Check for skeleton elements (they should have specific classes)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error message when there is an error', () => {
    mockedUseTripOffersPools.mockReturnValue({
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
    });

    renderWithRouter(<PoolLayout tripId="test-trip-id" />);
    
    expect(screen.getByText('Error loading offers: Test error message')).toBeInTheDocument();
  });
});
