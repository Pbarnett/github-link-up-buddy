// Test data fixtures for consistent data management across E2E tests
export const testData = {
  flights: {
    domestic: {
      origin: 'LAX',
      destination: 'JFK',
      dates: {
        departure: '2024-03-15',
        return: '2024-03-22'
      },
      budget: 800,
      passengers: 1
    },
    international: {
      origin: 'LAX',
      destination: 'LHR',
      dates: {
        departure: '2024-04-10',
        return: '2024-04-20'
      },
      budget: 1200,
      passengers: 2
    },
    shortTrip: {
      origin: 'SFO',
      destination: 'SEA',
      dates: {
        departure: '2024-03-01',
        return: '2024-03-03'
      },
      budget: 400,
      passengers: 1
    }
  },
  
  users: {
    testUser: {
      email: 'test-user@parkerfly.test',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    },
    premiumUser: {
      email: 'premium-user@parkerfly.test',
      password: 'PremiumPass456!',
      firstName: 'Premium',
      lastName: 'User'
    }
  },

  airports: {
    major: {
      LAX: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
      JFK: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
      LHR: { code: 'LHR', name: 'London Heathrow', city: 'London' },
      SFO: { code: 'SFO', name: 'San Francisco International', city: 'San Francisco' },
      SEA: { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle' }
    },
    nyc: ['JFK', 'LGA', 'EWR'],
    london: ['LHR', 'LGW', 'STN']
  },

  dates: {
    // Generate dynamic dates to avoid hardcoded date issues
    getDepartureDate: (daysFromNow: number = 30): string => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      return date.toISOString().split('T')[0];
    },
    
    getReturnDate: (daysFromNow: number = 37): string => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      return date.toISOString().split('T')[0];
    },

    getFlexibleRange: () => ({
      departure: testData.dates.getDepartureDate(30),
      return: testData.dates.getReturnDate(37)
    })
  },

  validation: {
    errors: {
      requiredField: /required|cannot be empty|must be provided/i,
      invalidEmail: /invalid email|email format|valid email address/i,
      invalidDate: /invalid date|date format|select a date/i,
      budgetTooLow: /budget.*low|minimum budget|increase budget/i
    },
    success: {
      flightSearch: /flights found|search results|flight offers/i,
      accountCreated: /account created|welcome|registration successful/i,
      loginSuccess: /dashboard|welcome back|logged in/i
    }
  }
};

// Helper functions for common test operations
export const testHelpers = {
  // Generate unique email for each test run
  generateTestEmail: (prefix: string = 'e2e-test'): string => {
    const timestamp = Date.now();
    return `${prefix}-${timestamp}@parkerfly.test`;
  },

  // Calculate future date for travel
  getFutureDate: (daysAhead: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
  },

  // Wait for network requests to complete
  waitForNetworkIdle: async (page: any, timeout: number = 3000) => {
    await page.waitForLoadState('networkidle', { timeout });
  },

  // Check if element is in viewport
  isElementInViewport: async (page: any, selector: string): Promise<boolean> => {
    return await page.locator(selector).isInViewport();
  }
};

export default testData;
