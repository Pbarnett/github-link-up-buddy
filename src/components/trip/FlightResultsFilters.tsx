import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plane, Package, X } from 'lucide-react';

interface FlightResultsFiltersProps {
  nonstopOnly: boolean;
  onNonstopChange: (checked: boolean) => void;
  carryOnIncluded: boolean;
  onCarryOnChange: (checked: boolean) => void;
  totalResults: number;
  filteredResults: number;
  onClearFilters: () => void;
}

const FlightResultsFilters: React.FC<FlightResultsFiltersProps> = ({
  nonstopOnly,
  onNonstopChange,
  carryOnIncluded,
  onCarryOnChange,
  totalResults,
  filteredResults,
  onClearFilters
}) => {
  const hasActiveFilters = nonstopOnly || carryOnIncluded;
  const filtersChanged = filteredResults !== totalResults;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">Filter Results</h3>
          {filtersChanged && (
            <Badge variant="secondary" className="text-xs">
              {filteredResults} of {totalResults} flights
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/* Nonstop Filter */}
        <div className="flex items-center space-x-3">
          <Switch
            id="nonstop-filter"
            checked={nonstopOnly}
            onCheckedChange={onNonstopChange}
          />
          <label
            htmlFor="nonstop-filter"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            <Plane className="h-4 w-4 text-blue-600" />
            Nonstop flights only
          </label>
        </div>

        {/* Carry-on Filter */}
        <div className="flex items-center space-x-3">
          <Switch
            id="carryon-filter"
            checked={carryOnIncluded}
            onCheckedChange={onCarryOnChange}
          />
          <label
            htmlFor="carryon-filter"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            <Package className="h-4 w-4 text-green-600" />
            Include carry-on + personal item
          </label>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Active filters:</span>
            {nonstopOnly && (
              <Badge variant="outline" className="text-xs">
                Nonstop only
              </Badge>
            )}
            {carryOnIncluded && (
              <Badge variant="outline" className="text-xs">
                Carry-on included
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightResultsFilters;
