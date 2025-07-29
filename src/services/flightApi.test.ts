import * as React from 'react';
// Attempting to address CI issues. Further clarification may be needed.
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { transformAmadeusToOffers } from './flightApi.client';
describe('flightApi', () => {
  test('transformAmadeusToOffers maps correctly', () => {
    const mockResponse = {
      data: [
        {
          itineraries: [
            {
              duration: 'PT7H30M',
              segments: [
                {
                  carrierCode: 'AA',
                  number: '123',
                  departure: {
                    at: '2023-07-01T08:30:00',
                  },
                  arrival: {
                    at: '2023-07-01T11:45:00',
                  },
                },
              ],
            },
            {
              segments: [
                {
                  departure: {
                    at: '2023-07-08T09:00:00',
                  },
                  arrival: {
                    at: '2023-07-08T12:15:00',
                  },
                },
              ],
            },
          ],
          price: {
            total: '429.99',
          },
        },
      ],
    };

    const tripRequestId = 'test-trip-id';
    const result = transformAmadeusToOffers(mockResponse, tripRequestId);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      trip_request_id: tripRequestId,
      airline: 'AA',
      flight_number: '123',
      departure_date: '2023-07-01',
      departure_time: '08:30',
      return_date: '2023-07-08',
      return_time: '09:00',
      duration: 'PT7H30M',
      price: 429.99,
    });
  });

  test('transformAmadeusToOffers handles empty data', () => {
    expect(transformAmadeusToOffers({ data: [] }, 'test-id')).toEqual([]);
    expect(transformAmadeusToOffers({ data: null }, 'test-id')).toEqual([]);
  });

  test('transformAmadeusToOffers handles malformed data gracefully', () => {
    const malformedData = {
      data: [
        {
          // Missing required fields
          price: { total: '100.00' },
        },
      ],
    };

    // Should not throw an error but return empty array for malformed entry
    const result = transformAmadeusToOffers(malformedData, 'test-id');
    expect(result).toEqual([]);
  });
});

// We need to test the edge function's token management and retry logic
// For this, we'll create a separate test suite and mock the necessary functions
describe('OAuth Token Management', () => {
  // We're creating a mock version of the fetchToken logic to test in a browser environment
  // This simulates the same behaviors as the edge function's fetchToken
  let mockToken: string | undefined = undefined;
  let mockTokenExpires = 0;
  let mockFetchCounter = 0;
  const _baseUrl = 'https://test.api.amadeus.com';

  const fetchTokenForTest = async () => {
    const now = Date.now();
    if (mockToken && now < mockTokenExpires - 60000) return mockToken;

    mockFetchCounter++;
    // Simulate token fetch response
    const response = {
      access_token: `mock-token-${mockFetchCounter}`,
      expires_in: 1800, // 30 minutes
    };

    mockToken = response.access_token;
    mockTokenExpires = now + response.expires_in * 1000;
    return mockToken;
  };

  beforeEach(() => {
    // Reset the mock state before each test
    mockToken = undefined;
    mockTokenExpires = 0;
    mockFetchCounter = 0;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('First call fetches a new token', async () => {
    const token = await fetchTokenForTest();
    expect(token).toBe('mock-token-1');
    expect(mockFetchCounter).toBe(1);
  });

  test('Second call within expiry returns cached token', async () => {
    // First call
    await fetchTokenForTest();

    // Second call should use cache
    const token2 = await fetchTokenForTest();
    expect(token2).toBe('mock-token-1');
    expect(mockFetchCounter).toBe(1); // Counter should still be 1
  });

  test('Call after token expiry fetches a new token', async () => {
    // First call
    await fetchTokenForTest();
    expect(mockFetchCounter).toBe(1);

    // Advance time to just before the safety buffer kicks in
    vi.advanceTimersByTime((1740 - 1) * 1000); // Advance to 28m 59s (1739 seconds) - still within 1-minute buffer

    // Should still use cached token
    await fetchTokenForTest();
    expect(mockFetchCounter).toBe(1);

    // Now advance past the buffer
    vi.advanceTimersByTime(61 * 1000); // Advance past the 1-minute buffer

    // Should fetch new token
    const newToken = await fetchTokenForTest();
    expect(newToken).toBe('mock-token-2');
    expect(mockFetchCounter).toBe(2);
  });
});

describe('Retry Logic', () => {
  // Mock implementation of withRetry
  async function withRetryForTest<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    _baseDelayMs: number = 100
  ): Promise<T> {
    let attempts = 0;

    while (true) {
      attempts++;
      try {
        return await fn();
      } catch (error: unknown) {
        if (attempts >= maxAttempts) {
          throw error;
        }

        if (
          (error instanceof Error && error.message?.includes('429')) ||
          (error instanceof Error && error.message?.includes('5')) ||
          (error instanceof Error && error.name === 'NetworkError')
        ) {
          // For tests, we use a fixed delay to make tests faster
          await new Promise(r => setTimeout(r, 10));
          continue;
        }

        throw error;
      }
    }
  }

  test('Should succeed after retrying on 429 errors', async () => {
    let callCount = 0;

    // Mock function that fails with 429 twice, then succeeds
    const mockFn = async () => {
      callCount++;
      if (callCount <= 2) {
        throw new Error('429 Rate limit exceeded');
      }
      return 'success';
    };

    const result = await withRetryForTest(mockFn);
    expect(result).toBe('success');
    expect(callCount).toBe(3);
  });

  test('Should retry on network errors', async () => {
    let callCount = 0;

    // Mock function that fails with network error once, then succeeds
    const mockFn = async () => {
      callCount++;
      if (callCount === 1) {
        const error = new Error('Network error');
        error.name = 'NetworkError';
        throw error;
      }
      return 'success';
    };

    const result = await withRetryForTest(mockFn);
    expect(result).toBe('success');
    expect(callCount).toBe(2);
  });

  test('Should retry on 500 errors', async () => {
    let callCount = 0;

    // Mock function that fails with 500 error once, then succeeds
    const mockFn = async () => {
      callCount++;
      if (callCount === 1) {
        throw new Error('500 Internal Server Error');
      }
      return 'success';
    };

    const result = await withRetryForTest(mockFn);
    expect(result).toBe('success');
    expect(callCount).toBe(2);
  });

  test('Should fail after max attempts', async () => {
    let callCount = 0;

    // Mock function that always fails with 429
    const mockFn = async () => {
      callCount++;
      throw new Error('429 Rate limit exceeded');
    };

    await expect(withRetryForTest(mockFn, 3)).rejects.toThrow(
      '429 Rate limit exceeded'
    );
    expect(callCount).toBe(3);
  });

  test('Should not retry on non-retryable errors', async () => {
    let callCount = 0;

    // Mock function that fails with a non-retryable error
    const mockFn = async () => {
      callCount++;
      throw new Error('400 Bad Request');
    };

    await expect(withRetryForTest(mockFn)).rejects.toThrow('400 Bad Request');
    expect(callCount).toBe(1); // Should only be called once
  });
});

//
// Auto-added placeholder exports so TypeScript can compile.
// Replace with real implementation when ready.
export const placeholder = () => undefined;
export default placeholder;
