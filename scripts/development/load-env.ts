#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs';

/**
 * Loads environment variables from .env files
 * Follows the priority order: .env.local > .env.production > .env
 */
export function loadEnvironmentVariables(): void {
  const envFiles = [
    '.env.local',
    '.env.production', 
    '.env'
  ];

  console.log('🔧 Loading environment variables...');

  for (const envFile of envFiles) {
    if (existsSync(envFile)) {
      console.log(`📄 Loading ${envFile}...`);
      
      try {
        const envContent = readFileSync(envFile, 'utf8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
          // Skip comments and empty lines
          if (line.trim() === '' || line.trim().startsWith('#')) {
            continue;
          }
          
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            
            // Only set if not already set (respects priority order)
            if (!process.env[key.trim()]) {
              process.env[key.trim()] = value;
              console.log(`   ✅ Set ${key.trim()}`);
            }
          }
        }
        
      } catch (error) {
        console.warn(`⚠️  Failed to load ${envFile}: ${error}`);
      }
    }
  }

  console.log('✅ Environment variables loaded\n');
}

/**
 * Validates that all required environment variables are present
 */
export function validateRequiredEnvVars(): boolean {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY', 
    'VITE_LD_CLIENT_ID'
  ];

  const missing: string[] = [];
  
  for (const envVar of required) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(var_ => console.error(`   - ${var_}`));
    return false;
  }

  return true;
}

/**
 * Sets default values for optional environment variables
 */
export function setDefaults(): void {
  const defaults = {
    'AWS_REGION': 'us-east-1',
    'NODE_ENV': 'development'
  };

  for (const [key, value] of Object.entries(defaults)) {
    if (!process.env[key]) {
      process.env[key] = value;
      console.log(`🔧 Set default ${key}=${value}`);
    }
  }
}

// If run directly, load environment variables
if (import.meta.url === `file://${process.argv[1]}`) {
  loadEnvironmentVariables();
  setDefaults();
  
  if (validateRequiredEnvVars()) {
    console.log('🎉 All environment variables validated successfully!');
  } else {
    console.log('❌ Environment validation failed. Please check your .env files.');
    process.exit(1);
  }
}
