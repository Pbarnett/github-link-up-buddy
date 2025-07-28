type FC<T = {}> = React.FC<T>;

import * as React from 'react';
import { DatabaseOperations } from '@/lib/supabase/database-operations';
import { useUser } from '@/lib/auth/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CalendarIcon,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Plane,
  PlaneTakeoff,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  Wifi,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  ProfileCompletenessIndicator,
  ProfileCompletenessData,
  ProfileField,
} from './ProfileCompletenessIndicator';

interface ProfileCompletenessConnectedProps {
  onFieldClick?: (fieldId: string) => void;
  showFieldList?: boolean;
  compact?: boolean;
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface DatabaseProfileCompleteness {
  completionPercentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
}

// Map database field names to UI-friendly labels and categories
const FIELD_METADATA: Record<
  string,
  {
    label: string;
    category: 'basic' | 'contact' | 'travel' | 'payment' | 'verification';
    required: boolean;
    description?: string;
  }
> = {
  firstName: {
    label: 'First Name',
    category: 'basic',
    required: true,
    description: 'Your legal first name as it appears on travel documents',
  },
  lastName: {
    label: 'Last Name',
    category: 'basic',
    required: true,
    description: 'Your legal last name as it appears on travel documents',
  },
  dateOfBirth: {
    label: 'Date of Birth',
    category: 'basic',
    required: true,
    description: 'Required for age verification and travel bookings',
  },
  nationality: {
    label: 'Nationality',
    category: 'basic',
    required: true,
    description: 'Your citizenship for visa and travel requirements',
  },
  phoneNumber: {
    label: 'Phone Number',
    category: 'contact',
    required: true,
    description: 'For booking confirmations and emergency contact',
  },
  email: {
    label: 'Email Address',
    category: 'contact',
    required: true,
    description: 'Primary contact for bookings and notifications',
  },
  address: {
    label: 'Home Address',
    category: 'contact',
    required: false,
    description: 'For billing and emergency contact purposes',
  },
  passportNumber: {
    label: 'Passport Number',
    category: 'travel',
    required: true,
    description: 'Required for international travel bookings',
  },
  passportExpiry: {
    label: 'Passport Expiry',
    category: 'travel',
    required: true,
    description: 'Ensure your passport is valid for travel dates',
  },
  travelPreferences: {
    label: 'Travel Preferences',
    category: 'travel',
    required: false,
    description: 'Your preferred airlines, seating, meal options, etc.',
  },
  emergencyContact: {
    label: 'Emergency Contact',
    category: 'contact',
    required: false,
    description: 'Someone to contact in case of emergency during travel',
  },
  paymentMethod: {
    label: 'Payment Method',
    category: 'payment',
    required: false,
    description: 'Credit card or other payment method for bookings',
  },
  identityVerified: {
    label: 'Identity Verification',
    category: 'verification',
    required: false,
    description: 'Verify your identity for enhanced security and features',
  },
  profilePhoto: {
    label: 'Profile Photo',
    category: 'basic',
    required: false,
    description: 'Helps travel companions recognize you',
  },
  dietaryRestrictions: {
    label: 'Dietary Restrictions',
    category: 'travel',
    required: false,
    description: 'Special dietary needs for meal planning',
  },
};

export const ProfileCompletenessConnected: FC<
  ProfileCompletenessConnectedProps
> = ({
  onFieldClick,
  showFieldList = true,
  compact = false,
  className,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}) => {
  const user = useUser();
  const [profileData, setProfileData] =
    useState<ProfileCompletenessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileCompleteness = useCallback(
    async (showRefreshIndicator = false) => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        if (showRefreshIndicator) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const result = await DatabaseOperations.getProfileCompleteness(
          user.id,
          { withRetry: true }
        );

        if (result.error) {
          throw new Error(
            result.error.message || 'Failed to load profile completeness'
          );
        }

        if (result.data) {
          // Transform database response to UI format
          const dbData: DatabaseProfileCompleteness = result.data;

          // Get all possible fields and mark which ones are completed
          const allFieldNames = Object.keys(FIELD_METADATA);
          const completedFieldNames = allFieldNames.filter(
            fieldName => !dbData.missingFields.includes(fieldName)
          );

          const fields: ProfileField[] = allFieldNames.map(fieldName => {
            const metadata = FIELD_METADATA[fieldName];
            return {
              id: fieldName,
              label: metadata.label,
              completed: completedFieldNames.includes(fieldName),
              required: metadata.required,
              category: metadata.category,
              description: metadata.description,
            };
          });

          // Determine profile tier based on completion
          let tier: 'basic' | 'complete' | 'verified' = 'basic';
          if (dbData.completionPercentage === 100) {
            // Check if identity is verified
            const hasIdentityVerification =
              completedFieldNames.includes('identityVerified');
            tier = hasIdentityVerification ? 'verified' : 'complete';
          } else if (dbData.completionPercentage >= 70) {
            tier = 'basic';
          }

          const profileCompletenessData: ProfileCompletenessData = {
            completionPercentage: dbData.completionPercentage,
            completedFields: dbData.completedFields,
            totalFields: dbData.totalFields,
            fields,
            lastUpdated: new Date(),
            tier,
          };

          setProfileData(profileCompletenessData);
          setLastRefresh(new Date());
        }
      } catch (err) {
        console.error('Failed to fetch profile completeness:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load profile data'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id]
  );

  const handleRefresh = useCallback(() => {
    fetchProfileCompleteness(true);
  }, [fetchProfileCompleteness]);

  // Initial load
  useEffect(() => {
    fetchProfileCompleteness();
  }, [fetchProfileCompleteness]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh || !user?.id) return;

    const intervalId = setInterval(() => {
      fetchProfileCompleteness(true);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchProfileCompleteness, user?.id]);

  // Enhanced field click handler with navigation
  const handleFieldClick = useCallback(
    (fieldId: string) => {
      if (onFieldClick) {
        onFieldClick(fieldId);
        return;
      }

      // Default navigation based on field category
      const metadata = FIELD_METADATA[fieldId];
      if (!metadata) return;

      const navigationMap = {
        basic: '/profile/personal',
        contact: '/profile/contact',
        travel: '/profile/travel',
        payment: '/profile/payment',
        verification: '/profile/verification',
      };

      const targetUrl = navigationMap[metadata.category];
      if (targetUrl) {
        // Add field parameter to highlight specific field
        window.location.href = `${targetUrl}?field=${fieldId}`;
      }
    },
    [onFieldClick]
  );

  // Loading state
  if (loading && !profileData) {
    return (
      <div className={cn('flex items-center justify-center p-6', className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Loading profile data...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileData) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-2"
          >
            {refreshing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // No user state
  if (!user || !profileData) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to view your profile completeness.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Refresh indicator */}
      {refreshing && (
        <div className="absolute top-2 right-2 z-10">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Main component */}
      <ProfileCompletenessIndicator
        data={profileData}
        onFieldClick={handleFieldClick}
        showFieldList={showFieldList}
        compact={compact}
        className={refreshing ? 'opacity-90' : ''}
      />

      {/* Last updated info for non-compact view */}
      {!compact && profileData.lastUpdated && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-6 px-2 text-xs"
          >
            {refreshing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            Refresh
          </Button>
        </div>
      )}

      {/* Error overlay for refresh errors */}
      {error && profileData && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">Failed to refresh: {error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProfileCompletenessConnected;
