import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Corrected import
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
// You might need to define or import a TripRequest type similar to Tables<'trip_requests'>
// For now, using 'any'. Replace with a proper type.
// import { Tables } from '@/integrations/supabase/types'; // Example if you have this type

const TripHistory: React.FC = () => {
  const [tripHistory, setTripHistory] = useState<any[]>([]); // Replace 'any' with your TripRequest type
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { supabase } = useSupabase(); // Removed useSupabase hook call
  const { userId: currentUserId } = useCurrentUser();

  useEffect(() => {
    const fetchTripHistory = async () => {
      if (!currentUserId || !supabase) {
        setHistoryLoading(false);
        if (!currentUserId) console.warn("Trip History: Current user ID not available.");
        if (!supabase) console.warn("Trip History: Supabase client not available.");
        return;
      }
      try {
        setHistoryLoading(true);
        const { data, error } = await supabase
          .from('trip_requests')
          .select('id, destination_airport, earliest_departure, latest_departure, auto_book_enabled, booking_status')
          .eq('user_id', currentUserId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching trip history:", error);
          setHistoryError(error.message);
        } else {
          setTripHistory(data || []);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching trip history:", err);
        setHistoryError(err.message || "An unexpected error occurred.");
      } finally {
        setHistoryLoading(false);
      }
    };

    if (supabase && currentUserId) {
      fetchTripHistory();
    }
  }, [supabase, currentUserId]);

  if (historyLoading) {
    return <p>Loading trip history...</p>;
  }

  if (historyError) {
    return <p className="text-red-500">Error loading trip history: {historyError}</p>;
  }

  if (tripHistory.length === 0) {
    return <p>No past trips found.</p>;
  }

  return (
    <section className="mt-8 pt-6 border-t">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">My Past Trips</h2>
      <div className="space-y-4">
        {tripHistory.map((trip) => (
          <div key={trip.id} className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">{trip.destination_airport || 'N/A'}</h3>
            <p className="text-sm text-gray-600">
              Dates: {new Date(trip.earliest_departure).toLocaleDateString()} - {new Date(trip.latest_departure).toLocaleDateString()}
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p>Auto-Book: <span className={`font-medium ${trip.auto_book_enabled ? 'text-green-600' : 'text-gray-700'}`}>{trip.auto_book_enabled ? 'Enabled' : 'Disabled'}</span></p>
              <p>Status: <span className="font-medium text-gray-700">{trip.booking_status || 'Pending'}</span></p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/trip/confirm?tripRequestId=${trip.id}`)}
              className="mt-3"
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TripHistory;
