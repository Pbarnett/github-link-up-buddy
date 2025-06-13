
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PoolLayout from '../PoolLayout';

// Mock the hook
vi.mock('@/hooks/useTripOffers', () => ({
  useTripOffersPools: vi.fn(() => ({
    pool1: [],
    pool2: [],
    pool3: [],
    mode: 'manual',
    isLoading: false,
    hasError: false,
    errorMessage: '',
  })),
}));

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
    const { useTripOffersPools } = require('@/hooks/useTripOffers');
    useTripOffersPools.mockReturnValue({
      pool1: [],
      pool2: [],
      pool3: [],
      mode: 'manual',
      isLoading: true,
      hasError: false,
      errorMessage: '',
    });

    renderWithRouter(<PoolLayout tripId="test-trip-id" />);
    
    // Check for skeleton elements (they should have specific classes)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error message when there is an error', () => {
    const { useTripOffersPools } = require('@/hooks/useTripOffers');
    useTripOffersPools.mockReturnValue({
      pool1: [],
      pool2: [],
      pool3: [],
      mode: 'manual',
      isLoading: false,
      hasError: true,
      errorMessage: 'Test error message',
    });

    renderWithRouter(<PoolLayout tripId="test-trip-id" />);
    
    expect(screen.getByText('Error loading offers: Test error message')).toBeInTheDocument();
  });
});
