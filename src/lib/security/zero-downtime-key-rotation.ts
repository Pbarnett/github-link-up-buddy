interface ApiKeySet {
  primary: string;
  secondary?: string;
  rotationStarted?: number;
  gracePeriod: number; // milliseconds
}

/**
 * Zero Downtime Key Rotation for APIs
 */
export class ZeroDowntimeKeyRotation {
  private activeKeys = new Map<string, ApiKeySet>();
  private rotationInProgress = new Set<string>();

  /**
   * Rotate API key for a given service
   */
  async rotateApiKey(service: string): Promise<void> {
    if (this.rotationInProgress.has(service)) {
      throw new Error(`Rotation already in progress for ${service}`);
    }

    this.rotationInProgress.add(service);

    try {
      await this.executeRotation(service);
    } finally {
      this.rotationInProgress.delete(service);
    }
  }

  /**
   * Execute the key rotation process
   */
  private async executeRotation(service: string): Promise<void> {
    const currentKeys = this.activeKeys.get(service);
    if (!currentKeys) {
      throw new Error(`No active keys found for service ${service}`);
    }

    // Step 1: Generate new key
    const newKey = await this.generateNewApiKey(service);
    
    // Step 2: Store new key as secondary
    const updatedKeys: ApiKeySet = {
      primary: currentKeys.primary,
      secondary: newKey,
      rotationStarted: Date.now(),
      gracePeriod: this.getGracePeriod(service)
    };

    await this.updateSecretsManager(service, updatedKeys);
    this.activeKeys.set(service, updatedKeys);

    // Step 3: Wait for grace period
    await this.waitForGracePeriod(service);

    // Step 4: Promote secondary to primary
    const finalKeys: ApiKeySet = {
      primary: newKey,
      gracePeriod: updatedKeys.gracePeriod
    };

    await this.updateSecretsManager(service, finalKeys);
    this.activeKeys.set(service, finalKeys);

    // Step 5: Revoke old key
    await this.revokeOldApiKey(service, currentKeys.primary);
  }

  /**
   * Grace period waiting
   */
  private async waitForGracePeriod(service: string): Promise<void> {
    const gracePeriod = this.activeKeys.get(service)?.gracePeriod || 600000;
    return new Promise((resolve) => setTimeout(resolve, gracePeriod));
  }

  /**
   * Get grace period for a service
   */
  private getGracePeriod(service: string): number {
    const gracePeriods = {
      'stripe': 300000,    // 5 minutes
      'twilio': 600000,    // 10 minutes
      'duffel': 900000,    // 15 minutes
      'amadeus': 1800000,  // 30 minutes
      'openai': 300000     // 5 minutes
    };
    
    return gracePeriods[service] || 600000; // Default 10 minutes
  }

  /**
   * Generate a new API key for a service
   */
  private async generateNewApiKey(service: string): Promise<string> {
    // Mocked API key generation - replace with real implementation
    return `new-key-for-${service}-${Date.now()}`;
  }

  /**
   * Update Secrets Manager with new keys
   */
  private async updateSecretsManager(service: string, keys: ApiKeySet): Promise<void> {
    // Update the key set in Secrets Manager
    console.log(`Updating Secrets Manager for ${service} with keys:`, keys);
  }

  /**
   * Revoke an old API key
   */
  private async revokeOldApiKey(service: string, oldKey: string): Promise<void> {
    // Mock key revocation
    console.log(`Revoking old API key for ${service}: ${oldKey}`);
  }

  /**
   * Retrieve current API key for a service
   */
  async getApiKey(service: string): Promise<string> {
    const keys = this.activeKeys.get(service);
    if (!keys) {
      // Fallback to Secrets Manager
      return await this.retrieveFromSecretsManager(service);
    }

    // During rotation, try secondary key if primary fails
    if (keys.secondary && keys.rotationStarted) {
      const rotationAge = Date.now() - keys.rotationStarted;
      if (rotationAge > keys.gracePeriod / 2) {
        return keys.secondary; // Prefer new key in second half of grace period
      }
    }

    return keys.primary;
  }

  /**
   * Retrieve API key from Secrets Manager (mock)
   */
  private async retrieveFromSecretsManager(service: string): Promise<string> {
    // Mock retrieval - replace with real Secrets Manager logic
    return `mock-key-for-${service}`;
  }
}

