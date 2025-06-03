
import { Control } from "react-hook-form";
import TripNumberField from "../TripNumberField";

interface TripDurationSectionProps {
  control: Control<any>;
}

const TripDurationSection = ({ control }: TripDurationSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TripNumberField 
        name="min_duration"
        label="Min Duration (days)"
        description="Minimum length of your trip (1-30)"
        placeholder="3"
        control={control}
      />

      <TripNumberField 
        name="max_duration"
        label="Max Duration (days)"
        description="Maximum length of your trip (1-30)"
        placeholder="7"
        control={control}
      />
    </div>
  );
};

export default TripDurationSection;
