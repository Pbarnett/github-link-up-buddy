import React from "react";
import { Control } from "react-hook-form";
import TripNumberField from "../TripNumberField";
import { FormValues } from "@/types/form";

interface TripDurationSectionProps {
  control: Control<FormValues>;
}

const TripDurationSectionComponent = ({ control }: TripDurationSectionProps) => {
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

// Memoized component for export
const TripDurationSection = React.memo(TripDurationSectionComponent);

export default TripDurationSection;
