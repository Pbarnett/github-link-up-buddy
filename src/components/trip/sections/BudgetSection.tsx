
import React from "react";
import { Control } from "react-hook-form";
import TripNumberField from "../TripNumberField";
import { FormValues } from "@/types/form";

interface BudgetSectionProps {
  control: Control<FormValues>;
}

// Renamed original component for memoization
const BudgetSectionComponent = ({ control }: BudgetSectionProps) => {
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

// Memoized component for export
const BudgetSection = React.memo(BudgetSectionComponent);
export default BudgetSection;
