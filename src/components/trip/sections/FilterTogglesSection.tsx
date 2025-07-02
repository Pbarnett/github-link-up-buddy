import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Plane, Package, Check } from 'lucide-react';

// This component shows informational badges about core business requirements
// rather than user-toggleable filters, since nonstop and carry-on are always included
interface FilterTogglesSectionProps {
  // No longer needs control or isLoading since these are informational only
}

const FilterTogglesSection: React.FC<FilterTogglesSectionProps> = () => {
  return (
    <div className="space-y-3">
      {/* Nonstop Flights - Always Included */}
      <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <Plane className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-0.5">
            <div className="text-base font-medium text-blue-900">Nonstop flights only</div>
            <div className="text-sm text-blue-700">
              All flights shown are direct with no stops.
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          <Check className="h-3 w-3 mr-1" />
          Included
        </Badge>
      </div>

      {/* Carry-on Baggage - Always Included */}
      <div className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <Package className="h-4 w-4 text-green-600" />
          </div>
          <div className="space-y-0.5">
            <div className="text-base font-medium text-green-900">Carry-on + personal item</div>
            <div className="text-sm text-green-700">
              All prices include carry-on baggage and personal item.
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <Check className="h-3 w-3 mr-1" />
          Included
        </Badge>
      </div>
    </div>
  );
};

export default FilterTogglesSection;
