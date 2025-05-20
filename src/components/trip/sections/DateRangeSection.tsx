
import { Control } from "react-hook-form";
import { FormDescription } from "@/components/ui/form";
import TripDateField from "../TripDateField";

interface DateRangeSectionProps {
  control: Control<any>;
}

const DateRangeSection = ({ control }: DateRangeSectionProps) => {
  console.log("Rendering DateRangeSection");
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

export default DateRangeSection;
