
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BookingRequest {
  id: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
  attempts: number;
  offer_data: any;
}

export interface TripRequest {
  id: string;
  destination_airport: string;
  earliest_departure: string;
  latest_departure: string;
  budget: number;
  created_at: string;
}

export function useDashboardData(userId: string | null) {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([]);

  async function loadDashboardData() {
    if (!userId) return;
    await Promise.all([loadBookingRequests(), loadTripRequests()]);
  }

  async function loadBookingRequests() {
    if (!userId) return;
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error) setBookingRequests(data || []);
  }

  async function loadTripRequests() {
    if (!userId) return;
    const { data, error } = await supabase
      .from('trip_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    if (!error) setTripRequests(data || []);
  }

  return { bookingRequests, tripRequests, loadDashboardData, setBookingRequests, setTripRequests };
}
