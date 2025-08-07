
../ConfigLoader';
../schema';

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
      ui: {
        destination: true,
        departure: true,
        dates: true,
        budget: true,
        advancedFilters: false,
        paymentMethod: true,
        travelerInfo: true,
      },
      flightSearch: {
        forceRoundTrip: true,
        defaultNonstopRequired: true,
        maxAdvanceBookingDays: 365,
        minAdvanceBookingDays: 1,
        allowedCabinClasses: ['economy'],
        maxPriceUSD: 1000,
        minPriceUSD: 50,
      },
      autoBooking: {
        enabled: true,
        maxConcurrentCampaigns: 3,
        cooldownPeriodHours: 24,
        requiresPaymentMethodVerification: true,
        maxMonthlySpend: 2000,
      },
      filters: [],
      emergencyDisable: false,
      emergencyMessage: undefined,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue(mockConfig),
    });

    const config = await configLoader.loadConfig('test');
    expect(config).toEqual(mockConfig);
    expect(BusinessRulesConfigSchema.parse(config)).toBeTruthy();
  });

  it('should return fallback config on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

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
      ui: {
        destination: true,
        departure: true,
        dates: true,
        budget: true,
        advancedFilters: false,
        paymentMethod: true,
        travelerInfo: true,
      },
      flightSearch: {
        forceRoundTrip: true,
        defaultNonstopRequired: true,
        maxAdvanceBookingDays: 365,
        minAdvanceBookingDays: 1,
        allowedCabinClasses: ['economy'],
        maxPriceUSD: 1000,
        minPriceUSD: 50,
      },
      autoBooking: {
        enabled: true,
        maxConcurrentCampaigns: 3,
        cooldownPeriodHours: 24,
        requiresPaymentMethodVerification: true,
        maxMonthlySpend: 2000,
      },
      filters: [],
      emergencyDisable: false,
      emergencyMessage: undefined,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue(mockConfig),
    });

    const config1 = await configLoader.loadConfig('test');
    const config2 = await configLoader.loadConfig('test');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(config1).toBe(config2);
  });
});
