/**
 * KMS Health Check Edge Function
 * Tests KMS connectivity and encryption/decryption functionality
 * Implements AWS AI bot recommendations for multi-region KMS testing
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  DenoKMSService, 
  validateKMSConfig, 
  testKMS, 
  createKMSAuditLog 
} from "../_shared/enhanced-kms.ts";

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  checks: {
    config: {
      status: 'pass' | 'fail';
      details?: string;
    };
    kms_connectivity: {
      status: 'pass' | 'fail' | 'partial';
      regions?: Record<string, { status: 'healthy' | 'unhealthy'; latency?: number; error?: string }>;
      details?: string;
    };
    key_functionality: {
      status: 'pass' | 'fail' | 'partial';
      keys?: {
        general: boolean;
        pii: boolean;
        payment: boolean;
      };
      details?: string;
    };
  };
  metadata: {
    version: number;
    region: string;
    environment: string;
    latency_ms: number;
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  let kmsService: DenoKMSService | null = null;
  
  try {
    const healthCheck: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        config: { status: 'fail' },
        kms_connectivity: { status: 'fail' },
        key_functionality: { status: 'fail' },
      },
      metadata: {
        version: 2, // Enhanced multi-region version
        region: Deno.env.get('AWS_REGION') || 'us-east-1',
        environment: Deno.env.get('APP_ENV') || 'development',
        latency_ms: 0,
      },
    };

    // Step 1: Validate KMS Configuration
    console.log('Starting KMS configuration validation...');
    const configValid = validateKMSConfig();
    
    if (configValid) {
      healthCheck.checks.config = {
        status: 'pass',
        details: 'All required KMS environment variables are present',
      };
      console.log('✓ KMS configuration validation passed');
    } else {
      healthCheck.checks.config = {
        status: 'fail',
        details: 'Missing required KMS environment variables. Check AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and KMS key aliases.',
      };
      console.error('✗ KMS configuration validation failed');
      
      // If config is invalid, return early
      healthCheck.status = 'unhealthy';
      healthCheck.metadata.latency_ms = Date.now() - startTime;
      
      return new Response(JSON.stringify(healthCheck, null, 2), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Test KMS Connectivity Across Regions
    console.log('Testing KMS connectivity across regions...');
    try {
      kmsService = new DenoKMSService();
      const connectivityResult = await kmsService.healthCheck();
      
      healthCheck.checks.kms_connectivity = {
        status: connectivityResult.status === 'healthy' ? 'pass' : 
               Object.values(connectivityResult.regions).some(r => r.status === 'healthy') ? 'partial' : 'fail',
        regions: connectivityResult.regions,
        details: connectivityResult.status === 'healthy' ? 
          'All regions accessible' : 
          'Some regions may be experiencing issues',
      };
      
      console.log(`✓ KMS connectivity test: ${connectivityResult.status}`);
      
      // Log connectivity audit
      const connectivityAudit = createKMSAuditLog(
        'health_check',
        'general',
        connectivityResult.status === 'healthy',
        { 
          regions: connectivityResult.regions,
          totalRegions: Object.keys(connectivityResult.regions).length,
        }
      );
      console.log('KMS connectivity audit:', JSON.stringify(connectivityAudit));
      
    } catch (error) {
      healthCheck.checks.kms_connectivity = {
        status: 'fail',
        details: `KMS connectivity test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      console.error('✗ KMS connectivity test failed:', error);
    }

    // Step 3: Test Key Functionality (Encryption/Decryption)
    console.log('Testing KMS key functionality...');
    try {
      const keyTests = await testKMS();
      
      healthCheck.checks.key_functionality = {
        status: keyTests.overall ? 'pass' : 
               (keyTests.general || keyTests.pii || keyTests.payment) ? 'partial' : 'fail',
        keys: keyTests,
        details: keyTests.overall ? 
          'All KMS keys functional' : 
          `Key test results - General: ${keyTests.general}, PII: ${keyTests.pii}, Payment: ${keyTests.payment}`,
      };
      
      console.log(`✓ KMS key functionality test: ${keyTests.overall ? 'all passed' : 'some failed'}`);
      console.log('Key test details:', keyTests);
      
      // Log functionality audit
      const functionalityAudit = createKMSAuditLog(
        'test',
        'general',
        keyTests.overall,
        { 
          keyResults: keyTests,
          totalKeys: 3,
          passedKeys: [keyTests.general, keyTests.pii, keyTests.payment].filter(Boolean).length,
        }
      );
      console.log('KMS functionality audit:', JSON.stringify(functionalityAudit));
      
    } catch (error) {
      healthCheck.checks.key_functionality = {
        status: 'fail',
        details: `KMS key functionality test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      console.error('✗ KMS key functionality test failed:', error);
    }

    // Step 4: Determine Overall Health Status
    const allPassed = Object.values(healthCheck.checks).every(check => check.status === 'pass');
    const anyPassed = Object.values(healthCheck.checks).some(check => check.status === 'pass' || check.status === 'partial');
    
    healthCheck.status = allPassed ? 'healthy' : anyPassed ? 'degraded' : 'unhealthy';
    healthCheck.metadata.latency_ms = Date.now() - startTime;
    
    console.log(`KMS health check completed: ${healthCheck.status} (${healthCheck.metadata.latency_ms}ms)`);
    
    // Step 5: Add Metadata from KMS Service
    if (kmsService) {
      const kmsMetadata = kmsService.getEncryptionMetadata();
      healthCheck.metadata = {
        ...healthCheck.metadata,
        ...kmsMetadata,
      };
    }

    // Determine HTTP status code
    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;
    
    return new Response(JSON.stringify(healthCheck, null, 2), {
      status: httpStatus,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('KMS health check failed:', error);
    
    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        config: { status: 'fail', details: 'Health check crashed during execution' },
        kms_connectivity: { status: 'fail', details: 'Could not test connectivity' },
        key_functionality: { status: 'fail', details: 'Could not test key functionality' },
      },
      metadata: {
        version: 2,
        region: Deno.env.get('AWS_REGION') || 'us-east-1',
        environment: Deno.env.get('APP_ENV') || 'development',
        latency_ms: Date.now() - startTime,
      },
    };
    
    // Add error details
    if (error instanceof Error) {
      errorResponse.checks.config.details = `Health check error: ${error.message}`;
    }
    
    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
