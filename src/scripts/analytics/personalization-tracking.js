/**
 * Personalization Feature Analytics Tracking
 * Tracks user interactions, engagement metrics, and performance indicators
 */

// Event tracking for personalization feature
export const trackPersonalizationEvent = (eventName, properties = {}) => {
  const baseProperties = {
    feature: 'personalization',
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    user_id: getUserId(),
    ...properties
  };

  // Send to analytics service (replace with actual implementation)
  if (window.analytics) {
    window.analytics.track(eventName, baseProperties);
  }
};

// Track greeting display
export const trackGreetingDisplay = (greetingType, personalizationData) => {
  trackPersonalizationEvent('greeting_displayed', {
    greeting_type: greetingType,
    has_personal_data: !!personalizationData.name,
    time_of_day: getTimeOfDay(),
    display_context: 'header'
  });
};

// Track user engagement with personalized content
export const trackPersonalizationEngagement = (action, element) => {
  trackPersonalizationEvent('personalization_engagement', {
    action: action,
    element: element,
    engagement_type: 'click'
  });
};

// Track opt-out banner interactions
export const trackOptOutBanner = (action) => {
  trackPersonalizationEvent('opt_out_banner', {
    action: action, // 'displayed', 'dismissed', 'opted_out'
    banner_type: 'gdpr_compliance'
  });
};

// Performance monitoring for personalization feature
export const trackPersonalizationPerformance = (metrics) => {
  trackPersonalizationEvent('personalization_performance', {
    load_time: metrics.loadTime,
    api_response_time: metrics.apiResponseTime,
    render_time: metrics.renderTime,
    bundle_size_impact: metrics.bundleSizeImpact
  });
};

// Helper functions
const getSessionId = () => {
  return sessionStorage.getItem('session_id') || 'anonymous';
};

const getUserId = () => {
  return localStorage.getItem('user_id') || 'anonymous';
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};
