// supabase/functions/tests/amadeusToken.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Deno.env.get
const mockEnvGet = vi.fn();
vi.stubGlobal('Deno', {
  env: { get: mockEnvGet }
});

// Mock fetch for testing
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Amadeus Token Caching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any cached tokens by reloading the module
    vi.resetModules();
  });

  it('should cache tokens and reuse them', async () => {
    mockEnvGet.mockImplementation((key: string) => {
      const env = {
        AMADEUS_API_KEY: 'test_client_id',
        AMADEUS_API_SECRET: 'test_client_secret',
        AMADEUS_BASE_URL: 'https://test.api.amadeus.com'
      };
      return env[key as keyof typeof env];
    });
    
    let fetchCallCount = 0;
    const mockTokenResponse = {
      access_token: 'test_token_123',
      expires_in: 1799
    };
    
    mockFetch.mockImplementation(async () => {
      fetchCallCount++;
      return new Response(JSON.stringify(mockTokenResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // Dynamic import to get fresh module with mocks
    const { getAmadeusAccessToken } = await import('../lib/amadeus.ts');
    
    // First call should fetch token
    const token1 = await getAmadeusAccessToken();
    expect(token1).toBe('test_token_123');
    expect(fetchCallCount).toBe(1);
    
    // Second call should use cached token
    const token2 = await getAmadeusAccessToken();
    expect(token2).toBe('test_token_123');
    expect(fetchCallCount).toBe(1); // Should not have called fetch again
  });
  
  it('should refresh expired tokens', async () => {
    mockEnvGet.mockImplementation((key: string) => {
      const env = {
        AMADEUS_API_KEY: 'test_client_id',
        AMADEUS_API_SECRET: 'test_client_secret',
        AMADEUS_BASE_URL: 'https://test.api.amadeus.com'
      };
      return env[key as keyof typeof env];
    });
    
    let fetchCallCount = 0;
    
    mockFetch.mockImplementation(async () => {
      fetchCallCount++;
      const mockResponse = {
        access_token: `test_token_${fetchCallCount}`,
        expires_in: 1 // Very short expiry for testing
      };
      return new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    const { getAmadeusAccessToken } = await import('../lib/amadeus.ts');
    
    // First call
    const token1 = await getAmadeusAccessToken();
    expect(token1).toBe('test_token_1');
    expect(fetchCallCount).toBe(1);
    
    // Wait for token to expire (with buffer)
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Second call should fetch new token due to expiry
    const token2 = await getAmadeusAccessToken();
    expect(token2).toBe('test_token_2');
    expect(fetchCallCount).toBe(2);
  });
  
  it('should handle missing credentials', async () => {
    mockEnvGet.mockImplementation(() => undefined); // No credentials
    
    const { getAmadeusAccessToken } = await import('../lib/amadeus.ts');
    
    await expect(getAmadeusAccessToken()).rejects.toThrow('Missing Amadeus credentials');
  });
  
  it('should handle API errors', async () => {
    mockEnvGet.mockImplementation((key: string) => {
      const env = {
        AMADEUS_API_KEY: 'test_client_id',
        AMADEUS_API_SECRET: 'test_client_secret',
        AMADEUS_BASE_URL: 'https://test.api.amadeus.com'
      };
      return env[key as keyof typeof env];
    });
    
    mockFetch.mockImplementation(async () => {
      return new Response('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized'
      });
    });
    
    const { getAmadeusAccessToken } = await import('../lib/amadeus.ts');
    
    await expect(getAmadeusAccessToken()).rejects.toThrow('Failed to get Amadeus access token: 401');
  });
});
