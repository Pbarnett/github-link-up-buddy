#!/usr/bin/env node

/**
 * This script runs the diagnoseOfferPipeline function to identify
 * where flight offers might be getting lost in the pipeline.
 * 
 * Usage:
 *   node diagnoseTripOffers.js <trip-request-id>
 * 
 * If no trip request ID is provided, the script will use "trip-123"
 * as the default test ID.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { diagnoseOfferPipeline } from '../src/services/tripOffersService.js';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Get Supabase URL and key from environment
const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: SUPABASE_PROJECT_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

// Create Supabase client (needed for tripOffersService functions)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Get trip request ID from command line or use default
const tripRequestId = process.argv[2] || 'trip-123';

/**
 * Main function to run diagnostics
 */
async function runDiagnostics() {
  console.log('='.repeat(80));
  console.log(`RUNNING OFFER PIPELINE DIAGNOSTICS FOR TRIP ID: ${tripRequestId}`);
  console.log('='.repeat(80));
  
  try {
    // First run with normal validation
    console.log('\n1. NORMAL VALIDATION MODE:');
    console.log('-'.repeat(50));
    
    console.log('Running diagnoseOfferPipeline with normal validation...');
    const normalResults = await diagnoseOfferPipeline(tripRequestId, false);
    
    console.log('\nDIAGNOSTIC RESULTS (NORMAL VALIDATION):');
    console.log(JSON.stringify(normalResults, null, 2));
    
    // Then run with validation bypassed
    console.log('\n\n2. BYPASS VALIDATION MODE:');
    console.log('-'.repeat(50));
    
    console.log('Running diagnoseOfferPipeline with validation bypassed...');
    const bypassResults = await diagnoseOfferPipeline(tripRequestId, true);
    
    console.log('\nDIAGNOSTIC RESULTS (BYPASS VALIDATION):');
    console.log(JSON.stringify(bypassResults, null, 2));
    
    // Comparison summary
    console.log('\n\n3. COMPARISON SUMMARY:');
    console.log('-'.repeat(50));
    
    const normalCount = normalResults.finalResult?.count || 0;
    const bypassCount = bypassResults.finalResult?.count || 0;
    const diff = bypassCount - normalCount;
    
    console.log(`With normal validation: ${normalCount} offers passed`);
    console.log(`With validation bypassed: ${bypassCount} offers available`);
    
    if (diff > 0) {
      console.log(`\n⚠️  ${diff} offers are being filtered out by validation rules.`);
      
      // Check which validation rules are causing the most rejections
      if (bypassResults.pipelineStages?.validation?.failureStats) {
        const stats = bypassResults.pipelineStages.validation.failureStats;
        
        console.log('\nValidation failure breakdown:');
        Object.entries(stats)
          .filter(([_, value]) => value > 0)
          .sort(([_, a], [__, b]) => b - a)
          .forEach(([rule, count]) => {
            console.log(`- ${rule}: ${count} failures`);
          });
      }
    } else if (normalCount === bypassCount && normalCount > 0) {
      console.log('\n✅ All offers are passing validation rules.');
    } else if (normalCount === 0 && bypassCount === 0) {
      console.log('\n❌ No offers found in the database for this trip ID.');
      console.log('This suggests the issue is upstream from the validation process.');
    }
    
  } catch (error) {
    console.error('Error running diagnostics:', error);
    process.exit(1);
  }
}

// Run the diagnostics
runDiagnostics()
  .then(() => {
    console.log('\nDiagnostics completed successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Diagnostics failed:', err);
    process.exit(1);
  });

