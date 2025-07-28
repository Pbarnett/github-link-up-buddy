import * as React from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import DateRangeSection from './DateRangeSection';
import BudgetSection from './BudgetSection';
import TripDurationSection from './TripDurationSection';
import DepartureAirportsSection from './DepartureAirportsSection';
import DestinationSection from './DestinationSection';

interface TripParametersSectionProps {
  control: Control<Record<string, unknown>>;
  watch: UseFormWatch<Record<string, unknown>>;
}

const TripParametersSection = ({
  control,
  watch,
}: TripParametersSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Trip Parameters
        </h2>
        <div className="space-y-6">
          <DateRangeSection control={control} />
          <BudgetSection control={control} />
          <TripDurationSection control={control} />
          <DepartureAirportsSection control={control} />
          <DestinationSection control={control} watch={watch} />
        </div>
      </div>
    </div>
  );
};

export default TripParametersSection;
