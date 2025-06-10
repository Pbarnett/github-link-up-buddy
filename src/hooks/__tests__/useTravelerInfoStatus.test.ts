import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest'; // Import vi from Vitest
import { useTravelerInfoStatus } from '../useTravelerInfoStatus';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Mocking Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(), // This will be configured per test case
  },
}));

// Mocking useCurrentUser
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}));

const mockSupabaseClient = supabase as any; // Cast to any or use Vitest's mocking types if preferred
const mockUseCurrentUser = useCurrentUser as any; // Cast to any

describe('useTravelerInfoStatus', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Default mock for useCurrentUser, can be overridden in specific tests
    mockUseCurrentUser.mockReturnValue({ userId: 'test-user-id', user: null, isLoading: false, error: null, fetchUser: vi.fn() });
  });

  it('should return loading true initially', () => {
    // Mock Supabase calls for this specific test if needed
    mockSupabaseClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockReturnValue(new Promise(() => {})), // Keep it pending
            } as any;
        }
        if (tableName === 'booking_requests') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                single: vi.fn().mockReturnValue(new Promise(() => {})), // Keep it pending
            } as any;
        }
        return { single: vi.fn().mockReturnValue(new Promise(() => {})) } as any;
    });

    const { result } = renderHook(() => useTravelerInfoStatus());
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle user not logged in', async () => {
    mockUseCurrentUser.mockReturnValue({ userId: null, user: null, isLoading: false, error: null, fetchUser: vi.fn() });
    const { result } = renderHook(() => useTravelerInfoStatus());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status?.isComplete).toBe(false);
    expect(result.current.status?.missingFields).toEqual(['userId']);
    expect(result.current.status?.completionPercentage).toBe(0);
  });

  it('should calculate status correctly when all data is present', async () => {
    mockSupabaseClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
            return {
                select: vi.fn((selectString: string) => {
                    if (selectString === 'email, phone, first_name, last_name') {
                        return {
                            eq: vi.fn().mockReturnThis(),
                            single: vi.fn().mockResolvedValue({
                                data: { email: 'test@example.com', phone: '1234567890', first_name: 'John', last_name: 'Doe' },
                                error: null,
                            }),
                        };
                    }
                    return { eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: {}, error: { message: 'Profile select mock not specific enough' }}) };
                }),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn()
            } as any;
        }
        if (tableName === 'booking_requests') {
            return {
                select: vi.fn((selectString: string) => {
                     if (selectString === 'traveler_data') {
                         return {
                            eq: vi.fn().mockReturnThis(),
                            not: vi.fn().mockReturnThis(),
                            order: vi.fn().mockReturnThis(),
                            limit: vi.fn().mockReturnThis(),
                            single: vi.fn().mockResolvedValue({
                                data: { traveler_data: { firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', passportNumber: 'P12345', nationality: 'US', documentExpiryDate: '2030-01-01' } },
                                error: null,
                            }),
                         };
                     }
                     return {
                        eq: vi.fn().mockReturnThis(),
                        not: vi.fn().mockReturnThis(),
                        order: vi.fn().mockReturnThis(),
                        limit: vi.fn().mockReturnThis(),
                        single: vi.fn().mockResolvedValue({data: {}, error: {message: "Booking request select mock not specific enough"}})
                    } as any;
                }),
                 eq: vi.fn().mockReturnThis(),
                 not: vi.fn().mockReturnThis(),
                 order: vi.fn().mockReturnThis(),
                 limit: vi.fn().mockReturnThis(),
                 single: vi.fn()
            } as any;
        }
        return {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            not: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({data: {}, error: { message: 'Table not mocked'}})
        } as any;
    });

    const { result, rerender } = renderHook(() => useTravelerInfoStatus());

    await act(async () => {
      // No need to call rerender without props change for useEffect to run with renderHook
      // await for a short period or a condition if necessary, though act should handle promises
    });

    // It might take a tick for all promises to resolve and state to update
    // If using older react-testing-library or specific scenarios, waitFor might be needed
    // For Vitest + RTL 16+, act usually covers it for hook updates.

    await act(async () => {
        // Ensure all async operations complete
        // This is a common pattern to ensure state updates from async effects are flushed.
    });


    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.status?.isComplete).toBe(true);
    expect(result.current.status?.missingFields).toEqual([]);
    expect(result.current.status?.completionPercentage).toBe(100);
    expect(result.current.status?.requiresInternational).toEqual([]);
  });

  it('should identify missing passportNumber for international travel', async () => {
     mockSupabaseClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { email: 'test@example.com', phone: '1234567890', first_name: 'John', last_name: 'Doe' },
                    error: null,
                }),
            } as any;
        }
        if (tableName === 'booking_requests') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                     data: { traveler_data: { firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01' /* passportNumber is missing */ } },
                     error: null,
                }),
            } as any;
        }
        return { single: vi.fn().mockResolvedValue({ data: {}, error: { message: 'Table not mocked', code: 'MOCK_TABLE_ERR'} }) } as any;
    });

    const { result } = renderHook(() => useTravelerInfoStatus());
    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status?.isComplete).toBe(false);
    expect(result.current.status?.missingFields).toContain('travelerDetails.passportNumber');
    expect(result.current.status?.requiresInternational).toContain('travelerDetails.passportNumber');
    expect(result.current.status?.completionPercentage).toBe(Math.round((6 / 7) * 100)); // Adjusted: 6 completed / 7 total
  });

  it('should handle profile data missing', async () => {
    mockSupabaseClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { email: 'test@example.com' /* first_name, last_name missing */ },
                    error: null,
                }),
            } as any;
        }
        if (tableName === 'booking_requests') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                     data: { traveler_data: { firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', passportNumber: 'P123' } },
                     error: null,
                }),
            } as any;
        }
        return { single: vi.fn().mockResolvedValue({ data: {}, error: { message: 'Table not mocked', code: 'MOCK_TABLE_ERR'} }) } as any;
    });

    const { result } = renderHook(() => useTravelerInfoStatus());
    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status?.isComplete).toBe(false);
    expect(result.current.status?.missingFields).toContain('profile.first_name');
    expect(result.current.status?.missingFields).toContain('profile.last_name');
    expect(result.current.status?.completionPercentage).toBe(Math.round((5 / 7) * 100)); // Adjusted: 5 completed / 7 total
  });

  it('should handle traveler_data being null or empty (no booking_request found)', async () => {
    mockSupabaseClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'profiles') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { email: 'test@example.com', first_name: 'John', last_name: 'Doe' },
                    error: null,
                }),
            } as any;
        }
        if (tableName === 'booking_requests') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows found'} }),
            } as any;
        }
        return { single: vi.fn().mockResolvedValue({ data: {}, error: { message: 'Table not mocked', code: 'MOCK_TABLE_ERR'} }) } as any;
    });

    const { result } = renderHook(() => useTravelerInfoStatus());
    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status?.isComplete).toBe(false);
    expect(result.current.status?.missingFields).toContain('travelerDetails.firstName');
    expect(result.current.status?.missingFields).toContain('travelerDetails.lastName');
    expect(result.current.status?.missingFields).toContain('travelerDetails.dateOfBirth');
    expect(result.current.status?.missingFields).toContain('travelerDetails.passportNumber');
    expect(result.current.status?.completionPercentage).toBe(Math.round((3 / 7) * 100)); // Adjusted: 3 completed / 7 total
  });

  it('should handle Supabase errors gracefully when fetching profile', async () => {
    mockSupabaseClient.from.mockImplementation((tableName: string) => {
      if (tableName === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockRejectedValue(new Error('Supabase network error')),
        } as any;
      }
      if (tableName === 'booking_requests') {
            return {
                select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), not: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
            } as any;
        }
      return { single: vi.fn().mockRejectedValue(new Error("Unknown table error")) } as any;
    });

    const { result } = renderHook(() => useTravelerInfoStatus());
    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error.message).toBe('Supabase network error');
    expect(result.current.status?.isComplete).toBe(false);
    expect(result.current.status?.missingFields).toEqual(['fetchError']);
    expect(result.current.status?.completionPercentage).toBe(0);
  });

  it('should handle Supabase errors gracefully when fetching traveler_data', async () => {
    mockSupabaseClient.from.mockImplementation((tableName : string) => {
      if (tableName === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { email: 'test@example.com', first_name: 'John', last_name: 'Doe' },
            error: null,
          }),
        } as any;
      }
      if (tableName === 'booking_requests') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          not: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockRejectedValue(new Error('Supabase booking_requests error')),
        } as any;
      }
      return { single: vi.fn().mockRejectedValue(new Error("Unknown table error")) } as any;
    });

    const { result } = renderHook(() => useTravelerInfoStatus());
     await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error.message).toBe('Supabase booking_requests error');
    expect(result.current.status?.isComplete).toBe(false);
    expect(result.current.status?.missingFields).toEqual(['fetchError']);
    expect(result.current.status?.completionPercentage).toBe(0);
  });

});
