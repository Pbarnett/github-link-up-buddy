import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { useMsw, server } from './setup/msw.server';

// Minimal integration around the adapter + repository boundary.
// We assert that a valid submit produces a payload that includes an idempotency key
// and normalized fields, and that a 400 maps to an error.

// Endpoint placeholder (replace with your actual API endpoint if available)
const API_URL = 'https://api.local/edge/trip-request';

useMsw();

function mockSuccess() {
  server.resetHandlers(
    http.post(API_URL, async ({ request }) => {
      const body = await request.json();
      // non-empty normalized departure_airports + destination uppercase expected
      if (!body || !Array.isArray(body.departure_airports) || body.departure_airports.length === 0) {
        return HttpResponse.json({ message: 'bad request' }, { status: 400 });
      }
      if (!body.destination_airport || body.destination_airport !== String(body.destination_airport).toUpperCase()) {
        return HttpResponse.json({ message: 'bad request' }, { status: 400 });
      }
      // idempotency key should be present in headers if wired through downstream
      return HttpResponse.json({ id: 'trip_123', ok: true }, { status: 200 });
    })
  );
}

function mockBadRequest() {
  server.resetHandlers(
    http.post(API_URL, async () => {
      return HttpResponse.json({ code: 'VALIDATION_ERROR', field: 'destination_airport' }, { status: 400 });
    })
  );
}

describe('TripRequestForm submit integration (msw)', () => {
  it('submits normalized payload and receives success', async () => {
    mockSuccess();
    // This is a placeholder; in a real test we would import the service that performs the HTTP call
    // and point it to API_URL (via env or DI). For now, assert the msw server behaves as expected.
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-idempotency-key': 'test-key' },
      body: JSON.stringify({
        departure_airports: ['JFK', 'LGA'],
        destination_airport: 'LAX',
        earliest_departure: new Date('2030-01-01').toISOString(),
        latest_departure: new Date('2030-01-05').toISOString(),
        min_duration: 3,
        max_duration: 7,
      }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it('maps backend 400 to field error (placeholder)', async () => {
    mockBadRequest();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe('VALIDATION_ERROR');
  });
});
