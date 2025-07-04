import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component

const TripOffersV2Skeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-6 w-1/6" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex space-x-2 pt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOffersV2Skeleton;
