/**
 * User Domain Type Definitions
 * Comprehensive user-related types with advanced TypeScript features
 */

import type {
  Brand,
  UserId,
  EmailAddress,
  ISODateString,
  DeepReadonly,
  Optional,
  Result
} from './index';

// ============================================================================
// USER IDENTITY TYPES
// ============================================================================

/**
 * User profile with comprehensive information
 */
export interface UserProfile {
  readonly id: UserId;
  readonly email: EmailAddress;
  readonly emailVerified: boolean;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  
  // Personal information
  personalInfo: {
    firstName: string;
    lastName: string;
    displayName?: string;
    avatar?: {
      url: string;
      thumbnailUrl: string;
    };
    dateOfBirth?: ISODateString;
    phoneNumber?: string;
    timezone: string;
    locale: string;
  };
  
  // Account status
  status: UserStatus;
  
  // Preferences
  preferences: UserPreferences;
  
  // Security settings
  security: UserSecuritySettings;
}

/**
 * User status variants
 */
export type UserStatus =
  | { type: 'active'; data: { lastLoginAt: ISODateString } }
  | { type: 'inactive'; data: { inactiveSince: ISODateString } }
  | { type: 'suspended'; data: { suspendedAt: ISODateString; reason: string } }
  | { type: 'pending_verification'; data: { verificationSentAt: ISODateString } };

// ============================================================================
// USER PREFERENCES
// ============================================================================

/**
 * Comprehensive user preferences
 */
export interface UserPreferences {
  // Travel preferences
  travel: {
    preferredClass: 'economy' | 'premium_economy' | 'business' | 'first';
    preferredAirlines: string[];
    seatPreferences: {
      window: boolean;
      aisle: boolean;
      extra_legroom: boolean;
    };
    mealPreferences: Array<'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'gluten_free'>;
    accessibility: {
      wheelchair: boolean;
      visualImpairment: boolean;
      hearingImpairment: boolean;
      other?: string;
    };
  };
  
  // Communication preferences
  notifications: {
    email: {
      marketing: boolean;
      bookingUpdates: boolean;
      priceAlerts: boolean;
      newsletter: boolean;
    };
    sms: {
      bookingUpdates: boolean;
      flightAlerts: boolean;
      emergencyOnly: boolean;
    };
    push: {
      enabled: boolean;
      bookingUpdates: boolean;
      priceAlerts: boolean;
      promotions: boolean;
    };
  };
  
  // UI preferences
  interface: {
    theme: 'light' | 'dark' | 'auto';
    currency: string;
    language: string;
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
  };
  
  // Privacy settings
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    shareBookingData: boolean;
    allowAnalytics: boolean;
    allowTargetedAds: boolean;
  };
}

// ============================================================================
// SECURITY & AUTHENTICATION
// ============================================================================

/**
 * User security settings
 */
export interface UserSecuritySettings {
  // Multi-factor authentication
  mfa: {
    enabled: boolean;
    methods: Array<'sms' | 'email' | 'authenticator' | 'backup_codes'>;
    lastUsed?: ISODateString;
    backupCodes?: {
      remaining: number;
      generatedAt: ISODateString;
    };
  };
  
  // Password policy
  password: {
    lastChanged: ISODateString;
    expiresAt?: ISODateString;
    requiresChange: boolean;
    history: Array<{
      hashedPassword: string;
      changedAt: ISODateString;
    }>;
  };
  
  // Session management
  sessions: Array<UserSession>;
  
  // Login attempts
  loginAttempts: {
    failed: number;
    lastFailedAt?: ISODateString;
    lockedUntil?: ISODateString;
    successfulLogins: Array<{
      timestamp: ISODateString;
      ipAddress: string;
      userAgent: string;
      location?: string;
    }>;
  };
}

/**
 * User session information
 */
export interface UserSession {
  readonly id: string;
  readonly userId: UserId;
  readonly createdAt: ISODateString;
  readonly expiresAt: ISODateString;
  readonly lastActivity: ISODateString;
  
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    userAgent: string;
  };
  
  location: {
    ipAddress: string;
    country?: string;
    city?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  status: 'active' | 'expired' | 'revoked';
}

// ============================================================================
// USER ROLES & PERMISSIONS
// ============================================================================

/**
 * User role system with hierarchical permissions
 */
export type UserRole = 'user' | 'premium' | 'admin' | 'super_admin';

/**
 * Permission structure
 */
export interface UserPermissions {
  readonly role: UserRole;
  readonly permissions: Set<Permission>;
  readonly grantedAt: ISODateString;
  readonly grantedBy?: UserId;
  readonly expiresAt?: ISODateString;
}

/**
 * Available permissions
 */
export type Permission =
  | 'user.read' | 'user.write' | 'user.delete'
  | 'booking.read' | 'booking.write' | 'booking.cancel'
  | 'admin.users' | 'admin.bookings' | 'admin.system'
  | 'super.all';

// ============================================================================
// USER ACTIONS & AUDIT
// ============================================================================

/**
 * User action audit log
 */
export interface UserAuditLog {
  readonly id: string;
  readonly userId: UserId;
  readonly action: UserAction;
  readonly timestamp: ISODateString;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * User actions for audit trail
 */
export type UserAction =
  | { type: 'login'; success: boolean; method: 'password' | 'oauth' | 'sso' }
  | { type: 'logout'; reason: 'user' | 'timeout' | 'admin' }
  | { type: 'profile_update'; fields: string[] }
  | { type: 'password_change'; forced: boolean }
  | { type: 'mfa_enable'; method: string }
  | { type: 'mfa_disable'; reason: string }
  | { type: 'booking_create'; bookingId: string }
  | { type: 'booking_cancel'; bookingId: string; reason: string }
  | { type: 'preference_update'; section: keyof UserPreferences }
  | { type: 'data_export'; format: 'json' | 'csv' | 'pdf' }
  | { type: 'account_delete'; reason: string };

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * User creation request
 */
export interface CreateUserRequest {
  email: EmailAddress;
  password: string;
  firstName: string;
  lastName: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  timezone?: string;
  locale?: string;
  referralCode?: string;
}

/**
 * User update request (partial updates)
 */
export type UpdateUserRequest = {
  personalInfo?: Partial<UserProfile['personalInfo']>;
  preferences?: Partial<UserProfile['preferences']>;
};

/**
 * User search criteria
 */
export interface UserSearchCriteria {
  query?: string;
  filters?: {
    status?: UserStatus['type'][];
    role?: UserRole[];
    createdAfter?: ISODateString;
    createdBefore?: ISODateString;
    lastLoginAfter?: ISODateString;
    emailVerified?: boolean;
    hasBookings?: boolean;
  };
  sort?: {
    field: 'createdAt' | 'lastLoginAt' | 'email' | 'lastName';
    direction: 'asc' | 'desc';
  };
}

// ============================================================================
// USER VALIDATION
// ============================================================================

/**
 * User validation rules
 */
export interface UserValidationRules {
  email: {
    required: true;
    format: 'email';
    maxLength: 255;
    unique: true;
  };
  password: {
    required: true;
    minLength: 8;
    maxLength: 128;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  firstName: {
    required: true;
    minLength: 1;
    maxLength: 50;
    pattern: string; // Pattern: /^[a-zA-Z\s\-']+$/
  };
  lastName: {
    required: true;
    minLength: 1;
    maxLength: 50;
    pattern: string; // Pattern: /^[a-zA-Z\s\-']+$/
  };
}

// ============================================================================
// USER ANALYTICS
// ============================================================================

/**
 * User behavior analytics
 */
export interface UserAnalytics {
  readonly userId: UserId;
  readonly generatedAt: ISODateString;
  
  activity: {
    totalSessions: number;
    averageSessionDuration: number;
    lastActiveAt: ISODateString;
    totalPageViews: number;
    bounceRate: number;
  };
  
  booking: {
    totalBookings: number;
    totalSpent: number;
    averageBookingValue: number;
    preferredDestinations: string[];
    bookingFrequency: 'frequent' | 'occasional' | 'rare';
  };
  
  engagement: {
    emailOpenRate: number;
    emailClickRate: number;
    pushNotificationEngagement: number;
    supportTicketsCreated: number;
    reviewsWritten: number;
  };
  
  segments: Array<'high_value' | 'frequent_traveler' | 'price_sensitive' | 'new_user' | 'at_risk'>;
}

// ============================================================================
// USER UTILITIES
// ============================================================================

/**
 * User utility functions type definitions
 */
export interface UserUtilities {
  // Validation
  validateEmail: (email: string) => Result<EmailAddress, string[]>;
  validatePassword: (password: string) => Result<string, string[]>;
  
  // Transformations
  getDisplayName: (user: UserProfile) => string;
  getInitials: (user: UserProfile) => string;
  formatName: (user: UserProfile, format: 'first_last' | 'last_first' | 'first_only') => string;
  
  // Permissions
  hasPermission: (user: UserProfile, permission: Permission) => boolean;
  canAccessResource: (user: UserProfile, resource: string, action: string) => boolean;
  
  // Status checks
  isActive: (user: UserProfile) => boolean;
  isVerified: (user: UserProfile) => boolean;
  requiresPasswordChange: (user: UserProfile) => boolean;
  
  // Analytics
  calculateUserScore: (analytics: UserAnalytics) => number;
  getUserSegment: (analytics: UserAnalytics) => UserAnalytics['segments'][number];
}

// ============================================================================
// READONLY USER TYPES
// ============================================================================

/**
 * Readonly user profile for display purposes
 */
export type ReadonlyUserProfile = DeepReadonly<UserProfile>;

/**
 * Public user information (safe for external sharing)
 */
export interface PublicUserInfo {
  readonly id: UserId;
  readonly displayName: string;
  readonly avatar?: {
    readonly url: string;
    readonly thumbnailUrl: string;
  };
  readonly joinedAt: ISODateString;
  readonly isVerified: boolean;
}
