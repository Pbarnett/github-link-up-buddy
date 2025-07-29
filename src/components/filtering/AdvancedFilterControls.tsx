import * as React from 'react';
import { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Filter, Plane, RefreshCw, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AirlineSelector from './AirlineSelector';
/**
 * Filter options that integrate with the backend FilterFactory system
 */
export interface FilterOptions {
  budget?: number;
  currency?: string;
  nonstop?: boolean;
  pipelineType?: 'standard' | 'budget' | 'fast';
  // Phase 4 filters
  airlines?: string[]; // Array of IATA airline codes (e.g., ['BA', 'AA', 'DL'])
  departureTimeRange?: { start: number; end: number }; // Hours (0-24)
  arrivalTimeRange?: { start: number; end: number };
  maxDuration?: number; // Hours
  maxLayoverTime?: number; // Hours
}

export interface FilterState {
  options: FilterOptions;
  activeFiltersCount: number;
  resultsCount?: number;
  totalCount?: number;
}

interface AdvancedFilterControlsProps {
  /** Current filter state */
  filterState: FilterState;
  /** Callback when filters change */
  onFiltersChange: (options: FilterOptions) => void;
  /** Callback to reset all filters */
  onResetFilters: () => void;
  /** Callback to refresh results with current filters */
  onRefreshResults?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Whether to show advanced options */
  showAdvanced?: boolean;
  /** Maximum budget allowed */
  maxBudget?: number;
  /** Trip budget for context */
  tripBudget?: number;
}

const AdvancedFilterControls: FC<AdvancedFilterControlsProps> = ({
  filterState,
  onFiltersChange,
  onResetFilters,
  onRefreshResults,
  isLoading = false,
  showAdvanced = true,
  maxBudget = 5000,
  tripBudget = 1000,
}) => {
  const [localOptions, setLocalOptions] = useState<FilterOptions>(
    filterState.options
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalOptions(filterState.options);
  }, [filterState.options]);

  // Debounced filter updates to avoid excessive API calls
  const debouncedUpdate = useCallback(
    createDebounce((options: FilterOptions) => {
      onFiltersChange(options);
    }, 300),
    [onFiltersChange]
  );

  const updateFilter = useCallback(
    (key: keyof FilterOptions, value: unknown) => {
      const newOptions = { ...localOptions, [key]: value };
      setLocalOptions(newOptions);
      debouncedUpdate(newOptions);
    },
    [localOptions, debouncedUpdate]
  );

  const removeFilter = useCallback(
    (key: keyof FilterOptions) => {
      const newOptions = { ...localOptions };
      delete newOptions[key];
      setLocalOptions(newOptions);
      onFiltersChange(newOptions);
    },
    [localOptions, onFiltersChange]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: localOptions.currency || 'USD',
    }).format(amount);
  };

  const hasActiveFilters = filterState.activeFiltersCount > 0;
  const showResults =
    filterState.resultsCount !== undefined &&
    filterState.totalCount !== undefined;

  return (
    <Card className="mb-6 shadow-sm border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Filter Results</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {filterState.activeFiltersCount} active
              </Badge>
            )}
            {showResults && (
              <Badge variant="outline" className="text-xs">
                {filterState.resultsCount} of {filterState.totalCount} flights
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRefreshResults && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefreshResults}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            )}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Primary Filters Row */}
        <div className="flex flex-wrap items-center gap-6 mb-4">
          {/* Budget Filter */}
          <div className="flex-1 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Max Budget
              </label>
              {localOptions.budget && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter('budget')}
                  className="h-auto p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="px-2">
              <Slider
                value={[localOptions.budget || tripBudget]}
                onValueChange={([value]) => updateFilter('budget', value)}
                max={maxBudget}
                min={100}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$100</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(localOptions.budget || tripBudget)}
                </span>
                <span>{formatCurrency(maxBudget)}</span>
              </div>
            </div>
          </div>

          {/* Pipeline Type Filter */}
          <div className="min-w-[140px] space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Filter Mode
            </label>
            <Select
              value={localOptions.pipelineType || 'standard'}
              onValueChange={(value: 'standard' | 'budget' | 'fast') =>
                updateFilter('pipelineType', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="budget">Budget Focus</SelectItem>
                <SelectItem value="fast">Fast Results</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nonstop Switch */}
          <div className="flex items-center space-x-3">
            <Switch
              id="nonstop-filter"
              checked={localOptions.nonstop || false}
              onCheckedChange={checked => updateFilter('nonstop', checked)}
            />
            <label
              htmlFor="nonstop-filter"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
            >
              <Plane className="h-4 w-4 text-blue-600" />
              Nonstop only
            </label>
          </div>
        </div>

        {/* Advanced Filters (Expandable) */}
        {showAdvanced && (
          <>
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-600 hover:text-gray-800"
              >
                {isExpanded ? 'Hide' : 'Show'} Advanced Filters
                <svg
                  className={`ml-2 h-4 w-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>

            {isExpanded && (
              <>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <Select
                      value={localOptions.currency || 'USD'}
                      onValueChange={value => updateFilter('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Departure Time Range (Phase 4 preview) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Departure Time
                      <Badge variant="outline" className="ml-2 text-xs">
                        Coming Soon
                      </Badge>
                    </label>
                    <div className="text-xs text-gray-500">
                      Filter by preferred departure times
                    </div>
                  </div>

                  {/* Airline Preferences - Phase 4.1 Implementation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Preferred Airlines
                      </label>
                      {localOptions.airlines &&
                        localOptions.airlines.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFilter('airlines')}
                            className="h-auto p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                    </div>
                    <AirlineSelector
                      selectedAirlines={localOptions.airlines || []}
                      onSelectionChange={airlines =>
                        updateFilter('airlines', airlines)
                      }
                    />
                  </div>

                  {/* Max Duration (Phase 4 preview) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Max Flight Duration
                      <Badge variant="outline" className="ml-2 text-xs">
                        Coming Soon
                      </Badge>
                    </label>
                    <div className="text-xs text-gray-500">
                      Limit total travel time
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Active Filters:
              </h4>
              <div className="flex flex-wrap gap-2">
                {localOptions.budget && (
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Budget: {formatCurrency(localOptions.budget)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter('budget')}
                      className="h-auto p-0 ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localOptions.nonstop && (
                  <Badge variant="outline" className="text-xs">
                    <Plane className="h-3 w-3 mr-1" />
                    Nonstop only
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter('nonstop')}
                      className="h-auto p-0 ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {localOptions.pipelineType &&
                  localOptions.pipelineType !== 'standard' && (
                    <Badge variant="outline" className="text-xs">
                      <Filter className="h-3 w-3 mr-1" />
                      {localOptions.pipelineType} mode
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateFilter('pipelineType', 'standard')}
                        className="h-auto p-0 ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Create a debounce function specifically for FilterOptions
function createDebounce(
  func: (options: FilterOptions) => void,
  wait: number
): (options: FilterOptions) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (options: FilterOptions) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(options), wait);
  };
}

// Utility function for debouncing
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default AdvancedFilterControls;
