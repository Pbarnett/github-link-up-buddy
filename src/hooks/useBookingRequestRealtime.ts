
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { BookingRequest } from './useDashboardData';

export function useBookingRequestRealtime(user: any, setBookingRequests: (fn: (prev: BookingRequest[]) => BookingRequest[]) => void) {
  const prevStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('booking-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setBookingRequests(prev => {
            const bookingUpdate = payload.new as BookingRequest;
            const requestId = bookingUpdate.id;
            const oldStatus = prevStatuses.current[requestId];
            const newStatus = bookingUpdate.status;

            // Transitions toast
            if (oldStatus && oldStatus !== newStatus) {
              const requestShortId = requestId.slice(0, 8);
              if (oldStatus === 'processing' && newStatus === 'done') {
                toast({ title: "🎉 Booking Confirmed!", description: `Your booking ${requestShortId} has been successfully completed.` });
              } else if (oldStatus === 'processing' && newStatus === 'failed') {
                toast({ title: "❌ Booking Failed", description: `Booking ${requestShortId} encountered an error.`, variant: 'destructive' });
              } else if (newStatus === 'processing') {
                toast({ title: "⏳ Processing Booking", description: `Booking ${requestShortId} is now being processed.` });
              } else if (newStatus === 'pending_payment') {
                toast({ title: "💳 Payment Required", description: `Booking ${requestShortId} is waiting for payment confirmation.` });
              }
            }
            prevStatuses.current[requestId] = newStatus;
            const existingIndex = prev.findIndex(r => r.id === requestId);
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = bookingUpdate;
              return updated;
            } else {
              return [bookingUpdate, ...prev];
            }
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, setBookingRequests]);
}
