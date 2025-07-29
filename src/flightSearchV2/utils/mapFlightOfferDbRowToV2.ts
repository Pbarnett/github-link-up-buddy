import { FlightOfferV2, FlightOfferV2DbRow } from '../types';
/**
 * Maps a snake_case database row object to a camelCase FlightOfferV2 object.
 * This function is pure and easily memoizable.
 * @param dbRow The flight offer data as retrieved from the database.
 * @returns A FlightOfferV2 object.
 */
export const mapFlightOfferDbRowToV2 = (
  dbRow: FlightOfferV2DbRow
): FlightOfferV2 => {
  return {
    id: dbRow.id,
    tripRequestId: dbRow.trip_request_id,
    mode: dbRow.mode,
    priceTotal: dbRow.price_total,
    priceCurrency: dbRow.price_currency,
    priceCarryOn: dbRow.price_carry_on,
    bagsIncluded: dbRow.bags_included,
    cabinClass: dbRow.cabin_class,
    nonstop: dbRow.nonstop,
    originIata: dbRow.origin_iata,
    destinationIata: dbRow.destination_iata,
    departDt: dbRow.depart_dt,
    returnDt: dbRow.return_dt,
    seatPref: dbRow.seat_pref,
    createdAt: dbRow.created_at,
    bookingUrl: dbRow.booking_url || undefined, // Map booking_url field
  };
};
