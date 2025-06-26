#!/usr/bin/env node
/**
 * Script to add missing feature flags to the database
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function addFeatureFlags() {
  console.log('🎛️ Adding Missing Feature Flags');
  console.log('=================================\n');

  const featureFlags = [
    {
      name: 'flight_search_v2_enabled',
      enabled: true,
      description: 'Enable the new V2 flight search system with round-trip filtering'
    },
    {
      name: 'use_new_pools_ui',
      enabled: false,
      description: 'Use the new pools UI in the legacy trip offers system'
    }
  ];

  for (const flag of featureFlags) {
    console.log(`Adding feature flag: ${flag.name}...`);
    
    // Check if flag already exists
    const { data: existing } = await supabase
      .from('feature_flags')
      .select('name, enabled')
      .eq('name', flag.name)
      .maybeSingle();
    
    if (existing) {
      console.log(`   ✅ Flag already exists: ${flag.name} = ${existing.enabled}`);
      
      // Update to the desired value if different
      if (existing.enabled !== flag.enabled) {
        const { error: updateError } = await supabase
          .from('feature_flags')
          .update({ enabled: flag.enabled, description: flag.description })
          .eq('name', flag.name);
        
        if (updateError) {
          console.error(`   ❌ Failed to update ${flag.name}:`, updateError.message);
        } else {
          console.log(`   🔄 Updated ${flag.name}: ${existing.enabled} → ${flag.enabled}`);
        }
      }
    } else {
      // Insert new flag
      const { error: insertError } = await supabase
        .from('feature_flags')
        .insert({
          name: flag.name,
          enabled: flag.enabled,
          description: flag.description
        });
      
      if (insertError) {
        console.error(`   ❌ Failed to add ${flag.name}:`, insertError.message);
      } else {
        console.log(`   ✅ Added ${flag.name} = ${flag.enabled}`);
      }
    }
  }

  // Verify all flags are in place
  console.log('\n📋 Current Feature Flags:');
  const { data: allFlags, error: fetchError } = await supabase
    .from('feature_flags')
    .select('name, enabled, description')
    .order('name');

  if (fetchError) {
    console.error('❌ Failed to fetch feature flags:', fetchError.message);
  } else {
    allFlags?.forEach(flag => {
      console.log(`   ${flag.enabled ? '✅' : '❌'} ${flag.name}: ${flag.enabled}`);
      if (flag.description) {
        console.log(`     ${flag.description}`);
      }
    });
  }

  console.log('\n🎉 Feature Flag Setup Complete!');
  console.log('\n📝 What this enables:');
  console.log('- flight_search_v2_enabled=true: Users will be redirected to the V2 system');
  console.log('- V2 system includes proper round-trip filtering and no duration validation issues');
  console.log('- One-way flights will be filtered out for round-trip searches');
  console.log('- Users will see clear notifications when flights are filtered');
  console.log('\n🔧 Next steps:');
  console.log('1. Test the /trip/offers route to verify it redirects to V2');
  console.log('2. Verify that V2 shows only round-trip flights for round-trip searches');
  console.log('3. Check that the 406 feature flag error is resolved');
}

// Run the script
addFeatureFlags().catch(console.error);

export { addFeatureFlags };
