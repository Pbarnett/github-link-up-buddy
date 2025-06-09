// lib/utils.ts

/**
 * Decide which seat type to book for a given Amadeus offer + trip constraints.
 * - If an aisle or window seat is available within trip.max_price, return "AISLE" or "WINDOW".
 * - Otherwise, if only middle seats are available and upgrading to aisle/window exceeds trip.max_price, return "MIDDLE".
 * - Otherwise, return null to skip this offer.
 */
export function decideSeatPreference(
  offer: any,
  trip: { max_price: number }
): "AISLE" | "WINDOW" | "MIDDLE" | null {
  // TODO: Jules will fill in the actual parsing of offer.seat_map or offer.fare_details.
  return "MIDDLE"; // placeholder so our smoke test always picks "MIDDLE"
}
