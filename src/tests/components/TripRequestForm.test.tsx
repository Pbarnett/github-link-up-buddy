import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,

import userEvent from '@testing-library/user-event';
import userEvent from '@testing-library/user-event'; } from '@testing-library/react';
import TripRequestForm from '@/components/trip/TripRequestForm';
import TripRequestForm from '@/components/trip/TripRequestForm'; } from '@/tests/utils/TestWrapper';

// Import our new testing utilities
import {
  fillBaseFormFieldsWithDates,
  getFormErrors,
  waitForButtonEnabledAndClick,

// Mock the Calendar component to provide test-friendly date selection
vi.mock('@/components/ui/calendar', () => {
  return {
    Calendar: ({ onSelect }: { onSelect?: (date: Date) => void }) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      return (
        <div data-testid="mock-day-picker" role="grid">
          <button
            onClick={() => onSelect?.(tomorrow)}
            data-testid="calendar-day-tomorrow"
            type="button"
          >
            {tomorrow.getDate()}
          </button>
          <button
            onClick={() => onSelect?.(nextWeek)}
            data-testid="calendar-day-next-week"
            type="button"
          >
            {nextWeek.getDate()}
          </button>
        </div>
      );
    },
  };
});

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockImplementation(table => {
      const mockQuery = {
        insert: vi
          .fn()
          .mockImplementation(() => ({ data: { id: 'mock-id' }, error: null })),
        update: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { id: 'new-trip-id' }, error: null }),
      };
      return mockQuery;
    }),
    functions: {
      invoke: vi
        .fn()
        .mockResolvedValue({ data: { success: true }, error: null }),
    },
  },
}));

// Mock Supabase client interactions
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: () => ({
      insert: () => ({ data: [{ id: 'trip-123' }], error: null }),
      select: () => ({ data: [{ iata: 'ATL' }], error: null }),
      single: () => ({ data: { id: 'trip-123' }, error: null }),
    }),
  },
}));

// Mock global fetch for Stripe calls
if (typeof global.fetch === 'undefined') {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
    text: vi.fn().mockResolvedValue(''),
  });
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock custom hooks used by AutoBookingSection
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));

vi.mock('@/hooks/useTravelerInfoCheck', () => ({
  useTravelerInfoCheck: vi.fn(),
}));

vi.mock('@/services/api/flightSearchApi', () => ({
  invokeFlightSearch: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock the TripRequestRepository using Vitest best practices
// Reference: https://vitest.dev/guide/mocking.html#modules
const mockCreateTripRequest = vi.fn();
const mockUpdateTripRequest = vi.fn();
const mockFindById = vi.fn();

vi.mock('@/lib/repositories', () => {
  // Create a mock class that properly handles constructor calls
  class MockTripRequestRepository {
    constructor(client: any) {
      // Mock constructor - accept any client
    }

    createTripRequest = mockCreateTripRequest;
    updateTripRequest = mockUpdateTripRequest;
    findById = mockFindById;
  }

  return {
    TripRequestRepository: MockTripRequestRepository,
  };
});

// Mock logger
vi.mock('@/lib/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock error handlers
vi.mock('@/lib/errors', () => ({
  handleError: vi.fn(error => ({
    code: 'GENERIC_ERROR',
    message: error.message || 'An error occurred',
    userMessage: 'Something went wrong. Please try again.',
  })),
  ValidationError: class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  },
}));

// Mock useFeatureFlag hook to prevent LaunchDarkly issues
vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn((flagName: string, defaultValue: boolean = false) => ({
    data: defaultValue,
    isLoading: false,
    isError: false,
    error: null,
  })),
  useFeatureFlagLegacy: vi.fn(
    (flagName: string, defaultValue: boolean = false) => defaultValue
  ),
  useClientFeatureFlag: vi.fn(
    (
      flagName: string,
      rolloutPercentage: number,
      defaultValue: boolean = false
    ) => defaultValue
  ),
}));
