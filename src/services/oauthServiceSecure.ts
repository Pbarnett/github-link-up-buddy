import * as React from 'react';
/**
 * Secure OAuth Service with AWS Secrets Manager Integration
 *
 * Handles OAuth authentication for multiple providers with secure credential management.
 * Supports Google, GitHub, Discord, and other OAuth providers.
 */

import { secretCache } from '@/lib/aws-sdk-enhanced/examples/secrets-manager-usage';

// Environment configuration
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';

// OAuth provider configurations
export interface OAuthProvider {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

// Secret naming patterns for OAuth providers
const OAUTH_SECRET_PATTERNS = {
  google: `${ENVIRONMENT}/oauth/google-credentials`,
  github: `${ENVIRONMENT}/oauth/github-credentials`,
  discord: `${ENVIRONMENT}/oauth/discord-credentials`,
  microsoft: `${ENVIRONMENT}/oauth/microsoft-credentials`,
  apple: `${ENVIRONMENT}/oauth/apple-credentials`,
};

/**
 * Secure OAuth Configuration Manager
 */
export class OAuthSecureConfig {
  private static configCache = new Map<
    string,
    { config: OAuthProvider; expiry: number }
  >();
  private static readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes for OAuth configs

  /**
   * Get OAuth provider configuration securely
   */
  static async getProviderConfig(
    provider: keyof typeof OAUTH_SECRET_PATTERNS
  ): Promise<OAuthProvider> {
    const cacheKey = `oauth-${provider}`;
    const cached = this.configCache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      return cached.config;
    }

    try {
      const secretId = OAUTH_SECRET_PATTERNS[provider];
      const credentialsJson = await secretCache.getSecret(
        secretId,
        AWS_REGION,
        10 * 60 * 1000 // 10 minute cache
      );

      if (!credentialsJson) {
        throw new Error(
          `OAuth credentials not found for provider: ${provider}`
        );
      }

      const credentials = JSON.parse(credentialsJson);
      const config = this.buildProviderConfig(provider, credentials);

      // Cache the configuration
      this.configCache.set(cacheKey, {
        config,
        expiry: Date.now() + this.CACHE_TTL,
      });

      return config;
    } catch (error) {
      console.error(`Failed to get OAuth config for ${provider}:`, error);
      throw new Error(`Unable to configure ${provider} OAuth integration`);
    }
  }

  /**
   * Build provider-specific configuration
   */
  private static buildProviderConfig(
    provider: string,
    credentials: any
  ): OAuthProvider {
    const baseRedirectUri = `${window.location.origin}/auth/callback`;

    switch (provider) {
      case 'google':
        return {
          name: 'Google',
          clientId: credentials.client_id,
          clientSecret: credentials.client_secret,
          redirectUri: `${baseRedirectUri}/google`,
          scopes: ['openid', 'profile', 'email'],
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenUrl: 'https://oauth2.googleapis.com/token',
          userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
        };

      case 'github':
        return {
          name: 'GitHub',
          clientId: credentials.client_id,
          clientSecret: credentials.client_secret,
          redirectUri: `${baseRedirectUri}/github`,
          scopes: ['user:email', 'read:user'],
          authUrl: 'https://github.com/login/oauth/authorize',
          tokenUrl: 'https://github.com/login/oauth/access_token',
          userInfoUrl: 'https://api.github.com/user',
        };

      case 'discord':
        return {
          name: 'Discord',
          clientId: credentials.client_id,
          clientSecret: credentials.client_secret,
          redirectUri: `${baseRedirectUri}/discord`,
          scopes: ['identify', 'email'],
          authUrl: 'https://discord.com/api/oauth2/authorize',
          tokenUrl: 'https://discord.com/api/oauth2/token',
          userInfoUrl: 'https://discord.com/api/users/@me',
        };

      case 'microsoft':
        return {
          name: 'Microsoft',
          clientId: credentials.client_id,
          clientSecret: credentials.client_secret,
          redirectUri: `${baseRedirectUri}/microsoft`,
          scopes: ['openid', 'profile', 'email'],
          authUrl:
            'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
          tokenUrl:
            'https://login.microsoftonline.com/common/oauth2/v2.0/token',
          userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
        };

      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  /**
   * Clear OAuth configuration cache
   */
  static clearCache(): void {
    this.configCache.clear();
  }
}

/**
 * Secure OAuth Service
 */
export class OAuthServiceSecure {
  private static instance: OAuthServiceSecure;

  static getInstance(): OAuthServiceSecure {
    if (!OAuthServiceSecure.instance) {
      OAuthServiceSecure.instance = new OAuthServiceSecure();
    }
    return OAuthServiceSecure.instance;
  }

  /**
   * Generate secure OAuth authorization URL
   */
  async getAuthorizationUrl(
    provider: keyof typeof OAUTH_SECRET_PATTERNS,
    state?: string
  ): Promise<{
    url: string;
    state: string;
    codeVerifier?: string; // For PKCE
  }> {
    try {
      const config = await OAuthSecureConfig.getProviderConfig(provider);

      // Generate secure state parameter
      const secureState = state || this.generateSecureState();

      // Generate PKCE code verifier and challenge for enhanced security
      const { codeVerifier, codeChallenge } = await this.generatePKCE();

      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scopes.join(' '),
        response_type: 'code',
        state: secureState,
        // Add PKCE for enhanced security
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      // Provider-specific parameters
      if (provider === 'google') {
        params.append('access_type', 'offline');
        params.append('prompt', 'consent');
      }

      return {
        url: `${config.authUrl}?${params.toString()}`,
        state: secureState,
        codeVerifier,
      };
    } catch (error) {
      console.error(
        `Failed to generate authorization URL for ${provider}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    provider: keyof typeof OAUTH_SECRET_PATTERNS,
    code: string,
    state: string,
    codeVerifier?: string
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    tokenType: string;
  }> {
    try {
      const config = await OAuthSecureConfig.getProviderConfig(provider);

      const tokenParams = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
      });

      // Add PKCE code verifier if provided
      if (codeVerifier) {
        tokenParams.append('code_verifier', codeVerifier);
      }

      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: tokenParams.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Token exchange failed: ${response.status} - ${errorText}`
        );
      }

      const tokenData = await response.json();

      if (tokenData.error) {
        throw new Error(
          `OAuth error: ${tokenData.error_description || tokenData.error}`
        );
      }

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type || 'Bearer',
      };
    } catch (error) {
      console.error(`Failed to exchange code for token (${provider}):`, error);
      throw error;
    }
  }

  /**
   * Get user information from OAuth provider
   */
  async getUserInfo(
    provider: keyof typeof OAUTH_SECRET_PATTERNS,
    accessToken: string
  ): Promise<{
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: string;
  }> {
    try {
      const config = await OAuthSecureConfig.getProviderConfig(provider);

      const response = await fetch(config.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const userData = await response.json();

      // Map provider-specific user data to standardized format
      return this.mapUserData(provider, userData);
    } catch (error) {
      console.error(`Failed to get user info (${provider}):`, error);
      throw error;
    }
  }

  /**
   * Refresh OAuth token
   */
  async refreshToken(
    provider: keyof typeof OAUTH_SECRET_PATTERNS,
    refreshToken: string
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    try {
      const config = await OAuthSecureConfig.getProviderConfig(provider);

      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const tokenData = await response.json();

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || refreshToken,
        expiresIn: tokenData.expires_in,
      };
    } catch (error) {
      console.error(`Failed to refresh token (${provider}):`, error);
      throw error;
    }
  }

  /**
   * Generate secure state parameter
   */
  private generateSecureState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Generate PKCE code verifier and challenge
   */
  private async generatePKCE(): Promise<{
    codeVerifier: string;
    codeChallenge: string;
  }> {
    // Generate random code verifier
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Generate code challenge using SHA256
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return { codeVerifier, codeChallenge };
  }

  /**
   * Map provider-specific user data to standardized format
   */
  private mapUserData(
    provider: string,
    userData: any
  ): {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: string;
  } {
    switch (provider) {
      case 'google':
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.picture,
          provider: 'google',
        };

      case 'github':
        return {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name || userData.login,
          avatar: userData.avatar_url,
          provider: 'github',
        };

      case 'discord':
        return {
          id: userData.id,
          email: userData.email,
          name: userData.username,
          avatar: userData.avatar
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
            : undefined,
          provider: 'discord',
        };

      case 'microsoft':
        return {
          id: userData.id,
          email: userData.mail || userData.userPrincipalName,
          name: userData.displayName,
          avatar: undefined, // Microsoft Graph doesn't provide avatar in user info
          provider: 'microsoft',
        };

      default:
        throw new Error(
          `Unsupported provider for user data mapping: ${provider}`
        );
    }
  }
}

/**
 * OAuth utility functions
 */
export const OAuthUtils = {
  /**
   * Validate OAuth state parameter
   */
  validateState: (receivedState: string, expectedState: string): boolean => {
    return receivedState === expectedState;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (expiresIn: number, issuedAt: number): boolean => {
    const now = Math.floor(Date.now() / 1000);
    return now >= issuedAt + expiresIn;
  },

  /**
   * Get provider display name
   */
  getProviderDisplayName: (provider: string): string => {
    const displayNames = {
      google: 'Google',
      github: 'GitHub',
      discord: 'Discord',
      microsoft: 'Microsoft',
    };
    return displayNames[provider as keyof typeof displayNames] || provider;
  },
};

// Export singleton instance
export const oauthServiceSecure = OAuthServiceSecure.getInstance();
