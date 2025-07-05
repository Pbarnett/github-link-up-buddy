
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PoolOfferControls from '@/components/trip/PoolOfferControls';

// Mock the hook
vi.mock('@/hooks/useTripOffers', () => ({
  useTripOffersPools: vi.fn(),
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

import { useTripOffersPools } from '@/hooks/useTripOffers';
import { toast } from '@/components/ui/use-toast';

describe('PoolOfferControls', () => {
  const mockHookData = {
    budget: 1000,
    maxBudget: 3000,
    dateRange: { from: '2024-06-15', to: '2024-06-22' },
    bumpsUsed: 0,
    bumpBudget: vi.fn(),
    pool1: [],
    pool2: [],
    pool3: [],
    mode: 'manual' as const,
    isLoading: false,
    hasError: false,
    errorMessage: '',
    refreshPools: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTripOffersPools as any).mockReturnValue(mockHookData);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  it('renders ConstraintChips with correct dateRange', () => {
    render(<PoolOfferControls tripId="test-trip" />, { wrapper });
    
    // Use flexible regex to account for locale differences in date formatting
    expect(screen.getByText(/Jun 1[45] – Jun 2[12]/)).toBeInTheDocument();
  });

  it('displays budget information correctly', () => {
    render(<PoolOfferControls tripId="test-trip" />, { wrapper });
    
    expect(screen.getByText('Budget: $1000 / Max: $3000')).toBeInTheDocument();
  });

  it('enables budget button when bumps < 3 and budget < maxBudget', () => {
    render(<PoolOfferControls tripId="test-trip" />, { wrapper });
    
    const budgetButton = screen.getByText('+20% Budget');
    expect(budgetButton).not.toBeDisabled();
  });

  it('disables budget button when bumpsUsed >= 3', () => {
    (useTripOffersPools as any).mockReturnValue({
      ...mockHookData,
      bumpsUsed: 3,
    });

    render(<PoolOfferControls tripId="test-trip" />, { wrapper });
    
    const budgetButton = screen.getByText('+20% Budget');
    expect(budgetButton).toBeDisabled();
  });

  it('disables budget button when budget >= maxBudget', () => {
    (useTripOffersPools as any).mockReturnValue({
      ...mockHookData,
      budget: 3000,
      maxBudget: 3000,
    });

    render(<PoolOfferControls tripId="test-trip" />, { wrapper });
    
    const budgetButton = screen.getByText('+20% Budget');
    expect(budgetButton).toBeDisabled();
  });

  it('calls bumpBudget and shows toast when budget button is clicked', () => {
    render(<PoolOfferControls tripId="test-trip" />, { wrapper });
    
    const budgetButton = screen.getByText('+20% Budget');
    fireEvent.click(budgetButton);
    
    expect(mockHookData.bumpBudget).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith({
      title: 'Budget raised to $1000',
      description: 'Maximum budget: $3000'
    });
  });

  it('shows bumps used indicator when bumpsUsed > 0', () => {
    (useTripOffersPools as any).mockReturnValue({
      ...mockHookData,
      bumpsUsed: 2,
    });

    render(<PoolOfferControls tripId="test-trip" />, { wrapper });
    
    expect(screen.getByText('(2/3 raises used)')).toBeInTheDocument();
  });
});
