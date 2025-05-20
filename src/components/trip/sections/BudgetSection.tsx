
import TripNumberField from "../TripNumberField";

const BudgetSection = () => {
  return (
    <TripNumberField 
      name="budget"
      label="Budget (USD)"
      description="Your budget for the trip ($100-$10,000)"
      placeholder="Enter your budget"
      prefix="$"
    />
  );
};

export default BudgetSection;
