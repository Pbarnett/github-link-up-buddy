
import { FilterOptions, FilterState } from '@/components/filtering/AdvancedFilterControls';
import { ScoredOffer } from '@/types/offer';
import { toast } from '@/components/ui/use-toast';
import logger from '@/lib/logger';
import * as React from 'react';

/**
 * Filter persistence options
 */
interface FilterPersistenceOptions {
  /** Whether to persist filters to localStorage */
  persist?: boolean;
  /** Storage key for persisting filters */
  storageKey?: string;
}

/**
 * Client-side filtering functions that work with the offers
 */
interface ClientSideFilters {
  budget?: number;
  nonstop?: boolean;
  airlines?: string[];
  departureTimeRange?: { start: number; end: number };
  maxDuration?: number;
}

/**
 * Hook result interface
 */
export interface UseFilterStateResult {
  /** Current filter state */
  filterState: FilterState;
  /** Filtered offers (client-side filtered from original offers) */
  filteredOffers: ScoredOffer[];
  /** Original unfiltered offers */
  originalOffers: ScoredOffer[];
  /** Update filter options */
  updateFilters: (options: Partial<FilterOptions>) => void;
  /** Reset all filters to defaults */
  resetFilters: () => void;
  /** Set the offers to be filtered */
  setOffers: (offers: ScoredOffer[]) => void;
  /** Whether filters are currently being applied */
  isApplyingFilters: boolean;
  /** Get backend filter options (for API calls) */
  getBackendFilterOptions: () => {
    budget?: number;
    currency?: string;
    nonstop?: boolean;
    pipelineType?: 'standard' | 'budget' | 'fast';
  };
  /** Get client-side filter options */
  getClientSideFilters: () => ClientSideFilters;
  /** Manually trigger filter application */
  applyFilters: () => void;
}

/**
 * Default filter options
 */
const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  currency: 'USD',
  pipelineType: 'standard',
};

/**
 * Hook for managing filter state with both backend and client-side filtering
 */
export const useFilterState = (
  initialOptions: Partial<FilterOptions> = {},
  persistenceOptions: FilterPersistenceOptions = {}
): UseFilterStateResult => {
  const { persist = false, storageKey = 'flight-filters' } = persistenceOptions;

  // Load persisted filters if enabled
  const loadPersistedFilters = useCallback((): FilterOptions => {
    if (!persist || typeof window === 'undefined') {
      return { ...DEFAULT_FILTER_OPTIONS, ...initialOptions };
    }

    try {
      const persisted = localStorage.getItem(storageKey);
      if (persisted) {
        const parsed = JSON.parse(persisted);
        return { ...DEFAULT_FILTER_OPTIONS, ...parsed, ...initialOptions };
      }
    } catch (error) {
      logger.warn('[FilterState] Failed to load persisted filters:', error);
    }

    return { ...DEFAULT_FILTER_OPTIONS, ...initialOptions };
  }, [persist, storageKey, initialOptions]);

  // State
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(loadPersistedFilters);
  const [originalOffers, setOriginalOffers] = useState<ScoredOffer[]>([]);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  // Persist filters when they change
  const persistFilters = useCallback((options: FilterOptions) => {
    if (!persist || typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(options));
    } catch (error) {
      logger.warn('[FilterState] Failed to persist filters:', error);
    }
  }, [persist, storageKey]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    // Count backend filters
    if (filterOptions.budget && filterOptions.budget !== initialOptions.budget) count++;
    if (filterOptions.nonstop) count++;
    if (filterOptions.pipelineType && filterOptions.pipelineType !== 'standard') count++;
    if (filterOptions.currency && filterOptions.currency !== 'USD') count++;

    // Count future client-side filters
    if (filterOptions.airlines && filterOptions.airlines.length > 0) count++;
    if (filterOptions.departureTimeRange) count++;
    if (filterOptions.maxDuration) count++;
    if (filterOptions.maxLayoverTime) count++;

    return count;
  }, [filterOptions, initialOptions.budget]);

  // Client-side filtering function
  const applyClientSideFilters = useCallback((offers: ScoredOffer[]): ScoredOffer[] => {
    let filtered = [...offers];

    // Apply client-side budget filter (fallback if not handled by backend)
    if (filterOptions.budget) {
      filtered = filtered.filter(offer => offer.price <= filterOptions.budget!);
    }

    // Apply client-side airline filter (Phase 4 feature)
    if (filterOptions.airlines && filterOptions.airlines.length > 0) {
      filtered = filtered.filter(offer => 
        filterOptions.airlines!.includes(offer.airline)
      );
    }

    // Apply client-side departure time filter (Phase 4 feature)
    if (filterOptions.departureTimeRange) {
      // This would require departure time information in the offer
      // For now, just log that it would be applied
      logger.info('[FilterState] Departure time filtering would be applied here');
    }

    // Apply max duration filter (Phase 4 feature)
    if (filterOptions.maxDuration) {
      // This would require duration information in the offer
      logger.info('[FilterState] Max duration filtering would be applied here');
    }

    return filtered;
  }, [filterOptions]);

  // Apply filters with loading state
  const applyFilters = useCallback(async () => {
    setIsApplyingFilters(true);
    
    // Simulate brief loading for UX (client-side filtering is instant)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setIsApplyingFilters(false);
    
    logger.info('[FilterState] Filters applied:', {
      activeCount: activeFiltersCount,
      originalCount: originalOffers.length,
      options: filterOptions
    });
  }, [activeFiltersCount, originalOffers.length, filterOptions]);

  // Filtered offers (apply client-side filters)
  const filteredOffers = useMemo(() => {
    return applyClientSideFilters(originalOffers);
  }, [originalOffers, applyClientSideFilters]);

  // Filter state object
  const filterState: FilterState = useMemo(() => ({
    options: filterOptions,
    activeFiltersCount,
    resultsCount: filteredOffers.length,
    totalCount: originalOffers.length,
  }), [filterOptions, activeFiltersCount, filteredOffers.length, originalOffers.length]);

  // Update filters function
  const updateFilters = useCallback((newOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => {
      const updated = { ...prev, ...newOptions };
      persistFilters(updated);
      
      logger.info('[FilterState] Filters updated:', {
        previous: prev,
        updates: newOptions,
        result: updated
      });
      
      return updated;
    });
  }, [persistFilters]);

  // Reset filters function
  const resetFilters = useCallback(() => {
    const defaultOptions = { ...DEFAULT_FILTER_OPTIONS, ...initialOptions };
    setFilterOptions(defaultOptions);
    persistFilters(defaultOptions);
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
    
    logger.info('[FilterState] Filters reset to defaults');
  }, [initialOptions, persistFilters]);

  // Set offers function
  const setOffers = useCallback((offers: ScoredOffer[]) => {
    setOriginalOffers(offers);
    logger.info(`[FilterState] Set ${offers.length} offers for filtering`);
  }, []);

  // Get backend filter options (for API calls)
  const getBackendFilterOptions = useCallback(() => {
    return {
      budget: filterOptions.budget,
      currency: filterOptions.currency,
      nonstop: filterOptions.nonstop,
      pipelineType: filterOptions.pipelineType,
    };
  }, [filterOptions]);

  // Get client-side filter options
  const getClientSideFilters = useCallback((): ClientSideFilters => {
    return {
      budget: filterOptions.budget,
      nonstop: filterOptions.nonstop,
      airlines: filterOptions.airlines,
      departureTimeRange: filterOptions.departureTimeRange,
      maxDuration: filterOptions.maxDuration,
    };
  }, [filterOptions]);

  // Auto-apply filters when they change
  useEffect(() => {
    if (originalOffers.length > 0) {
      applyFilters();
    }
  }, [filterOptions, originalOffers.length, applyFilters]);

  return {
    filterState,
    filteredOffers,
    originalOffers,
    updateFilters,
    resetFilters,
    setOffers,
    isApplyingFilters,
    getBackendFilterOptions,
    getClientSideFilters,
    applyFilters,
  };
};
