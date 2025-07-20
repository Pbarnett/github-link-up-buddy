import * as React from 'react';
const { useState, useEffect } = React;

import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface SocialProofData {
  totalTrips: number;
  avgSavings: number;
  activeUsers: number;
  recentBookings: number;
}

export const DynamicSocialProof = () => {
  const { user } = useCurrentUser();
  const [proofData, setProofData] = useState<SocialProofData>({
    totalTrips: 7412,
    avgSavings: 247,
    activeUsers: 2400,
    recentBookings: 156,
  });

  // Simulate dynamic data (in real app, this would come from API)
  useEffect(() => {
    const updateProof = () => {
      setProofData(prev => ({
        ...prev,
        recentBookings: Math.floor(Math.random() * 20) + 150,
        totalTrips: prev.totalTrips + Math.floor(Math.random() * 3),
      }));
    };

    const interval = setInterval(updateProof, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSocialProofText = () => {
    if (user) {
      // Personalized for logged-in users
      return {
        primary: `Welcome back! Ready for your next adventure?`,
        secondary: `Join ${proofData.activeUsers.toLocaleString()}+ smart travelers`,
        metric: `${proofData.recentBookings} trips auto-booked this week`
      };
    } else {
      // Marketing for anonymous users
      return {
        primary: `${proofData.totalTrips.toLocaleString()} trips auto-booked and counting`,
        secondary: `Average savings: $${proofData.avgSavings} per trip`,
        metric: `${proofData.recentBookings} bookings in the last 24 hours`
      };
    }
  };

  const proofText = getSocialProofText();

  return (
    <div className="text-center space-y-2">
      <p className="text-sm font-medium text-gray-900">
        {proofText.primary}
      </p>
      <p className="text-xs text-gray-600">
        {proofText.secondary}
      </p>
      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
        <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        {proofText.metric}
      </Badge>
    </div>
  );
};
