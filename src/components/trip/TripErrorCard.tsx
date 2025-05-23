
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

type TripErrorCardProps = {
  message?: string;
};

export default function TripErrorCard({ message = "We couldn't load your trip offers" }: TripErrorCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle>Error Loading Trip Offers</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p>{message}</p>
        <p className="text-sm text-muted-foreground mt-2">
          You can try reloading the page or creating a new trip request.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button onClick={() => navigate('/trip/new')}>New Trip</Button>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </CardFooter>
    </Card>
  );
}
