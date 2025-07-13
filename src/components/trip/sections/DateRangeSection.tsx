
import { Control } from "react-hook-form";
import TripDateField from "../TripDateField";

// Date range form data interface
interface DateRangeFormData {
  earliestDeparture?: Date | string;
  latestDeparture?: Date | string;
  [key: string]: unknown;
}

interface DateRangeSectionProps {
  control: Control<DateRangeFormData>;
}

const DateRangeSection = ({ control }: DateRangeSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

export default DateRangeSection;
