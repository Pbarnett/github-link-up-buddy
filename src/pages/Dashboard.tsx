
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { PlusCircle, Plane, Calendar } from 'lucide-react'
import { format as formatDate } from 'date-fns'

interface TripRequest {
  id: string
  earliest_departure: string
  latest_departure: string
  budget: number
  destination_airport: string
  created_at: string
  min_duration: number
  max_duration: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { userId } = useCurrentUser()
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTripRequests = async () => {
      if (!userId) return
      
      console.log('[Dashboard] Fetching trip requests for user:', userId)
      
      const { data, error } = await supabase
        .from('trip_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('[Dashboard] Error fetching trip requests:', error)
      } else {
        console.log('[Dashboard] Fetched trip requests:', data)
        // Map the data to match our interface
        const mappedData = (data || []).map(trip => ({
          id: trip.id,
          earliest_departure: trip.earliest_departure,
          latest_departure: trip.latest_departure,
          budget: trip.budget,
          destination_airport: trip.destination_airport || 'Unknown',
          created_at: trip.created_at,
          min_duration: trip.min_duration,
          max_duration: trip.max_duration
        }))
        setTripRequests(mappedData)
      }
      setIsLoading(false)
    }

    fetchTripRequests()
  }, [userId])

  const handleViewOffers = (tripId: string) => {
    console.log('[Dashboard] Navigating to offers for trip:', tripId)
    navigate(`/trip/offers?id=${tripId}`)
  }

  const handleCreateTrip = () => {
    navigate('/trip/new')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading your trips...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Your Trip Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your flight searches and bookings</p>
          </div>
          <Button onClick={handleCreateTrip} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Trip
          </Button>
        </div>

        {tripRequests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Plane className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first trip to start searching for flights
              </p>
              <Button onClick={handleCreateTrip}>
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tripRequests.map((trip) => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {trip.destination_airport || 'Unknown Destination'}
                  </CardTitle>
                  <CardDescription>
                    Created {formatDate(new Date(trip.created_at), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Travel Window:</span>
                      <span>
                        {formatDate(new Date(trip.earliest_departure), 'MMM d')} - {formatDate(new Date(trip.latest_departure), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span>{trip.min_duration}-{trip.max_duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Budget:</span>
                      <span>${trip.budget}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleViewOffers(trip.id)} 
                    className="w-full"
                  >
                    View Flight Offers
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
