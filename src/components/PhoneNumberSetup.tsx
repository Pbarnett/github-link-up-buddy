import { createBrowserClient } from '@supabase/ssr';
import * as React from 'react';
interface PhoneNumberSetupProps {
  userId?: string;
  onPhoneVerified?: () => void;
  className?: string;
}

 
export function PhoneNumberSetup({ userId: _userId, onPhoneVerified, className = '' }: PhoneNumberSetupProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  const loadExistingPhone = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.phone) {
        setPhoneNumber(user.user_metadata.phone);
        setIsVerified(user.user_metadata.phone_verified || false);
      }
    } catch (error) {
      console.error('Error loading phone number:', error);
    }
  }, [supabase]);

  useEffect(() => {
    loadExistingPhone();
  }, [loadExistingPhone]);

  function formatPhoneNumber(value: string) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as US phone number
    if (digits.length >= 10) {
      const country = digits.length === 11 && digits[0] === '1' ? '1' : '';
      const area = digits.slice(country.length, country.length + 3);
      const middle = digits.slice(country.length + 3, country.length + 6);
      const last = digits.slice(country.length + 6, country.length + 10);
      
      return `+${country || '1'} (${area}) ${middle}-${last}`.trim();
    }
    
    return `+1 ${digits}`;
  }

  function normalizePhoneNumber(value: string) {
    // Convert to E.164 format for storage
    const digits = value.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+${digits}`;
    }
    return `+${digits}`;
  }

  async function updatePhoneNumber() {
    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      
      // Update user metadata with phone number
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          phone: normalizedPhone,
          phone_verified: false
        }
      });

      if (updateError) throw updateError;

      // Send verification SMS
      await sendVerificationSMS(normalizedPhone);
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to update phone number');
    } finally {
      setLoading(false);
    }
  }

  async function sendVerificationSMS(phone: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate a simple verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code in user metadata temporarily
      await supabase.auth.updateUser({
        data: { verification_code: code }
      });

      // Send SMS via our SMS function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'phone_verification',
          user_id: user.id,
          phone_number: phone,
          data: {
            verification_code: code
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send verification SMS');
      }

      setIsVerifying(true);
      setSuccess('Verification code sent! Check your phone.');
      
    } catch (error: unknown) {
      console.error('SMS send error:', error);
      setError('Failed to send verification code. Please try again.');
    }
  }

  async function verifyCode() {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const storedCode = user?.user_metadata?.verification_code;

      if (verificationCode === storedCode) {
        // Mark phone as verified
        await supabase.auth.updateUser({
          data: { 
            phone_verified: true,
            verification_code: null // Clear the code
          }
        });

        setIsVerified(true);
        setIsVerifying(false);
        setSuccess('Phone number verified successfully!');
        onPhoneVerified?.();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  if (isVerified) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className="text-green-600">✅</span>
          <span className="text-green-800 font-medium">Phone Verified</span>
        </div>
        <p className="text-green-700 text-sm mt-1">{phoneNumber}</p>
        <button
          onClick={() => {
            setIsVerified(false);
            setPhoneNumber('');
          }}
          className="text-green-600 text-sm underline mt-2"
        >
          Change phone number
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📱 SMS Notifications
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add your phone number to receive booking confirmations and important updates via SMS.
        </p>
      </div>

      {!isVerifying ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber((e.target as HTMLInputElement).value))}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={18}
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send a verification code to this number
            </p>
          </div>

          <button
            onClick={updatePhoneNumber}
            disabled={loading || !phoneNumber}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={verifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            <button
              onClick={() => {
                setIsVerifying(false);
                setVerificationCode('');
                setError('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
          </div>

          <button
            onClick={() => sendVerificationSMS(normalizePhoneNumber(phoneNumber))}
            disabled={loading}
            className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Resend Code
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}
    </div>
  );
}
