import * as React from 'react';
/**
 * Trip Request Repository
 *
 * Handles all database operations for trip requests with
 * proper error handling and business logic encapsulation.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from '@/integrations/supabase/types';
import { BusinessLogicError, ErrorCode } from '../errors/types';
import { BaseRepository, FilterCondition, QueryOptions } from './base';
export type TripRequest = Tables<'trip_requests'>;
export type TripRequestInsert =
  Database['public']['Tables']['trip_requests']['Insert'];
export type TripRequestUpdate =
  Database['public']['Tables']['trip_requests']['Update'];

/**
 * Business-specific filter types for trip requests
 */
export interface TripRequestFilters {
  userId?: string;
  autoBookEnabled?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  destinationAirport?: string;
  maxPrice?: number;
  minPrice?: number;
}

export class TripRequestRepository extends BaseRepository<'trip_requests'> {
  constructor(client: SupabaseClient<Database>) {
    super({
      client,
      tableName: 'trip_requests',
      enableRetry: true,
      logQueries: import.meta.env.MODE === 'development',
    });
  }

  /**
   * Convert business filters to database filter conditions
   */
  private businessFiltersToConditions(
    filters: TripRequestFilters
  ): FilterCondition[] {
    const conditions: FilterCondition[] = [];

    if (filters.userId) {
      conditions.push({
        column: 'user_id',
        operator: 'eq',
        value: filters.userId,
      });
    }

    if (filters.autoBookEnabled !== undefined) {
      conditions.push({
        column: 'auto_book_enabled',
        operator: 'eq',
        value: filters.autoBookEnabled,
      });
    }

    if (filters.createdAfter) {
      conditions.push({
        column: 'created_at',
        operator: 'gte',
        value: filters.createdAfter.toISOString(),
      });
    }

    if (filters.createdBefore) {
      conditions.push({
        column: 'created_at',
        operator: 'lte',
        value: filters.createdBefore.toISOString(),
      });
    }

    if (filters.destinationAirport) {
      conditions.push({
        column: 'destination_airport',
        operator: 'eq',
        value: filters.destinationAirport,
      });
    }

    if (filters.maxPrice !== undefined) {
      conditions.push({
        column: 'max_price',
        operator: 'lte',
        value: filters.maxPrice,
      });
    }

    if (filters.minPrice !== undefined) {
      conditions.push({
        column: 'max_price',
        operator: 'gte',
        value: filters.minPrice,
      });
    }

    return conditions;
  }

  /**
   * Find trip requests by user ID
   */
  public async findByUserId(
    userId: string,
    options: QueryOptions = {}
  ): Promise<TripRequest[]> {
    return this.findMany(
      [{ column: 'user_id', operator: 'eq', value: userId }],
      {
        ...options,
        orderBy: [{ column: 'created_at', ascending: false }],
        context: { operation: 'findByUserId', userId, ...options.context },
      }
    );
  }

  /**
   * Find active auto-booking trip requests
   */
  public async findActiveAutoBookingRequests(
    options: QueryOptions = {}
  ): Promise<TripRequest[]> {
    return this.findMany(
      [
        { column: 'auto_book_enabled', operator: 'eq', value: true },
        {
          column: 'latest_departure',
          operator: 'gte',
          value: new Date().toISOString(),
        },
      ],
      {
        ...options,
        orderBy: [{ column: 'created_at', ascending: false }],
        context: {
          operation: 'findActiveAutoBookingRequests',
          ...options.context,
        },
      }
    );
  }

  /**
   * Find trip requests with business-specific filters
   */
  public async findWithFilters(
    filters: TripRequestFilters,
    options: QueryOptions = {}
  ): Promise<TripRequest[]> {
    const conditions = this.businessFiltersToConditions(filters);

    return this.findMany(conditions, {
      ...options,
      orderBy: options.orderBy || [{ column: 'created_at', ascending: false }],
      context: { operation: 'findWithFilters', filters, ...options.context },
    });
  }

  /**
   * Create a new trip request with validation
   */
  public async createTripRequest(
    data: TripRequestInsert,
    options: QueryOptions = {}
  ): Promise<TripRequest> {
    // Business validation
    this.validateTripRequestData(data);

    // Ensure required fields
    const tripRequestData: TripRequestInsert = {
      ...data,
      created_at: new Date().toISOString(),
      destination_location_code:
        data.destination_location_code || data.destination_airport || '',
      // Calculate departure and return dates if not provided
      departure_date:
        data.departure_date ||
        new Date(data.earliest_departure).toISOString().split('T')[0],
      return_date:
        data.return_date ||
        this.calculateReturnDate(
          data.earliest_departure,
          data.min_duration || 3
        ),
    };

    return this.create(tripRequestData, {
      ...options,
      context: { operation: 'createTripRequest', ...options.context },
    });
  }

  /**
   * Update trip request with validation
   */
  public async updateTripRequest(
    id: string,
    data: TripRequestUpdate,
    options: QueryOptions = {}
  ): Promise<TripRequest> {
    // Business validation if updating critical fields
    if (
      data.earliest_departure ||
      data.latest_departure ||
      data.min_duration ||
      data.max_duration
    ) {
      this.validateTripRequestData(data);
    }

    // Update calculated fields if necessary
    const updateData: TripRequestUpdate = { ...data };

    if (data.earliest_departure && data.min_duration) {
      updateData.departure_date = new Date(data.earliest_departure)
        .toISOString()
        .split('T')[0];
      updateData.return_date = this.calculateReturnDate(
        data.earliest_departure,
        data.min_duration
      );
    }

    if (data.destination_airport && !data.destination_location_code) {
      updateData.destination_location_code = data.destination_airport;
    }

    return this.updateById(id, updateData, {
      ...options,
      context: { operation: 'updateTripRequest', id, ...options.context },
    });
  }

  /**
   * Find trip requests needing flight search updates
   */
  public async findRequestsNeedingUpdate(
    options: QueryOptions = {}
  ): Promise<TripRequest[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return this.findMany(
      [
        { column: 'auto_book_enabled', operator: 'eq', value: true },
        {
          column: 'latest_departure',
          operator: 'gte',
          value: new Date().toISOString(),
        },
        {
          column: 'last_checked_at',
          operator: 'lt',
          value: oneDayAgo.toISOString(),
        },
      ],
      {
        ...options,
        orderBy: [{ column: 'last_checked_at', ascending: true }],
        context: { operation: 'findRequestsNeedingUpdate', ...options.context },
      }
    );
  }

  /**
   * Update last checked timestamp
   */
  public async updateLastCheckedAt(
    id: string,
    options: QueryOptions = {}
  ): Promise<void> {
    await this.updateById(
      id,
      { last_checked_at: new Date().toISOString() },
      {
        ...options,
        context: { operation: 'updateLastCheckedAt', id, ...options.context },
      }
    );
  }

  /**
   * Get trip request statistics for a user
   */
  public async getUserStatistics(
    userId: string,
    options: QueryOptions = {}
  ): Promise<{
    total: number;
    autoBookingEnabled: number;
    recentRequests: number;
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [total, autoBookingEnabled, recentRequests] = await Promise.all([
      this.count(
        [{ column: 'user_id', operator: 'eq', value: userId }],
        options
      ),
      this.count(
        [
          { column: 'user_id', operator: 'eq', value: userId },
          { column: 'auto_book_enabled', operator: 'eq', value: true },
        ],
        options
      ),
      this.count(
        [
          { column: 'user_id', operator: 'eq', value: userId },
          {
            column: 'created_at',
            operator: 'gte',
            value: oneWeekAgo.toISOString(),
          },
        ],
        options
      ),
    ]);

    return {
      total,
      autoBookingEnabled,
      recentRequests,
    };
  }

  /**
   * Business validation for trip request data
   */
  private validateTripRequestData(
    data: Partial<TripRequestInsert | TripRequestUpdate>
  ): void {
    // Validate date ranges
    if (data.earliest_departure && data.latest_departure) {
      const earliest = new Date(data.earliest_departure);
      const latest = new Date(data.latest_departure);

      if (latest <= earliest) {
        throw new BusinessLogicError(
          ErrorCode.VALIDATION_ERROR,
          'Latest departure must be after earliest departure',
          'Please check your travel dates and try again.',
          {
            earliest_departure: data.earliest_departure,
            latest_departure: data.latest_departure,
          }
        );
      }

      // Check if dates are in the future
      const now = new Date();
      if (earliest <= now) {
        throw new BusinessLogicError(
          ErrorCode.VALIDATION_ERROR,
          'Departure dates must be in the future',
          'Please select future travel dates.',
          { earliest_departure: data.earliest_departure }
        );
      }
    }

    // Validate duration
    if (data.min_duration && data.max_duration) {
      if (data.max_duration < data.min_duration) {
        throw new BusinessLogicError(
          ErrorCode.VALIDATION_ERROR,
          'Maximum duration must be greater than minimum duration',
          'Please check your trip duration settings.',
          { min_duration: data.min_duration, max_duration: data.max_duration }
        );
      }
    }

    // Validate auto-booking requirements
    if (data.auto_book_enabled) {
      if (!data.max_price) {
        throw new BusinessLogicError(
          ErrorCode.VALIDATION_ERROR,
          'Maximum price is required for auto-booking',
          'Please set a maximum price for automatic booking.',
          { auto_book_enabled: data.auto_book_enabled }
        );
      }

      if (!data.preferred_payment_method_id) {
        throw new BusinessLogicError(
          ErrorCode.VALIDATION_ERROR,
          'Payment method is required for auto-booking',
          'Please select a payment method for automatic booking.',
          { auto_book_enabled: data.auto_book_enabled }
        );
      }
    }

    // Validate destination
    if (data.destination_airport !== undefined && !data.destination_airport) {
      throw new BusinessLogicError(
        ErrorCode.VALIDATION_ERROR,
        'Destination airport is required',
        'Please select a destination for your trip.',
        { destination_airport: data.destination_airport }
      );
    }
  }

  /**
   * Calculate return date based on departure and duration
   */
  private calculateReturnDate(
    earliestDeparture: string,
    minDuration: number
  ): string {
    const departureDate = new Date(earliestDeparture);
    const returnDate = new Date(
      departureDate.getTime() + minDuration * 24 * 60 * 60 * 1000
    );
    return returnDate.toISOString().split('T')[0];
  }
}

export default TripRequestRepository;
