
import { Control } from "react-hook-form";
import TripNumberField from "../TripNumberField";

interface TripDurationSectionProps {
  control: Control<any>;
}

const TripDurationSection = ({ control }: TripDurationSectionProps) => {
  console.log("Rendering TripDurationSection");
  return (
    <div className="grid grid-cols-2 gap-4">
      <TripNumberField 
        name="min_duration"
        label="Min Duration (days)"
        description="Minimum length of your trip (1-30)"
        placeholder="Min days"
        control={control}
      />

      <TripNumberField 
        name="max_duration"
        label="Max Duration (days)"
        description="Maximum length of your trip (1-30)"
        placeholder="Max days"
        control={control}
      />
    </div>
  );
};

export default TripDurationSection;
