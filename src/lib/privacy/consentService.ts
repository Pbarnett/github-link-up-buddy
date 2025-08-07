// Privacy compliance service for consent management
// Based on GDPR/CCPA requirements and research recommendations

const CONSENT_STORAGE_KEY = 'parker_flight_consent';
const CONSENT_VERSION = '1.0';

export interface ConsentRecord {
  preferences: ConsentPreferences;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  version: string;
}

// Check if user has given any consent
export function hasUserConsented(): boolean {
  const consent = getStoredConsent();
  return consent !== null;
}

// Get stored consent preferences
export function getStoredConsent(): ConsentPreferences | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Check if consent is still valid (not expired)
    const consentDate = new Date(parsed.timestamp);
    const now = new Date();
    const daysSinceConsent = Math.floor(
      (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Consent expires after 13 months (GDPR recommendation)
    if (daysSinceConsent > 395) {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }

    return {
      ...parsed,
      timestamp: consentDate,
    };
  } catch (error) {
    console.error('Failed to retrieve consent:', error);
    return null;
  }
}

// Save consent preferences
export function saveConsent(
  preferences: ConsentPreferences,
  userId?: string
): void {
  try {
    const consentRecord: ConsentRecord = {
      preferences,
      userId,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentRecord));

    // Log consent for audit trail (in production, send to secure backend)
    console.log('🔒 Consent saved:', {
      userId: userId?.slice(0, 8) + '...' || 'anonymous',
      preferences: Object.entries(preferences)
        .filter(([key]) => key !== 'timestamp' && key !== 'version')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', '),
      timestamp: consentRecord.timestamp.toISOString(),
    });

    // Trigger personalization update
    window.dispatchEvent(
      new CustomEvent('consentUpdated', {
        detail: preferences,
      })
    );
  } catch (error) {
    console.error('Failed to save consent:', error);
  }
}

// Check if specific consent is granted
export function hasConsentFor(type: keyof ConsentPreferences): boolean {
  const consent = getStoredConsent();
  if (!consent) return false;

  return consent[type] === true;
}

// Withdraw consent (GDPR right to withdraw)
export function withdrawConsent(): void {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);

    // Log withdrawal for audit trail
    console.log('🔒 Consent withdrawn:', {
      timestamp: new Date().toISOString(),
      action: 'withdrawal',
    });

    // Trigger personalization update
    window.dispatchEvent(
      new CustomEvent('consentUpdated', {
        detail: null,
      })
    );
  } catch (error) {
    console.error('Failed to withdraw consent:', error);
  }
}

// Check if consent banner should be shown
export function shouldShowConsentBanner(): boolean {
  const consent = getStoredConsent();

  // Show banner if no consent or consent version is outdated
  if (!consent) return true;
  if (consent.version !== CONSENT_VERSION) return true;

  return false;
}

// Data subject rights - get user data (GDPR Article 15)
export interface UserDataExport {
  userId: string;
  consentRecord: ConsentPreferences | null;
  personalData: {
    message: string;
  };
}

export function getUserData(userId: string): Promise<UserDataExport> {
  // In a real implementation, this would call backend API
  return Promise.resolve({
    userId,
    consentRecord: getStoredConsent(),
    personalData: {
      // This would come from backend
      message: 'Personal data export would be generated here',
    },
  });
}

// Data subject rights - delete user data (GDPR Article 17)
export function deleteUserData(userId: string): Promise<void> {
  // In a real implementation, this would call backend API
  withdrawConsent();

  console.log('🔒 Data deletion requested:', {
    userId: userId.slice(0, 8) + '...',
    timestamp: new Date().toISOString(),
  });

  return Promise.resolve();
}

// Privacy compliance validation
export function validatePrivacyCompliance(): {
  isCompliant: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const consent = getStoredConsent();

  if (!consent) {
    issues.push('No consent record found');
    recommendations.push('Show consent banner to user');
  } else {
    // Check consent freshness
    const consentAge = Math.floor(
      (new Date().getTime() - consent.timestamp.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (consentAge > 365) {
      issues.push('Consent is over 1 year old');
      recommendations.push('Request fresh consent from user');
    }

    // Check if all required disclosures are present
    if (!consent.version || consent.version !== CONSENT_VERSION) {
      issues.push('Consent version mismatch');
      recommendations.push('Update consent to latest version');
    }
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    recommendations,
  };
}

// Analytics consent helper
export function canTrackAnalytics(): boolean {
  return hasConsentFor('analytics');
}

// Personalization consent helper
export function canPersonalize(): boolean {
  return hasConsentFor('personalization');
}

// Marketing consent helper
export function canSendMarketing(): boolean {
  return hasConsentFor('marketing');
}

// GDPR compliance helper - process only necessary data
export function processPersonalData<T>(
  data: T,
  purpose: 'personalization' | 'analytics' | 'marketing',
  fallback: T
): T {
  const consent = getStoredConsent();

  if (!consent) return fallback;

  switch (purpose) {
    case 'personalization':
      return consent.personalization ? data : fallback;
    case 'analytics':
      return consent.analytics ? data : fallback;
    case 'marketing':
      return consent.marketing ? data : fallback;
    default:
      return fallback;
  }
}

// Cookie consent helper
export function setCookie(
  name: string,
  value: string,
  type: 'functional' | 'analytics' | 'marketing'
): void {
  const consent = getStoredConsent();

  // Always allow functional cookies
  if (type === 'functional') {
    document.cookie = `${name}=${value}; path=/; secure; samesite=strict`;
    return;
  }

  // Check consent for non-functional cookies
  if (consent && consent[type]) {
    document.cookie = `${name}=${value}; path=/; secure; samesite=strict`;
  }
}

// Export consent data for user (GDPR Article 20)
export function exportConsentData(): string {
  const consent = getStoredConsent();
  if (!consent) return 'No consent data available';

  const exportData = {
    consentPreferences: consent,
    exportDate: new Date().toISOString(),
    version: CONSENT_VERSION,
    note: 'This is your consent data as stored by Parker Flight',
  };

  return JSON.stringify(exportData, null, 2);
}

// Initialize consent service
export function initializeConsentService(): void {
  // Check compliance on load
  const compliance = validatePrivacyCompliance();
  if (!compliance.isCompliant) {
    console.warn('Privacy compliance issues detected:', compliance.issues);
  }

  // Set up consent listener
  window.addEventListener('consentUpdated', (event: Event) => {
    const customEvent = event as CustomEvent;
    console.log('🔒 Consent updated:', customEvent.detail);
  });
}

// Default export
export default {
  hasUserConsented,
  getStoredConsent,
  saveConsent,
  hasConsentFor,
  withdrawConsent,
  shouldShowConsentBanner,
  getUserData,
  deleteUserData,
  validatePrivacyCompliance,
  canTrackAnalytics,
  canPersonalize,
  canSendMarketing,
  processPersonalData,
  setCookie,
  exportConsentData,
  initializeConsentService,
};
