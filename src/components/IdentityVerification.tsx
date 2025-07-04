import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface VerificationSession {
  id: string;
  client_secret: string;
  url: string;
  status: 'requires_input' | 'processing' | 'verified' | 'requires_action' | 'canceled';
  verified_outputs?: {
    document?: {
      type: string;
      number: string;
      issuing_country: string;
      expiration_date?: string;
    };
    id_number?: {
      type: string;
      value: string;
    };
    selfie?: {
      status: string;
    };
  };
  last_error?: {
    code: string;
    reason: string;
  };
}

interface IdentityVerificationProps {
  purpose?: 'identity_document' | 'address' | 'fraud_prevention';
  high_value_booking?: boolean;
  campaign_id?: string;
  onVerificationComplete?: (verified: boolean) => void;
  className?: string;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  purpose = 'identity_document',
  high_value_booking = false,
  campaign_id,
  onVerificationComplete,
  className = ''
}) => {
  const user = useUser();
  const supabase = useSupabaseClient();
  
  const [verificationSession, setVerificationSession] = useState<VerificationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [isVerificationRequired, setIsVerificationRequired] = useState<boolean | null>(null);

  const returnUrl = `${window.location.origin}/verification-complete`;

  // Check if verification is required on component mount
  useEffect(() => {
    if (user) {
      checkVerificationRequirement();
    }
  }, [user, high_value_booking, campaign_id]);

  const checkVerificationRequirement = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { data, error } = await supabase.functions.invoke('identity-verification', {
        method: 'POST',
        body: {
          return_url: returnUrl,
          purpose,
          high_value_booking,
          campaign_id
        }
      });

      if (error) throw error;

      if (data.verification_required === false) {
        setIsVerificationRequired(false);
        onVerificationComplete?.(true);
        return;
      }

      setIsVerificationRequired(true);
      if (data.verification_session) {
        setVerificationSession(data.verification_session);
      }

    } catch (err: any) {
      console.error('Error checking verification requirement:', err);
      setError(err.message || 'Failed to check verification requirement');
    } finally {
      setIsLoading(false);
    }
  };

  const createVerificationSession = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { data, error } = await supabase.functions.invoke('identity-verification', {
        method: 'POST',
        body: {
          return_url: returnUrl,
          purpose,
          high_value_booking,
          campaign_id
        }
      });

      if (error) throw error;

      if (data.verification_session) {
        setVerificationSession(data.verification_session);
      }

    } catch (err: any) {
      console.error('Error creating verification session:', err);
      setError(err.message || 'Failed to create verification session');
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async (sessionId?: string) => {
    try {
      setIsLoading(true);
      setError('');

      const url = sessionId 
        ? `identity-verification?session_id=${sessionId}`
        : 'identity-verification';

      const { data, error } = await supabase.functions.invoke(url, {
        method: 'GET'
      });

      if (error) throw error;

      if (sessionId && data.verification_session) {
        setVerificationSession(data.verification_session);
        setVerificationStatus(data.verification_session.status);
        
        if (data.verification_session.status === 'verified') {
          onVerificationComplete?.(true);
        }
      } else if (data.is_verified !== undefined) {
        setVerificationStatus(data.is_verified ? 'verified' : 'pending');
        onVerificationComplete?.(data.is_verified);
      }

    } catch (err: any) {
      console.error('Error checking verification status:', err);
      setError(err.message || 'Failed to check verification status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationRedirect = () => {
    if (verificationSession?.url) {
      // Open verification in new tab/window
      const verificationWindow = window.open(
        verificationSession.url,
        'stripe-verification',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Poll for completion
      const pollForCompletion = setInterval(() => {
        if (verificationWindow?.closed) {
          clearInterval(pollForCompletion);
          // Check status after user closes verification window
          setTimeout(() => {
            checkVerificationStatus(verificationSession.id);
          }, 1000);
        }
      }, 1000);

      // Auto-check status after 30 seconds if window still open
      setTimeout(() => {
        clearInterval(pollForCompletion);
        checkVerificationStatus(verificationSession.id);
      }, 30000);
    }
  };

  const getStatusDisplay = () => {
    if (!verificationSession) return null;

    const status = verificationSession.status;
    const colors = {
      requires_input: 'text-blue-600 bg-blue-50',
      processing: 'text-yellow-600 bg-yellow-50',
      verified: 'text-green-600 bg-green-50',
      requires_action: 'text-orange-600 bg-orange-50',
      canceled: 'text-gray-600 bg-gray-50'
    };

    const messages = {
      requires_input: 'Verification required - please complete identity check',
      processing: 'Verification in progress - please wait',
      verified: 'Identity successfully verified ✓',
      requires_action: 'Additional action required',
      canceled: 'Verification was canceled'
    };

    return (
      <div className={`px-3 py-2 rounded-md text-sm font-medium ${colors[status]}`}>
        {messages[status]}
      </div>
    );
  };

  const getErrorDisplay = () => {
    if (!verificationSession?.last_error) return null;

    return (
      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
        <div className="text-sm text-red-600">
          <strong>Verification Error:</strong> {verificationSession.last_error.reason}
        </div>
        <div className="text-xs text-red-500 mt-1">
          Code: {verificationSession.last_error.code}
        </div>
      </div>
    );
  };

  // Don't render if verification is not required
  if (isVerificationRequired === false) {
    return null;
  }

  if (!user) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-600">Please log in to verify your identity.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              Identity Verification Required
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {purpose === 'identity_document' && 'We need to verify your identity document for this booking.'}
              {purpose === 'address' && 'We need to verify your address for this booking.'}
              {purpose === 'fraud_prevention' && 'Additional verification is required for security purposes.'}
            </p>
            {high_value_booking && (
              <p className="mt-1 text-xs text-orange-600">
                High-value booking requires identity verification
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {verificationSession && (
          <div className="mt-4 space-y-3">
            {getStatusDisplay()}
            {getErrorDisplay()}
            
            {verificationSession.status === 'requires_input' && (
              <div className="space-y-3">
                <button
                  onClick={handleVerificationRedirect}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting Verification...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Identity Verification
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  This will open a secure verification window. Please have your ID document ready.
                </p>
              </div>
            )}

            {verificationSession.status === 'processing' && (
              <div className="text-center py-4">
                <div className="inline-flex items-center text-sm text-gray-600">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing verification...
                </div>
                <button
                  onClick={() => checkVerificationStatus(verificationSession.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Check Status
                </button>
              </div>
            )}

            {verificationSession.status === 'verified' && verificationSession.verified_outputs && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="text-sm text-green-600">
                  <strong>Verification Complete!</strong>
                  {verificationSession.verified_outputs.document && (
                    <div className="mt-2 text-xs">
                      Document: {verificationSession.verified_outputs.document.type} from {verificationSession.verified_outputs.document.issuing_country}
                    </div>
                  )}
                </div>
              </div>
            )}

            {verificationSession.status === 'requires_action' && (
              <button
                onClick={handleVerificationRedirect}
                className="w-full px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Complete Additional Verification Steps
              </button>
            )}
          </div>
        )}

        {!verificationSession && isVerificationRequired && (
          <div className="mt-4">
            <button
              onClick={createVerificationSession}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Begin Identity Verification'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Help section */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">What you'll need:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Government-issued photo ID (passport, driver's license, or national ID)</li>
          <li>• Good lighting and camera access</li>
          <li>• 2-3 minutes to complete</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          Your information is securely processed by Stripe and deleted after verification.
        </p>
      </div>
    </div>
  );
};

export default IdentityVerification;
