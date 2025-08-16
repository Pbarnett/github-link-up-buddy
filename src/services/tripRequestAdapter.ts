import { v4 as uuidv4 } from "uuid";
import { parseISO } from "date-fns";
import type { FormValues } from "@/types/form";
import type { TripRequestInsert, TripRequestUpdate } from "@/lib/repositories";

const normalizeAirport = (ap?: string | null) => (ap || "").trim().toUpperCase();

export function buildDepartureAirports(values: FormValues): string[] {
  const set = new Set<string>();
  (values.nyc_airports || []).forEach((ap) => {
    const norm = normalizeAirport(ap);
    if (norm) set.add(norm);
  });
  const other = normalizeAirport(values.other_departure_airport || undefined);
  if (other) set.add(other);
  return Array.from(set);
}

export function toInsert(values: FormValues, userId: string): TripRequestInsert {
  const minDur = Math.max(1, Math.min(30, values.min_duration));
  const maxDur = Math.max(minDur, Math.min(30, values.max_duration));
  const destination = normalizeAirport(values.destination_airport || values.destination_other || "");
  return {
    user_id: userId,
    destination_airport: destination,
    destination_location_code: destination,
    departure_airports: buildDepartureAirports(values),
    earliest_departure: values.earliestDeparture.toISOString(),
    latest_departure: values.latestDeparture.toISOString(),
    min_duration: minDur,
    max_duration: maxDur,
    budget: values.max_price,
    nonstop_required: values.nonstop_required ?? true,
    baggage_included_required: values.baggage_included_required ?? false,
    auto_book_enabled: values.auto_book_enabled ?? false,
    max_price: (values.auto_book_enabled ? values.max_price : null) as number | null,
    preferred_payment_method_id: (values.auto_book_enabled ? values.preferred_payment_method_id || null : null) as string | null,
  };
}

export function toUpdate(values: FormValues): TripRequestUpdate {
  const minDur = Math.max(1, Math.min(30, values.min_duration));
  const maxDur = Math.max(minDur, Math.min(30, values.max_duration));
  const destination = normalizeAirport(values.destination_airport || values.destination_other || "");
  return {
    destination_airport: destination,
    destination_location_code: destination,
    departure_airports: buildDepartureAirports(values),
    earliest_departure: values.earliestDeparture.toISOString(),
    latest_departure: values.latestDeparture.toISOString(),
    min_duration: minDur,
    max_duration: maxDur,
    budget: values.max_price,
    nonstop_required: values.nonstop_required ?? true,
    baggage_included_required: values.baggage_included_required ?? false,
    auto_book_enabled: values.auto_book_enabled ?? false,
    max_price: (values.auto_book_enabled ? values.max_price : null) as number | null,
    preferred_payment_method_id: (values.auto_book_enabled ? values.preferred_payment_method_id || null : null) as string | null,
  };
}

export function createIdempotencyKey(): string {
  return uuidv4();
}

