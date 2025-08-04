import { KMSClient } from '@aws-sdk/client-kms';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Agent } from 'https';

// Multi-Region Client Manager for optimal failover performance
export class MultiRegionClientManager {
  private clients = new Map<string, { kms: KMSClient; secrets: SecretsManagerClient }>();
  private primaryRegion = 'us-west-2';
  private fallbackRegion = 'us-east-1';

  getClients(preferredRegion?: string): { kms: KMSClient; secrets: SecretsManagerClient } {
    const region = preferredRegion || this.primaryRegion;
    
    if (!this.clients.has(region)) {
      this.clients.set(region, {
        kms: new KMSClient({
          region,
          maxAttempts: 3
        }),
        secrets: new SecretsManagerClient({
          region,
          maxAttempts: 3
        })
      });
    }
    
    return this.clients.get(region)!;
  }

  async executeWithFailover<T>(operation: (clients: { kms: KMSClient; secrets: SecretsManagerClient }) => Promise<T>): Promise<T> {
    try {
      return await operation(this.getClients(this.primaryRegion));
    } catch (error) {
      console.warn(`Primary region ${this.primaryRegion} failed, trying fallback`);
      return await operation(this.getClients(this.fallbackRegion));
    }
  }
}
