/**
 * @file Offer expiration countdown timer component
 * Handles the 5-20 minute validity window for Duffel flight offers
 */

import * as React from 'react';
import { FC } from 'react';
import { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface OfferExpirationTimerProps {
  expiresAt?: string;
  onExpired?: () => void;
  className?: string;
}

export const OfferExpirationTimer: FC<OfferExpirationTimerProps> = ({
  expiresAt,
  onExpired,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        onExpired?.();
        return;
      }

      setTimeLeft(difference);
      setIsExpired(false);
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  if (!expiresAt || timeLeft === null) {
    return null;
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVariant = () => {
    if (isExpired) return 'destructive';
    if (timeLeft < 5 * 60 * 1000) return 'destructive'; // Less than 5 minutes
    if (timeLeft < 10 * 60 * 1000) return 'secondary'; // Less than 10 minutes
    return 'outline'; // More than 10 minutes
  };

  const getIcon = () => {
    if (isExpired || timeLeft < 5 * 60 * 1000) {
      return <AlertTriangle className="h-3 w-3" />;
    }
    return <Clock className="h-3 w-3" />;
  };

  const getText = () => {
    if (isExpired) return 'Expired';
    return `${formatTime(timeLeft)} left`;
  };

  return (
    <Badge
      variant={getVariant()}
      className={`flex items-center gap-1 ${className}`}
    >
      {getIcon()}
      {getText()}
    </Badge>
  );
};

export default OfferExpirationTimer;
