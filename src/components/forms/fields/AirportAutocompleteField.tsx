
/**
 * Airport Autocomplete Field Component
 * 
 * Renders an airport search input with autocomplete functionality
 */

type FC<T = {}> = React.FC<T>;
type _Component<P = {}, S = {}> = React.Component<P, S>;

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { APIIntegration } from '@/types/dynamic-forms';

interface Airport {
  code: string;
  name: string;
  city?: string;
  country?: string;
}

interface AirportAutocompleteFieldProps {
  value?: Airport;
  onChange: (value: Airport) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  apiIntegration?: APIIntegration;
  className?: string;
}

export const AirportAutocompleteField: FC<AirportAutocompleteFieldProps> = ({
  value,
  onChange,
  placeholder = "Search airports...",
  disabled = false,
  error,
  apiIntegration,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  // Use existing search functionality or default airports
  const searchAirports = async (query: string): Promise<Airport[]> => {
    if (query.length < 2) return [];

    try {
      setLoading(true);
      
      // Use API integration if provided
      if (apiIntegration) {
        const response = await fetch(`${apiIntegration.endpoint}?q=${encodeURIComponent(query)}`, {
          method: apiIntegration.method || 'GET',
          headers: apiIntegration.headers
        });
        const data = await response.json();
        return data.airports || [];
      }

      // Fallback to mock data or existing airport search
      const mockAirports: Airport[] = [
        { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'US' },
        { code: 'JFK', name: 'John F Kennedy International Airport', city: 'New York', country: 'US' },
        { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'GB' },
        { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'FR' },
        { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'JP' },
        { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'US' },
        { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'US' },
        { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'US' }
      ];

      // Filter mock airports based on query
      return mockAirports.filter(airport =>
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.code.toLowerCase().includes(query.toLowerCase()) ||
        airport.city?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Airport search error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Search for airports when query changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery) {
        const results = await searchAirports(searchQuery);
        setAirports(results);
      } else {
        setAirports([]);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAirportSelect = (airport: Airport) => {
    onChange(airport);
    setOpen(false);
    setSearchQuery('');
  };

  const displayValue = value 
    ? `${value.code} - ${value.name}${value.city ? ` (${value.city})` : ''}`
    : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "pl-8",
              error && "border-destructive",
              className
            )}
            readOnly
            onClick={() => !disabled && setOpen(true)}
          />
          <Plane className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search airports..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? 'Searching...' : 'No airports found.'}
            </CommandEmpty>
            <CommandGroup>
              {airports.map((airport) => (
                <CommandItem
                  key={airport.code}
                  onSelect={() => handleAirportSelect(airport)}
                  className="flex items-center gap-2"
                >
                  <Plane className="h-4 w-4" />
                  <div>
                    <div className="font-medium">
                      {airport.code} - {airport.name}
                    </div>
                    {airport.city && (
                      <div className="text-sm text-muted-foreground">
                        {airport.city}{airport.country && `, ${airport.country}`}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
