/**
 * Test-only booking page that bypasses authentication
 * This page is used exclusively for E2E testing to avoid auth complexities
 */

import * as React from 'react';
import { useEffect } from 'react';
import { SecureFlightBooking } from '@/components/booking/SecureFlightBooking';

// Mock the useSecureOAuth hook for testing
const mockAuthData = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User'
    }
  },
  session: {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token'
  },
  loading: false,
  error: null
};

const TestBooking: React.FC = () => {
  // Only render in test environment
  if (process.env.NODE_ENV === 'production') {
    return <div>This page is not available in production</div>;
  }

  // Mock Supabase auth for testing
  useEffect(() => {
    // Override the useSecureOAuth hook globally for this component tree
    (window as any).__TEST_AUTH_OVERRIDE__ = mockAuthData;
    
    return () => {
      delete (window as any).__TEST_AUTH_OVERRIDE__;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Flight Booking</h1>
          <p className="text-gray-600 mt-2">
            This is a test-only page for E2E testing - authentication is bypassed
          </p>
        </div>
        
        <SecureFlightBooking
          onBookingComplete={(bookingRef, flight) => {
            console.log('Test booking completed:', bookingRef, flight);
          }}
          onError={(error) => {
            console.error('Test booking error:', error);
          }}
        />
      </div>
    </div>
  );
};

export default TestBooking;
