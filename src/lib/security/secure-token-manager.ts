import { EncryptCommand, DecryptCommand, KMSClient } from '@aws-sdk/client-kms';
import { nanoid } from 'nanoid';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scopes: string[];
}

interface TokenEntry {
  encryptedToken: string;
  expiresAt: number;
  refreshToken: string;
  tokenType: string;
  scopes: string[];
}

/**
 * Secure Token Manager for managing and refreshing auth tokens
 */
export class SecureTokenManager {
  private tokenCache = new Map<string, TokenEntry>();
  private readonly TOKEN_ENCRYPTION_KEY = 'alias/auth-tokens';
  private readonly TOKEN_TTL = 3600000; // 1 hour
  private readonly REFRESH_THRESHOLD = 300000; // 5 minutes before expiry
  private kmsClient: KMSClient;

  constructor(kmsClient: KMSClient) {
    this.kmsClient = kmsClient;
  }

  /**
   * Store auth token with encryption
   */
  async storeAuthToken(userId: string, token: AuthToken): Promise<void> {
    // Encrypt token before caching
    const encryptedToken = await this.encryptToken(token);
    
    const tokenEntry: TokenEntry = {
      encryptedToken,
      expiresAt: Date.now() + token.expiresIn * 1000,
      refreshToken: await this.encryptToken(token.refreshToken),
      tokenType: token.tokenType,
      scopes: token.scopes
    };

    this.tokenCache.set(userId, tokenEntry);

    // Recommend storing in Secrets Manager for persistence if needed
  }

  /**
   * Retrieve an auth token, refreshing if necessary
   */
  async getAuthToken(userId: string): Promise<AuthToken | null> {
    let tokenEntry = this.tokenCache.get(userId);

    if (!tokenEntry || tokenEntry.expiresAt <= Date.now()) {
      return null; // Token is expired
    }

    // Proactive refresh if near expiry
    if (tokenEntry.expiresAt - Date.now() < this.REFRESH_THRESHOLD) {
      this.refreshTokenAsync(userId, tokenEntry.refreshToken);
    }

    return await this.decryptToken(tokenEntry.encryptedToken);
  }

  /**
   * Encrypt a token with KMS
   */
  private async encryptToken(token: any): Promise<string> {
    const command = new EncryptCommand({
      KeyId: this.TOKEN_ENCRYPTION_KEY,
      Plaintext: Buffer.from(JSON.stringify(token)),
      EncryptionContext: {
        purpose: 'auth-token',
        timestamp: new Date().toISOString(),
        nonce: nanoid()
      }
    });

    const result = await this.kmsClient.send(command);
    return Buffer.from(result.CiphertextBlob!).toString('base64');
  }

  /**
   * Decrypt a token with KMS
   */
  private async decryptToken(encryptedToken: string): Promise<AuthToken> {
    const ciphertextBlob = Buffer.from(encryptedToken, 'base64');

    const command = new DecryptCommand({
      CiphertextBlob: ciphertextBlob,
      EncryptionContext: {
        purpose: 'auth-token'
      }
    });

    const result = await this.kmsClient.send(command);
    return JSON.parse(Buffer.from(result.Plaintext!).toString('utf8')) as AuthToken;
  }

  /**
   * Refresh a token asynchronously
   */
  private async refreshTokenAsync(userId: string, encryptedRefreshToken: string): Promise<void> {
    try {
      const refreshToken = await this.decryptToken(encryptedRefreshToken);
      const newToken = await this.refreshWithProvider(refreshToken.refreshToken);
      await this.storeAuthToken(userId, newToken);
    } catch (error) {
      console.error(`Failed to refresh token for user ${userId}:`, error);
      // Invalidate cached token on refresh failure
      this.tokenCache.delete(userId);
    }
  }

  /**
   * Simulate a provider refresh
   */
  private async refreshWithProvider(refreshToken: string): Promise<AuthToken> {
    // Simulate a token refresh from provider
    return {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
      tokenType: 'Bearer',
      scopes: ['read', 'write']
    };
  }
}
