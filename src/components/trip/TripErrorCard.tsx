
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, PlaneTakeoff } from 'lucide-react';

type TripErrorCardProps = {
  message?: string;
};

export default function TripErrorCard({ message = "We couldn't load your trip offers" }: TripErrorCardProps) {
  const navigate = useNavigate();

  // Identify common error types and provide more specific guidance
  const getErrorHint = (errorMessage: string): string => {
    if (errorMessage.toLowerCase().includes("no trip data")) {
      return "The trip request could not be found. Try creating a new trip request.";
    }
    
    if (errorMessage.toLowerCase().includes("token") || 
        errorMessage.toLowerCase().includes("api") ||
        errorMessage.toLowerCase().includes("amadeus")) {
      return "There was an issue connecting to the flight search service. This might be temporary - please try again.";
    }
    
    if (errorMessage.toLowerCase().includes("no offers")) {
      return "No flight offers were found for your search criteria. Try adjusting your budget, date range, or airports.";
    }
    
    return "You can try reloading the page or creating a new trip request with different criteria.";
  };
  
  const errorHint = getErrorHint(message);

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle>Error Loading Trip Offers</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-2">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {errorHint}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button 
          onClick={() => navigate('/trip/new')}
          className="flex items-center gap-2"
        >
          <PlaneTakeoff size={16} />
          New Trip
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </Button>
      </CardFooter>
    </Card>
  );
}
