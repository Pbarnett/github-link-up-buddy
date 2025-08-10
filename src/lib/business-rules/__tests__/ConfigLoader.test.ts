import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configLoader } from '../ConfigLoader';
import { BusinessRulesConfigSchema } from '../schema';
import { mockFetchSuccess } from '@/tests/utils/mockFetch';

const mockFetch = vi.fn();

describe('ConfigLoader', () => {
  beforeEach(() => {
    configLoader.clearCache();
    mockFetch.mockClear();
    // Override global fetch with our mock
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should load and validate config successfully', async () => {
    const mockConfig = {
      version: '1.0.0',
      environment: 'test',
      context: 'flight-search',
      lastUpdated: '2025-01-01T00:00:00Z',
      updatedBy: 'test@example.com',
      ui: { destination: true, departure: true, dates: true, budget: true, advancedFilters: false, paymentMethod: true, travelerInfo: true },
      flightSearch: { forceRoundTrip: true, defaultNonstopRequired: true, maxAdvanceBookingDays: 365, minAdvanceBookingDays: 1, allowedCabinClasses: ['economy'], maxPriceUSD: 1000, minPriceUSD: 50 },
      autoBooking: { enabled: true, maxConcurrentCampaigns: 3, cooldownPeriodHours: 24, requiresPaymentMethodVerification: true, maxMonthlySpend: 2000 },
      filters: [],
      emergencyDisable: false,
      emergencyMessage: undefined
    };

mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: vi.fn().mockResolvedValue(mockConfig)
    } as any);

    const config = await configLoader.loadConfig('test');
    expect(config).toEqual(mockConfig);
    expect(BusinessRulesConfigSchema.parse(config)).toBeTruthy();
  });

  it('should return fallback config on fetch failure', async () => {
mockFetch.mockRejectedValueOnce(new Error('Network error'));
    // Static fallback attempt should also fail its fetch, triggering final fallback
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers({ 'Content-Type': 'text/plain' }),
      text: vi.fn().mockResolvedValue('not found')
    } as any);
    
    const config = await configLoader.loadConfig('test');
    expect(config.updatedBy).toBe('system@fallback.com');
    expect(BusinessRulesConfigSchema.parse(config)).toBeTruthy();
  });

  it('should cache config and reuse it', async () => {
    const mockConfig = {
      version: '1.0.0',
      environment: 'test',
      context: 'flight-search',
      lastUpdated: '2025-01-01T00:00:00Z',
      updatedBy: 'test@example.com',
      ui: { destination: true, departure: true, dates: true, budget: true, advancedFilters: false, paymentMethod: true, travelerInfo: true },
      flightSearch: { forceRoundTrip: true, defaultNonstopRequired: true, maxAdvanceBookingDays: 365, minAdvanceBookingDays: 1, allowedCabinClasses: ['economy'], maxPriceUSD: 1000, minPriceUSD: 50 },
      autoBooking: { enabled: true, maxConcurrentCampaigns: 3, cooldownPeriodHours: 24, requiresPaymentMethodVerification: true, maxMonthlySpend: 2000 },
      filters: [],
      emergencyDisable: false,
      emergencyMessage: undefined
    };
    
mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: vi.fn().mockResolvedValue(mockConfig)
    } as any);

    const config1 = await configLoader.loadConfig('test');
    const config2 = await configLoader.loadConfig('test');
    
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(config1).toBe(config2);
  });
});
