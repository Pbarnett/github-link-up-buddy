/**
 * AirlineSelector Component - Phase 4.1
 *
 * Multi-select component for choosing preferred airlines in flight filtering.
 * Displays airline logos, names, and allows easy selection/deselection.
 */

type FC<T = {}> = React.FC<T>;
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface Airline {
  code: string;
  name: string;
  logoUrl?: string;
  country?: string;
}

interface AirlineSelectorProps {
  selectedAirlines: string[];
  onSelectionChange: (selectedCodes: string[]) => void;
  availableAirlines?: Airline[];
  maxSelections?: number;
  placeholder?: string;
}

// Common airlines dataset - in a real app, this could come from an API
const COMMON_AIRLINES: Airline[] = [
  { code: 'AA', name: 'American Airlines', country: 'US' },
  { code: 'DL', name: 'Delta Air Lines', country: 'US' },
  { code: 'UA', name: 'United Airlines', country: 'US' },
  { code: 'WN', name: 'Southwest Airlines', country: 'US' },
  { code: 'AS', name: 'Alaska Airlines', country: 'US' },
  { code: 'B6', name: 'JetBlue Airways', country: 'US' },
  { code: 'NK', name: 'Spirit Airlines', country: 'US' },
  { code: 'F9', name: 'Frontier Airlines', country: 'US' },
  { code: 'BA', name: 'British Airways', country: 'GB' },
  { code: 'LH', name: 'Lufthansa', country: 'DE' },
  { code: 'AF', name: 'Air France', country: 'FR' },
  { code: 'KL', name: 'KLM', country: 'NL' },
  { code: 'VS', name: 'Virgin Atlantic', country: 'GB' },
  { code: 'EK', name: 'Emirates', country: 'AE' },
  { code: 'QR', name: 'Qatar Airways', country: 'QA' },
  { code: 'SQ', name: 'Singapore Airlines', country: 'SG' },
  { code: 'CX', name: 'Cathay Pacific', country: 'HK' },
  { code: 'JL', name: 'Japan Airlines', country: 'JP' },
  { code: 'AC', name: 'Air Canada', country: 'CA' },
  { code: 'IB', name: 'Iberia', country: 'ES' },
  { code: 'AZ', name: 'Alitalia', country: 'IT' },
  { code: 'TK', name: 'Turkish Airlines', country: 'TR' },
  { code: 'LX', name: 'Swiss International', country: 'CH' },
  { code: 'OS', name: 'Austrian Airlines', country: 'AT' },
];

const AirlineSelector: FC<AirlineSelectorProps> = ({
  selectedAirlines,
  onSelectionChange,
  availableAirlines = COMMON_AIRLINES,
  maxSelections = 10,
  placeholder = 'Select preferred airlines...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter airlines based on search query
  const filteredAirlines = useMemo(() => {
    if (!searchQuery) return availableAirlines;

    const query = searchQuery.toLowerCase();
    return availableAirlines.filter(
      airline =>
        airline.name.toLowerCase().includes(query) ||
        airline.code.toLowerCase().includes(query) ||
        airline.country?.toLowerCase().includes(query)
    );
  }, [availableAirlines, searchQuery]);

  // Get selected airline objects
  const selectedAirlineObjects = useMemo(() => {
    return selectedAirlines
      .map(code => availableAirlines.find(airline => airline.code === code))
      .filter(Boolean) as Airline[];
  }, [selectedAirlines, availableAirlines]);

  const handleAirlineToggle = (airlineCode: string) => {
    const newSelection = selectedAirlines.includes(airlineCode)
      ? selectedAirlines.filter(code => code !== airlineCode)
      : [...selectedAirlines, airlineCode];

    // Respect max selections
    if (newSelection.length <= maxSelections) {
      onSelectionChange(newSelection);
    }
  };

  const handleRemoveAirline = (airlineCode: string) => {
    const newSelection = selectedAirlines.filter(code => code !== airlineCode);
    onSelectionChange(newSelection);
  };

  const clearAllSelections = () => {
    onSelectionChange([]);
  };

  // Generate display text for the trigger button
  const getDisplayText = () => {
    if (selectedAirlines.length === 0) {
      return placeholder;
    }

    if (selectedAirlines.length === 1) {
      const airline = selectedAirlineObjects[0];
      return airline
        ? `${airline.code} - ${airline.name}`
        : selectedAirlines[0];
    }

    return `${selectedAirlines.length} airlines selected`;
  };

  return (
    <div className="space-y-2">
      {/* Main Selector */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between text-left font-normal"
          >
            <span className="truncate">{getDisplayText()}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                placeholder="Search airlines..."
                value={searchQuery}
                onChange={e =>
                  setSearchQuery((e.target as HTMLInputElement).value)
                }
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredAirlines.length > 0 ? (
                <CommandGroup>
                  {filteredAirlines.map(airline => (
                    <CommandItem
                      key={airline.code}
                      value={airline.code}
                      onSelect={() => handleAirlineToggle(airline.code)}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedAirlines.includes(airline.code)}
                        onChange={() => {}} // Handled by parent
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                          <span className="text-xs font-bold text-gray-600">
                            {airline.code}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{airline.name}</div>
                          <div className="text-xs text-gray-500">
                            {airline.code} • {airline.country}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No airlines found.</CommandEmpty>
              )}
            </div>
            {selectedAirlines.length > 0 && (
              <div className="border-t p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllSelections}
                  className="w-full text-sm"
                >
                  Clear all selections
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Airlines Display */}
      {selectedAirlines.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedAirlineObjects.map(airline => (
            <Badge
              key={airline.code}
              variant="secondary"
              className="text-xs px-2 py-1 flex items-center gap-2"
            >
              <Plane className="h-3 w-3" />
              <span>
                {airline.code} - {airline.name}
              </span>
              <button
                onClick={() => handleRemoveAirline(airline.code)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                aria-label={`Remove ${airline.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Selection Limit Warning */}
      {selectedAirlines.length >= maxSelections && (
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border">
          Maximum {maxSelections} airlines can be selected. Remove some to
          select others.
        </div>
      )}

      {/* Help Text */}
      {selectedAirlines.length === 0 && (
        <div className="text-xs text-gray-500">
          Select airlines to filter flight results. Only flights operated by
          selected airlines will be shown.
        </div>
      )}
    </div>
  );
};

export default AirlineSelector;
