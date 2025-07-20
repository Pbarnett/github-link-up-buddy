

import * as React from 'react';
const { useEffect } = React;
type FC<T = {}> = React.FC<T>;

import { cn } from '@/lib/utils';
import { GreetingBannerProps, PersonalizationEvent } from '@/types/personalization';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { getGreeting } from '@/lib/personalization/voiceAndTone';
import { useAnalytics } from '@/hooks/useAnalytics';

interface GreetingBannerComponentProps extends GreetingBannerProps {
  onClick?: () => void;
  showIcon?: boolean;
}

export const GreetingBanner: FC<GreetingBannerComponentProps> = ({
  context,
  userId,
  className,
  variant = 'default',
  onClick,
  showIcon = true,
}) => {
  const { 
    personalizationData, 
    abTestVariant, 
    trackPersonalizationEvent,
    isPersonalizationEnabled 
  } = usePersonalization();
  const analytics = useAnalytics();

  // Get the appropriate greeting based on A/B test and personalization data
  const greetingText = getGreeting(context, isPersonalizationEnabled ? personalizationData : null);

  // Track analytics when greeting is shown
  useEffect(() => {
    if (userId) {
      const event: PersonalizationEvent = {
        type: 'greeting_shown',
        context,
        data: {
          variant,
          hasPersonalData: !!(personalizationData?.firstName || personalizationData?.nextTripCity),
          interactionType: onClick ? 'clickable' : 'static',
        },
        timestamp: new Date(),
        userId,
      };

      // Track A/B test exposure event
      if (abTestVariant) {
        trackPersonalizationEvent('exposure', 'greeting_shown', {
          context,
          variant,
          hasPersonalData: event.data?.hasPersonalData,
        });
      }

      // Log analytics event (implement based on your analytics setup)
      analytics?.track?.('personalization_greeting_shown', {
        context,
        variant,
        hasPersonalData: event.data?.hasPersonalData,
        abTestVariant,
      });

      console.log('📊 Greeting shown:', event);
    }
  }, [userId, context, variant, personalizationData, analytics, onClick, abTestVariant, isPersonalizationEnabled, trackPersonalizationEvent]);

  // Handle click events
  const handleClick = () => {
    if (onClick) {
      onClick();
      
      // Track click analytics
      if (userId) {
        const clickEvent: PersonalizationEvent = {
          type: 'greeting_clicked',
          context,
          data: {
            variant,
            hasPersonalData: !!(personalizationData?.firstName || personalizationData?.nextTripCity),
          },
          timestamp: new Date(),
          userId,
        };

        // Track A/B test engagement event
        if (abTestVariant) {
          trackPersonalizationEvent('engagement', 'greeting_clicked', {
            context,
            variant,
          });
        }

        analytics?.track?.('personalization_greeting_clicked', {
          context,
          variant,
          abTestVariant,
        });

        console.log('🖱️ Greeting clicked:', clickEvent);
      }
    }
  };

  // Determine styling based on variant and context
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent py-4';
      case 'compact':
        return 'text-base font-medium text-gray-700';
      default:
        return 'text-xl lg:text-2xl font-semibold text-gray-800';
    }
  };

  const getContextStyles = () => {
    switch (context) {
      case 'dashboard':
        return 'mb-2';
      case 'bookingConfirmation':
        return 'text-green-700 mb-4';
      case 'error':
        return 'text-red-700 mb-3';
      case 'profile':
        return 'text-blue-700 mb-3';
      default:
        return 'mb-2';
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    switch (context) {
      case 'dashboard':
        return '✈️';
      case 'bookingConfirmation':
        return '🎉';
      case 'error':
        return '⚠️';
      case 'profile':
        return '👋';
      default:
        return '✈️';
    }
  };

  // Combine all styles
  const combinedClassName = cn(
    'transition-all duration-300 ease-in-out',
    getVariantStyles(),
    getContextStyles(),
    onClick && 'cursor-pointer hover:opacity-80',
    className
  );

  // Render the greeting
  const icon = getIcon();
  const displayText = greetingText;

  return (
    <div
      className={combinedClassName}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      aria-label={onClick ? `${displayText} - Click for more options` : displayText}
    >
      {/* Render with icon or text only */}
      {icon && variant !== 'compact' ? (
        <span className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden="true">
            {icon}
          </span>
          <span>{displayText.replace(icon, '').trim()}</span>
        </span>
      ) : (
        <span>{displayText}</span>
      )}
    </div>
  );
};

// Convenience wrapper components for specific contexts
export const DashboardGreeting: FC<Omit<GreetingBannerComponentProps, 'context'>> = (props) => (
  <GreetingBanner {...props} context="dashboard" />
);

export const ProfileGreeting: FC<Omit<GreetingBannerComponentProps, 'context'>> = (props) => (
  <GreetingBanner {...props} context="profile" />
);

export const ConfirmationGreeting: FC<Omit<GreetingBannerComponentProps, 'context'>> = (props) => (
  <GreetingBanner {...props} context="bookingConfirmation" />
);

export const ErrorGreeting: FC<Omit<GreetingBannerComponentProps, 'context'>> = (props) => (
  <GreetingBanner {...props} context="error" />
);

// Default export
export default GreetingBanner;
