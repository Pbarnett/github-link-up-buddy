import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

// Staggered Secret Cache for reliable secret retrieval
export class SecretCache {
  private cache = new Map<string, { value: any; version: string; primaryExpiry: number; secondaryExpiry: number; refreshing: boolean }>();
  private readonly PRIMARY_TTL = 240000; // 4 minutes
  private readonly SECONDARY_TTL = 300000; // 5 minutes

  async getSecret(secretId: string, secretsClient: SecretsManagerClient): Promise<any> {
    const cached = this.cache.get(secretId);
    
    if (cached) {
      // If within primary TTL, return immediately
      if (cached.primaryExpiry > Date.now()) {
        return cached.value;
      }
      
      // If within secondary TTL but past primary, trigger async refresh
      if (cached.secondaryExpiry > Date.now()) {
        if (!cached.refreshing) {
          this.refreshSecretAsync(secretId, secretsClient);
        }
        return cached.value;
      }
    }
    
    // Force synchronous refresh if no cache or expired
    return await this.refreshSecret(secretId, secretsClient);
  }

  private async refreshSecretAsync(secretId: string, secretsClient: SecretsManagerClient): Promise<void> {
    const cached = this.cache.get(secretId);
    if (cached) {
      cached.refreshing = true;
    }
    
    try {
      await this.refreshSecret(secretId, secretsClient);
    } catch (error) {
      console.error(`Failed to refresh secret ${secretId}:`, error);
    } finally {
      if (cached) {
        cached.refreshing = false;
      }
    }
  }

  private async refreshSecret(secretId: string, secretsClient: SecretsManagerClient): Promise<any> {
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const result = await secretsClient.send(command);
    
    const now = Date.now();
    const secretData = {
      value: JSON.parse(result.SecretString!),
      version: result.VersionId!,
      primaryExpiry: now + this.PRIMARY_TTL,
      secondaryExpiry: now + this.SECONDARY_TTL,
      refreshing: false
    };
    
    this.cache.set(secretId, secretData);
    return secretData.value;
  }
}
