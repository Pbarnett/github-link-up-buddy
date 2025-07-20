import * as React from 'react';
const { useState, useMemo, useDeferredValue } = React;

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plane, MapPin, Clock } from 'lucide-react';

interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
}

// Mock flight data for demo
const mockFlights: FlightResult[] = [
  {
    id: '1',
    airline: 'United Airlines',
    flightNumber: 'UA123',
    origin: 'JFK',
    destination: 'LAX',
    departure: '08:00',
    arrival: '11:30',
    duration: '5h 30m',
    price: 299
  },
  {
    id: '2',
    airline: 'Delta Airlines',
    flightNumber: 'DL456',
    origin: 'LGA',
    destination: 'SFO',
    departure: '14:30',
    arrival: '17:45',
    duration: '6h 15m',
    price: 389
  },
  {
    id: '3',
    airline: 'American Airlines',
    flightNumber: 'AA789',
    origin: 'ORD',
    destination: 'MIA',
    departure: '10:15',
    arrival: '14:20',
    duration: '3h 5m',
    price: 245
  },
  {
    id: '4',
    airline: 'Southwest Airlines',
    flightNumber: 'WN101',
    origin: 'DEN',
    destination: 'PHX',
    departure: '16:00',
    arrival: '17:30',
    duration: '1h 30m',
    price: 149
  },
  {
    id: '5',
    airline: 'JetBlue Airways',
    flightNumber: 'B6202',
    origin: 'BOS',
    destination: 'MCO',
    departure: '09:45',
    arrival: '13:15',
    duration: '3h 30m',
    price: 199
  }
];

// Memoized flight card to prevent unnecessary re-renders
const FlightCard = memo(({ flight }: { flight: FlightResult }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{flight.airline}</h3>
            <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">${flight.price}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <p className="font-semibold">{flight.departure}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {flight.origin}
            </p>
          </div>
          
          <div className="text-center">
            <Plane className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
              <Clock className="w-3 h-3" />
              {flight.duration}
            </p>
          </div>
          
          <div className="text-center">
            <p className="font-semibold">{flight.arrival}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {flight.destination}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

FlightCard.displayName = 'FlightCard';

// Simulate expensive search operation
const performExpensiveSearch = (flights: FlightResult[], query: string): FlightResult[] => {
  if (!query) return flights;
  
  // Simulate processing time
  const start = Date.now();
  while (Date.now() - start < 100) {
    // Intentional delay to simulate expensive computation
  }
  
  const searchTerm = query.toLowerCase();
  return flights.filter(flight => 
    flight.airline.toLowerCase().includes(searchTerm) ||
    flight.flightNumber.toLowerCase().includes(searchTerm) ||
    flight.origin.toLowerCase().includes(searchTerm) ||
    flight.destination.toLowerCase().includes(searchTerm)
  );
};

export function DeferredSearchDemo() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  // Check if search results are stale (user is still typing)
  const isStale = query !== deferredQuery;
  
  // Perform expensive search with deferred query
  const filteredFlights = useMemo(() => 
    performExpensiveSearch(mockFlights, deferredQuery),
    [deferredQuery]
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Flight Search with useDeferredValue
            {isStale && (
              <Badge variant="secondary" className="ml-2">
                Searching...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search flights by airline, flight number, or airport code..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <strong>React 19 Performance Demo:</strong> This search uses{' '}
              <code className="bg-muted px-1 rounded">useDeferredValue</code> to defer expensive 
              search operations while keeping the input responsive.
            </p>
            {query && (
              <p className="mt-2">
                Current query: <strong>"{query}"</strong> | 
                Search query: <strong>"{deferredQuery}"</strong>
                {isStale && <span className="text-amber-600"> (Update pending...)</span>}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div 
        className={`grid gap-4 transition-opacity duration-200 ${
          isStale ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {/* Results header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
          </h3>
          {query && (
            <Badge variant="outline">
              Searching for: "{deferredQuery}"
            </Badge>
          )}
        </div>
        
        {/* Flight results */}
        {filteredFlights.length > 0 ? (
          filteredFlights.map(flight => (
            <FlightCard key={flight.id} flight={flight} />
          ))
        ) : query ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Plane className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No flights found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords like airline names or airport codes.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Start typing to search through available flights...
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Loading skeleton when search is stale */}
        {isStale && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-8 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeferredSearchDemo;
