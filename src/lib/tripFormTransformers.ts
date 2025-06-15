
import { FormValues, ExtendedTripFormValues } from "@/types/form";

/**
 * Transforms form values into the ExtendedTripFormValues shape
 * for server/database submission.
 */
export function transformFormData(data: FormValues): ExtendedTripFormValues {
  const departureAirports: string[] = [];
  if (data.nyc_airports && data.nyc_airports.length > 0) {
    departureAirports.push(...data.nyc_airports);
  }
  if (data.other_departure_airport) {
    departureAirports.push(data.other_departure_airport);
  }
  const destinationAirport = data.destination_airport || data.destination_other || "";
  return {
    earliestDeparture: data.earliestDeparture,
    latestDeparture: data.latestDeparture,
    min_duration: data.min_duration,
    max_duration: data.max_duration,
    budget: data.budget,
    departure_airports: departureAirports,
    destination_airport: destinationAirport,
    destination_location_code: destinationAirport, // Mapping for API
    nonstop_required: data.nonstop_required,
    baggage_included_required: data.baggage_included_required,
    auto_book_enabled: data.auto_book_enabled,
    max_price: data.max_price,
    preferred_payment_method_id: data.preferred_payment_method_id,
  };
}
