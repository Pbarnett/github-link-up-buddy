/**
 * @file Test page for validating Duffel integration components
 * Battle-tested approach: Build and test incrementally
 */

type FC<T = {}> = React.FC<T>;

import type { User } from '@supabase/supabase-js';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { TestTube, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useDuffelFlights from '@/hooks/useDuffelFlights';
import DuffelBookingCard from '@/components/trip/DuffelBookingCard';
import OfferExpirationTimer from '@/components/trip/OfferExpirationTimer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DuffelErrorHandler, {
  DuffelError,
} from '@/components/trip/DuffelErrorHandler';
import { DuffelTraveler } from '@/services/api/duffelBookingApi';
import { supabase } from '@/integrations/supabase/client';

const DuffelTest: FC = () => {
  // Authentication state
  const [, setUser] = useState<User | null>(null);
  const [, setIsAuthenticating] = useState(false);

  // Test state
  const [tripRequestId, setTripRequestId] = useState('');
  const [testTraveler] = useState<DuffelTraveler>({
    type: 'adult',
    title: 'mr',
    given_name: 'Test',
    family_name: 'User',
    born_on: '1990-01-01',
    gender: 'male',
    email: 'test@example.com',
    phone_number: '+1234567890',
  });

  // Check authentication status on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with test credentials (currently unused but kept for future functionality)

  const _signIn = async () => {
    setIsAuthenticating(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123',
      });

      if (error) {
        console.error('Sign in error:', error);
        alert('Sign in failed: ' + error.message);
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      alert('Sign in failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign out (currently unused but kept for future functionality)

  const _signOut = async () => {
    await supabase.auth.signOut();
  };

  // Duffel flights hook
  const {
    offers,
    isLoading,
    error,
    searchFlights,
    clearResults,
    searchResponse,
    offersCount,
    searchSuccess,
  } = useDuffelFlights(tripRequestId, { autoSearch: false });

  const handleSearch = async () => {
    if (!tripRequestId.trim()) {
      alert('Please enter a trip request ID');
      return;
    }

    await searchFlights({
      maxPrice: 1000,
      cabinClass: 'economy',
      maxResults: 10,
    });
  };

  const handleClear = () => {
    clearResults();
    setTripRequestId('');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Flight Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6" />
            Duffel Flight Search
          </CardTitle>
          <p className="text-muted-foreground">
            Search and book flights with real-time pricing from Duffel
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6" />
            Duffel Integration Test Page
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Test Flight Search</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tripRequestId">Trip Request ID</Label>
                <Input
                  id="tripRequestId"
                  placeholder="Enter a valid trip request ID"
                  value={tripRequestId}
                  onChange={e =>
                    setTripRequestId((e.target as HTMLInputElement).value)
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search Duffel Flights'
                )}
              </Button>

              <Button variant="outline" onClick={handleClear}>
                Clear Results
              </Button>
            </div>
          </div>

          {/* Search Status */}
          {searchResponse && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">2. Search Results</h3>

              <Alert variant={searchSuccess ? 'default' : 'destructive'}>
                {searchSuccess ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {searchSuccess ? (
                    <>
                      ✅ Search successful! Found {searchResponse.offersFound}{' '}
                      offers, inserted {searchResponse.inserted} into database.
                    </>
                  ) : (
                    <>❌ Search failed: {error || 'Unknown error'}</>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>Error: {error}</AlertDescription>
            </Alert>
          )}

          {/* Offers Display */}
          {offersCount > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                3. Flight Offers ({offersCount} found)
              </h3>

              <div className="grid gap-4">
                {offers.slice(0, 3).map(offer => (
                  <Card key={offer.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Flight:</span>
                        <p>
                          {offer.airline_code} {offer.flight_number}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Route:</span>
                        <p>
                          {offer.origin_airport} → {offer.destination_airport}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Price:</span>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: offer.currency || 'USD',
                            }).format(offer.price)}
                          </p>
                          {offer.expires_at && (
                            <OfferExpirationTimer
                              expiresAt={offer.expires_at}
                              className="text-xs"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {offers.length > 3 && (
                  <p className="text-gray-600 text-center">
                    ... and {offers.length - 3} more offers
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Booking Test */}
          {offers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">4. Test Booking Flow</h3>
              <p className="text-gray-600">
                Click "Test Booking" to validate the booking component with the
                first offer:
              </p>

              <DuffelBookingCard
                offer={offers[0]}
                traveler={testTraveler}
                onBookingComplete={result => {
                  console.log('Booking completed:', result);
                  alert('Booking test completed! Check console for details.');
                }}
                onBookingError={error => {
                  console.error('Booking error:', error);
                  alert(`Booking test failed: ${error}`);
                }}
              />
            </div>
          )}

          {/* Instructions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Testing Instructions</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Step 1:</strong> Enter a valid trip request ID from your
                database
              </p>
              <p>
                <strong>Step 2:</strong> Click "Search Duffel Flights" to test
                the search integration
              </p>
              <p>
                <strong>Step 3:</strong> Review the search results and offers
                returned
              </p>
              <p>
                <strong>Step 4:</strong> Test the booking flow with the first
                offer (uses test data)
              </p>
              <p>
                <strong>Note:</strong> This page is for development testing only
                and should not be accessible in production.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DuffelTest;
