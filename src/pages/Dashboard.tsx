

import * as React from 'react';
const { useState, useEffect, useRef } = React;

import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, Eye, PlusCircle, Plane, DollarSign, Activity } from 'lucide-react';
import TripHistory from '@/components/dashboard/TripHistory'; // Added import
import { DashboardGreeting } from '@/components/personalization/GreetingBanner';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface BookingRequest {
  id: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
  attempts: number;
  offer_data: Record<string, unknown> | null;
}

interface TripRequest {
  id: string;
  destination_airport: string;
  earliest_departure: string;
  latest_departure: string;
  budget: number;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [, setTripRequests] = useState<TripRequest[]>([]);
  const [, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [, setSelectedError] = useState<string | null>(null);

  // Track previous statuses for smart toast notifications
  const prevStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
        // Check if this is a JWT user not found error
        if (error.message && error.message.includes('User from sub claim in JWT does not exist')) {
          console.log('Stale JWT detected, clearing auth state...');
          // Type guard for real Supabase client
          if ('signOut' in supabase.auth) {
            await supabase.auth.signOut();
          }
          toast({
            title: "Session expired",
            description: "Please sign in again.",
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        setUser(data.user);
        await loadDashboardData(data.user.id);
      }

      setLoading(false);
    };

    getUser();

    // Type guard for real Supabase client auth state changes
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if ('onAuthStateChange' in supabase.auth) {
      const { data } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (session?.user) {
          setUser(session.user);
          loadDashboardData(session.user.id);
        }
      });
      authListener = data;
    }

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Initialize previous statuses when booking requests are first loaded
  useEffect(() => {
    bookingRequests.forEach(request => {
      prevStatuses.current[request.id] = request.status;
    });
  }, [bookingRequests.length]); // Only run when length changes (initial load)

  useEffect(() => {
    if (!user) return;

    // TODO: Set up real-time subscription for booking requests
    // Currently disabled due to API compatibility issues
    console.log('Real-time subscription for booking requests disabled');
    
    // No cleanup needed for now
    return () => {};
  }, [user]);

  // Automatic polling fallback every 30 seconds
  useEffect(() => {
    if (!user) return;

    const pollInterval = setInterval(async () => {
      await loadBookingRequests(user.id);
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [user]);

  const loadDashboardData = async (userId: string) => {
    await Promise.all([
      loadBookingRequests(userId),
      loadTripRequests(userId)
    ]);
  };

  const loadBookingRequests = async (userId: string) => {
    try {
      const query = supabase
        .from('booking_requests')
        .select('*')
        .eq('user_id', userId);
      
      // Type guard for real Supabase client with order method
      const { data, error } = 'order' in query ? 
        await (query as any).order('created_at', { ascending: false }) :
        await (query as any);

      if (error) {
        console.error('Error loading booking requests:', error);
      } else {
        setBookingRequests((data as BookingRequest[]) || []);
      }
    } catch (error) {
      console.error('Error loading booking requests:', error);
      setBookingRequests([]);
    }
  };

  const loadTripRequests = async (userId: string) => {
    try {
      const query = supabase
        .from('trip_requests')
        .select('*')
        .eq('user_id', userId);
      
      // Type guard for real Supabase client with order and limit methods
      let finalQuery = query as any;
      if ('order' in query) {
        finalQuery = (query as any).order('created_at', { ascending: false });
      }
      if ('limit' in finalQuery) {
        finalQuery = finalQuery.limit(5);
      }
      
      const { data, error } = await finalQuery;

      if (error) {
        console.error('Error loading trip requests:', error);
      } else {
        setTripRequests((data as TripRequest[]) || []);
      }
    } catch (error) {
      console.error('Error loading trip requests:', error);
      setTripRequests([]);
    }
  };

  const retryBookingRequest = async (requestId: string) => {
    try {
      const query = supabase
        .from('booking_requests');
      
      // Type guard for real Supabase client with update method
      if ('update' in query) {
        const { error } = await (query
          .update({
            status: 'pending_booking',
            attempts: 0,
            error_message: null
          } as any)
          .eq('id', requestId) as any);

        if (error) throw error;
      }

      toast({
        title: "🔄 Retry Initiated",
        description: "Your booking request has been queued for retry",
      });
    } catch (error: unknown) {
      toast({
        title: "Retry Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    if (!user) return;
    setRefreshing(true);
    await loadDashboardData(user.id);
    setRefreshing(false);
  };
  
  // Mark as potentially unused but keep for future use
  void refreshData;

  const handleSignOut = async () => {
    try {
      // Type guard for real Supabase client
      if ('signOut' in supabase.auth) {
        await supabase.auth.signOut();
      }
      toast({
        title: "Signed out successfully",
      });
    } catch (error: unknown) {
      toast({
        title: "Error signing out",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    const iconClasses = "h-4 w-4 transition-all duration-200";
    switch (status) {
      case 'done': 
        return <CheckCircle className={`${iconClasses} text-green-500 drop-shadow-sm`} />;
      case 'failed': 
        return <XCircle className={`${iconClasses} text-red-500 drop-shadow-sm`} />;
      case 'processing': 
        return <RefreshCw className={`${iconClasses} text-blue-500 animate-spin drop-shadow-sm`} />;
      case 'pending_booking':
      case 'pending_payment': 
        return <Clock className={`${iconClasses} text-amber-500 drop-shadow-sm`} />;
      default: 
        return <AlertCircle className={`${iconClasses} text-gray-500 drop-shadow-sm`} />;
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'done': return 'default';
      case 'failed': return 'destructive';
      case 'processing': return 'secondary';
      case 'pending_payment':
      case 'pending_booking': return 'outline';
      default: return 'outline';
    }
  };

  const getFilteredBookingRequests = () => {
    if (statusFilter === 'all') return bookingRequests;
    return bookingRequests.filter(request => request.status === statusFilter);
  };

  const getStatusCounts = () => {
    return {
      all: bookingRequests.length,
      pending_booking: bookingRequests.filter(r => r.status === 'pending_booking').length,
      pending_payment: bookingRequests.filter(r => r.status === 'pending_payment').length,
      processing: bookingRequests.filter(r => r.status === 'processing').length,
      done: bookingRequests.filter(r => r.status === 'done').length,
      failed: bookingRequests.filter(r => r.status === 'failed').length,
    };
  };

  const renderPrice = (offerData: Record<string, unknown> | null) => {
    if (!offerData || typeof offerData !== 'object' || !('price' in offerData) || !offerData.price) {
      return null;
    }
    
    const price = offerData.price;
    if (typeof price !== 'string' && typeof price !== 'number') {
      return null;
    }
    
    return (
      <span className="flex items-center">
        <DollarSign className="h-3 w-3 mr-1" />
        ${String(price)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Enhanced Header skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-6 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-48 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          {/* Enhanced Summary cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="card-enhanced p-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer transform"></div>
                <div className="flex items-center justify-between relative">
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-16 w-16 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Main content skeleton */}
          <div className="card-enhanced">
            <div className="p-6 space-y-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer transform"></div>
                    <div className="flex items-center space-x-3 relative">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const statusCounts = getStatusCounts();
  const filteredRequests = getFilteredBookingRequests();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="heading-primary bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <DashboardGreeting 
              userId={user.id}
              variant="default"
              className="text-lg text-gray-600 font-medium"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.location.href = '/trip/new'}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Find Your Next Flight
            </Button>
            <Button 
              onClick={handleSignOut} 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Conditional Hero Block - Progressive Disclosure */}
        {(statusCounts.pending_booking + statusCounts.processing + statusCounts.done) === 0 ? (
          /* Getting Started Hero Block - When Everything is 0 */
          <Card className="card-enhanced mb-8 text-center py-12 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 border-blue-200">
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">✈️ Skip the fare hunt.</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Tell us your perfect flight and price; we'll book it the moment it appears.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  onClick={() => window.location.href = '/trip/new?mode=auto'}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Set up Auto-Booking
                </Button>
                <Button
                  onClick={() => window.location.href = '/trip/new'}
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                >
                  or search flights manually
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Active State - Mini Widgets When User Has Data */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Upcoming Trips Widget */}
            <Card className="card-enhanced border-green-200 hover:border-green-300 cursor-pointer group" onClick={() => (document.querySelector('[value="tripHistory"]') as HTMLElement)?.click()}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-green-800">Upcoming Trips</p>
                    <p className="text-3xl font-bold text-green-900 transition-transform duration-200 group-hover:scale-105">
                      {statusCounts.done}
                    </p>
                    <p className="text-sm text-green-700 font-medium">
                      {statusCounts.done > 0 ? 'Booked flights' : 'No trips yet'}
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-green-500/10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-green-500/20 group-hover:scale-110">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Watches Widget */}
            <Card className="card-enhanced border-blue-200 hover:border-blue-300 cursor-pointer group" onClick={() => (document.querySelector('[value="currentRequests"]') as HTMLElement)?.click()}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-800">Active Watches</p>
                    <p className="text-3xl font-bold text-blue-900 transition-transform duration-200 group-hover:scale-105">
                      {statusCounts.pending_booking + statusCounts.processing}
                    </p>
                    <p className="text-sm text-blue-700 font-medium">
                      {statusCounts.pending_booking + statusCounts.processing > 0 ? 'Monitoring fares' : 'No active watches'}
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-blue-500/10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-blue-500/20 group-hover:scale-110">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main content area with new Tabs */}
        {/* Only show detailed tabs when user has data to show */}
        {(statusCounts.pending_booking + statusCounts.processing + statusCounts.done + statusCounts.failed + statusCounts.pending_payment) > 0 && (
          <Tabs defaultValue="currentRequests" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="currentRequests"
                className="rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                Active Watches
              </TabsTrigger>
              <TabsTrigger 
                value="tripHistory"
                className="rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                My Trips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="currentRequests">
              {/* Active Watches with its own internal Tabs for filtering */}
              <Card className="card-enhanced mt-4">
                <CardHeader className="pb-4">
                  <CardTitle className="heading-secondary">Active Watches</CardTitle>
                  <CardDescription className="text-gray-600">
                    Monitor your active flight searches and auto-booking requests
                  </CardDescription>
                </CardHeader>
              <CardContent>
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="all" className="text-xs">
                      All ({statusCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="pending_booking" className="text-xs">
                      Pending ({statusCounts.pending_booking})
                    </TabsTrigger>
                    <TabsTrigger value="processing" className="text-xs">
                      Processing ({statusCounts.processing})
                    </TabsTrigger>
                    <TabsTrigger value="done" className="text-xs">
                      Done ({statusCounts.done})
                    </TabsTrigger>
                    <TabsTrigger value="failed" className="text-xs">
                      Failed ({statusCounts.failed})
                    </TabsTrigger>
                    <TabsTrigger value="pending_payment" className="text-xs">
                      Payment ({statusCounts.pending_payment})
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    {filteredRequests.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="relative">
                          <div className="h-32 w-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            {statusFilter === 'all' ? (
                              <Plane className="h-16 w-16 text-gray-400" />
                            ) : (
                              <div className="scale-150">
                                {getStatusIcon(statusFilter)}
                              </div>
                            )}
                          </div>
                          <div className="absolute top-0 right-1/2 transform translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {statusFilter === 'all'
                            ? 'No booking requests yet'
                            : `No ${statusFilter.replace('_', ' ')} requests`
                          }
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                          {statusFilter === 'all'
                            ? 'Start by creating your first trip request to find great flight deals.'
                            : `No requests with ${statusFilter.replace('_', ' ')} status at the moment.`
                          }
                        </p>
                        {statusFilter === 'all' && (
                          <Button 
                            onClick={() => window.location.href = '/trip/new'}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            size="lg"
                          >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create Your First Trip
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredRequests.map((request) => (
                          <Card key={request.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              {/* Mobile-optimized layout */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(request.status)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                      <p className="font-medium text-gray-900 truncate">
                                        {request.offer_data && typeof request.offer_data === 'object' && 'airline' in request.offer_data ? String(request.offer_data.airline) : ''} {request.offer_data && typeof request.offer_data === 'object' && 'flight_number' in request.offer_data ? String(request.offer_data.flight_number) : ''}
                                      </p>
                                      <Badge 
                                        variant={getStatusBadgeVariant(request.status)}
                                        className="self-start sm:self-center mt-1 sm:mt-0"
                                      >
                                        {request.status.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-sm text-gray-500">
                                      <span>Created {new Date(request.created_at).toLocaleDateString()}</span>
                                      {renderPrice(request.offer_data)}
                                      {request.attempts > 0 && (
                                        <span className="text-orange-600">
                                          Attempt {request.attempts}
                                        </span>
                                      )}
                                    </div>
                                    {request.error_message && (
                                      <div className="flex items-center space-x-2 mt-2 p-2 bg-red-50 rounded border-l-4 border-red-200">
                                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-red-700 truncate">
                                            {request.error_message.length > 100 
                                              ? `${request.error_message.substring(0, 100)}...`
                                              : request.error_message
                                            }
                                          </p>
                                        </div>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => setSelectedError(request.error_message)}
                                              className="p-1 h-auto flex-shrink-0"
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                              <DialogTitle>Error Details</DialogTitle>
                                              <DialogDescription>
                                                Booking request {request.id.slice(0, 8)} error information
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-4">
                                              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                                                {request.error_message}
                                              </pre>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex items-center space-x-2 sm:flex-shrink-0">
                                  {request.status === 'failed' && request.attempts < 3 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => retryBookingRequest(request.id)}
                                      className="text-xs"
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Retry
                                    </Button>
                                  )}
                                  {request.status === 'pending_payment' && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-xs"
                                    >
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      Pay Now
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tripHistory">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Past Bookings</CardTitle>
                <CardDescription>Review your completed flight bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                {user && <TripHistory userId={user?.id ?? ''} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
