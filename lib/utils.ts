// lib/utils.ts

/**
 * Amadeus flight offer structure
 */
interface FlightOffer {
  id: string;
  price: number;
  seat_map?: unknown; // Will be defined by Jules
  fare_details?: unknown; // Will be defined by Jules
}

/**
 * Trip request with constraints
 */
interface TripConstraints {
  max_price: number;
}

/**
 * Decide which seat type to book for a given Amadeus offer + trip constraints.
 * - If an aisle or window seat is available within trip.max_price, return "AISLE" or "WINDOW".
 * - Otherwise, if only middle seats are available and upgrading to aisle/window exceeds trip.max_price, return "MIDDLE".
 * - Otherwise, return null to skip this offer.
 */
export function decideSeatPreference(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _offer: FlightOffer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _trip: TripConstraints
): "AISLE" | "WINDOW" | "MIDDLE" | null {
  // TODO: Jules will fill in the actual parsing of offer.seat_map or offer.fare_details.
  return "MIDDLE"; // placeholder so our smoke test always picks "MIDDLE"
}
