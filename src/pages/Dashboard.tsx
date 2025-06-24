
import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, Eye, PlusCircle, Plane, Calendar, DollarSign, Activity, TrendingUp } from 'lucide-react';
import TripHistory from '@/components/dashboard/TripHistory'; // Added import

interface BookingRequest {
  id: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
  attempts: number;
  offer_data: any;
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedError, setSelectedError] = useState<string | null>(null);

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
          await supabase.auth.signOut();
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

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
        loadDashboardData(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
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

    // Set up real-time subscription for booking requests
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
          console.log('Booking request change:', payload);

          setBookingRequests(prev => {
            const bookingUpdate = payload.new as BookingRequest;
            const requestId = bookingUpdate.id;
            const oldStatus = prevStatuses.current[requestId];
            const newStatus = bookingUpdate.status;

            // Enhanced toast notifications for meaningful transitions
            if (oldStatus && oldStatus !== newStatus) {
              const requestShortId = requestId.slice(0, 8);

              if (oldStatus === 'processing' && newStatus === 'done') {
                toast({
                  title: "🎉 Booking Confirmed!",
                  description: `Your booking ${requestShortId} has been successfully completed.`,
                });
              } else if (oldStatus === 'processing' && newStatus === 'failed') {
                toast({
                  title: "❌ Booking Failed",
                  description: `Booking ${requestShortId} encountered an error. You can retry if needed.`,
                  variant: 'destructive'
                });
              } else if (newStatus === 'processing') {
                toast({
                  title: "⏳ Processing Booking",
                  description: `Booking ${requestShortId} is now being processed.`,
                });
              } else if (newStatus === 'pending_payment') {
                toast({
                  title: "💳 Payment Required",
                  description: `Booking ${requestShortId} is waiting for payment confirmation.`,
                });
              }
            }

            // Update the previous status tracker
            prevStatuses.current[requestId] = newStatus;

            // Update the list
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
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading booking requests:', error);
    } else {
      setBookingRequests(data || []);
    }
  };

  const loadTripRequests = async (userId: string) => {
    const { data, error } = await supabase
      .from('trip_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error loading trip requests:', error);
    } else {
      setTripRequests(data || []);
    }
  };

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
    await loadDashboardData(user.id);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending_booking':
      case 'pending_payment': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Summary cards skeleton - updated for focused layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-16 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main content skeleton */}
          <div className="bg-white rounded-lg border">
            <div className="p-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">Hello, {user.email}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Prominent New Trip CTA */}
            <Button
              onClick={() => window.location.href = '/trip/new'}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Find Your Next Flight
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm">Sign Out</Button>
          </div>
        </div>

        {/* Focused Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Active Auto-Bookings</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {statusCounts.pending_booking + statusCounts.processing}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Monitoring for flight deals
                  </p>
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              {statusCounts.pending_booking + statusCounts.processing === 0 && (
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <Button 
                    onClick={() => window.location.href = '/trip/new?mode=auto'}
                    variant="outline"
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Set Up Auto-Booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Booked Flights</p>
                  <p className="text-3xl font-bold text-green-900">{statusCounts.done}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {statusCounts.done > 0 ? 'Successfully purchased' : 'Ready for your first flight'}
                  </p>
                </div>
                <div className="h-16 w-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              {statusCounts.done === 0 && (
                <div className="mt-4 pt-4 border-t border-green-100">
                  <Button 
                    onClick={() => window.location.href = '/trip/new'}
                    variant="outline"
                    className="w-full text-green-600 border-green-200 hover:bg-green-50"
                    size="sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Book Your First Flight
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content area with new Tabs */}
        <Tabs defaultValue="currentRequests" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="currentRequests">Current Booking Requests</TabsTrigger>
            <TabsTrigger value="tripHistory">Trip History</TabsTrigger>
          </TabsList>

          <TabsContent value="currentRequests">
            {/* Booking Requests with its own internal Tabs for filtering */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>
                  Track your flight booking requests and their status
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
                      <div className="text-center py-12">
                        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          {statusFilter === 'all' ? (
                            <Plane className="h-12 w-12 text-gray-400" />
                          ) : (
                            getStatusIcon(statusFilter === 'pending_booking' ? 'pending_booking' : statusFilter === 'processing' ? 'processing' : statusFilter === 'done' ? 'done' : statusFilter === 'failed' ? 'failed' : statusFilter)
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {statusFilter === 'all'
                            ? 'No booking requests yet'
                            : `No ${statusFilter.replace('_', ' ')} requests`
                          }
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                          {statusFilter === 'all'
                            ? 'Start by creating your first trip request to find great flight deals.'
                            : `No requests with ${statusFilter.replace('_', ' ')} status at the moment.`
                          }
                        </p>
                        {statusFilter === 'all' && (
                          <Button 
                            onClick={() => window.location.href = '/trip/new'}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
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
                                        {request.offer_data?.airline} {request.offer_data?.flight_number}
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
                                      {request.offer_data?.price && (
                                        <span className="flex items-center">
                                          <DollarSign className="h-3 w-3 mr-1" />
                                          ${request.offer_data.price}
                                        </span>
                                      )}
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
      </div>
    </div>
  );
};

export default Dashboard;
