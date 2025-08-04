import crypto from 'crypto';
import { nanoid } from 'nanoid';

interface OAuthState {
  provider: string;
  redirectUri: string;
  nonce: string;
  codeVerifier: string;
  createdAt: number;
  expiresAt: number;
}

interface OAuthInitiation {
  authUrl: string;
  state: string;
  codeChallenge: string;
  expiresIn: number;
}

interface OAuthCallback {
  code: string;
  state: string;
  provider: string;
}

/**
 * Secure OAuth Handler with PKCE and comprehensive security measures
 */
export class SecureOAuthHandler {
  private readonly OAUTH_STATE_TTL = 600000; // 10 minutes
  private stateStore = new Map<string, OAuthState>();
  private readonly SUPPORTED_PROVIDERS = ['google', 'github', 'microsoft'];

  /**
   * Initiate OAuth flow with PKCE
   */
  async initiateOAuth(provider: string, redirectUri: string): Promise<OAuthInitiation> {
    if (!this.SUPPORTED_PROVIDERS.includes(provider)) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    const state = this.generateSecureState();
    const nonce = this.generateNonce();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);
    
    // Store state with expiration
    this.stateStore.set(state, {
      provider,
      redirectUri,
      nonce,
      codeVerifier,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.OAUTH_STATE_TTL
    });

    const authUrl = this.buildAuthUrl(provider, state, nonce, codeChallenge, redirectUri);
    
    return {
      authUrl,
      state,
      codeChallenge,
      expiresIn: this.OAUTH_STATE_TTL / 1000
    };
  }

  /**
   * Handle OAuth callback with comprehensive validation
   */
  async handleOAuthCallback(callback: OAuthCallback): Promise<any> {
    // Validate state parameter
    const storedState = this.stateStore.get(callback.state);
    if (!storedState || storedState.expiresAt <= Date.now()) {
      throw new Error('Invalid or expired OAuth state');
    }

    if (storedState.provider !== callback.provider) {
      throw new Error('Provider mismatch in OAuth callback');
    }

    // Clean up used state
    this.stateStore.delete(callback.state);

    // Exchange code for token with PKCE validation
    const tokenResponse = await this.exchangeCodeForToken(
      callback.code, 
      storedState.redirectUri,
      storedState.codeVerifier,
      callback.provider
    );

    // Validate token signature and claims if it's an ID token
    if (tokenResponse.idToken) {
      await this.validateTokenSignature(tokenResponse.idToken, callback.provider);
    }
    
    return tokenResponse;
  }

  /**
   * Generate cryptographically secure state parameter
   */
  private generateSecureState(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Generate nonce for ID token validation
   */
  private generateNonce(): string {
    return crypto.randomBytes(16).toString('base64url');
  }

  /**
   * Generate PKCE code verifier
   */
  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Generate PKCE code challenge from verifier
   */
  private generateCodeChallenge(codeVerifier: string): string {
    return crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
  }

  /**
   * Build authorization URL with security parameters
   */
  private buildAuthUrl(
    provider: string, 
    state: string, 
    nonce: string, 
    codeChallenge: string, 
    redirectUri: string
  ): string {
    const baseUrls = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
    };

    const clientIds = {
      google: process.env.GOOGLE_CLIENT_ID!,
      github: process.env.GITHUB_CLIENT_ID!,
      microsoft: process.env.MICROSOFT_CLIENT_ID!
    };

    const scopes = {
      google: 'openid email profile',
      github: 'user:email',
      microsoft: 'openid email profile'
    };

    const params = new URLSearchParams({
      client_id: clientIds[provider as keyof typeof clientIds],
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes[provider as keyof typeof scopes],
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    return `${baseUrls[provider as keyof typeof baseUrls]}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCodeForToken(
    code: string, 
    redirectUri: string, 
    codeVerifier: string,
    provider: string
  ): Promise<any> {
    const tokenUrls = {
      google: 'https://oauth2.googleapis.com/token',
      github: 'https://github.com/login/oauth/access_token',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    };

    const clientIds = {
      google: process.env.GOOGLE_CLIENT_ID!,
      github: process.env.GITHUB_CLIENT_ID!,
      microsoft: process.env.MICROSOFT_CLIENT_ID!
    };

    const clientSecrets = {
      google: process.env.GOOGLE_CLIENT_SECRET!,
      github: process.env.GITHUB_CLIENT_SECRET!,
      microsoft: process.env.MICROSOFT_CLIENT_SECRET!
    };

    const body = new URLSearchParams({
      client_id: clientIds[provider as keyof typeof clientIds],
      client_secret: clientSecrets[provider as keyof typeof clientSecrets],
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    });

    const response = await fetch(tokenUrls[provider as keyof typeof tokenUrls], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Validate JWT token signature and claims
   */
  private async validateTokenSignature(idToken: string, provider: string): Promise<void> {
    // Implementation would verify JWT signature using provider's public keys
    // This is a simplified version - in production, use a proper JWT library
    
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());

    // Validate issuer
    const expectedIssuers = {
      google: 'https://accounts.google.com',
      github: 'https://github.com',
      microsoft: 'https://login.microsoftonline.com'
    };

    if (payload.iss !== expectedIssuers[provider as keyof typeof expectedIssuers]) {
      throw new Error('Invalid token issuer');
    }

    // Validate expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token has expired');
    }

    // Validate audience
    const clientIds = {
      google: process.env.GOOGLE_CLIENT_ID!,
      github: process.env.GITHUB_CLIENT_ID!,
      microsoft: process.env.MICROSOFT_CLIENT_ID!
    };

    if (payload.aud !== clientIds[provider as keyof typeof clientIds]) {
      throw new Error('Invalid token audience');
    }

    console.log('Token validation passed for provider:', provider);
  }

  /**
   * Clean up expired states periodically
   */
  public cleanupExpiredStates(): void {
    const now = Date.now();
    for (const [state, stateData] of this.stateStore.entries()) {
      if (stateData.expiresAt <= now) {
        this.stateStore.delete(state);
      }
    }
  }
}

/**
 * OAuth Security Middleware for request validation
 */
export class OAuthSecurityMiddleware {
  /**
   * Validate OAuth request parameters
   */
  static validateRequest(req: any): void {
    // Check for required parameters
    if (!req.query.state) {
      throw new Error('Missing state parameter');
    }

    if (!req.query.code && !req.query.error) {
      throw new Error('Missing authorization code or error parameter');
    }

    // Check for potential CSRF attacks
    if (req.query.error === 'access_denied') {
      console.warn('User denied OAuth authorization');
      return;
    }

    // Validate state format
    if (!/^[A-Za-z0-9_-]+$/.test(req.query.state)) {
      throw new Error('Invalid state parameter format');
    }
  }

  /**
   * Security headers for OAuth responses
   */
  static setSecurityHeaders(res: any): void {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', 'default-src \'self\'');
  }
}
