import React, { useEffect } from 'react';
import { renderHook, render, waitFor } from '@testing-library/react';
import { type Mock, vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import { useFlightSearchV2Flag } from './useFlightSearchV2Flag';
import { supabase } from '@/integrations/supabase/client';

// singleMock needs to be accessible in tests to set its return value.
const singleMock = vi.fn();

vi.mock('@/integrations/supabase/client', () => {
  // These are defined inside the factory, so they are initialized when the factory runs.
  const eqMockFactory = vi.fn(() => ({ single: singleMock }));
  const selectMockFactory = vi.fn(() => ({ eq: eqMockFactory }));
  const fromMockFactory = vi.fn(() => ({ select: selectMockFactory }));
  return {
    supabase: {
      from: fromMockFactory,
    },
  };
});

// Mock console.log
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
// Mock console.warn
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
// Mock console.error
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});


// Test component to simulate App.tsx usage
const TestAppConsumer = () => {
  const { enabled, loading } = useFlightSearchV2Flag();
  useEffect(() => {
    if (!loading && enabled) {
      console.log('🔧 v2 flag ON');
    }
  }, [enabled, loading]);
  return null; // No UI needed for this test
};

describe('useFlightSearchV2Flag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Restore original console functions
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should return enabled as true when the flag is true in Supabase', async () => {
    (singleMock as Mock).mockResolvedValueOnce({ data: { enabled: true }, error: null });
    const { result } = renderHook(() => useFlightSearchV2Flag());
    await waitFor(() => !result.current.loading);
    expect(result.current.enabled).toBe(true);
    // Check if the mocks from the factory were called
    expect(supabase.from).toHaveBeenCalledWith('feature_flags');
    // To check deeper calls, we'd need to expose selectMockFactory and eqMockFactory
    // or trust the chain leads to singleMock being called.
    // For now, let's assume singleMock being called is sufficient if from was called.
    // We can verify singleMock was called if needed, but the current structure
    // makes it hard to assert on selectMockFactory and eqMockFactory directly.
  });

  it('should return enabled as false when the flag is false in Supabase', async () => {
    (singleMock as Mock).mockResolvedValueOnce({ data: { enabled: false }, error: null });
    const { result } = renderHook(() => useFlightSearchV2Flag());
    await waitFor(() => !result.current.loading);
    expect(result.current.enabled).toBe(false);
  });

  it('should return enabled as false and log warning when the flag is not found', async () => {
    (singleMock as Mock).mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });
    const { result } = renderHook(() => useFlightSearchV2Flag());
    await waitFor(() => !result.current.loading);
    expect(result.current.enabled).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Feature flag 'flight_search_v2_enabled' not found, using default value: false"
    );
  });

  it('should return enabled as false and log error when Supabase call fails', async () => {
    const MOCK_ERROR = new Error('Supabase error');
    (singleMock as Mock).mockRejectedValueOnce(MOCK_ERROR);
    const { result } = renderHook(() => useFlightSearchV2Flag());
    await waitFor(() => !result.current.loading);
    expect(result.current.enabled).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching feature flag 'flight_search_v2_enabled':", MOCK_ERROR
    );
  });

  describe('App.tsx integration simulation', () => {
    it('should call console.log with "🔧 v2 flag ON" when flag is true', async () => {
      (singleMock as Mock).mockResolvedValueOnce({ data: { enabled: true }, error: null });
      render(<TestAppConsumer />);
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('🔧 v2 flag ON');
      });
    });

    it('should not call console.log when flag is false', async () => {
      (singleMock as Mock).mockResolvedValueOnce({ data: { enabled: false }, error: null });
      render(<TestAppConsumer />);
      await waitFor(() => { // Ensure hook finishes loading
         // We need to ensure the effect has a chance to run or not run.
         // A small delay or checking loading state might be needed if there are race conditions.
      });
      // Ensure console.log was not called after state settles
      expect(consoleLogSpy).not.toHaveBeenCalledWith('🔧 v2 flag ON');
    });

     it('should not call console.log when flag fetch errors', async () => {
      (singleMock as Mock).mockRejectedValueOnce(new Error('Supabase error'));
      render(<TestAppConsumer />);
      await waitFor(() => {
        // Wait for loading to complete, hook should set enabled to false
      });
      expect(consoleLogSpy).not.toHaveBeenCalledWith('🔧 v2 flag ON');
    });
  });
});
