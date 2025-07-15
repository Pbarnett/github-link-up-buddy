import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decide which seat type to book for a given Amadeus offer + trip constraints.
 * - If an aisle or window seat is available within trip.max_price, return "AISLE" or "WINDOW".
 * - Otherwise, if only middle seats are available and upgrading to aisle/window exceeds trip.max_price, return "MIDDLE".
 * - Otherwise, return null to skip this offer.
 */
export function decideSeatPreference(
  _offer: { // eslint-disable-line @typescript-eslint/no-unused-vars
    price: number;
    hasAisleSeat?: boolean;
    hasWindowSeat?: boolean;
    hasMiddleSeat?: boolean;
  },
  _trip: { // eslint-disable-line @typescript-eslint/no-unused-vars
    max_price: number;
    // We can add more fields later (e.g., nonstop_required, baggage_included_required),
    // but this stub is enough for Jules to call.
  }
): "AISLE" | "WINDOW" | "MIDDLE" | null {
  // TODO: Jules will fill this in with actual logic that parses offer.seat_map or fare details.
  return null;
}
