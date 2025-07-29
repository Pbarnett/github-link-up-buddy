/**
 * PII Decryption Helper for Business Logic
 * 
 * Provides decryption functions to handle encrypted PII
 * Required for tasks #24-25
 */

import { Client } from 'https://deno.land/x/postgres@v0.15.0/mod.ts';

interface DecryptionConfig {
  user: string;
  database: string;
  hostname: string;
  password: string;
  port: number;
}

/**
 * Decrypt an encrypted PII field
 * @param ciphertext - The encrypted data
 * @param encryptionKey - The encryption key used
 * @returns Decrypted plaintext
 */
export async function decryptPII(ciphertext: Uint8Array, encryptionKey: string): Promise<string> {
  const config: DecryptionConfig = {
    user: Deno.env.get('POSTGRES_USER') || 'postgres',
    database: Deno.env.get('POSTGRES_DB') || 'postgres',
    hostname: Deno.env.get('POSTGRES_HOST') || 'localhost',
    password: Deno.env.get('POSTGRES_PASSWORD') || 'password',
    port: parseInt(Deno.env.get('POSTGRES_PORT') || '5432', 10)
  };

  const client = new Client(config);
  await client.connect();

  // Decrypt using PG's pgp_sym_decrypt function
  const result = await client.queryArray(`
    SELECT pgp_sym_decrypt($1, $2);
  `, [ciphertext, encryptionKey]);

  await client.end();

  if (result.rows.length > 0) {
    return result.rows[0][0] as string;
  } else {
    console.error('[Crypto] Decryption failed: No result returned');
    throw new Error('Failed to decrypt PII');
  }
}

/**
 * Decrypt full_name column for display
 * @param encryptedFullName - The encrypted full name column from the database
 * @returns Decrypted full name string
 */
export async function decryptFullName(encryptedFullName: Uint8Array): Promise<string> {
  return decryptPII(encryptedFullName, 'default-pii-key-change-in-production');
}

/**
 * Decrypt date_of_birth column for business processes
 * @param encryptedDOB - The encrypted date of birth column from the database
 * @returns Decrypted date of birth string (format depends on how it's stored)
 */
export async function decryptDateOfBirth(encryptedDOB: Uint8Array): Promise<string> {
  return decryptPII(encryptedDOB, 'default-pii-key-change-in-production');
}
