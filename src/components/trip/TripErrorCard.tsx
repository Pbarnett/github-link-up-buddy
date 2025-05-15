
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const TripErrorCard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Error</CardTitle>
          <CardDescription>No trip ID provided</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please submit a trip request to view offers.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripErrorCard;
