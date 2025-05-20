
import TripNumberField from "../TripNumberField";

const TripDurationSection = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TripNumberField 
        name="min_duration"
        label="Min Duration (days)"
        description="Minimum length of your trip (1-30)"
        placeholder="Min days"
      />

      <TripNumberField 
        name="max_duration"
        label="Max Duration (days)"
        description="Maximum length of your trip (1-30)"
        placeholder="Max days"
      />
    </div>
  );
};

export default TripDurationSection;
