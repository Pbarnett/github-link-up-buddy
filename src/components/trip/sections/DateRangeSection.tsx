
import { memo } from "react";
import { Control } from "react-hook-form";
// FormDescription is not used, so it can be removed if desired.
import TripDateField from "../TripDateField";

interface DateRangeSectionProps {
  control: Control<any>;
}

// Renamed original component
const DateRangeSectionComponent = ({ control }: DateRangeSectionProps) => {
  return (
    <div className="space-y-6">
      <TripDateField 
        name="earliestDeparture"
        label="Earliest Departure Date"
        description="The earliest date you can depart for your trip."
        control={control}
      />

      <TripDateField 
        name="latestDeparture"
        label="Latest Departure Date"
        description="The latest date you can depart for your trip."
        control={control}
      />
    </div>
  );
};

// Memoized component for export
const DateRangeSection = memo(DateRangeSectionComponent);
export default DateRangeSection;
