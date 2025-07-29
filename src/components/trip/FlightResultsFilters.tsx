import * as React from 'react';
import { FC } from 'react';
import { Check, Package, Plane } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface FlightResultsFiltersProps {
  totalResults: number;
  // Removed filter props since nonstop and carry-on are always included
}

const FlightResultsFilters: FC<FlightResultsFiltersProps> = ({
  totalResults,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">Flight Results</h3>
          <Badge variant="secondary" className="text-xs">
            {totalResults} flights
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Nonstop - Always Included */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
          <Plane className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Nonstop flights only
          </span>
          <Check className="h-3 w-3 text-blue-600" />
        </div>

        {/* Carry-on - Always Included */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
          <Package className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">
            Carry-on included
          </span>
          <Check className="h-3 w-3 text-green-600" />
        </div>
      </div>

      {/* Information note */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-600">
          All flights include nonstop routing and carry-on baggage at no extra
          cost.
        </div>
      </div>
    </div>
  );
};

export default FlightResultsFilters;
