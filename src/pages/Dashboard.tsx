
import { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

interface BookingRequest {
  id: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  error: string | null;
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
            const requestId = payload.new.id;
            const oldStatus = prevStatuses.current[requestId];
            const newStatus = payload.new.status;
            
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
              updated[existingIndex] = payload.new;
              return updated;
            } else {
              return [payload.new, ...prev];
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
          error: null
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">Hello, {user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={refreshData} 
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Requests with Tabs */}
          <Card>
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
                    <p className="text-gray-500 text-center py-8">
                      {statusFilter === 'all' 
                        ? 'No booking requests yet' 
                        : `No ${statusFilter.replace('_', ' ')} requests`
                      }
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {filteredRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <p className="font-medium">
                                {request.offer_data?.airline} {request.offer_data?.flight_number}
                              </p>
                              <p className="text-sm text-gray-500">
                                Created {new Date(request.created_at).toLocaleDateString()}
                              </p>
                              {request.error && (
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-sm text-red-600 truncate max-w-xs">
                                    {request.error.substring(0, 50)}...
                                  </p>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setSelectedError(request.error)}
                                        className="p-1 h-auto"
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
                                          {request.error}
                                        </pre>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusBadgeVariant(request.status)}>
                              {request.status.replace('_', ' ')}
                            </Badge>
                            {request.status === 'failed' && request.attempts < 3 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => retryBookingRequest(request.id)}
                              >
                                Retry
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Trip Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Trip Requests</CardTitle>
              <CardDescription>
                Your latest trip searches and requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tripRequests.length === 0 ? (
                <p className="text-gray-500">No trip requests yet</p>
              ) : (
                <div className="space-y-4">
                  {tripRequests.map((trip) => (
                    <div key={trip.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            To: {trip.destination_airport || 'Any destination'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(trip.earliest_departure).toLocaleDateString()} - 
                            {new Date(trip.latest_departure).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Budget: ${trip.budget}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(trip.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
