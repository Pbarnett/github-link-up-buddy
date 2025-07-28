import * as React from 'react';
import { LDContext } from 'launchdarkly-js-client-sdk';

export interface UserAttributes {
  userId?: string;
  email?: string;
  name?: string;
  avatar?: string;
  subscription?: 'free' | 'premium' | 'enterprise';
  country?: string;
  language?: string;
  timezone?: string;
  signupDate?: string;
  lastLogin?: string;
  features?: string[];
  experimentGroup?: string;
  customAttributes?: Record<string, string | number | boolean>;
}

export class LaunchDarklyContextManager {
  /**
   * Creates a LaunchDarkly context from user attributes
   */
  static createContext(userAttributes: UserAttributes): LDContext {
    const { userId, customAttributes, ...standardAttributes } = userAttributes;

    return {
      kind: 'user',
      key: userId || 'anonymous',
      ...standardAttributes,
      ...customAttributes,
    };
  }

  /**
   * Creates an anonymous context for non-authenticated users
   */
  static createAnonymousContext(sessionId?: string): LDContext {
    return {
      kind: 'user',
      key:
        sessionId ||
        `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      anonymous: true,
    };
  }

  /**
   * Updates context with authentication information
   */
  static updateContextOnAuth(
    currentContext: LDContext,
    userAttributes: UserAttributes
  ): LDContext {
    const newContext = this.createContext(userAttributes);

    // Preserve any existing attributes that aren't being updated
    return {
      ...currentContext,
      ...newContext,
      anonymous: false,
    };
  }

  /**
   * Updates context with subscription changes
   */
  static updateContextOnSubscription(
    currentContext: LDContext,
    subscription: 'free' | 'premium' | 'enterprise'
  ): LDContext {
    return {
      ...currentContext,
      subscription,
    };
  }

  /**
   * Updates context with feature usage tracking
   * Note: Using custom attributes since 'features' is not part of LDContext
   */
  static updateContextWithFeatureUsage(
    currentContext: LDContext,
    featureKey: string,
    used: boolean = true
  ): LDContext {
    const currentFeatures = (currentContext as any).customFeatures || [];
    const updatedFeatures = used
      ? [...new Set([...currentFeatures, featureKey])]
      : currentFeatures.filter((f: string) => f !== featureKey);

    return {
      ...currentContext,
      customFeatures: updatedFeatures,
      lastFeatureUsed: used
        ? featureKey
        : (currentContext as any).lastFeatureUsed,
      lastActivity: new Date().toISOString(),
    };
  }

  /**
   * Updates context with location information
   */
  static updateContextWithLocation(
    currentContext: LDContext,
    country?: string,
    timezone?: string
  ): LDContext {
    return {
      ...currentContext,
      ...(country && { country }),
      ...(timezone && { timezone }),
    };
  }

  /**
   * Creates a context for A/B testing
   */
  static createExperimentContext(
    userAttributes: UserAttributes,
    experimentGroup: string
  ): LDContext {
    return {
      ...this.createContext(userAttributes),
      experimentGroup,
      experimentStarted: new Date().toISOString(),
    };
  }

  /**
   * Validates context before sending to LaunchDarkly
   */
  static validateContext(context: LDContext): boolean {
    // Key is required
    if (!context.key || context.key.length === 0) {
      console.warn('LaunchDarkly context missing required key');
      return false;
    }

    // Key should be a string
    if (typeof context.key !== 'string') {
      console.warn('LaunchDarkly context key must be a string');
      return false;
    }

    // Kind should be 'user' or other valid types
    // Note: kind property may not exist on all LDContext types, so we check if it exists as a custom property
    const contextKind = (context as any).kind;
    if (
      contextKind &&
      !['user', 'organization', 'device'].includes(contextKind as string)
    ) {
      console.warn(
        'LaunchDarkly context kind should be user, organization, or device'
      );
      return false;
    }

    return true;
  }

  /**
   * Sanitizes context to remove sensitive information
   */
  static sanitizeContext(context: LDContext): LDContext {
    const {
      password,
      token,
      secret,
      apiKey,
      creditCard,
      ssn,
      ...sanitizedContext
    } = context as any;

    return sanitizedContext;
  }
}
