import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Define NotificationType based on your DB schema
// Matches the 'notifications' table structure from the migration.
export interface NotificationType {
  id: number; // BIGSERIAL corresponds to number in JS/TS
  user_id: string; // UUID
  trip_request_id?: number | null; // BIGINT, nullable
  type: string; // TEXT
  message: string; // TEXT
  data?: Record<string, any> | null; // JSONB, nullable
  read: boolean; // BOOLEAN
  created_at: string; // TIMESTAMPTZ
}

export function useNotifications() {
  const { userId } = useCurrentUser(); // Assuming it returns { userId: string | null | undefined, ...otherProps }

  return useQuery<NotificationType[], Error>(
    // Query Key: Includes 'notifications' and the userId.
    // React Query will re-run the query if userId changes.
    ['notifications', userId], 
    
    // Query Function: Fetches data from Supabase.
    async () => {
      // This check is technically redundant if `enabled: !!userId` is used,
      // as React Query won't execute the queryFn if userId is falsy.
      // However, it doesn't hurt as a safeguard or if 'enabled' was omitted.
      if (!userId) {
        return []; // Or throw new Error("User not authenticated"); based on desired behavior
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId) // Filter by the current user's ID
        .eq('read', false)     // Filter for unread notifications
        .order('created_at', { ascending: false }); // Order by creation date, newest first

      if (error) {
        // If Supabase returns an error, throw it. React Query will catch it
        // and set the query status to 'error' with this error object.
        console.error("Error fetching notifications:", error);
        throw new Error(error.message);
      }

      // If data is null (which can happen if the query successfully returns no rows),
      // return an empty array to ensure the return type is always NotificationType[].
      return data || [];
    },
    
    // Options for useQuery:
    {
      // The query will not run until the userId is available (truthy).
      enabled: !!userId,
      
      // Optional: Configure staleTime and cacheTime as needed for your application.
      // staleTime: 1000 * 60 * 5, // 5 minutes
      // cacheTime: 1000 * 60 * 30, // 30 minutes
      
      // Optional: Refetch interval for polling (e.g., every 2 minutes)
      // refetchInterval: 1000 * 60 * 2, 
    }
  );
}
