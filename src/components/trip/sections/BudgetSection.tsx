
import { Control } from "react-hook-form";
import TripNumberField from "../TripNumberField";

interface BudgetSectionProps {
  control: Control<any>;
}

const BudgetSection = ({ control }: BudgetSectionProps) => {
  console.log("Rendering BudgetSection");
  return (
    <TripNumberField 
      name="budget"
      label="Budget (USD)"
      description="Your budget for the trip ($100-$10,000)"
      placeholder="Enter your budget"
      prefix="$"
      control={control}
    />
  );
};

export default BudgetSection;
