import { KMSClient, GenerateDataKeyCommand } from '@aws-sdk/client-kms';

// KMS Data Key Caching for optimal payment processing performance
export class KMSDataKeyCache {
  private cache = new Map<string, { dataKey: Uint8Array; plaintext: Uint8Array; expires: number }>();
  private readonly TTL = 300000; // 5 minutes

  async getDataKey(keyId: string, kmsClient: KMSClient): Promise<{ dataKey: Uint8Array; plaintext: Uint8Array }> {
    const cached = this.cache.get(keyId);
    if (cached && cached.expires > Date.now()) {
      return { dataKey: cached.dataKey, plaintext: cached.plaintext };
    }

    const command = new GenerateDataKeyCommand({
      KeyId: keyId,
      KeySpec: 'AES_256'
    });
    
    const result = await kmsClient.send(command);
    const entry = {
      dataKey: result.CiphertextBlob!,
      plaintext: result.Plaintext!,
      expires: Date.now() + this.TTL
    };
    
    this.cache.set(keyId, entry);
    return { dataKey: entry.dataKey, plaintext: entry.plaintext };
  }
}
