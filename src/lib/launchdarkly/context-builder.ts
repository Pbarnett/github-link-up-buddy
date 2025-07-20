/**
 * LaunchDarkly Context Builder
 * Multi-context support for precise targeting based on documentation analysis
 */

import { LDContext } from '@launchdarkly/node-server-sdk';
import { UAParser } from 'ua-parser-js';

export interface UserContext {
  key: string;
  email?: string;
  name?: string;
  subscription?: 'free' | 'premium' | 'enterprise';
  region?: string;
  country?: string;
  timezone?: string;
  language?: string;
  role?: 'user' | 'admin' | 'moderator' | 'beta-tester';
  joinDate?: number;
  lastActive?: number;
  avatar?: string;
  preferences?: Record<string, any>;
}

export interface DeviceContext {
  key: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'tv' | 'embedded';
  os?: string;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  screenResolution?: string;
  colorDepth?: number;
  pixelRatio?: number;
  touchSupported?: boolean;
  language?: string;
  userAgent?: string;
}

export interface OrganizationContext {
  key: string;
  name?: string;
  plan: 'startup' | 'business' | 'enterprise' | 'free';
  size: 'small' | 'medium' | 'large' | 'enterprise';
  industry?: string;
  country?: string;
  employees?: number;
  founded?: number;
  revenue?: string;
  features?: string[];
}

export interface SessionContext {
  key: string;
  sessionId: string;
  startTime: number;
  referrer?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  experiments?: string[];
  ab_tests?: Record<string, string>;
}

export interface ApplicationContext {
  key: string;
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  region?: string;
  deployment?: string;
  build?: string;
  commit?: string;
  feature_flags?: string[];
}

export interface AppMultiContext extends LDContext {
  kind: 'multi';
  user: UserContext;
  device: DeviceContext;
  organization?: OrganizationContext;
  session?: SessionContext;
  application?: ApplicationContext;
}

/**
 * Build a comprehensive multi-context for LaunchDarkly targeting
 */
export class ContextBuilder {
  /**
   * Create user context from user data
   */
  static buildUserContext(userData: any): UserContext {
    return {
      key: userData.id || userData.userId || 'anonymous',
      email: userData.email,
      name: userData.name || userData.displayName,
      subscription: this.normalizeSubscription(userData.subscription || userData.plan),
      region: userData.region || userData.location?.region,
      country: userData.country || userData.location?.country,
      timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: userData.language || navigator?.language,
      role: this.normalizeRole(userData.role),
      joinDate: userData.createdAt ? new Date(userData.createdAt).getTime() : undefined,
      lastActive: userData.lastActiveAt ? new Date(userData.lastActiveAt).getTime() : Date.now(),
      avatar: userData.avatar || userData.profilePicture,
      preferences: userData.preferences || {}
    };
  }

  /**
   * Create device context from user agent and device info
   */
  static buildDeviceContext(userAgent?: string): DeviceContext {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    return {
      key: this.generateDeviceId(),
      type: this.getDeviceType(result),
      os: result.os.name,
      osVersion: result.os.version,
      browser: result.browser.name,
      browserVersion: result.browser.version,
      screenResolution: typeof window !== 'undefined' 
        ? `${window.screen.width}x${window.screen.height}` 
        : undefined,
      colorDepth: typeof window !== 'undefined' ? window.screen.colorDepth : undefined,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : undefined,
      touchSupported: typeof window !== 'undefined' ? 'ontouchstart' in window : undefined,
      language: typeof navigator !== 'undefined' ? navigator.language : undefined,
      userAgent: userAgent
    };
  }

  /**
   * Create organization context
   */
  static buildOrganizationContext(orgData: any): OrganizationContext {
    return {
      key: orgData.id || orgData.organizationId,
      name: orgData.name,
      plan: this.normalizeOrgPlan(orgData.plan || orgData.subscription),
      size: this.normalizeOrgSize(orgData.size || orgData.employeeCount),
      industry: orgData.industry,
      country: orgData.country,
      employees: orgData.employeeCount,
      founded: orgData.foundedYear,
      revenue: orgData.revenue,
      features: orgData.enabledFeatures || []
    };
  }

  /**
   * Create session context
   */
  static buildSessionContext(sessionData: any = {}): SessionContext {
    return {
      key: sessionData.sessionId || this.generateSessionId(),
      sessionId: sessionData.sessionId || this.generateSessionId(),
      startTime: sessionData.startTime || Date.now(),
      referrer: typeof document !== 'undefined' ? document.referrer : sessionData.referrer,
      utm: this.extractUTMParams(),
      experiments: sessionData.experiments || [],
      ab_tests: sessionData.ab_tests || {}
    };
  }

  /**
   * Create application context
   */
  static buildApplicationContext(): ApplicationContext {
    return {
      key: 'github-link-up-buddy',
      name: 'GitHub Link-Up Buddy',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: (process.env.NODE_ENV as any) || 'development',
      region: process.env.NEXT_PUBLIC_APP_REGION,
      deployment: process.env.NEXT_PUBLIC_DEPLOYMENT_ID,
      build: process.env.NEXT_PUBLIC_BUILD_ID,
      commit: process.env.NEXT_PUBLIC_GIT_COMMIT,
      feature_flags: []
    };
  }

  /**
   * Build complete multi-context
   */
  static buildMultiContext(options: {
    userData?: any;
    orgData?: any;
    sessionData?: any;
    userAgent?: string;
    includeSession?: boolean;
    includeOrganization?: boolean;
  } = {}): AppMultiContext {
    const context: AppMultiContext = {
      kind: 'multi',
      user: this.buildUserContext(options.userData || {}),
      device: this.buildDeviceContext(options.userAgent),
      application: this.buildApplicationContext()
    };

    if (options.includeOrganization && options.orgData) {
      context.organization = this.buildOrganizationContext(options.orgData);
    }

    if (options.includeSession !== false) {
      context.session = this.buildSessionContext(options.sessionData);
    }

    return context;
  }

  /**
   * Build anonymous context for non-authenticated users
   */
  static buildAnonymousContext(userAgent?: string): AppMultiContext {
    return {
      kind: 'multi',
      user: {
        key: 'anonymous-' + this.generateAnonymousId(),
        subscription: 'free',
        role: 'user'
      },
      device: this.buildDeviceContext(userAgent),
      application: this.buildApplicationContext(),
      session: this.buildSessionContext()
    };
  }

  /**
   * Build server-side context (without browser-specific data)
   */
  static buildServerContext(userData: any, orgData?: any): AppMultiContext {
    const context: AppMultiContext = {
      kind: 'multi',
      user: this.buildUserContext(userData),
      device: {
        key: 'server',
        type: 'desktop' // Default for server-side
      },
      application: this.buildApplicationContext()
    };

    if (orgData) {
      context.organization = this.buildOrganizationContext(orgData);
    }

    return context;
  }

  // Helper methods
  private static normalizeSubscription(subscription: any): UserContext['subscription'] {
    if (!subscription) return 'free';
    const sub = subscription.toLowerCase();
    if (sub.includes('premium') || sub.includes('pro')) return 'premium';
    if (sub.includes('enterprise') || sub.includes('business')) return 'enterprise';
    return 'free';
  }

  private static normalizeRole(role: any): UserContext['role'] {
    if (!role) return 'user';
    const r = role.toLowerCase();
    if (r.includes('admin')) return 'admin';
    if (r.includes('moderator') || r.includes('mod')) return 'moderator';
    if (r.includes('beta') || r.includes('tester')) return 'beta-tester';
    return 'user';
  }

  private static normalizeOrgPlan(plan: any): OrganizationContext['plan'] {
    if (!plan) return 'free';
    const p = plan.toLowerCase();
    if (p.includes('enterprise')) return 'enterprise';
    if (p.includes('business')) return 'business';
    if (p.includes('startup')) return 'startup';
    return 'free';
  }

  private static normalizeOrgSize(size: any): OrganizationContext['size'] {
    if (typeof size === 'number') {
      if (size > 1000) return 'enterprise';
      if (size > 100) return 'large';
      if (size > 10) return 'medium';
      return 'small';
    }
    
    if (typeof size === 'string') {
      const s = size.toLowerCase();
      if (s.includes('enterprise') || s.includes('xl')) return 'enterprise';
      if (s.includes('large') || s.includes('l')) return 'large';
      if (s.includes('medium') || s.includes('m')) return 'medium';
      return 'small';
    }
    
    return 'small';
  }

  private static getDeviceType(parserResult: any): DeviceContext['type'] {
    if (parserResult.device.type === 'mobile') return 'mobile';
    if (parserResult.device.type === 'tablet') return 'tablet';
    if (parserResult.device.type === 'smarttv') return 'tv';
    if (parserResult.device.type === 'embedded') return 'embedded';
    return 'desktop';
  }

  private static generateDeviceId(): string {
    // Try to use a persistent device identifier
    if (typeof localStorage !== 'undefined') {
      let deviceId = localStorage.getItem('ld_device_id');
      if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ld_device_id', deviceId);
      }
      return deviceId;
    }
    
    return 'device_' + Math.random().toString(36).substr(2, 9);
  }

  private static generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private static generateAnonymousId(): string {
    // Try to use a persistent anonymous identifier
    if (typeof localStorage !== 'undefined') {
      let anonId = localStorage.getItem('ld_anonymous_id');
      if (!anonId) {
        anonId = Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ld_anonymous_id', anonId);
      }
      return anonId;
    }
    
    return Math.random().toString(36).substr(2, 9);
  }

  private static extractUTMParams(): SessionContext['utm'] {
    if (typeof window === 'undefined') return {};
    
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined
    };
  }
}

// Export convenience functions
export const buildUserContext = ContextBuilder.buildUserContext;
export const buildDeviceContext = ContextBuilder.buildDeviceContext;
export const buildMultiContext = ContextBuilder.buildMultiContext;
export const buildAnonymousContext = ContextBuilder.buildAnonymousContext;
export const buildServerContext = ContextBuilder.buildServerContext;
