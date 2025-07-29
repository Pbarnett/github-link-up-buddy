/**
 * World-Class Error Messaging System
 * 
 * Provides contextual, user-friendly error messages that guide users
 * toward successful form completion rather than just indicating failure.
 */

export interface ErrorMessageContext {
  fieldName: string;
  value?: any;
  formData?: Record<string, any>;
  userPreferences?: {
    locale?: string;
    experienceLevel?: 'novice' | 'intermediate' | 'expert';
  };
}

export interface ErrorMessageConfig {
  title: string;
  message: string;
  suggestion?: string;
  helpLink?: string;
  severity: 'error' | 'warning' | 'info';
  category: 'validation' | 'network' | 'business' | 'system';
}

/**
 * Enhanced error messages that provide context and guidance
 */
export const enhancedErrorMessages = {
  // Date validation errors
  dates: {
    earliestDepartureRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Departure date needed",
      message: "Please select when you'd like to start your trip",
      suggestion: "Choose a date at least 24 hours from now to ensure availability",
      severity: 'error' as const,
      category: 'validation' as const,
    }),
    
    earliestDepartureInPast: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Past date selected",
      message: "Your departure date must be in the future",
      suggestion: "Select a date starting tomorrow or later",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    latestDepartureRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "End date needed",
      message: "Please select the latest date you'd consider departing",
      suggestion: "This gives us flexibility to find better deals within your timeframe",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    dateRangeInvalid: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Date range issue",
      message: "Your latest departure date must be after your earliest departure date",
      suggestion: "Try selecting a later end date or an earlier start date",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    dateRangeTooWide: (ctx: ErrorMessageContext): ErrorMessageConfig => {
      const daysDiff = ctx.formData?.daysDiff || 60;
      return {
        title: "Date range too wide",
        message: `Your ${daysDiff}-day search window is too large and may cause timeouts`,
        suggestion: "Please narrow your search to 60 days or less for faster results",
        helpLink: "/help/search-tips#date-ranges",
        severity: 'warning' as const,
        category: 'business' as const,
      };
    },
  },

  // Duration validation errors
  duration: {
    minDurationRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Trip length needed",
      message: "Please specify the minimum number of days for your trip",
      suggestion: "Most travelers prefer at least 3 days for international destinations",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    minDurationTooShort: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Very short trip",
      message: "Minimum trip length must be at least 1 day",
      suggestion: "Consider if a same-day trip meets your travel goals",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    maxDurationTooLong: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Extended trip duration",
      message: "Maximum trip length cannot exceed 30 days",
      suggestion: "For longer trips, consider creating multiple bookings",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    durationRangeInvalid: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Duration range issue",
      message: "Maximum trip length must be greater than or equal to minimum length",
      suggestion: "Adjust your trip length preferences so the maximum is at least equal to the minimum",
      severity: 'error' as const,
      category: 'validation' as const,
    }),
  },

  // Airport and destination errors
  location: {
    destinationRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Destination needed",
      message: "Where would you like to go?",
      suggestion: "Enter a city name, airport code (like LAX), or choose from popular destinations",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    departureAirportRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Departure location needed",
      message: "Please select at least one departure airport",
      suggestion: "Choose from NYC area airports or enter your preferred departure airport",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    invalidAirportCode: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Airport code format",
      message: `"${ctx.value}" doesn't appear to be a valid airport code`,
      suggestion: "Airport codes are typically 3 letters (like JFK, LAX, ORD)",
      severity: 'error' as const,
      category: 'validation' as const,
    }),
  },

  // Budget and pricing errors
  pricing: {
    budgetRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Budget needed",
      message: "Please set your maximum price per person",
      suggestion: "This helps us find flights within your price range",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    budgetTooLow: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Budget quite low",
      message: `$${ctx.value} might be too low for most flight options`,
      suggestion: "Consider increasing your budget to $300+ for better availability",
      severity: 'warning' as const,
      category: 'business' as const,
    }),

    budgetTooHigh: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Budget very high",
      message: `$${ctx.value} is higher than most flights require`,
      suggestion: "You might find great options at a lower price point",
      severity: 'info' as const,
      category: 'business' as const,
    }),
  },

  // Auto-booking specific errors
  autoBooking: {
    paymentMethodRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Payment method needed",
      message: "Auto-booking requires a saved payment method",
      suggestion: "Add a credit card to enable automatic booking when deals are found",
      helpLink: "/wallet",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    consentRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Authorization required",
      message: "Please authorize us to book flights automatically on your behalf",
      suggestion: "This ensures we can secure deals quickly when they match your criteria",
      severity: 'error' as const,
      category: 'validation' as const,
    }),

    maxPriceRequired: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Price limit needed",
      message: "Set the maximum amount we can spend on auto-booking",
      suggestion: "This protects you from unexpected charges",
      severity: 'error' as const,
      category: 'validation' as const,
    }),
  },

  // Network and system errors
  network: {
    searchTimeout: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Search taking longer than expected",
      message: "Flight search is still running but may be slow due to high demand",
      suggestion: "You can wait for results or try narrowing your search criteria",
      severity: 'warning' as const,
      category: 'network' as const,
    }),

    apiError: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Service temporarily unavailable",
      message: "We're having trouble connecting to our flight search service",
      suggestion: "Please try again in a few moments, or contact support if the issue persists",
      severity: 'error' as const,
      category: 'network' as const,
    }),

    rateLimitError: (ctx: ErrorMessageContext): ErrorMessageConfig => ({
      title: "Too many requests",
      message: "You've made several searches recently. Please wait a moment before trying again",
      suggestion: "This helps us maintain fast service for all users",
      severity: 'warning' as const,
      category: 'network' as const,
    }),
  },
};

/**
 * Get contextual error message based on error type and context
 */
export function getEnhancedErrorMessage(
  errorType: string,
  context: ErrorMessageContext
): ErrorMessageConfig {
  const [category, specific] = errorType.split('.');
  const messageGenerator = enhancedErrorMessages[category as keyof typeof enhancedErrorMessages]?.[specific as any];
  
  if (typeof messageGenerator === 'function') {
    return messageGenerator(context);
  }

  // Fallback to generic error message
  return {
    title: "Input needed",
    message: "Please check this field and try again",
    suggestion: "Make sure all required information is provided",
    severity: 'error' as const,
    category: 'validation' as const,
  };
}

/**
 * Format error for display in UI components
 */
export function formatErrorForDisplay(error: ErrorMessageConfig): {
  title: string;
  description: string;
  variant: 'default' | 'destructive' | 'warning';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
} {
  const variantMap = {
    error: 'destructive' as const,
    warning: 'warning' as const,
    info: 'default' as const,
  };

  const result = {
    title: error.title,
    description: error.message + (error.suggestion ? ` ${error.suggestion}` : ''),
    variant: variantMap[error.severity],
  };

  if (error.helpLink) {
    return {
      ...result,
      action: {
        label: "Learn more",
        href: error.helpLink,
      },
    };
  }

  return result;
}

/**
 * Progressive error severity - shows warnings before they become errors
 */
export function getProgressiveErrorSeverity(
  fieldName: string,
  value: any,
  hasBlurred: boolean,
  hasAttemptedSubmit: boolean
): 'none' | 'warning' | 'error' {
  // Don't show errors until user has interacted with the field
  if (!hasBlurred && !hasAttemptedSubmit) {
    return 'none';
  }

  // Show warnings on blur, errors on submit attempt
  if (!hasAttemptedSubmit && hasBlurred) {
    return 'warning';
  }

  return 'error';
}
