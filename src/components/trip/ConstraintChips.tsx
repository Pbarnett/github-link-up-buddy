import { Lock, ToggleRight, ToggleLeft } from 'lucide-react';
import * as React from 'react';
import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
interface ConstraintChipsProps {
  dateRange: { from: string; to: string };
  nonStopOnly: boolean;
  onToggleNonStop: () => void;
}

// Pure helper function for date formatting - exported for testing
export const formatDateRange = (
  startDate: string,
  endDate: string,
  timezone?: string
): string => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    });
  };

  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
};

const ConstraintChips: FC<ConstraintChipsProps> = ({
  dateRange,
  nonStopOnly,
  onToggleNonStop,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Carry-on included chip */}
      <span role="status" className="inline-flex">
        <Badge
          variant="secondary"
          className="flex items-center gap-1"
          data-testid="chip-carry-on"
        >
          <Lock className="h-3 w-3" />
          Carry-on included
        </Badge>
      </span>

      {/* Date range chip */}
      <span role="status" className="inline-flex">
        <Badge
          variant="secondary"
          className="flex items-center gap-1"
          data-testid="chip-date-range"
        >
          <Lock className="h-3 w-3" />
          {formatDateRange(dateRange.from, dateRange.to)}
        </Badge>
      </span>

      {/* Non-stop only toggle chip */}
      <button
        type="button"
        className="inline-flex"
        onClick={onToggleNonStop}
        aria-pressed={nonStopOnly}
        aria-label={`Non-stop flights ${nonStopOnly ? 'enabled' : 'disabled'}`}
        data-testid="chip-nonstop"
      >
        <Badge
          variant={nonStopOnly ? 'default' : 'outline'}
          className="flex items-center gap-1 cursor-pointer hover:bg-opacity-80 transition-colors"
        >
          {nonStopOnly ? (
            <ToggleRight className="h-3 w-3" />
          ) : (
            <ToggleLeft className="h-3 w-3" />
          )}
          Non-stop only
        </Badge>
      </button>
    </div>
  );
};

export default ConstraintChips;
