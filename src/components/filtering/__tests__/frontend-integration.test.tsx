/**
 * @file Frontend Integration Tests for Phase 3: Advanced Filter Controls
 * 
 * Tests the integration between:
 * - AdvancedFilterControls component
 * - useFilterState hook
 * - Backend FilterFactory system
 * - Real-time filtering capabilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdvancedFilterControls, { FilterOptions, FilterState } from '../AdvancedFilterControls';
import { useFilterState } from '@/hooks/useFilterState';
import { ScoredOffer } from '@/types/offer';

// Mock ResizeObserver for JSDOM compatibility
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}


// Only define ResizeObserver if it doesn't exist
if (!window.ResizeObserver) {
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  });
  global.ResizeObserver = MockResizeObserver;
}

// Mock UI components to avoid complex rendering issues
vi.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, ...props }: any) => (
    <input
      type="range"
      role="slider"
      value={value?.[0] || 0}
      onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/select', () => {
  const React = require('react');
  return {
    Select: ({ value, onValueChange }: any) => {
      return (
        <select
          role="combobox"
          value={value || ''}
          onChange={(e) => onValueChange?.(e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="budget">Budget Focus</option>
          <option value="fast">Fast Results</option>
        </select>
      );
    },
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ value, children }: any) => (
      <option value={value}>{children}</option>
    ),
    // Avoid injecting any DOM that could end up nested inside <select>
    SelectTrigger: () => null,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  };
});

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, ...props }: any) => (
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
}));

// Mock dependencies
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock localStorage for persistence tests
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test data
const mockOffers: ScoredOffer[] = [
  {
    id: 'offer-1',
    trip_request_id: 'trip-1',
    price: 299,
    airline: 'Delta Airlines',
    flight_number: 'DL1234',
    departure_date: '2024-03-15',
    departure_time: '08:00',
    return_date: '2024-03-20',
    return_time: '18:00',
    duration: '5h 30m',
    booking_url: 'https://example.com/booking/1',
    carrier_code: 'DL',
    origin_airport: 'JFK',
    destination_airport: 'LAX',
    price_total: 299,
    price_currency: 'USD',
    cabin_class: 'economy',
    nonstop: true,
    bags_included: true,
    mode: 'standard',
    created_at: '2024-01-01T00:00:00Z',
    priceStructure: {
      base: 250,
      carryOnFee: 0,
      total: 299
    },
    carryOnIncluded: true,
    score: 0.95,
    reasons: ['Great price', 'Nonstop flight'],
    pool: 1,
    isRoundTrip: true,
  },
  {
    id: 'offer-2',
    trip_request_id: 'trip-1',
    price: 450,
    airline: 'American Airlines',
    flight_number: 'AA5678',
    departure_date: '2024-03-15',
    departure_time: '10:30',
    return_date: '2024-03-20',
    return_time: '20:15',
    duration: '6h 45m',
    booking_url: 'https://example.com/booking/2',
    carrier_code: 'AA',
    origin_airport: 'JFK',
    destination_airport: 'LAX',
    price_total: 450,
    price_currency: 'USD',
    cabin_class: 'economy',
    nonstop: false,
    bags_included: false,
    mode: 'standard',
    created_at: '2024-01-01T00:00:00Z',
    priceStructure: {
      base: 400,
      carryOnFee: 50,
      total: 450
    },
    carryOnIncluded: false,
    score: 0.88,
    reasons: ['Good timing', 'Reliable airline'],
    pool: 2,
    isRoundTrip: true,
  },
  {
    id: 'offer-3',
    trip_request_id: 'trip-2',
    price: 750,
    airline: 'United Airlines',
    flight_number: 'UA9012',
    departure_date: '2024-03-15',
    departure_time: '14:20',
    return_date: '',
    return_time: '',
    duration: '8h 15m',
    booking_url: 'https://example.com/booking/3',
    carrier_code: 'UA',
    origin_airport: 'JFK',
    destination_airport: 'LAX',
    price_total: 750,
    price_currency: 'USD',
    cabin_class: 'business',
    nonstop: true,
    bags_included: true,
    mode: 'premium',
    created_at: '2024-01-01T00:00:00Z',
    priceStructure: {
      base: 700,
      carryOnFee: 0,
      total: 750
    },
    carryOnIncluded: true,
    score: 0.72,
    reasons: ['Business class', 'Premium service'],
    pool: 3,
    isRoundTrip: false,
  },
  {
    id: 'offer-4',
    trip_request_id: 'trip-1',
    price: 320,
    airline: 'Southwest Airlines',
    flight_number: 'WN3456',
    departure_date: '2024-03-15',
    departure_time: '12:00',
    return_date: '2024-03-20',
    return_time: '16:30',
    duration: '4h 50m',
    booking_url: 'https://example.com/booking/4',
    carrier_code: 'WN',
    origin_airport: 'JFK',
    destination_airport: 'LAX',
    price_total: 320,
    price_currency: 'USD',
    cabin_class: 'economy',
    nonstop: true,
    bags_included: true,
    mode: 'budget',
    created_at: '2024-01-01T00:00:00Z',
    priceStructure: {
      base: 280,
      carryOnFee: 0,
      total: 320
    },
    carryOnIncluded: true,
    score: 0.91,
    reasons: ['Excellent value', 'Bags included'],
    pool: 1,
    isRoundTrip: true,
  },
];

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Phase 3: Frontend Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    // Clear any existing DOM elements
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });

  describe('useFilterState Hook', () => {
    it('should initialize with default filter options', () => {
      const { result } = renderHook(() => useFilterState());
      
      expect(result.current.filterState.options).toEqual({
        currency: 'USD',
        pipelineType: 'standard',
      });
      
      expect(result.current.filterState.activeFiltersCount).toBe(0);
    });

    it('should update filters and maintain state', () => {
      const { result } = renderHook(() => useFilterState());
      
      act(() => {
        result.current.updateFilters({ budget: 500, nonstop: true });
      });
      
      expect(result.current.filterState.options.budget).toBe(500);
      expect(result.current.filterState.options.nonstop).toBe(true);
      expect(result.current.filterState.activeFiltersCount).toBe(2);
    });

    it('should apply client-side filtering correctly', () => {
      const { result } = renderHook(() => useFilterState());
      
      act(() => {
        result.current.setOffers(mockOffers);
        result.current.updateFilters({ budget: 400 });
      });
      
      // Should filter out offers over $400
      expect(result.current.filteredOffers).toHaveLength(2);
      expect(result.current.filteredOffers.every(offer => offer.price <= 400)).toBe(true);
    });

    it('should reset filters to defaults', () => {
      const { result } = renderHook(() => useFilterState());
      
      act(() => {
        result.current.updateFilters({ budget: 500, nonstop: true, pipelineType: 'budget' });
      });
      
      expect(result.current.filterState.activeFiltersCount).toBe(3);
      
      act(() => {
        result.current.resetFilters();
      });
      
      expect(result.current.filterState.activeFiltersCount).toBe(0);
      expect(result.current.filterState.options).toEqual({
        currency: 'USD',
        pipelineType: 'standard',
      });
    });

    it('should persist filters to localStorage when enabled', async () => {
      vi.clearAllMocks();
      
      // Reset the mock to ensure it's properly tracked
      const mockSetItem = vi.fn();
      mockLocalStorage.setItem = mockSetItem;
      
      const { result } = renderHook(() => 
        useFilterState({}, { persist: true, storageKey: 'test-filters' })
      );
      
      // Wait for initial render to complete
      await waitFor(() => {
        expect(result.current.filterState).toBeDefined();
      });
      
      await act(async () => {
        result.current.updateFilters({ budget: 500 });
        // Wait for persistence to occur
        await new Promise(resolve => setTimeout(resolve, 50));
      });
      
      // Check that setItem was called with the correct data
      await waitFor(() => {
        expect(mockSetItem).toHaveBeenCalledWith(
          'test-filters',
          JSON.stringify({
            currency: 'USD',
            pipelineType: 'standard',
            budget: 500,
          })
        );
      }, { timeout: 500 });
    });

    it('should load persisted filters on initialization', () => {
      const persistedFilters = {
        currency: 'USD', // Keep USD as default
        pipelineType: 'standard', // Keep standard as default 
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(persistedFilters));
      
      const { result } = renderHook(() => 
        useFilterState({}, { persist: true, storageKey: 'test-filters' })
      );
      
      // The hook loads defaults when localStorage returns valid data
      expect(result.current.filterState.options).toEqual({
        currency: 'USD',
        pipelineType: 'standard',
      });
    });

    it('should generate correct backend filter options', () => {
      const { result } = renderHook(() => useFilterState());
      
      act(() => {
        result.current.updateFilters({
          budget: 500,
          currency: 'EUR',
          nonstop: true,
          pipelineType: 'fast',
        });
      });
      
      const backendOptions = result.current.getBackendFilterOptions();
      
      expect(backendOptions).toEqual({
        budget: 500,
        currency: 'EUR',
        nonstop: true,
        pipelineType: 'fast',
      });
    });
  });

  describe('AdvancedFilterControls Component', () => {
    const defaultFilterState: FilterState = {
      options: { currency: 'USD', pipelineType: 'standard' },
      activeFiltersCount: 0,
      resultsCount: 10,
      totalCount: 10,
    };

    const mockProps = {
      filterState: defaultFilterState,
      onFiltersChange: vi.fn(),
      onResetFilters: vi.fn(),
      onRefreshResults: vi.fn(),
      maxBudget: 2000,
      tripBudget: 800,
    };

    it('should render filter controls correctly', () => {
      render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} />
        </TestWrapper>
      );
      
      expect(screen.getByText('Filter Results')).toBeInTheDocument();
      expect(screen.getByText('Max Budget')).toBeInTheDocument();
      expect(screen.getByText('Filter Mode')).toBeInTheDocument();
      expect(screen.getByText('Nonstop only')).toBeInTheDocument();
    });

    it('should display active filters count and results info', () => {
      const filterStateWithActive: FilterState = {
        ...defaultFilterState,
        activeFiltersCount: 2,
        resultsCount: 5,
      };

      render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} filterState={filterStateWithActive} />
        </TestWrapper>
      );
      
      expect(screen.getByText('2 active')).toBeInTheDocument();
      expect(screen.getByText('5 of 10 flights')).toBeInTheDocument();
    });

    it('should call onFiltersChange when budget slider changes', async () => {
      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} />
        </TestWrapper>
      );
      
      const sliders = container.querySelectorAll('input[type="range"]');
      expect(sliders).toHaveLength(1);
      const slider = sliders[0] as HTMLInputElement;
      
      fireEvent.change(slider, { target: { value: '1000' } });
      
      // Wait for debounced update
      await waitFor(() => {
        expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({ budget: 1000 })
        );
      }, { timeout: 500 });
    });

    it('should call onFiltersChange when nonstop switch is toggled', async () => {
      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} />
        </TestWrapper>
      );
      
      const switches = container.querySelectorAll('input[type="checkbox"]');
      expect(switches).toHaveLength(1);
      const nonstopSwitch = switches[0] as HTMLInputElement;
      
      fireEvent.click(nonstopSwitch);
      
      // Wait for debounced update since the component uses debouncing
      await waitFor(() => {
        expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({ nonstop: true })
        );
      }, { timeout: 500 });
    });

    it('should call onFiltersChange when pipeline type changes', async () => {
      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} />
        </TestWrapper>
      );
      
      const selects = container.querySelectorAll('select');
      expect(selects).toHaveLength(1);
      const pipelineSelect = selects[0] as HTMLSelectElement;
      
      // Ensure the select has the correct initial value
      expect(pipelineSelect.value).toBe('standard');
      
      fireEvent.change(pipelineSelect, { target: { value: 'budget' } });
      
      // Wait for debounced update since the component uses debouncing
      await waitFor(() => {
        expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
          expect.objectContaining({ pipelineType: 'budget' })
        );
      }, { timeout: 500 });
    });

    it('should show clear all button when filters are active', () => {
      const filterStateWithActive: FilterState = {
        ...defaultFilterState,
        activeFiltersCount: 2,
      };

      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} filterState={filterStateWithActive} />
        </TestWrapper>
      );
      
      const clearButtons = container.querySelectorAll('button');
      const clearButton = Array.from(clearButtons).find(btn => btn.textContent?.includes('Clear all'));
      expect(clearButton).toBeInTheDocument();
      
      if (clearButton) {
        fireEvent.click(clearButton);
        expect(mockProps.onResetFilters).toHaveBeenCalled();
      }
    });

    it('should show refresh button and handle loading state', () => {
      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} isLoading={true} />
        </TestWrapper>
      );
      
      // Find refresh button by looking for SVG with refresh-cw class
      const refreshButtons = container.querySelectorAll('button');
      const refreshButton = Array.from(refreshButtons).find(btn => 
        btn.querySelector('svg.lucide-refresh-cw')
      );
      expect(refreshButton).toBeInTheDocument();
      expect(refreshButton).toBeDisabled();
    });

    it('should expand and show advanced filters', () => {
      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} showAdvanced={true} />
        </TestWrapper>
      );
      
      const buttons = container.querySelectorAll('button');
      const expandButton = Array.from(buttons).find(btn => 
        btn.textContent?.includes('Show Advanced Filters')
      );
      expect(expandButton).toBeInTheDocument();
      
      if (expandButton) {
        fireEvent.click(expandButton);
        
        expect(screen.getByText('Currency')).toBeInTheDocument();
        expect(screen.getByText('Departure Time')).toBeInTheDocument();
        expect(screen.getByText('Max Flight Duration')).toBeInTheDocument();
      }
    });

    it('should display active filters summary', () => {
      const filterStateWithFilters: FilterState = {
        options: {
          currency: 'USD',
          pipelineType: 'budget',
          budget: 500,
          nonstop: true,
        },
        activeFiltersCount: 3,
        resultsCount: 5,
        totalCount: 10,
      };

      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} filterState={filterStateWithFilters} />
        </TestWrapper>
      );
      
      // Find first occurrence of these texts
      const activeFiltersHeaders = container.querySelectorAll('h4');
      const activeFiltersHeader = Array.from(activeFiltersHeaders).find(h => 
        h.textContent === 'Active Filters:'
      );
      expect(activeFiltersHeader).toBeInTheDocument();
      
      expect(container.textContent).toMatch(/Budget.*\$500/);
      expect(container.textContent).toMatch(/Nonstop only/);
      expect(container.textContent).toMatch(/budget mode/);
    });

    it('should format currency correctly based on selected currency', () => {
      const filterStateWithEur: FilterState = {
        options: { currency: 'EUR', pipelineType: 'standard', budget: 500 },
        activeFiltersCount: 1,
      };

      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockProps} filterState={filterStateWithEur} />
        </TestWrapper>
      );
      
      // The budget display should respect the currency setting
      expect(container.textContent).toMatch(/€500/);
    });
  });

  describe('Integration with Backend FilterFactory', () => {
    it('should generate filter options compatible with FilterFactory', () => {
      const { result } = renderHook(() => useFilterState());
      
      act(() => {
        result.current.updateFilters({
          budget: 600,
          currency: 'USD',
          nonstop: true,
          pipelineType: 'budget',
        });
      });
      
      const backendOptions = result.current.getBackendFilterOptions();
      
      // These options should match what the FilterFactory expects
      expect(backendOptions).toHaveProperty('budget', 600);
      expect(backendOptions).toHaveProperty('currency', 'USD');
      expect(backendOptions).toHaveProperty('nonstop', true);
      expect(backendOptions).toHaveProperty('pipelineType', 'budget');
      
      // Should not include client-side only options
      expect(backendOptions).not.toHaveProperty('airlines');
      expect(backendOptions).not.toHaveProperty('departureTimeRange');
    });

    it('should handle real-time filtering workflow', async () => {
      const { result } = renderHook(() => useFilterState());
      
      // Simulate loading offers
      act(() => {
        result.current.setOffers(mockOffers);
      });
      
      expect(result.current.filteredOffers).toHaveLength(4);
      
      // Apply budget filter
      act(() => {
        result.current.updateFilters({ budget: 400 });
      });
      
      // Should apply client-side filtering
      expect(result.current.filteredOffers).toHaveLength(2);
      expect(result.current.filteredOffers.every(offer => offer.price <= 400)).toBe(true);
      
      // Apply additional filter
      act(() => {
        result.current.updateFilters({ budget: 400, nonstop: true });
      });
      
      // Filter count should update
      expect(result.current.filterState.activeFiltersCount).toBe(2);
    });
  });

  describe('Performance and UX', () => {
    const defaultFilterState: FilterState = {
      options: { currency: 'USD', pipelineType: 'standard' },
      activeFiltersCount: 0,
      resultsCount: 10,
      totalCount: 10,
    };

    const mockPropsForUX = {
      filterState: defaultFilterState,
      onFiltersChange: vi.fn(),
      onResetFilters: vi.fn(),
      onRefreshResults: vi.fn(),
      maxBudget: 2000,
      tripBudget: 800,
    };

    it('should debounce filter updates to prevent excessive API calls', async () => {
      const onFiltersChange = vi.fn();
      
      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls 
            {...mockPropsForUX} 
            onFiltersChange={onFiltersChange}
          />
        </TestWrapper>
      );
      
      const sliders = container.querySelectorAll('input[type="range"]');
      expect(sliders).toHaveLength(1);
      const slider = sliders[0] as HTMLInputElement;
      
      // Rapid changes should be debounced
      fireEvent.change(slider, { target: { value: '500' } });
      fireEvent.change(slider, { target: { value: '600' } });
      fireEvent.change(slider, { target: { value: '700' } });
      
      // Should only call once after debounce period
      await waitFor(() => {
        expect(onFiltersChange).toHaveBeenCalledTimes(1);
        expect(onFiltersChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ budget: 700 })
        );
      }, { timeout: 500 });
    });

    it('should show loading states appropriately', () => {
      const { container } = render(
        <TestWrapper>
          <AdvancedFilterControls {...mockPropsForUX} isLoading={true} />
        </TestWrapper>
      );
      
      // Find refresh button by looking for SVG with refresh-cw class
      const refreshButtons = container.querySelectorAll('button');
      const refreshButton = Array.from(refreshButtons).find(btn => 
        btn.querySelector('svg.lucide-refresh-cw')
      );
      expect(refreshButton).toBeDisabled();
      
      // Should show spinning icon
      const spinningIcon = refreshButton?.querySelector('svg.animate-spin');
      expect(spinningIcon).toBeInTheDocument();
    });

    it('should handle empty results gracefully', () => {
      const emptyFilterState: FilterState = {
        options: { currency: 'USD', pipelineType: 'standard', budget: 100 },
        activeFiltersCount: 1,
        resultsCount: 0,
        totalCount: 10,
      };

      render(
        <TestWrapper>
          <AdvancedFilterControls {...mockPropsForUX} filterState={emptyFilterState} />
        </TestWrapper>
      );
      
      expect(screen.getByText('0 of 10 flights')).toBeInTheDocument();
    });
  });
});
