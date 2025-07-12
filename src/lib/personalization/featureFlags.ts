// Temporary feature flag configuration for personalization testing
// In a real implementation, this would come from a feature flag service or database

export const PERSONALIZATION_FEATURE_FLAGS = {
  // Set to true for Alpha testing (internal users only)
  personalizedGreetings: true, // Enable for testing
  nextTripSuggestions: false,  // Future feature
  loyaltyBadges: false,        // Future feature
};

// Helper function to check if personalization is enabled
export const isPersonalizationEnabled = (): boolean => {
  // In Alpha phase, we can enable for specific users or environments
  const isAlphaUser = true; // Set to true for testing
  const isFeatureEnabled = PERSONALIZATION_FEATURE_FLAGS.personalizedGreetings;
  
  return isAlphaUser && isFeatureEnabled;
};

// Override feature flag for testing
export const enablePersonalizationForTesting = () => {
  // This will be used temporarily until proper feature flag infrastructure is in place
  console.log('🎯 Personalization enabled for testing');
  return true;
};
