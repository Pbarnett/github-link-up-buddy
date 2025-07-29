import { describe, it, expect } from 'vitest';
import { decryptFullName, decryptDateOfBirth } from '../crypto';

// Mock Decryption by Postgres functions
const mockDecryptFunction = async (ciphertext: Uint8Array, _key: string): Promise<string> => {
  // Simulate decryption by converting from Uint8Array to string directly (for testing)
  return new TextDecoder().decode(ciphertext);
};

// Mock implementation to replace the real decryption process
vi.mock('../crypto', async () => {
  const actual = await vi.importActual<any>('../crypto');
  return {
    ...actual,
    decryptPII: mockDecryptFunction,
  };
});

describe('PII Decryption Helper', () => {
  it('should decrypt full name', async () => {
    const encryptedFullName = new TextEncoder().encode('John Doe'); // Mock encrypted data
    const fullName = await decryptFullName(encryptedFullName);

    expect(fullName).toBe('John Doe');
  });

  it('should decrypt date of birth', async () => {
    const encryptedDOB = new TextEncoder().encode('1990-01-01'); // Mock encrypted data
    const dateOfBirth = await decryptDateOfBirth(encryptedDOB);

    expect(dateOfBirth).toBe('1990-01-01');
  });
});

