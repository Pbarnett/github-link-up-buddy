import { vi } from 'vitest';
export function buildSupabaseMock({
  tripId = 'trip-123',
  locationCode = 'BOS',
  paymentMethodId = 'pm_123',
} = {}) {
  return {
    supabase: {
      from: (table: string) => {
        switch (table) {
          case 'trips':
            return {
              insert: vi.fn(() => ({
                select: () => ({
                  single: () =>
                    Promise.resolve({ data: { id: tripId }, error: null }),
                }),
              })),
            };

          case 'airports':
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  single: () =>
                    Promise.resolve({
                      data: { location_code: locationCode },
                      error: null,
                    }),
                })),
              })),
            };

          case 'payment_methods':
            return {
              select: vi.fn(() =>
                Promise.resolve({
                  data: [{ id: paymentMethodId }],
                  error: null,
                })
              ),
            };

          default:
            throw new Error(`No mock for table ${table}`);
        }
      },
    },
  };
}
