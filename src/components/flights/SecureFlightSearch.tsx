/**
 * Secure Flight Search Component
 *
 * React component for flight search with secure API integration.
 * Uses AWS Secrets Manager for secure flight API credentials.
 */

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import {
  flightSearchServiceSecure,
  FlightSearchRequest,
  FlightSearchResponse,
  FlightOffer,
  FlightSearchUtils,
} from '@/services/flightSearchSecure';

// Flight search form interface
interface FlightSearchFormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'oneWay' | 'roundTrip';
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currency: string;
  maxPrice?: number;
  directFlightsOnly: boolean;
}

interface FlightSearchState {
  loading: boolean;
  error: string | null;
  results: FlightSearchResponse | null;
  selectedFlight: FlightOffer | null;
}

interface SecureFlightSearchProps {
  onFlightSelect?: (flight: FlightOffer) => void;
  onError?: (error: string) => void;
  className?: string;
  defaultValues?: Partial<FlightSearchFormData>;
}

export const SecureFlightSearch: React.FC<SecureFlightSearchProps> = ({
  onFlightSelect,
  onError,
  className = '',
  defaultValues = {},
}) => {
  const [formData, setFormData] = useState<FlightSearchFormData>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    tripType: 'roundTrip',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'ECONOMY',
    currency: 'USD',
    maxPrice: undefined,
    directFlightsOnly: false,
    ...defaultValues,
  });

  const [searchState, setSearchState] = useState<FlightSearchState>({
    loading: false,
    error: null,
    results: null,
    selectedFlight: null,
  });

  // Set minimum departure date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!formData.departureDate) {
      setFormData(prev => ({ ...prev, departureDate: today }));
    }
  }, [formData.departureDate]);

  /**
   * Handle form input changes
   */
  const handleInputChange = useCallback(
    (field: keyof FlightSearchFormData, value: string | number | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear return date if switching to one-way
      if (field === 'tripType' && value === 'oneWay') {
        setFormData(prev => ({ ...prev, returnDate: '' }));
      }
    },
    []
  );

  /**
   * Validate search form
   */
  const validateForm = (): string | null => {
    if (!formData.origin.trim()) return 'Origin is required';
    if (!formData.destination.trim()) return 'Destination is required';
    if (!formData.departureDate) return 'Departure date is required';
    if (formData.tripType === 'roundTrip' && !formData.returnDate) {
      return 'Return date is required for round trip';
    }
    if (formData.origin === formData.destination) {
      return 'Origin and destination must be different';
    }
    if (formData.adults < 1) return 'At least 1 adult is required';
    if (formData.adults + formData.children + formData.infants > 9) {
      return 'Maximum 9 passengers allowed';
    }

    // Validate dates
    const today = new Date();
    const departureDate = new Date(formData.departureDate);
    if (departureDate < today) {
      return 'Departure date cannot be in the past';
    }

    if (formData.returnDate) {
      const returnDate = new Date(formData.returnDate);
      if (returnDate <= departureDate) {
        return 'Return date must be after departure date';
      }
    }

    return null;
  };

  /**
   * Perform flight search
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setSearchState(prev => ({ ...prev, error: validationError }));
      onError?.(validationError);
      return;
    }

    setSearchState({
      loading: true,
      error: null,
      results: null,
      selectedFlight: null,
    });

    try {
      const searchRequest: FlightSearchRequest = {
        origin: formData.origin.toUpperCase(),
        destination: formData.destination.toUpperCase(),
        departureDate: formData.departureDate,
        returnDate:
          formData.tripType === 'roundTrip' ? formData.returnDate : undefined,
        adults: formData.adults,
        children: formData.children > 0 ? formData.children : undefined,
        infants: formData.infants > 0 ? formData.infants : undefined,
        cabinClass: formData.cabinClass,
        currency: formData.currency,
        maxPrice: formData.maxPrice || undefined,
        directFlightsOnly: formData.directFlightsOnly,
      };

      const results =
        await flightSearchServiceSecure.searchFlights(searchRequest);

      setSearchState({
        loading: false,
        error: null,
        results,
        selectedFlight: null,
      });

      if (results.data.length === 0) {
        const noResultsMessage =
          'No flights found for your search criteria. Try adjusting your dates or destinations.';
        setSearchState(prev => ({ ...prev, error: noResultsMessage }));
        onError?.(noResultsMessage);
      }
    } catch (error) {
      console.error('Flight search failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Flight search failed';

      setSearchState({
        loading: false,
        error: errorMessage,
        results: null,
        selectedFlight: null,
      });

      onError?.(errorMessage);
    }
  };

  /**
   * Handle flight selection
   */
  const handleFlightSelect = (flight: FlightOffer) => {
    setSearchState(prev => ({ ...prev, selectedFlight: flight }));
    onFlightSelect?.(flight);
  };

  /**
   * Format price display
   */
  const formatPrice = (price: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(parseFloat(price));
  };

  /**
   * Format date and time
   */
  const formatDateTime = (dateTime: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateTime));
  };

  /**
   * Render flight search form
   */
  const renderSearchForm = () => (
    <form
      onSubmit={handleSearch}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      {/* Trip type selection */}
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="roundTrip"
            checked={formData.tripType === 'roundTrip'}
            onChange={e =>
              handleInputChange(
                'tripType',
                (e.target as HTMLInputElement).value
              )
            }
            className="mr-2"
          />
          Round Trip
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="oneWay"
            checked={formData.tripType === 'oneWay'}
            onChange={e =>
              handleInputChange(
                'tripType',
                (e.target as HTMLInputElement).value
              )
            }
            className="mr-2"
          />
          One Way
        </label>
      </div>

      {/* Origin and destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From (Origin)
          </label>
          <input
            type="text"
            placeholder="LAX, New York, etc."
            value={formData.origin}
            onChange={e =>
              handleInputChange('origin', (e.target as HTMLInputElement).value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To (Destination)
          </label>
          <input
            type="text"
            placeholder="JFK, London, etc."
            value={formData.destination}
            onChange={e =>
              handleInputChange(
                'destination',
                (e.target as HTMLInputElement).value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure Date
          </label>
          <input
            type="date"
            value={formData.departureDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e =>
              handleInputChange(
                'departureDate',
                (e.target as HTMLInputElement).value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {formData.tripType === 'roundTrip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Date
            </label>
            <input
              type="date"
              value={formData.returnDate || ''}
              min={formData.departureDate}
              onChange={e =>
                handleInputChange(
                  'returnDate',
                  (e.target as HTMLInputElement).value
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adults
          </label>
          <select
            value={formData.adults}
            onChange={e =>
              handleInputChange(
                'adults',
                parseInt((e.target as HTMLSelectElement).value)
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Children (2-11)
          </label>
          <select
            value={formData.children}
            onChange={e =>
              handleInputChange(
                'children',
                parseInt((e.target as HTMLSelectElement).value)
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[0, 1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Infants (under 2)
          </label>
          <select
            value={formData.infants}
            onChange={e =>
              handleInputChange(
                'infants',
                parseInt((e.target as HTMLSelectElement).value)
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[0, 1, 2].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cabin Class
          </label>
          <select
            value={formData.cabinClass}
            onChange={e =>
              handleInputChange(
                'cabinClass',
                (e.target as HTMLSelectElement).value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={e =>
              handleInputChange(
                'currency',
                (e.target as HTMLSelectElement).value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="directFlights"
            checked={formData.directFlightsOnly}
            onChange={e =>
              handleInputChange('directFlightsOnly', e.target.checked)
            }
            className="mr-2"
          />
          <label htmlFor="directFlights" className="text-sm text-gray-700">
            Direct flights only
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Price (optional)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            placeholder="e.g., 1000"
            value={formData.maxPrice || ''}
            onChange={e =>
              handleInputChange(
                'maxPrice',
                (e.target as HTMLSelectElement).value
                  ? parseInt((e.target as HTMLInputElement).value)
                  : undefined
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Search button */}
      <button
        type="submit"
        disabled={searchState.loading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        {searchState.loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Searching flights...
          </div>
        ) : (
          'Search Flights'
        )}
      </button>
    </form>
  );

  /**
   * Render flight results
   */
  const renderFlightResults = () => {
    if (!searchState.results || searchState.results.data.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Flight Results ({searchState.results.meta.count} found)
        </h3>

        <div className="space-y-4">
          {searchState.results.data.slice(0, 10).map(flight => (
            <div
              key={flight.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                searchState.selectedFlight?.id === flight.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleFlightSelect(flight)}
            >
              {flight.itineraries.map((itinerary, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-medium">
                        {itinerary.segments[0].departure.iataCode} →{' '}
                        {
                          itinerary.segments[itinerary.segments.length - 1]
                            .arrival.iataCode
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        {FlightSearchUtils.formatDuration(itinerary.duration)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {FlightSearchUtils.isDirectFlight(itinerary)
                          ? 'Direct'
                          : `${itinerary.segments.length - 1} stop${itinerary.segments.length > 2 ? 's' : ''}`}
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(
                            flight.price.total,
                            flight.price.currency
                          )}
                        </div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <div>
                      Depart:{' '}
                      {formatDateTime(itinerary.segments[0].departure.at)}
                    </div>
                    <div>
                      Arrive:{' '}
                      {formatDateTime(
                        itinerary.segments[itinerary.segments.length - 1]
                          .arrival.at
                      )}
                    </div>
                  </div>

                  {/* Airline info */}
                  <div className="mt-2 text-xs text-gray-500">
                    {FlightSearchUtils.getAirlineName(
                      flight.validatingAirlineCodes[0],
                      searchState.results?.dictionaries
                    )}{' '}
                    • {flight.provider.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Search form */}
      {renderSearchForm()}

      {/* Error message */}
      {searchState.error && (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400" role="img" aria-label="Error">
                ⚠️
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Search Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {searchState.error}
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() =>
                  setSearchState(prev => ({ ...prev, error: null }))
                }
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flight results */}
      {renderFlightResults()}

      {/* Security notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure flight search powered by AWS Secrets Manager
        </p>
      </div>
    </div>
  );
};

export default SecureFlightSearch;
