import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import { supabase } from '@/integrations/supabase/client'; // Corrected import
// import { useCurrentUser } from '@/hooks/useCurrentUser'; // Removed
import { Button } from '@/components/ui/button';
// For now, using 'any'. Replace with a proper type for booking history items.
// import { Tables } from '@/integrations/supabase/types'; // Example if you have this type

interface TripHistoryProps {
  userId: string;
}

const TripHistory: React.FC<TripHistoryProps> = ({ userId }) => {
  const [tripHistory, setTripHistory] = useState<any[]>([]); // Replace 'any' with your Booking type
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { userId: currentUserId } = useCurrentUser(); // Removed

  useEffect(() => {
    const fetchTripHistory = async () => {
      if (!userId || !supabase) { // Use prop userId
        setHistoryLoading(false);
        if (!userId) console.warn("Trip History: User ID prop not available.");
        if (!supabase) console.warn("Trip History: Supabase client not available.");
        return;
      }
      try {
        setHistoryLoading(true);
        const { data, error } = await supabase
          .from('bookings') // Changed table to 'bookings'
          .select('id, trip_request_id, pnr, price, selected_seat_number, created_at') // Updated fields
          .eq('user_id', userId) // Use prop userId for filtering
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching trip history from bookings:", error);
          setHistoryError(error.message);
        } else {
          setTripHistory(data || []);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching trip history from bookings:", err);
        setHistoryError(err.message || "An unexpected error occurred.");
      } finally {
        setHistoryLoading(false);
      }
    };

    if (supabase && userId) { // Use prop userId in condition
      fetchTripHistory();
    }
  }, [supabase, userId]); // Add userId to dependency array

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
            </tr>
          </thead>
          <tbody>
            {tripHistory.map((booking) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TripHistory;
