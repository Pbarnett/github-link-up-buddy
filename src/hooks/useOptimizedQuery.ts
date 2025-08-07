/**
 * Optimized Query Hook
 * React Query wrapper with intelligent caching, retry, and performance optimizations
 */

import {
  useQuery,
  useQueryClient,
  QueryKey,
  UseQueryOptions,

./useNetworkStatus';

interface OptimizedQueryOptions<T>
  extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  // Custom options for optimization
  enableOfflineFirst?: boolean;
  skipNetworkOnCacheHit?: boolean;
  trackPerformance?: boolean;
}

export const useOptimizedQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const queryClient = useQueryClient();

  const {
    enableOfflineFirst = true,
    skipNetworkOnCacheHit = true,
    trackPerformance = true,
    ...reactQueryOptions
  } = options;

  // Performance tracking
  const startTime = performance.now();

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      const cacheHit = queryClient.getQueryData(queryKey);

      // Skip network if we have cache and option enabled
      if (
        cacheHit &&
        skipNetworkOnCacheHit &&
        !reactQueryOptions.refetchInterval
      ) {
        if (trackPerformance) {
          trackEvent('query_cache_hit', {
            queryKey: JSON.stringify(queryKey),
            duration: performance.now() - startTime,
          });
        }
        return cacheHit as T;
      }

      try {
        const result = await queryFn()();

        if (trackPerformance) {
          trackEvent('query_network_success', {
            queryKey: JSON.stringify(queryKey),
            duration: performance.now() - startTime,
            cacheHit: !!cacheHit,
            isSlowConnection,
          });
        }

        return result;
      } catch (error) {
        if (trackPerformance) {
          trackEvent('query_network_error', {
            queryKey: JSON.stringify(queryKey),
            duration: performance.now() - startTime,
            error: error instanceof Error ? error.message : 'Unknown error',
            isOnline,
          });
        }
        throw error;
      }
    },

    // Adaptive caching based on connection
    staleTime: isSlowConnection ? 10 * 60 * 1000 : 5 * 60 * 1000, // 10min vs 5min
    gcTime: 15 * 60 * 1000, // 15 minutes (renamed from cacheTime in v5)

    // Smart retry logic
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404s
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 404
      )
        return false;

      // Don't retry when offline (unless enableOfflineFirst)
      if (!isOnline && !enableOfflineFirst) return false;

      // Retry up to 3 times with exponential backoff
      return failureCount < 3;
    },

    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Network mode based on connection status
    networkMode: isOnline
      ? 'online'
      : enableOfflineFirst
        ? 'offlineFirst'
        : 'online',

    // Refetch on window focus only if online
    refetchOnWindowFocus: isOnline,

    // Disable background refetch on slow connections
    refetchOnMount: !isSlowConnection,

    // Merge with user options
    ...reactQueryOptions,
  });

  // Track query state changes
  if (trackPerformance && queryResult.status) {
    const queryState = {
      queryKey: JSON.stringify(queryKey),
      status: queryResult.status,
      isLoading: queryResult.isLoading,
      isError: queryResult.isError,
      isFetching: queryResult.isFetching,
      dataUpdatedAt: queryResult.dataUpdatedAt,
    };

    // Only track significant state changes to avoid spam
    if (
      queryResult.status === 'error' ||
      (queryResult.status === 'success' && !queryResult.isFetching)
    ) {
      trackEvent('query_state_change', queryState);
    }
  }

  return queryResult;
};

// Prefetch utility for predictive loading
export const usePrefetchQuery = () => {
  const queryClient = useQueryClient();
  const { isOnline, isSlowConnection } = useNetworkStatus();

  return {
    prefetch: <T>(
      queryKey: QueryKey,
      queryFn: () => Promise<T>,
      options: { staleTime?: number } = {}
    ) => {
      // Only prefetch if online and not on slow connection
      if (!isOnline || isSlowConnection) return;

      return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
      });
    },
  };
};
