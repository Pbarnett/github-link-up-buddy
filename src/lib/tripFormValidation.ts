
import { toast } from "@/components/ui/use-toast";
import { FormValues } from "@/types/form";

/**
 * Custom validation for destination fields beyond the Zod schema.
 * Returns true if valid; otherwise triggers a toast and returns false.
 */
export function validateFormData(data: FormValues): boolean {
  const destinationAirport = data.destination_airport || data.destination_other || "";
  if (!destinationAirport) {
    toast({
      title: "Validation error",
      description: "Please select a destination or enter a custom one.",
      variant: "destructive",
    });
    return false;
  }
  return true;
}

/**
 * Determines if the form is valid and all necessary fields are filled for submission.
 */
export function isFormValid(watchedFields: FormValues, mode: "manual" | "auto") {
  const hasDepartureAirport =
    (watchedFields.nyc_airports && watchedFields.nyc_airports.length > 0) || watchedFields.other_departure_airport;
  const hasDestination = watchedFields.destination_airport || watchedFields.destination_other;
  const hasRequiredFields =
    watchedFields.earliestDeparture &&
    watchedFields.latestDeparture &&
    watchedFields.budget &&
    watchedFields.min_duration &&
    watchedFields.max_duration &&
    hasDepartureAirport &&
    hasDestination;

  if (mode === "manual") {
    return Boolean(hasRequiredFields);
  }

  // Auto mode: Require max_price if auto_book_enabled, otherwise standard manual rules
  return Boolean(
    hasRequiredFields &&
      ((watchedFields.auto_book_enabled && watchedFields.max_price) || !watchedFields.auto_book_enabled)
  );
}
