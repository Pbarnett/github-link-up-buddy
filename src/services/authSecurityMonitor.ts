import * as React from 'react';
// Authentication Security Monitoring Service
// Tracks security events, authentication patterns, and potential threats

interface SecurityEvent {
  id: string;
  type:
    | 'AUTH_SUCCESS'
    | 'AUTH_FAILURE'
    | 'SUSPICIOUS_ACTIVITY'
    | 'TOKEN_VALIDATION_FAILED'
    | 'PRIVACY_MODE_DETECTED';
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
    authMethod?: 'one_tap' | 'popup' | 'redirect' | 'fedcm';
    privacyMode?: 'standard' | 'fedcm' | 'redirect';
    errorCode?: string;
    errorMessage?: string;
    tokenClaims?: any;
    browserInfo?: BrowserInfo;
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0-100
}

interface BrowserInfo {
  name: string;
  version: string;
  platform: string;
  isMobile: boolean;
  cookiesEnabled: boolean;
  thirdPartyCookiesBlocked: boolean;
  fedcmSupported: boolean;
}

interface SecurityMetrics {
  totalAuthAttempts: number;
  successfulAuths: number;
  failedAuths: number;
  suspiciousActivities: number;
  privacyModeDetections: number;
  averageRiskScore: number;
  lastUpdated: number;
}

interface AuthPattern {
  pattern: string;
  frequency: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

class AuthSecurityMonitor {
  private events: SecurityEvent[] = [];
  private metrics: SecurityMetrics;
  private patterns: Map<string, AuthPattern> = new Map();
  private maxEvents = 1000; // Keep last 1000 events in memory
  private alertThresholds = {
    failureRate: 0.3, // 30% failure rate triggers alert
    suspiciousActivity: 5, // 5 suspicious events in 1 hour
    riskScoreThreshold: 75, // Risk score above 75 triggers alert
  };

  constructor() {
    this.metrics = this.initializeMetrics();
    this.setupPatternDetection();
    this.startPeriodicAnalysis();
  }

  /**
   * Log a security event
   */
  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      ...event,
    };

    // Add to events array
    this.events.push(securityEvent);

    // Maintain max events limit
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Update metrics
    this.updateMetrics(securityEvent);

    // Check for suspicious patterns
    this.analyzeEvent(securityEvent);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`🛡️ Security Event [${event.severity}]:`, securityEvent);
    }

    // Send to external monitoring service if configured
    this.reportToExternalService(securityEvent);
  }

  /**
   * Log successful authentication
   */
  logAuthSuccess(data: {
    userId: string;
    sessionId: string;
    authMethod: 'one_tap' | 'popup' | 'redirect' | 'fedcm';
    privacyMode: 'standard' | 'fedcm' | 'redirect';
    tokenClaims?: any;
  }): void {
    const browserInfo = this.getBrowserInfo();

    this.logEvent({
      type: 'AUTH_SUCCESS',
      userId: data.userId,
      sessionId: data.sessionId,
      metadata: {
        userAgent: navigator.userAgent,
        authMethod: data.authMethod,
        privacyMode: data.privacyMode,
        tokenClaims: data.tokenClaims,
        browserInfo,
      },
      severity: 'LOW',
      riskScore: this.calculateRiskScore('AUTH_SUCCESS', {
        authMethod: data.authMethod,
        privacyMode: data.privacyMode,
        browserInfo,
      }),
    });
  }

  /**
   * Log authentication failure
   */
  logAuthFailure(data: {
    authMethod: 'one_tap' | 'popup' | 'redirect' | 'fedcm';
    errorCode?: string;
    errorMessage?: string;
    userId?: string;
  }): void {
    const browserInfo = this.getBrowserInfo();

    this.logEvent({
      type: 'AUTH_FAILURE',
      userId: data.userId,
      metadata: {
        userAgent: navigator.userAgent,
        authMethod: data.authMethod,
        errorCode: data.errorCode,
        errorMessage: data.errorMessage,
        browserInfo,
      },
      severity: 'MEDIUM',
      riskScore: this.calculateRiskScore('AUTH_FAILURE', {
        authMethod: data.authMethod,
        errorCode: data.errorCode,
        browserInfo,
      }),
    });
  }

  /**
   * Log token validation failure
   */
  logTokenValidationFailure(data: {
    reason: string;
    tokenClaims?: any;
    expectedAudience?: string;
  }): void {
    this.logEvent({
      type: 'TOKEN_VALIDATION_FAILED',
      metadata: {
        userAgent: navigator.userAgent,
        errorMessage: data.reason,
        tokenClaims: data.tokenClaims,
        browserInfo: this.getBrowserInfo(),
      },
      severity: 'HIGH',
      riskScore: this.calculateRiskScore('TOKEN_VALIDATION_FAILED', {
        reason: data.reason,
        tokenClaims: data.tokenClaims,
      }),
    });
  }

  /**
   * Log privacy mode detection
   */
  logPrivacyModeDetection(mode: 'standard' | 'fedcm' | 'redirect'): void {
    const browserInfo = this.getBrowserInfo();

    this.logEvent({
      type: 'PRIVACY_MODE_DETECTED',
      metadata: {
        userAgent: navigator.userAgent,
        privacyMode: mode,
        browserInfo,
      },
      severity: 'LOW',
      riskScore: this.calculateRiskScore('PRIVACY_MODE_DETECTED', {
        mode,
        browserInfo,
      }),
    });
  }

  /**
   * Get current security metrics
   */
  getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(-limit).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEvent['type'], hours = 24): SecurityEvent[] {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return this.events.filter(
      event => event.type === type && event.timestamp > cutoff
    );
  }

  /**
   * Get security alerts
   */
  getSecurityAlerts(): string[] {
    const alerts: string[] = [];
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Check failure rate
    const recentEvents = this.events.filter(
      event => event.timestamp > now - oneHour
    );
    const failures = recentEvents.filter(
      event => event.type === 'AUTH_FAILURE'
    );
    const failureRate =
      recentEvents.length > 0 ? failures.length / recentEvents.length : 0;

    if (failureRate > this.alertThresholds.failureRate) {
      alerts.push(
        `High authentication failure rate: ${(failureRate * 100).toFixed(1)}%`
      );
    }

    // Check suspicious activities
    const suspiciousEvents = this.getEventsByType('SUSPICIOUS_ACTIVITY', 1);
    if (suspiciousEvents.length >= this.alertThresholds.suspiciousActivity) {
      alerts.push(
        `Multiple suspicious activities detected: ${suspiciousEvents.length} in the last hour`
      );
    }

    // Check high risk scores
    const highRiskEvents = recentEvents.filter(
      event => event.riskScore > this.alertThresholds.riskScoreThreshold
    );
    if (highRiskEvents.length > 0) {
      alerts.push(
        `${highRiskEvents.length} high-risk authentication events detected`
      );
    }

    return alerts;
  }

  /**
   * Analyze authentication patterns
   */
  analyzePatterns(): AuthPattern[] {
    return Array.from(this.patterns.values()).sort(
      (a, b) => b.frequency - a.frequency
    );
  }

  private initializeMetrics(): SecurityMetrics {
    return {
      totalAuthAttempts: 0,
      successfulAuths: 0,
      failedAuths: 0,
      suspiciousActivities: 0,
      privacyModeDetections: 0,
      averageRiskScore: 0,
      lastUpdated: Date.now(),
    };
  }

  private setupPatternDetection(): void {
    // Initialize common patterns
    this.patterns.set('repeated_failures', {
      pattern: 'Multiple authentication failures from same source',
      frequency: 0,
      riskLevel: 'HIGH',
      description:
        'Multiple failed authentication attempts may indicate brute force attack',
    });

    this.patterns.set('token_validation_failures', {
      pattern: 'Token validation failures',
      frequency: 0,
      riskLevel: 'HIGH',
      description: 'Token validation failures may indicate token manipulation',
    });

    this.patterns.set('privacy_mode_usage', {
      pattern: 'Privacy mode authentication',
      frequency: 0,
      riskLevel: 'LOW',
      description: 'Users accessing with enhanced privacy settings',
    });
  }

  private updateMetrics(event: SecurityEvent): void {
    this.metrics.totalAuthAttempts++;

    switch (event.type) {
      case 'AUTH_SUCCESS':
        this.metrics.successfulAuths++;
        break;
      case 'AUTH_FAILURE':
        this.metrics.failedAuths++;
        break;
      case 'SUSPICIOUS_ACTIVITY':
        this.metrics.suspiciousActivities++;
        break;
      case 'PRIVACY_MODE_DETECTED':
        this.metrics.privacyModeDetections++;
        break;
    }

    // Update average risk score
    const totalRiskScore = this.events.reduce((sum, e) => sum + e.riskScore, 0);
    this.metrics.averageRiskScore = totalRiskScore / this.events.length;
    this.metrics.lastUpdated = Date.now();
  }

  private analyzeEvent(event: SecurityEvent): void {
    // Pattern: Repeated failures
    if (event.type === 'AUTH_FAILURE') {
      const recentFailures = this.getEventsByType('AUTH_FAILURE', 1);
      if (recentFailures.length >= 3) {
        const pattern = this.patterns.get('repeated_failures')!;
        pattern.frequency++;

        this.logEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          metadata: {
            pattern: 'repeated_failures',
            count: recentFailures.length,
            userAgent: navigator.userAgent,
            browserInfo: this.getBrowserInfo(),
          },
          severity: 'HIGH',
          riskScore: 85,
        });
      }
    }

    // Pattern: Token validation failures
    if (event.type === 'TOKEN_VALIDATION_FAILED') {
      const pattern = this.patterns.get('token_validation_failures')!;
      pattern.frequency++;
    }

    // Pattern: Privacy mode usage
    if (event.type === 'PRIVACY_MODE_DETECTED') {
      const pattern = this.patterns.get('privacy_mode_usage')!;
      pattern.frequency++;
    }
  }

  private calculateRiskScore(
    eventType: SecurityEvent['type'],
    context: any
  ): number {
    let baseScore = 0;

    // Base scores by event type
    switch (eventType) {
      case 'AUTH_SUCCESS':
        baseScore = 5;
        break;
      case 'AUTH_FAILURE':
        baseScore = 30;
        break;
      case 'TOKEN_VALIDATION_FAILED':
        baseScore = 70;
        break;
      case 'SUSPICIOUS_ACTIVITY':
        baseScore = 80;
        break;
      case 'PRIVACY_MODE_DETECTED':
        baseScore = 10;
        break;
    }

    // Adjust based on context
    if (context.authMethod === 'redirect' && eventType === 'AUTH_SUCCESS') {
      baseScore += 10; // Redirect mode might indicate privacy restrictions
    }

    if (context.privacyMode === 'fedcm') {
      baseScore -= 5; // FedCM is more secure
    }

    if (context.errorCode === 'popup_blocked') {
      baseScore -= 10; // Common, not necessarily suspicious
    }

    if (context.browserInfo?.thirdPartyCookiesBlocked) {
      baseScore += 5; // Slightly higher risk due to privacy restrictions
    }

    // Recent failure history affects risk score
    const recentFailures = this.getEventsByType('AUTH_FAILURE', 1).length;
    baseScore += recentFailures * 5;

    return Math.min(100, Math.max(0, baseScore));
  }

  private getBrowserInfo(): BrowserInfo {
    const userAgent = navigator.userAgent;

    return {
      name: this.getBrowserName(userAgent),
      version: this.getBrowserVersion(userAgent),
      platform: navigator.platform,
      isMobile: /Mobi|Android/i.test(userAgent),
      cookiesEnabled: navigator.cookieEnabled,
      thirdPartyCookiesBlocked: this.detectThirdPartyCookieBlocking(),
      fedcmSupported: 'IdentityCredential' in window,
    };
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getBrowserVersion(userAgent: string): string {
    const match = userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/(\d+)/);
    return match ? match[1] : 'Unknown';
  }

  private detectThirdPartyCookieBlocking(): boolean {
    try {
      // Simple test for third-party cookie blocking
      localStorage.setItem('third-party-test', 'test');
      localStorage.removeItem('third-party-test');
      return false;
    } catch {
      return true;
    }
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportToExternalService(event: SecurityEvent): void {
    // In production, send critical events to external monitoring service
    if (event.severity === 'CRITICAL' || event.riskScore > 90) {
      // Example: Send to logging service, SIEM, or security monitoring platform
      // fetch('/api/security/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });

      console.warn('🚨 Critical Security Event:', event);
    }
  }

  private startPeriodicAnalysis(): void {
    // Run security analysis every 5 minutes
    setInterval(
      () => {
        const alerts = this.getSecurityAlerts();
        if (alerts.length > 0) {
          console.warn('🛡️ Security Alerts:', alerts);
        }

        // Clean up old events (older than 24 hours)
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        this.events = this.events.filter(event => event.timestamp > cutoff);
      },
      5 * 60 * 1000
    ); // 5 minutes
  }
}

// Export singleton instance
export const authSecurityMonitor = new AuthSecurityMonitor();

// Export types for external use
export type { SecurityEvent, SecurityMetrics, AuthPattern, BrowserInfo };
