import { createClient } from '@supabase/supabase-js';
import * as React from 'react';
import { PhoneNumberSetup } from './PhoneNumberSetup';
interface NotificationPreferences {
  booking_confirmations: { email: boolean; sms: boolean };
  booking_failures: { email: boolean; sms: boolean };
  flight_reminders: { email: boolean; sms: boolean };
  price_alerts: { email: boolean; sms: boolean };
  marketing: { email: boolean; sms: boolean };
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  booking_confirmations: { email: true, sms: false },
  booking_failures: { email: true, sms: true },
  flight_reminders: { email: true, sms: false },
  price_alerts: { email: true, sms: false },
  marketing: { email: false, sms: false },
};

const NOTIFICATION_TYPES = [
  {
    id: 'booking_confirmations' as keyof NotificationPreferences,
    label: 'Booking Confirmations',
    description: 'Flight booking confirmations and receipts',
    critical: true,
  },
  {
    id: 'booking_failures' as keyof NotificationPreferences,
    label: 'Booking Issues',
    description: 'Important notifications about booking problems',
    critical: true,
  },
  {
    id: 'flight_reminders' as keyof NotificationPreferences,
    label: 'Flight Reminders',
    description: 'Reminders before your upcoming flights',
    critical: false,
  },
  {
    id: 'price_alerts' as keyof NotificationPreferences,
    label: 'Price Alerts',
    description: 'Notifications when flight prices drop',
    critical: false,
  },
  {
    id: 'marketing' as keyof NotificationPreferences,
    label: 'Promotions & Deals',
    description: 'Special offers and travel deals',
    critical: false,
  },
];

const CHANNELS = [
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'sms', label: 'SMS', icon: '📱' },
];

export function NotificationPreferences() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  const loadPreferences = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Load preferences from user metadata
        const userPrefs = user.user_metadata?.notification_preferences;
        if (userPrefs) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...userPrefs });
        }

        // Check phone number status
        setHasPhoneNumber(!!user.user_metadata?.phone);
        setPhoneVerified(user.user_metadata?.phone_verified || false);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  async function savePreferences() {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { notification_preferences: preferences },
      });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: unknown) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function updatePreference(
    type: keyof NotificationPreferences,
    channel: 'email' | 'sms',
    enabled: boolean
  ) {
    setPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: enabled,
      },
    }));
  }

  function onPhoneVerified() {
    setHasPhoneNumber(true);
    setPhoneVerified(true);
    // Reload preferences to get updated user data
    loadPreferences();
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Notification Preferences
        </h2>
        <p className="text-gray-600">
          Choose how you'd like to receive notifications about your flights and
          account.
        </p>
      </div>

      {/* Phone Number Setup */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <PhoneNumberSetup onPhoneVerified={onPhoneVerified} />
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Communication Preferences
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Control which notifications you receive and how you receive them.
            </p>
          </div>

          <div className="space-y-4">
            {NOTIFICATION_TYPES.map(type => (
              <div
                key={type.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {type.label}
                      </h4>
                      {type.critical && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {CHANNELS.map(channel => (
                    <label
                      key={channel.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={
                          preferences[type.id][channel.id as 'email' | 'sms']
                        }
                        disabled={
                          (type.critical && channel.id === 'email') || // Email required for critical
                          (channel.id === 'sms' && !phoneVerified) // SMS requires verified phone
                        }
                        onChange={e =>
                          updatePreference(
                            type.id,
                            channel.id as 'email' | 'sms',
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{channel.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {channel.label}
                        </span>
                        {channel.id === 'sms' && !phoneVerified && (
                          <span className="text-xs text-gray-500">
                            (phone verification required)
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* SMS Notice */}
          {!hasPhoneNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-xl">📱</span>
                <div>
                  <h4 className="font-medium text-blue-900">
                    Enable SMS Notifications
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Add your phone number above to receive important booking
                    updates via SMS.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              {saved && (
                <>
                  <span className="text-green-600">✅</span>
                  <span className="text-sm text-green-700 font-medium">
                    Preferences saved successfully!
                  </span>
                </>
              )}
            </div>

            <button
              onClick={savePreferences}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>

      {/* Current Status Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Setup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">
                Active for all important updates
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">
                {phoneVerified
                  ? 'Active for selected notifications'
                  : hasPhoneNumber
                    ? 'Phone number pending verification'
                    : 'Add phone number to enable'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
