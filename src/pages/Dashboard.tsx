
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { useDashboardAuth } from '@/hooks/useDashboardAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useBookingRequestRealtime } from '@/hooks/useBookingRequestRealtime';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import BookingRequestsTab from '@/components/dashboard/BookingRequestsTab';
import RecentTripRequests from '@/components/dashboard/RecentTripRequests';
import TripHistory from '@/components/dashboard/TripHistory';

const Dashboard = () => {
  const { user, loading } = useDashboardAuth();
  const [refreshing, setRefreshing] = useState(false);

  const {
    bookingRequests,
    tripRequests,
    loadDashboardData,
    setBookingRequests,
  } = useDashboardData(user?.id || null);

  useBookingRequestRealtime(user, setBookingRequests);

  const retryBookingRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({
          status: 'pending_booking',
          attempts: 0,
          error_message: null
        })
        .eq('id', requestId);

      if (error) throw error;
      toast({
        title: "🔄 Retry Initiated",
        description: "Your booking request has been queued for retry",
      });
    } catch (error: any) {
      toast({
        title: "Retry Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    if (!user) return;
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/70 to-slate-100">
        <div className="w-full max-w-7xl px-4">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <DashboardHeader
          email={user.email}
          refreshing={refreshing}
          onRefresh={refreshData}
          onSignOut={handleSignOut}
        />
        <Tabs defaultValue="currentRequests" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="currentRequests">Current Booking Requests</TabsTrigger>
            <TabsTrigger value="tripHistory">Trip History</TabsTrigger>
          </TabsList>
          <TabsContent value="currentRequests" className="animate-fade-in">
            <BookingRequestsTab bookingRequests={bookingRequests} onRetry={retryBookingRequest} />
          </TabsContent>
          <TabsContent value="tripHistory" className="animate-fade-in">
            <TripHistory userId={user?.id ?? ''} />
          </TabsContent>
        </Tabs>
        <div className="mt-8">
          <RecentTripRequests tripRequests={tripRequests} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
