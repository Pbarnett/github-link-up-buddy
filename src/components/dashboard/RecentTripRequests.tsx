
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmptyState from './EmptyState';
import { TripRequest } from '@/hooks/useDashboardData';

type Props = {
  tripRequests: TripRequest[];
};

export default function RecentTripRequests({ tripRequests }: Props) {
  return (
    <Card className="shadow-[0_2px_8px_rgba(40,72,100,0.06)] transition-all hover:shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle>Recent Trip Requests</CardTitle>
        <CardDescription>Your latest trip searches and requests</CardDescription>
      </CardHeader>
      <CardContent>
        {tripRequests.length === 0 ? (
          <EmptyState>
            <div className="mb-1 text-gray-600 font medium">
              No trip requests yet
            </div>
            <div className="text-xs text-muted-foreground">Create a trip request to get started!</div>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {tripRequests.map((trip) => (
              <div
                key={trip.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-white animate-fade-in"
              >
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
                  <Badge variant="outline" className="bg-muted/40">
                    {new Date(trip.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
