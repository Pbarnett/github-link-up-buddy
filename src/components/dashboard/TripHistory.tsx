

import * as React from 'react';
const { useState, useEffect, useCallback } = React;
type FC<T = {}> = React.FC<T>;

import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast'; // Added useToast
import { Loader2 } from 'lucide-react'; // Added Loader2
// For now, using 'any'. Replace with a proper type for booking history items.
// import { Tables } from '@/integrations/supabase/types'; // Example if you have this type

interface TripHistoryProps {
  userId: string;
}

const TripHistory: FC<TripHistoryProps> = ({ userId }) => {
  const [tripHistory, setTripHistory] = useState<Array<{
    id: string;
    trip_request_id: string;
    pnr: string;
    price: number;
    selected_seat_number: string;
    created_at: string;
    status: string;
  }>>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const fetchTripHistory = useCallback(async () => {
    if (!userId || !supabase) {
      setHistoryLoading(false);
      if (!userId) console.warn("Trip History: User ID prop not available.");
      if (!supabase) console.warn("Trip History: Supabase client not available.");
      return;
    }
    try {
      setHistoryLoading(true);
      const { data, error } = await (supabase
        .from('bookings')
        .select('id, trip_request_id, pnr, price, selected_seat_number, created_at, status') // Added status
        .eq('user_id', userId)
        .order('created_at', { ascending: false }) as any);

      if (error) {
        console.error("Error fetching trip history from bookings:", error);
        setHistoryError(error.message);
      } else {
        setTripHistory(data || []);
      }
    } catch (err: unknown) {
      console.error("Unexpected error fetching trip history from bookings:", err);
      setHistoryError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setHistoryLoading(false);
    }
  }, [userId, supabase]); // supabase is stable from client import

  useEffect(() => {
    if (userId) {
      fetchTripHistory();
    }
  }, [userId, fetchTripHistory]);

  const handleCancelBooking = async (bookingId: string) => {
    setIsCancelling(bookingId);
    try {
      // supabase.auth.getSession() is not needed if functions.invoke uses user's JWT by default
      const { error: invokeError, data: invokeData } = await supabase.functions.invoke('cancel-booking', {
        body: { booking_id: bookingId },
      });

      if (invokeError) {
        throw invokeError;
      }

      toast({
        title: 'Booking Cancellation Initiated',
        description: (invokeData && typeof invokeData === 'object' && 'message' in invokeData ? (invokeData as { message: string }).message : null) || 'Your booking cancellation is being processed.'
      });

      setTimeout(() => fetchTripHistory(), 1000); // Refresh after a delay

    } catch (err: unknown) {
      console.error('[TripHistory] Cancel booking failed for ID', bookingId, ':', err instanceof Error ? err.message : err);
      toast({
        title: 'Cancellation Failed',
        description: err instanceof Error ? err.message : 'Could not cancel the booking at this time.',
        variant: 'destructive'
      });
    } finally {
      setIsCancelling(null);
    }
  };

  if (historyLoading) {
    return <p>Loading trip history...</p>;
  }

  if (historyError) {
    return <p className="text-red-500">Error loading trip history: {historyError}</p>;
  }

  if (tripHistory.length === 0) {
    return <p>No past bookings found.</p>; // Updated message
  }

  return (
    <section className="mt-8 pt-6 border-t">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">My Past Bookings</h2>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                PNR
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Seat
              </th>
              <th scope="col" className="px-6 py-3">
                Booked On
              </th>
              <th scope="col" className="px-6 py-3">
                Details
              </th>
              <th scope="col" className="px-6 py-3">
                Status / Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tripHistory.map((booking) => {
              const now = new Date();
              const bookedAt = new Date(booking.created_at);
              const hoursSinceBooking = (now.getTime() - bookedAt.getTime()) / (1000 * 60 * 60);
              const canCancel = booking.status === 'ticketed' && hoursSinceBooking < 24;

              return (
                <tr
                  key={booking.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {booking.pnr || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {booking.price ? `$${Number(booking.price).toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {booking.selected_seat_number || 'Auto-assigned'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {booking.trip_request_id ? (
                      <Button variant="link" asChild className="p-0 h-auto text-blue-600 hover:underline">
                        <Link to={`/trip/confirm?tripId=${booking.trip_request_id}`}>View Details</Link>
                      </Button>
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {canCancel ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={isCancelling === booking.id}
                        className="text-xs"
                      >
                        {isCancelling === booking.id ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : null}
                        Cancel ({Math.max(0, Math.floor(24 - hoursSinceBooking))}h left)
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-600 capitalize">
                        {booking.status === 'ticketed' && hoursSinceBooking >= 24 ?
                          'Confirmed (Window Closed)' :
                          (booking.status ? booking.status.replace('_', ' ') : 'Unknown')}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TripHistory;
