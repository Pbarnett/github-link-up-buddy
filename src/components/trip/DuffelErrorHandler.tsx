
/**
 * @file Enhanced error handling component for Duffel API operations
 * Provides user-friendly error messages and recovery options
 */

type FC<T = {}> = React.FC<T>;

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import * as React from 'react';

export interface DuffelError {
  type: 'search' | 'booking' | 'payment' | 'network' | 'api' | 'validation';
  message: string;
  details?: string;
  code?: string;
  retryable?: boolean;
}

interface DuffelErrorHandlerProps {
  error: DuffelError;
  onRetry?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const DuffelErrorHandler: FC<DuffelErrorHandlerProps> = ({
  error,
  onRetry,
  onCancel,
  className
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'search':
        return <AlertCircle className="h-4 w-4" />;
      case 'booking':
        return <AlertCircle className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'network':
        return <Wifi className="h-4 w-4" />;
      case 'api':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'search':
        return 'Flight Search Error';
      case 'booking':
        return 'Booking Error';
      case 'payment':
        return 'Payment Error';
      case 'network':
        return 'Connection Error';
      case 'api':
        return 'Service Temporarily Unavailable';
      case 'validation':
        return 'Invalid Information';
      default:
        return 'Error';
    }
  };

  const getUserFriendlyMessage = () => {
    // Map common error messages to user-friendly versions
    const message = error.message.toLowerCase();
    
    if (message.includes('expired') || message.includes('no longer available')) {
      return 'This flight offer has expired. Please search for new flights to see current availability and pricing.';
    }
    
    if (message.includes('network') || message.includes('timeout')) {
      return 'We\'re having trouble connecting to our flight search service. Please check your connection and try again.';
    }
    
    if (message.includes('payment') || message.includes('card')) {
      return 'There was an issue processing your payment. Please check your payment information and try again.';
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return 'Please check that all required information is correctly filled out and try again.';
    }
    
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'We\'re experiencing high demand. Please wait a moment and try again.';
    }
    
    // Default to original message for unrecognized errors
    return error.message;
  };

  const getRecoveryActions = () => {
    const actions = [];
    
    if (error.retryable !== false && onRetry) {
      actions.push(
        <Button
          key="retry"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-3 w-3" />
          Try Again
        </Button>
      );
    }
    
    if (error.type === 'search') {
      actions.push(
        <Button
          key="newsearch"
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          New Search
        </Button>
      );
    }
    
    if (onCancel) {
      actions.push(
        <Button
          key="cancel"
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      );
    }
    
    return actions;
  };

  return (
    <Alert variant="destructive" className={className}>
      {getErrorIcon()}
      <AlertTitle>{getErrorTitle()}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-3">
          <p>{getUserFriendlyMessage()}</p>
          
          {error.details && (
            <details className="text-xs opacity-75">
              <summary className="cursor-pointer">Technical Details</summary>
              <p className="mt-1 font-mono">{error.details}</p>
              {error.code && <p className="mt-1">Error Code: {error.code}</p>}
            </details>
          )}
          
          {getRecoveryActions().length > 0 && (
            <div className="flex gap-2 pt-2">
              {getRecoveryActions()}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DuffelErrorHandler;
