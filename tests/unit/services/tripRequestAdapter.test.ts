import { describe, it, expect } from 'vitest';
import { toInsert, toUpdate, buildDepartureAirports } from '@/services/tripRequestAdapter';

const baseValues = {
  form_mode: 'manual' as const,
  earliestDeparture: new Date('2030-01-01T00:00:00.000Z'),
  latestDeparture: new Date('2030-01-10T00:00:00.000Z'),
  min_duration: 3,
  max_duration: 7,
  max_price: 1000,
  nyc_airports: ['jfk', 'lga'],
  other_departure_airport: ' ewr ',
  destination_airport: ' lax ',
  destination_other: '',
  nonstop_required: true,
  baggage_included_required: false,
  auto_book_enabled: true,
  preferred_payment_method_id: 'pm_123',
  auto_book_consent: true,
};

describe('tripRequestAdapter', () => {
  it('buildDepartureAirports dedupes and uppercases', () => {
    const arr = buildDepartureAirports({ ...baseValues, nyc_airports: ['jfk', 'JFK'], other_departure_airport: '  ewr ' } as any);
    expect(arr.sort()).toEqual(['EWR', 'JFK']);
  });

  it('toInsert shapes repository payload and normalizes fields', () => {
    const payload = toInsert(baseValues as any, 'user_1');
    expect(payload.user_id).toBe('user_1');
    expect(payload.destination_airport).toBe('LAX');
    expect(payload.destination_location_code).toBe('LAX');
    expect(payload.departure_airports.sort()).toEqual(['EWR', 'JFK', 'LGA']);
    expect(payload.min_duration).toBe(3);
    expect(payload.max_duration).toBe(7);
    expect(payload.budget).toBe(1000);
    expect(payload.auto_book_enabled).toBe(true);
    expect(payload.max_price).toBe(1000);
    expect(payload.preferred_payment_method_id).toBe('pm_123');
  });

  it('toUpdate nulls auto-book fields when disabled', () => {
    const payload = toUpdate({ ...baseValues, auto_book_enabled: false } as any);
    expect(payload.auto_book_enabled).toBe(false);
    expect(payload.max_price).toBeNull();
    expect(payload.preferred_payment_method_id).toBeNull();
  });
});

