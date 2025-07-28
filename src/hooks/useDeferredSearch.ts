import * as React from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { useDeferredValue } from 'react';

/**
 * Custom hook that provides deferred search functionality for better performance.
 * Uses React 19's useDeferredValue to defer expensive search operations.
 */

export function useDeferredSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  delay: number = 0
) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // Check if search is stale (user is still typing)
  const isStale = query !== deferredQuery;

  // Perform expensive search operation with deferred value
  const filteredItems = useMemo(() => {
    if (!deferredQuery) return items;

    return items.filter(item => searchFn(item, deferredQuery));
  }, [items, deferredQuery, searchFn]);

  return {
    query,
    setQuery,
    filteredItems,
    isStale,
    isSearching: isStale,
  };
}

/**
 * Specialized hook for flight search functionality
 */
export function useFlightSearch(flights: any[]) {
  return useDeferredSearch(flights, (flight, query) => {
    const searchTerm = query.toLowerCase();
    return (
      flight.origin?.toLowerCase().includes(searchTerm) ||
      flight.destination?.toLowerCase().includes(searchTerm) ||
      flight.airline?.toLowerCase().includes(searchTerm) ||
      flight.flightNumber?.toLowerCase().includes(searchTerm)
    );
  });
}

/**
 * Specialized hook for campaign search functionality
 */
export function useCampaignSearch(campaigns: any[]) {
  return useDeferredSearch(campaigns, (campaign, query) => {
    const searchTerm = query.toLowerCase();
    return (
      campaign.name?.toLowerCase().includes(searchTerm) ||
      campaign.destination?.toLowerCase().includes(searchTerm) ||
      campaign.status?.toLowerCase().includes(searchTerm)
    );
  });
}
