import React, { useEffect, useRef } from "react";

interface FormErrorSummaryProps {
  // key: field name, value: any error type with optional message
  errors: Record<string, any>;
  onFocusField: (name: string) => void;
  title?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  onFocusField,
  title = "Please correct the following errors:",
}) => {
  const entries = Object.entries(errors || {});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (entries.length > 0 && containerRef.current) {
      // Make focusable and move focus for immediate announcement
      const el = containerRef.current;
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
      }
      el.focus({ preventScroll: false });
      el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    // Only when entries change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  if (entries.length === 0) return null;

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-red-200 bg-red-50 p-4 outline-none"
    >
      <p className="font-medium text-red-800">{title}</p>
      <ul className="mt-2 list-disc list-inside text-sm text-red-800">
        {entries.map(([name, err]) => (
          <li key={name}>
            <button
              type="button"
              className="underline"
              onClick={() => onFocusField(name)}
            >
              {friendlyLabel(name)}: {getMessage(err)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function getMessage(err: any): string {
  if (!err) return "Invalid value";
  if (typeof err === "string") return err;
  if (typeof err.message === "string") return err.message;
  return "Invalid value";
}

function friendlyLabel(name: string): string {
  switch (name) {
    case 'destination_airport': return 'Destination airport';
    case 'destination_other': return 'Destination';
    case 'nyc_airports': return 'Departure airports (NYC)';
    case 'other_departure_airport': return 'Other departure airport';
    case 'earliestDeparture': return 'Earliest departure date';
    case 'latestDeparture': return 'Latest departure date';
    case 'min_duration': return 'Minimum trip length (days)';
    case 'max_duration': return 'Maximum trip length (days)';
    case 'max_price': return 'Maximum price';
    case 'preferred_payment_method_id': return 'Payment method';
    case 'auto_book_consent': return 'Auto-booking authorization';
    default: return name.replaceAll('_', ' ');
  }
}

