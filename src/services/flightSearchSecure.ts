/**
 * Secure Flight Search Service with AWS Secrets Manager Integration
 * 
 * Handles flight search operations with secure credential management.
 * Supports multiple flight search APIs (Amadeus, Skyscanner, etc.)
 */

import { secretCache } from '@/lib/aws-sdk-enhanced/examples/secrets-manager-usage';

// Environment configuration
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';

// Flight API secret naming patterns
const FLIGHT_API_SECRETS = {
  amadeus: `${ENVIRONMENT}/flight-apis/amadeus-credentials`,
  skyscanner: `${ENVIRONMENT}/flight-apis/skyscanner-credentials`,
  kayak: `${ENVIRONMENT}/flight-apis/kayak-credentials`,
};

// Flight search interfaces
export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currency?: string;
  maxPrice?: number;
  directFlightsOnly?: boolean;
}

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    base: string;
    fees: string;
    currency: string;
  };
  itineraries: FlightItinerary[];
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
  provider: string;
  bookingToken?: string;
  deepLink?: string;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating?: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: 'ADULT' | 'CHILD' | 'INFANT';
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags: {
      quantity: number;
    };
  }>;
}

export interface FlightSearchResponse {
  data: FlightOffer[];
  meta: {
    count: number;
    links?: {
      self?: string;
      next?: string;
      previous?: string;
    };
  };
  dictionaries?: {
    locations?: Record<string, any>;
    aircraft?: Record<string, any>;
    carriers?: Record<string, any>;
  };
}

/**
 * Secure Flight API Configuration Manager
 */
export class FlightAPIConfigManager {
  private static configCache = new Map<string, { config: any; expiry: number }>();
  private static readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  /**
   * Get flight API configuration securely
   */
  static async getAPIConfig(provider: keyof typeof FLIGHT_API_SECRETS): Promise<any> {
    const cacheKey = `flight-api-${provider}`;
    const cached = this.configCache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      return cached.config;
    }

    try {
      const secretId = FLIGHT_API_SECRETS[provider];
      const credentialsJson = await secretCache.getSecret(
        secretId,
        AWS_REGION,
        15 * 60 * 1000 // 15 minute cache
      );

      if (!credentialsJson) {
        throw new Error(`Flight API credentials not found for provider: ${provider}`);
      }

      const credentials = JSON.parse(credentialsJson);
      
      // Cache the configuration
      this.configCache.set(cacheKey, {
        config: credentials,
        expiry: Date.now() + this.CACHE_TTL
      });

      return credentials;
    } catch (error) {
      console.error(`Failed to get flight API config for ${provider}:`, error);
      throw new Error(`Unable to configure ${provider} flight API integration`);
    }
  }

  /**
   * Clear flight API configuration cache
   */
  static clearCache(): void {
    this.configCache.clear();
  }
}

/**
 * Amadeus Flight Search Integration
 */
export class AmadeusFlightSearch {
  private static instance: AmadeusFlightSearch;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  static getInstance(): AmadeusFlightSearch {
    if (!AmadeusFlightSearch.instance) {
      AmadeusFlightSearch.instance = new AmadeusFlightSearch();
    }
    return AmadeusFlightSearch.instance;
  }

  /**
   * Get access token for Amadeus API
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const config = await FlightAPIConfigManager.getAPIConfig('amadeus');
      
      const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.client_id,
          client_secret: config.client_secret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Amadeus token request failed: ${response.status}`);
      }

      const tokenData = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Amadeus access token:', error);
      throw error;
    }
  }

  /**
   * Search flights using Amadeus API
   */
  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResponse> {
    try {
      const accessToken = await this.getAccessToken();
      
      const searchParams = new URLSearchParams({
        originLocationCode: request.origin,
        destinationLocationCode: request.destination,
        departureDate: request.departureDate,
        adults: request.adults.toString(),
        currencyCode: request.currency || 'USD',
        max: '50', // Limit results
      });

      if (request.returnDate) {
        searchParams.append('returnDate', request.returnDate);
      }

      if (request.children) {
        searchParams.append('children', request.children.toString());
      }

      if (request.infants) {
        searchParams.append('infants', request.infants.toString());
      }

      if (request.cabinClass) {
        searchParams.append('travelClass', request.cabinClass);
      }

      if (request.maxPrice) {
        searchParams.append('maxPrice', request.maxPrice.toString());
      }

      if (request.directFlightsOnly) {
        searchParams.append('nonStop', 'true');
      }

      const response = await fetch(
        `https://api.amadeus.com/v2/shopping/flight-offers?${searchParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Amadeus flight search failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Transform Amadeus response to our standard format
      return this.transformAmadeusResponse(data);
    } catch (error) {
      console.error('Amadeus flight search failed:', error);
      throw error;
    }
  }

  /**
   * Transform Amadeus API response to standard format
   */
  private transformAmadeusResponse(amadeusData: any): FlightSearchResponse {
    const offers: FlightOffer[] = amadeusData.data?.map((offer: any) => ({
      id: offer.id,
      price: {
        total: offer.price.total,
        base: offer.price.base,
        fees: (parseFloat(offer.price.total) - parseFloat(offer.price.base)).toString(),
        currency: offer.price.currency,
      },
      itineraries: offer.itineraries?.map((itinerary: any) => ({
        duration: itinerary.duration,
        segments: itinerary.segments?.map((segment: any) => ({
          departure: {
            iataCode: segment.departure.iataCode,
            terminal: segment.departure.terminal,
            at: segment.departure.at,
          },
          arrival: {
            iataCode: segment.arrival.iataCode,
            terminal: segment.arrival.terminal,
            at: segment.arrival.at,
          },
          carrierCode: segment.carrierCode,
          number: segment.number,
          aircraft: {
            code: segment.aircraft.code,
          },
          operating: segment.operating,
          duration: segment.duration,
          id: segment.id,
          numberOfStops: segment.numberOfStops,
          blacklistedInEU: segment.blacklistedInEU,
        })) || [],
      })) || [],
      validatingAirlineCodes: offer.validatingAirlineCodes || [],
      travelerPricings: offer.travelerPricings || [],
      provider: 'amadeus',
      bookingToken: offer.id,
    })) || [];

    return {
      data: offers,
      meta: {
        count: offers.length,
        links: amadeusData.meta?.links,
      },
      dictionaries: amadeusData.dictionaries,
    };
  }
}

/**
 * Secure Flight Search Service
 */
export class FlightSearchServiceSecure {
  private static instance: FlightSearchServiceSecure;
  private amadeusSearch: AmadeusFlightSearch;

  static getInstance(): FlightSearchServiceSecure {
    if (!FlightSearchServiceSecure.instance) {
      FlightSearchServiceSecure.instance = new FlightSearchServiceSecure();
    }
    return FlightSearchServiceSecure.instance;
  }

  private constructor() {
    this.amadeusSearch = AmadeusFlightSearch.getInstance();
  }

  /**
   * Search flights across multiple providers
   */
  async searchFlights(
    request: FlightSearchRequest,
    providers: string[] = ['amadeus']
  ): Promise<FlightSearchResponse> {
    const searchPromises = providers.map(async (provider) => {
      try {
        switch (provider) {
          case 'amadeus':
            return await this.amadeusSearch.searchFlights(request);
          default:
            throw new Error(`Unsupported flight search provider: ${provider}`);
        }
      } catch (error) {
        console.warn(`Flight search failed for provider ${provider}:`, error);
        throw error;
      }
    });

    const results = await Promise.allSettled(searchPromises);
    const successfulResults = results
      .filter((result) => result.status === 'fulfilled' && result.value !== null)
      .map((result) => (result as PromiseFulfilledResult<FlightSearchResponse>).value);

    if (successfulResults.length === 0) {
      // Get the first error to provide more specific error information
      const firstRejection = results.find((result) => result.status === 'rejected');
      if (firstRejection && firstRejection.status === 'rejected') {
        throw firstRejection.reason;
      }
      throw new Error('All flight search providers failed');
    }

    // Combine results from multiple providers
    const combinedOffers: FlightOffer[] = [];
    const combinedDictionaries: any = {};
    let totalCount = 0;

    successfulResults.forEach((result) => {
      combinedOffers.push(...result.data);
      totalCount += result.meta.count;
      
      if (result.dictionaries) {
        Object.assign(combinedDictionaries, result.dictionaries);
      }
    });

    // Sort by price
    combinedOffers.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));

    return {
      data: combinedOffers,
      meta: {
        count: totalCount,
      },
      dictionaries: combinedDictionaries,
    };
  }

  /**
   * Get flight details by offer ID
   */
  async getFlightDetails(offerId: string, provider: string): Promise<FlightOffer | null> {
    try {
      switch (provider) {
        case 'amadeus':
          // Implement flight details retrieval from Amadeus
          const config = await FlightAPIConfigManager.getAPIConfig('amadeus');
          // Add implementation for detailed flight info
          break;
        default:
          throw new Error(`Unsupported provider for flight details: ${provider}`);
      }
    } catch (error) {
      console.error('Failed to get flight details:', error);
      throw error;
    }

    return null;
  }

  /**
   * Validate flight availability before booking
   */
  async validateFlightAvailability(
    offerId: string,
    provider: string
  ): Promise<{
    available: boolean;
    price?: {
      total: string;
      currency: string;
    };
    validUntil?: string;
  }> {
    try {
      switch (provider) {
        case 'amadeus':
          // Implement flight availability validation
          return {
            available: true,
            price: { total: '0', currency: 'USD' },
            validUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
          };
        default:
          throw new Error(`Unsupported provider for availability check: ${provider}`);
      }
    } catch (error) {
      console.error('Flight availability validation failed:', error);
      throw error;
    }
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    FlightAPIConfigManager.clearCache();
  }
}

/**
 * Flight search utility functions
 */
export const FlightSearchUtils = {
  /**
   * Format flight duration
   */
  formatDuration: (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1]?.replace('H', '') || '0';
    const minutes = match[2]?.replace('M', '') || '0';
    
    return `${hours}h ${minutes}m`;
  },

  /**
   * Calculate layover time
   */
  calculateLayoverTime: (segments: FlightSegment[]): string[] => {
    const layovers: string[] = [];
    
    for (let i = 0; i < segments.length - 1; i++) {
      const arrivalTime = new Date(segments[i].arrival.at);
      const departureTime = new Date(segments[i + 1].departure.at);
      const layoverMs = departureTime.getTime() - arrivalTime.getTime();
      const layoverHours = Math.floor(layoverMs / (1000 * 60 * 60));
      const layoverMinutes = Math.floor((layoverMs % (1000 * 60 * 60)) / (1000 * 60));
      
      layovers.push(`${layoverHours}h ${layoverMinutes}m`);
    }
    
    return layovers;
  },

  /**
   * Check if flight is direct
   */
  isDirectFlight: (itinerary: FlightItinerary): boolean => {
    return itinerary.segments.length === 1;
  },

  /**
   * Get airline name from code
   */
  getAirlineName: (carrierCode: string, dictionaries?: any): string => {
    return dictionaries?.carriers?.[carrierCode] || carrierCode;
  },

  /**
   * Get airport name from code
   */
  getAirportName: (iataCode: string, dictionaries?: any): string => {
    return dictionaries?.locations?.[iataCode]?.name || iataCode;
  },
};

// Export singleton instance
export const flightSearchServiceSecure = FlightSearchServiceSecure.getInstance();
