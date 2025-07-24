// Privacy-first consent management for personalization features
// Based on GDPR/CCPA compliance requirements

type FC<T = {}> = React.FC<T>;

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ConsentPreferences {
  personalization: boolean;
  analytics: boolean;
  marketing: boolean;
  functionalCookies: boolean;
  timestamp: Date;
  version: string;
}

interface ConsentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: ConsentPreferences) => void;
  currentPreferences?: ConsentPreferences;
  mode?: 'banner' | 'settings';
}

const DEFAULT_PREFERENCES: ConsentPreferences = {
  personalization: false,
  analytics: false,
  marketing: false,
  functionalCookies: true, // Required for basic functionality
  timestamp: new Date(),
  version: '1.0',
};

export const ConsentManager: FC<ConsentManagerProps> = ({
  isOpen,
  onClose,
  onSave,
  currentPreferences = DEFAULT_PREFERENCES,
  mode = 'banner',
}) => {
  const [preferences, setPreferences] =
    useState<ConsentPreferences>(currentPreferences);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setPreferences(currentPreferences);
  }, [currentPreferences]);

  const handleSave = () => {
    const updatedPreferences = {
      ...preferences,
      timestamp: new Date(),
      version: '1.0',
    };
    onSave(updatedPreferences);
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      ...preferences,
      personalization: true,
      analytics: true,
      marketing: true,
      functionalCookies: true,
      timestamp: new Date(),
      version: '1.0',
    };
    onSave(allAccepted);
    onClose();
  };

  const handleDeclineAll = () => {
    const allDeclined = {
      ...preferences,
      personalization: false,
      analytics: false,
      marketing: false,
      functionalCookies: true, // Keep functional cookies
      timestamp: new Date(),
      version: '1.0',
    };
    onSave(allDeclined);
    onClose();
  };

  const updatePreference = (key: keyof ConsentPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (mode === 'banner') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              Parker Flight values your privacy
            </DialogTitle>
            <DialogDescription>
              We'd like to personalize your experience with your permission. We
              only use your data to serve you better.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Privacy-friendly banner message */}
            <Card className="border-blue-100 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      We respect your privacy
                    </h3>
                    <p className="text-sm text-blue-800 mb-3">
                      Parker Flight uses minimal data (just your first name and
                      upcoming destination) to create personalized greetings and
                      improve your experience.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        GDPR Compliant
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Data Minimization
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick consent options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAcceptAll}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plane className="h-4 w-4 mr-2" />
                Yes, personalize my experience
              </Button>
              <Button
                onClick={handleDeclineAll}
                variant="outline"
                className="flex-1"
              >
                No, keep it generic
              </Button>
            </div>

            {/* Advanced options */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-600 hover:text-gray-800"
              >
                <Settings className="h-4 w-4 mr-1" />
                Manage preferences
              </Button>
            </div>

            {showDetails && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Privacy Preferences</CardTitle>
                  <CardDescription>
                    Control how Parker Flight uses your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConsentToggle
                    title="Personalization"
                    description="Use your name and trip details for personalized greetings"
                    enabled={preferences.personalization}
                    onChange={value =>
                      updatePreference('personalization', value)
                    }
                    required={false}
                  />
                  <ConsentToggle
                    title="Analytics"
                    description="Help us improve the service by analyzing how you use the app"
                    enabled={preferences.analytics}
                    onChange={value => updatePreference('analytics', value)}
                    required={false}
                  />
                  <ConsentToggle
                    title="Functional Cookies"
                    description="Essential for the app to work properly"
                    enabled={preferences.functionalCookies}
                    onChange={value =>
                      updatePreference('functionalCookies', value)
                    }
                    required={true}
                  />
                  <ConsentToggle
                    title="Marketing"
                    description="Receive personalized offers and travel recommendations"
                    enabled={preferences.marketing}
                    onChange={value => updatePreference('marketing', value)}
                    required={false}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      Save Preferences
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy policy link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Settings mode - full preferences panel
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Privacy Preferences
        </CardTitle>
        <CardDescription>
          Control how Parker Flight uses your data to personalize your
          experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ConsentToggle
          title="Personalization"
          description="Use your name and trip details for personalized greetings and recommendations"
          enabled={preferences.personalization}
          onChange={value => updatePreference('personalization', value)}
          required={false}
        />
        <ConsentToggle
          title="Analytics & Improvement"
          description="Help us improve the service by analyzing how you use the app (anonymized)"
          enabled={preferences.analytics}
          onChange={value => updatePreference('analytics', value)}
          required={false}
        />
        <ConsentToggle
          title="Marketing Communications"
          description="Receive personalized offers, travel tips, and destination recommendations"
          enabled={preferences.marketing}
          onChange={value => updatePreference('marketing', value)}
          required={false}
        />
        <ConsentToggle
          title="Functional Cookies"
          description="Essential cookies required for the app to work properly"
          enabled={preferences.functionalCookies}
          onChange={value => updatePreference('functionalCookies', value)}
          required={true}
        />

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Your rights:</strong> You can change these preferences at
            any time, request your data, or ask us to delete your account.
          </p>
          <p>
            <strong>Data retention:</strong> Personal data is kept only as long
            as needed for personalization. Analytics data is anonymized after 1
            year.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface ConsentToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  required: boolean;
}

const ConsentToggle: FC<ConsentToggleProps> = ({
  title,
  description,
  enabled,
  onChange,
  required,
}) => {
  return (
    <div className="flex items-start justify-between space-x-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {required && (
            <Badge variant="secondary" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onChange}
        disabled={required}
        className="mt-1"
      />
    </div>
  );
};

export default ConsentManager;
