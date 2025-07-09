import { LDClient } from 'launchdarkly-js-client-sdk';

class PersonalizationService {
  constructor() {
    this.ldClient = null;
    this.isInitialized = false;
  }

  async initialize(userId, userContext = {}) {
    try {
      this.ldClient = LDClient.initialize(
        process.env.REACT_APP_LAUNCHDARKLY_CLIENT_ID,
        {
          key: userId,
          anonymous: false,
          ...userContext
        }
      );

      await this.ldClient.waitForInitialization();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize LaunchDarkly:', error);
      this.isInitialized = false;
    }
  }

  isPersonalizationEnabled() {
    if (!this.isInitialized || !this.ldClient) {
      return false;
    }

    return this.ldClient.variation('personalization-enabled', false);
  }

  shouldShowOptOutBanner() {
    if (!this.isInitialized || !this.ldClient) {
      return false;
    }

    return this.ldClient.variation('show-opt-out-banner', false);
  }

  async fetchPersonalizedGreeting(userId) {
    if (!this.isPersonalizationEnabled()) {
      return { greeting: 'Welcome!', personalized: false };
    }

    try {
      const response = await fetch(`/api/personalization/greeting?userId=${userId}`);
      const data = await response.json();
      
      return {
        greeting: data.greeting,
        name: data.name,
        lastVisit: data.lastVisit,
        personalized: true
      };
    } catch (error) {
      console.error('Failed to fetch personalized greeting:', error);
      return { greeting: 'Welcome!', personalized: false };
    }
  }

  async updatePersonalizationPreference(userId, enabled) {
    try {
      const response = await fetch('/api/personalization/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          personalizationEnabled: enabled
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update personalization preference');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update personalization preference:', error);
      throw error;
    }
  }

  // Emergency disable method for quick rollback
  disablePersonalization() {
    if (this.ldClient) {
      // This would typically be done through LaunchDarkly dashboard
      // but keeping method for programmatic disable if needed
      this.ldClient.close();
    }
  }
}

export default new PersonalizationService();
