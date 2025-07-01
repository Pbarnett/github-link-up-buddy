import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TripSummaryChipsProps {
  control: Control<any>;
  onClearField?: (fieldName: string) => void;
}

const TripSummaryChips = ({ control, onClearField }: TripSummaryChipsProps) => {
  const watchedFields = useWatch({ control });

  const chips: Array<{ label: string; value: string; field?: string }> = [];

  // Destination chip
  const destination = watchedFields.destination_airport || watchedFields.destination_other;
  if (destination) {
    chips.push({
      label: destination.length === 3 ? destination : destination.slice(0, 20) + (destination.length > 20 ? '...' : ''),
      value: 'destination',
      field: watchedFields.destination_airport ? 'destination_airport' : 'destination_other'
    });
  }

  // Origin chip
  const origins = [];
  if (watchedFields.nyc_airports?.length > 0) {
    origins.push(...watchedFields.nyc_airports);
  }
  if (watchedFields.other_departure_airport) {
    origins.push(watchedFields.other_departure_airport);
  }
  if (origins.length > 0) {
    chips.push({
      label: origins.join(', '),
      value: 'origin',
      field: 'departure'
    });
  }

  // Dates chip
  if (watchedFields.flexible_dates?.from && watchedFields.flexible_dates?.to) {
    chips.push({
      label: `${format(watchedFields.flexible_dates.from, 'MMM d')} - ${format(watchedFields.flexible_dates.to, 'MMM d')} (flexible)`,
      value: 'dates_flexible',
      field: 'flexible_dates'
    });
  } else if (watchedFields.earliestDeparture && watchedFields.latestDeparture) {
    const sameDate = watchedFields.earliestDeparture.getTime() === watchedFields.latestDeparture.getTime();
    if (sameDate) {
      chips.push({
        label: format(watchedFields.earliestDeparture, 'MMM d, yyyy'),
        value: 'dates_specific',
        field: 'earliestDeparture'
      });
    } else {
      chips.push({
        label: `${format(watchedFields.earliestDeparture, 'MMM d')} - ${format(watchedFields.latestDeparture, 'MMM d')}`,
        value: 'dates_range',
        field: 'earliestDeparture'
      });
    }
  }

  // Trip length chip
  if (watchedFields.min_duration && watchedFields.max_duration) {
    const sameLength = watchedFields.min_duration === watchedFields.max_duration;
    const label = sameLength 
      ? `${watchedFields.min_duration} ${watchedFields.min_duration === 1 ? 'night' : 'nights'}`
      : `${watchedFields.min_duration}-${watchedFields.max_duration} nights`;
    chips.push({
      label,
      value: 'duration',
      field: 'min_duration'
    });
  }

  // Price chip
  if (watchedFields.max_price) {
    chips.push({
      label: `≤ $${watchedFields.max_price}`,
      value: 'price',
      field: 'max_price'
    });
  }

  // Filters chips
  if (watchedFields.nonstop_required) {
    chips.push({
      label: 'Non-stop',
      value: 'nonstop',
      field: 'nonstop_required'
    });
  }

  if (watchedFields.baggage_included_required) {
    chips.push({
      label: 'Bag included',
      value: 'baggage',
      field: 'baggage_included_required'
    });
  }

  // Auto-booking chip
  if (watchedFields.auto_book_enabled) {
    chips.push({
      label: '💫 Auto-Book ON',
      value: 'auto_book',
      field: 'auto_book_enabled'
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Your Trip</h3>
        {chips.length > 0 && (
          <button 
            type="button"
            onClick={() => {
              // Clear all relevant fields
              const clearMethods = control._subjects.current || {};
              Object.keys(clearMethods).forEach(field => {
                if (['destination_airport', 'destination_other', 'nyc_airports', 'other_departure_airport', 
                     'earliestDeparture', 'latestDeparture', 'flexible_dates', 'min_duration', 'max_duration', 
                     'max_price', 'nonstop_required', 'baggage_included_required', 'auto_book_enabled'].includes(field)) {
                  onClearField?.(field);
                }
              });
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <Badge 
            key={`${chip.value}-${index}`}
            variant="secondary" 
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1 px-3 py-1"
          >
            <span className="text-sm">{chip.label}</span>
            {onClearField && chip.field && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearField(chip.field!);
                }}
                className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
              >
                <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TripSummaryChips;
