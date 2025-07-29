import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Campaign,
  CampaignFormData,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from '@/types/campaign';
import { Tables } from '@/integrations/supabase/types';
type AutoBookingRequestRow = Tables<'auto_booking_requests'>;

class CampaignService {
  async getCampaigns(userId: string): Promise<Campaign[]> {
    const { data, error } = await (supabase
      .from('auto_booking_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) as any);

    if (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }

    return this.mapToCampaigns(data || []);
  }

  async createCampaign(
    formData: CampaignFormData,
    userId: string
  ): Promise<Campaign> {
    // First, create a trip request
    const tripRequest = await this.createTripRequest(formData, userId);

    // Then create the auto-booking request
    const campaignData: CreateCampaignRequest = {
      trip_request_id: tripRequest.id,
      user_id: userId,
      status: 'watching',
      criteria: {
        destination: formData.destination,
        departure_dates: formData.departureDates,
        max_price: formData.maxPrice,
        direct_flights_only: formData.directFlightsOnly,
        departure_airports: formData.departureAirports,
        min_duration: formData.minDuration,
        max_duration: formData.maxDuration,
        cabin_class: formData.cabinClass,
        traveler_profile_id: formData.travelerProfileId,
        payment_method_id: formData.paymentMethodId,
      },
    };

    const { data, error } = await supabase
      .from('auto_booking_requests')
      .insert([campaignData as any])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }

    return this.mapToCampaign(data);
  }

  async updateCampaign(
    id: string,
    updates: UpdateCampaignRequest
  ): Promise<Campaign> {
    const { data, error } = await supabase
      .from('auto_booking_requests')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update campaign: ${error.message}`);
    }

    return this.mapToCampaign(data);
  }

  async pauseCampaign(id: string): Promise<Campaign> {
    return this.updateCampaign(id, { status: 'paused' });
  }

  async resumeCampaign(id: string): Promise<Campaign> {
    return this.updateCampaign(id, { status: 'watching' });
  }

  async deleteCampaign(id: string): Promise<void> {
    const { error } = await (supabase
      .from('auto_booking_requests')
      .delete()
      .eq('id', id) as any);

    if (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  }

  private async createTripRequest(formData: CampaignFormData, userId: string) {
    // Create a simplified trip request for the campaign
    const tripRequestData = {
      user_id: userId,
      destination_airport: formData.destination,
      destination_location_code: formData.destination,
      departure_airports: formData.departureAirports || [],
      earliest_departure: new Date().toISOString(),
      latest_departure: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(), // 1 year from now
      departure_date: new Date().toISOString().split('T')[0],
      return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 1 week from now
      min_duration: formData.minDuration || 3,
      max_duration: formData.maxDuration || 14,
      budget: formData.maxPrice,
      max_price: formData.maxPrice,
      nonstop_required: formData.directFlightsOnly,
      baggage_included_required: false,
      auto_book_enabled: true,
    };

    const { data, error } = await supabase
      .from('trip_requests')
      .insert([tripRequestData as any])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create trip request: ${error.message}`);
    }

    return data;
  }

  private mapToCampaigns(rows: AutoBookingRequestRow[]): Campaign[] {
    return rows.map(row => this.mapToCampaign(row));
  }

  private mapToCampaign(row: AutoBookingRequestRow): Campaign {
    return {
      id: row.id,
      user_id: row.user_id,
      trip_request_id: row.trip_request_id,
      status: row.status as Campaign['status'],
      criteria: row.criteria as any as Campaign['criteria'], // Type assertion since it's stored as JSONB
      price_history:
        (row.price_history as any as Campaign['price_history']) || [],
      latest_booking_request_id: row.latest_booking_request_id || undefined,
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
    };
  }
}

export const campaignService = new CampaignService();
