import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

interface DebugInfoProps {
  tripId?: string | null;
}

export default function DebugInfo({ tripId }: DebugInfoProps) {
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [tripData, setTripData] = useState<any>(null);
  const [offersCount, setOffersCount] = useState<number>(0);
  
  // Current feature flags being used
  const useNewPoolsUI = useFeatureFlag('use_new_pools_ui', false);
  const flightSearchV2Flag = import.meta.env.VITE_FLAG_FS_V2 === 'true';

  useEffect(() => {
    // Fetch feature flags from database
    const fetchFeatureFlags = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .order('name');
        
        if (!error && data) {
          setFeatureFlags(data);
          console.log('🔍 [DEBUG-INFO] Feature flags from database:', data);
        }
      } catch (err) {
        console.error('🔍 [DEBUG-INFO] Error fetching feature flags:', err);
      }
    };

    // Fetch trip data if tripId provided
    const fetchTripData = async () => {
      if (!tripId) return;
      
      try {
        const { data: trip, error: tripError } = await supabase
          .from('trip_requests')
          .select('*')
          .eq('id', tripId)
          .single();
        
        if (!tripError && trip) {
          setTripData(trip);
          console.log('🔍 [DEBUG-INFO] Trip data:', trip);
        }

        // Check how many offers exist for this trip
        const { data: offers, error: offersError } = await supabase
          .from('flight_offers')
          .select('*', { count: 'exact' })
          .eq('trip_request_id', tripId);
        
        if (!offersError) {
          setOffersCount(offers?.length || 0);
          console.log(`🔍 [DEBUG-INFO] Found ${offers?.length || 0} offers in flight_offers table for trip ${tripId}`);
          
          if (offers && offers.length > 0) {
            console.log('🔍 [DEBUG-INFO] Sample offers:', offers.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('🔍 [DEBUG-INFO] Error fetching trip/offers data:', err);
      }
    };

    fetchFeatureFlags();
    fetchTripData();
  }, [tripId]);

  useEffect(() => {
    // Print comprehensive debug info to console
    console.log('🔍 [DEBUG-INFO] ==================== SYSTEM DEBUG INFO ====================');
    console.log('🔍 [DEBUG-INFO] Environment:', {
      NODE_ENV: import.meta.env.NODE_ENV,
      VITE_FLAG_FS_V2: import.meta.env.VITE_FLAG_FS_V2,
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL
    });
    console.log('🔍 [DEBUG-INFO] React Feature Flags:', {
      use_new_pools_ui: useNewPoolsUI,
      VITE_FLAG_FS_V2: flightSearchV2Flag
    });
    console.log('🔍 [DEBUG-INFO] Current Trip:', {
      tripId,
      hasData: !!tripData,
      offersCount
    });
    console.log('🔍 [DEBUG-INFO] Active Implementation:', {
      usingPools: useNewPoolsUI,
      usingV2Search: flightSearchV2Flag
    });
    console.log('🔍 [DEBUG-INFO] =======================================================');
  }, [useNewPoolsUI, flightSearchV2Flag, tripId, tripData, offersCount]);

  // Only render in development
  if (import.meta.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-2 rounded max-w-xs opacity-80 z-50">
      <div className="font-bold">🔍 DEBUG INFO</div>
      <div>Pools UI: {useNewPoolsUI ? '✅' : '❌'}</div>
      <div>FS-V2: {flightSearchV2Flag ? '✅' : '❌'}</div>
      <div>Trip: {tripId?.slice(0, 8)}...</div>
      <div>Offers: {offersCount}</div>
    </div>
  );
}
