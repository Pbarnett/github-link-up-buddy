
import { FormDescription } from "@/components/ui/form";
import TripDateField from "../TripDateField";

interface DateRangeSectionProps {
  // No additional props needed since we use the form context
}

const DateRangeSection = () => {
  return (
    <div className="space-y-6">
      <TripDateField 
        name="earliestDeparture"
        label="Earliest Departure Date"
        description="The earliest date you can depart for your trip."
      />

      <TripDateField 
        name="latestDeparture"
        label="Latest Departure Date"
        description="The latest date you can depart for your trip."
      />
    </div>
  );
};

export default DateRangeSection;
