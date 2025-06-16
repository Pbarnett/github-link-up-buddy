import React, { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { createTripRequest } from '@/services/tripService';
import { useTripOffers } from '@/hooks/useTripOffersLegacy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExtendedTripFormValues } from '@/types/form';

const TestFlightSearch: React.FC = () => {
  const { user } = useCurrentUser();
  const [tripId, setTripId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const {
    offers,
    tripDetails,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    refreshOffers
  } = useTripOffers({ tripId });

  const createTestTrip = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    setIsCreating(true);
    try {
      const testFormData: ExtendedTripFormValues = {
        destination_airport: 'LAX',
        departure_airports: ['SFO', 'OAK'],
        earliestDeparture: new Date('2025-07-15'),
        latestDeparture: new Date('2025-07-20'),
        min_duration: 3,
        max_duration: 7,
        budget: 500,
        max_price: 600,
        auto_book_enabled: false,
        nonstop_required: false,
        baggage_included_required: false,
        preferred_payment_method_id: null
      };

      console.log('Creating test trip with data:', testFormData);
      const newTrip = await createTripRequest(user.id, testFormData);
      console.log('Created trip:', newTrip);
      setTripId(newTrip.id);
    } catch (error) {
      console.error('Error creating test trip:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Flight Search Debug Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>Trip ID:</strong> {tripId || 'None'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Refreshing:</strong> {isRefreshing ? 'Yes' : 'No'}</p>
            <p><strong>Has Error:</strong> {hasError ? 'Yes' : 'No'}</p>
            <p><strong>Error Message:</strong> {errorMessage || 'None'}</p>
            <p><strong>Offers Count:</strong> {offers.length}</p>
          </div>
          
          <div className="space-x-2">
            <Button 
              onClick={createTestTrip} 
              disabled={isCreating || !user}
            >
              {isCreating ? 'Creating...' : 'Create Test Trip'}
            </Button>
            
            <Button 
              onClick={refreshOffers} 
              disabled={!tripId || isLoading || isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Offers'}
            </Button>
          </div>

          {tripDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre>{JSON.stringify(tripDetails, null, 2)}</pre>
              </CardContent>
            </Card>
          )}

          {offers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Flight Offers ({offers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <pre>{JSON.stringify(offers.slice(0, 3), null, 2)}</pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestFlightSearch;

