

type FC<T = {}> = React.FC<T>;

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import * as React from 'react';

// Form data interface for filter toggles
interface FilterToggleFormData {
  nonstop_required?: boolean;
  baggage_included_required?: boolean;
  [key: string]: unknown;
}

interface FilterTogglesSectionProps {
  control: Control<FilterToggleFormData>;
}

const FilterTogglesSection: FC<FilterTogglesSectionProps> = ({ control }) => {
  // Controller for nonstop_required switch
  const {
    field: nonstopField,
  } = useController({
    name: 'nonstop_required',
    control,
    defaultValue: true,
  });

  // Controller for baggage_included_required switch
  const {
    field: baggageField,
  } = useController({
    name: 'baggage_included_required',
    control,
    defaultValue: false,
  });

  return (
    <div className="space-y-4">
      {/* Nonstop Flights Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <Plane className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-0.5">
            <Label 
              htmlFor="nonstop-toggle" 
              className="text-base font-medium text-gray-900 cursor-pointer"
            >
              Nonstop flights only
            </Label>
            <div className="text-sm text-gray-600">
              Search for direct flights with no stops
            </div>
          </div>
        </div>
        <Switch
          id="nonstop-toggle"
          checked={nonstopField.value}
          onCheckedChange={nonstopField.onChange}
          name={nonstopField.name}
          onBlur={nonstopField.onBlur}
          aria-label="Nonstop flights only"
        />
      </div>

      {/* Carry-on Baggage Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <Package className="h-4 w-4 text-green-600" />
          </div>
          <div className="space-y-0.5">
            <Label 
              htmlFor="baggage-toggle" 
              className="text-base font-medium text-gray-900 cursor-pointer"
            >
              Include carry-on + personal item
            </Label>
            <div className="text-sm text-gray-600">
              Include carry-on baggage and personal item in search
            </div>
          </div>
        </div>
        <Switch
          id="baggage-toggle"
          checked={baggageField.value}
          onCheckedChange={baggageField.onChange}
          name={baggageField.name}
          onBlur={baggageField.onBlur}
          aria-label="Include carry-on + personal item"
        />
      </div>
    </div>
  );
};

export default FilterTogglesSection;
