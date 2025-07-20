import * as React from 'react';
// supabase/functions/lib/seatSelector.ts

export type SeatMap = {
  flightSegments: Array<{
    decks: Array<{
      rows: Array<{
        seats: Array<{
          seatNumber: string;
          available: boolean;
          features?: string[];
          pricing?: {
            total: string | number;
          };
        }>;
      }>;
    }>;
  }>;
};

export type SeatInfo = {
  seatNumber: string;
  seatType: 'WINDOW' | 'AISLE' | 'MIDDLE';
  price: number;
};

/**
 * Given Amadeus seatMap JSON and the flight’s base fare, select a seat under the trip’s total budget.
 *
 * Priority order:
 *   1) AISLE
 *   2) WINDOW
 *   3) MIDDLE (only if allowMiddle===true)
 *
 * @param seatMap          The JSON returned by amadeus.shopping.seatMaps.get(...)
 *                         Assumed to be an object with a `flightSegments` property, where each segment
 *                         has `decks`, each deck has `rows`, and each row has `seats`.
 * @param baseFare         The numeric base fare for the ticket (e.g. 450.00)
 * @param totalBudget      The user’s max_price from trip_requests (e.g. 600.00)
 * @param allowMiddle      If false, never consider MIDDLE seats
 * @returns                A SeatInfo object (seatNumber, seatType, price) or null if none qualify
 */
export function selectSeat(
  seatMap: SeatMap,
  baseFare: number,
  totalBudget: number,
  allowMiddle: boolean
): SeatInfo | null {
  // Verify seatMap structure (expecting flightSegments)
  if (!seatMap?.flightSegments || !Array.isArray(seatMap.flightSegments)) {
    console.warn('[selectSeat] seatMap input is missing or does not have a flightSegments array:', seatMap);
    return null;
  }

  const remainingBudget = totalBudget - baseFare;
  // User's original condition was remainingBudget <= 0.
  // If seats can be free (price 0), then <= 0 would exclude free seats if remainingBudget is 0.
  // If only paid seats are considered, or free seats are not desired if budget is exactly met by base fare, then <=0 is fine.
  // Sticking to user's logic:
  if (remainingBudget <= 0) {
    console.log(`[selectSeat] Remaining budget (${remainingBudget}) is not positive enough for paid seats (or is zero). totalBudget: ${totalBudget}, baseFare: ${baseFare}`);
    return null;
  }

  const seats: SeatInfo[] = [];

  for (const segment of seatMap.flightSegments) {
    if (!segment?.decks || !Array.isArray(segment.decks)) continue;
    for (const deck of segment.decks) {
      if (!deck?.rows || !Array.isArray(deck.rows)) continue;
      for (const row of deck.rows) {
        if (!row?.seats || !Array.isArray(row.seats)) continue;
        for (const seat of row.seats) {
          if (!seat?.available) { // Only consider available seats
            continue;
          }

          // Determine seatType based on 'features' as per user's code
          const seatType: 'WINDOW' | 'AISLE' | 'MIDDLE' = seat.features?.includes('AISLE')
            ? 'AISLE'
            : seat.features?.includes('WINDOW')
            ? 'WINDOW'
            : 'MIDDLE';

          // Get seat price, defaulting to 0 if not specified or invalid
          const seatPriceText = seat.pricing?.total; // User: seat.pricing?.total
          let seatPrice: number = 0;
          if (typeof seatPriceText === 'string' || typeof seatPriceText === 'number') {
            seatPrice = parseFloat(String(seatPriceText));
            if (isNaN(seatPrice)) seatPrice = 0; // Handle parsing errors
          }

          seats.push({
            seatNumber: seat.seatNumber, // User: seat.seatNumber
            seatType,
            price: seatPrice
          });
        }
      }
    }
  }

  console.log(`[selectSeat] Found ${seats.length} available seats before filtering.`);

  // 1) Filter out seats over remainingBudget
  let candidates = seats.filter(s => s.price <= remainingBudget);
  console.log(`[selectSeat] ${candidates.length} seats after budget filtering (remaining budget: ${remainingBudget}).`);

  // 2) Exclude MIDDLE if not allowed
  if (!allowMiddle) {
    const preFilterCount = candidates.length;
    candidates = candidates.filter(s => s.seatType !== 'MIDDLE');
    console.log(`[selectSeat] ${candidates.length} seats after middle seat filtering (was ${preFilterCount}, allowMiddle: ${allowMiddle}).`);
  }

  if (candidates.length === 0) {
    console.log(`[selectSeat] No seats available after all filters.`);
    return null;
  }

  // 3) Partition into priority buckets: AISLE → WINDOW → MIDDLE
  const aisleSeats = candidates.filter(s => s.seatType === 'AISLE');
  const windowSeats = candidates.filter(s => s.seatType === 'WINDOW');
  const middleSeats = candidates.filter(s => s.seatType === 'MIDDLE');

  console.log(`[selectSeat] Seats by type - Aisle: ${aisleSeats.length}, Window: ${windowSeats.length}, Middle: ${middleSeats.length}`);

  // Helper to pick the cheapest seat from an array
  const pickLowest = (arr: SeatInfo[]): SeatInfo | null =>
    arr.length > 0 ? arr.reduce((prev, curr) => (curr.price < prev.price ? curr : prev)) : null;

  // 4) Choose in order
  let chosen: SeatInfo | null = null;
  if (aisleSeats.length > 0) {
    chosen = pickLowest(aisleSeats);
    console.log(`[selectSeat] Attempting to pick from AISLE seats. Chosen: ${chosen?.seatNumber}, Price: ${chosen?.price}`);
  }
  if (!chosen && windowSeats.length > 0) {
    chosen = pickLowest(windowSeats);
    console.log(`[selectSeat] Attempting to pick from WINDOW seats. Chosen: ${chosen?.seatNumber}, Price: ${chosen?.price}`);
  }
  if (!chosen && middleSeats.length > 0) { // Only if allowMiddle was true and it passed filtering
    chosen = pickLowest(middleSeats);
    console.log(`[selectSeat] Attempting to pick from MIDDLE seats. Chosen: ${chosen?.seatNumber}, Price: ${chosen?.price}`);
  }

  if (chosen) {
    console.log(`[selectSeat] Final chosen seat: ${chosen.seatNumber}, Type: ${chosen.seatType}, Price: ${chosen.price}`);
  } else {
    console.log(`[selectSeat] No seat could be chosen based on preferences and budget from the available candidates.`);
  }
  return chosen;
}
