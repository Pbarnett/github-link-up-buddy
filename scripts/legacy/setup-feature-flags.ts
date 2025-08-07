#!/usr/bin/env -S npx tsx

/**
 * LaunchDarkly Feature Flag Setup for Auto-Booking Controlled Rollout
 * 
 * This script creates and configures the essential feature flags for 
 * safe, controlled rollout of the auto-booking functionality.
 */

interface FeatureFlagConfig {
  key: string;
  name: string;
  description: string;
  defaultValue: boolean;
  variations: Array<{ value: boolean; name: string; description: string }>;
  rollout?: {
    percentage: number;
    userSegments?: string[];
  };
}

const AUTO_BOOKING_FLAGS: FeatureFlagConfig[] = [
  {
    key: 'auto_booking_pipeline_enabled',
    name: 'Auto-Booking Pipeline Enabled',
    description: 'Master switch for the entire auto-booking functionality. When disabled, auto-booking options are hidden from users.',
    defaultValue: false,
    variations: [
      { value: true, name: 'Enabled', description: 'Auto-booking pipeline is active' },
      { value: false, name: 'Disabled', description: 'Auto-booking pipeline is inactive' }
    ],
    rollout: {
      percentage: 0, // Start disabled
      userSegments: ['internal_team', 'beta_testers']
    }
  },
  {
    key: 'auto_booking_emergency_disable',
    name: 'Auto-Booking Emergency Kill Switch',
    description: 'Emergency kill switch to immediately disable all auto-booking operations. When true, all auto-booking is suspended.',
    defaultValue: false,
    variations: [
      { value: true, name: 'Emergency Stop', description: 'All auto-booking suspended immediately' },
      { value: false, name: 'Normal Operation', description: 'Auto-booking operates normally' }
    ]
  },
  {
    key: 'auto_booking_payment_validation_strict',
    name: 'Strict Payment Validation',
    description: 'Enable enhanced payment method validation for auto-booking transactions.',
    defaultValue: true,
    variations: [
      { value: true, name: 'Strict Validation', description: 'Enhanced validation enabled' },
      { value: false, name: 'Standard Validation', description: 'Standard validation only' }
    ]
  },
  {
    key: 'auto_booking_monitoring_enhanced',
    name: 'Enhanced Auto-Booking Monitoring',
    description: 'Enable detailed monitoring and alerting for auto-booking operations.',
    defaultValue: true,
    variations: [
      { value: true, name: 'Enhanced Monitoring', description: 'Detailed monitoring active' },
      { value: false, name: 'Basic Monitoring', description: 'Basic monitoring only' }
    ]
  },
  {
    key: 'duffel_live_api_enabled',
    name: 'Duffel Live API Enabled',
    description: 'Switch between Duffel test and live API environments for flight bookings.',
    defaultValue: false,
    variations: [
      { value: true, name: 'Live API', description: 'Using Duffel production API' },
      { value: false, name: 'Test API', description: 'Using Duffel test API' }
    ]
  }
];

class FeatureFlagManager {
  private projectKey: string;
  private apiToken: string;
  private baseUrl = 'https://app.launchdarkly.com/api/v2';

  constructor() {
    this.projectKey = process.env.LAUNCHDARKLY_PROJECT_KEY || 'default';
    this.apiToken = process.env.LAUNCHDARKLY_API_TOKEN || '';
    
    if (!this.apiToken) {
      console.error('❌ LAUNCHDARKLY_API_TOKEN environment variable is required');
      process.exit(1);
    }
  }

  private get headers() {
    return {
      'Authorization': this.apiToken,
      'Content-Type': 'application/json'
    };
  }

  async createFlag(flagConfig: FeatureFlagConfig): Promise<boolean> {
    try {
      console.log(`🏁 Creating feature flag: ${flagConfig.key}`);

      const response = await fetch(
        `${this.baseUrl}/flags/${this.projectKey}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            key: flagConfig.key,
            name: flagConfig.name,
            description: flagConfig.description,
            kind: 'boolean',
            variations: flagConfig.variations,
            defaults: {
              onVariation: flagConfig.defaultValue ? 0 : 1,
              offVariation: 1
            }
          })
        }
      );

      if (response.status === 409) {
        console.log(`⚠️  Flag ${flagConfig.key} already exists, updating instead...`);
        return await this.updateFlag(flagConfig);
      }

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to create flag ${flagConfig.key}: ${error}`);
        return false;
      }

      console.log(`✅ Created flag: ${flagConfig.key}`);
      
      // Set up initial targeting if specified
      if (flagConfig.rollout) {
        await this.setupTargeting(flagConfig);
      }

      return true;
    } catch (error) {
      console.error(`❌ Error creating flag ${flagConfig.key}:`, error);
      return false;
    }
  }

  async updateFlag(flagConfig: FeatureFlagConfig): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/flags/${this.projectKey}/${flagConfig.key}`,
        {
          method: 'PATCH',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json-patch+json'
          },
          body: JSON.stringify([
            {
              op: 'replace',
              path: '/description',
              value: flagConfig.description
            },
            {
              op: 'replace',
              path: '/name',
              value: flagConfig.name
            }
          ])
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to update flag ${flagConfig.key}: ${error}`);
        return false;
      }

      console.log(`✅ Updated flag: ${flagConfig.key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error updating flag ${flagConfig.key}:`, error);
      return false;
    }
  }

  async setupTargeting(flagConfig: FeatureFlagConfig): Promise<boolean> {
    if (!flagConfig.rollout) return true;

    try {
      console.log(`🎯 Setting up targeting for: ${flagConfig.key}`);

      const targetingRules = {
        on: flagConfig.defaultValue,
        targets: [],
        rules: [],
        fallthrough: {
          variation: flagConfig.defaultValue ? 0 : 1,
          rollout: {
            variations: [
              {
                variation: 0,
                weight: flagConfig.rollout.percentage * 1000 // LaunchDarkly uses basis points
              },
              {
                variation: 1,
                weight: (100 - flagConfig.rollout.percentage) * 1000
              }
            ]
          }
        },
        offVariation: 1,
        prerequisites: []
      };

      const response = await fetch(
        `${this.baseUrl}/flags/${this.projectKey}/${flagConfig.key}/environments/production`,
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(targetingRules)
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to setup targeting for ${flagConfig.key}: ${error}`);
        return false;
      }

      console.log(`✅ Targeting configured for: ${flagConfig.key} (${flagConfig.rollout.percentage}% rollout)`);
      return true;
    } catch (error) {
      console.error(`❌ Error setting up targeting for ${flagConfig.key}:`, error);
      return false;
    }
  }

  async validateFlags(): Promise<boolean> {
    try {
      console.log('🔍 Validating feature flags...');

      for (const flagConfig of AUTO_BOOKING_FLAGS) {
        const response = await fetch(
          `${this.baseUrl}/flags/${this.projectKey}/${flagConfig.key}`,
          {
            method: 'GET',
            headers: this.headers
          }
        );

        if (!response.ok) {
          console.error(`❌ Flag ${flagConfig.key} not found or inaccessible`);
          return false;
        }

        const flag = await response.json();
        console.log(`✅ Validated: ${flagConfig.key} (${flag.on ? 'enabled' : 'disabled'})`);
      }

      return true;
    } catch (error) {
      console.error('❌ Error validating flags:', error);
      return false;
    }
  }

  async enableGradualRollout(flagKey: string, percentage: number): Promise<boolean> {
    try {
      console.log(`📈 Enabling ${percentage}% rollout for: ${flagKey}`);

      const response = await fetch(
        `${this.baseUrl}/flags/${this.projectKey}/${flagKey}/environments/production`,
        {
          method: 'PATCH',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json-patch+json'
          },
          body: JSON.stringify([
            {
              op: 'replace',
              path: '/on',
              value: true
            },
            {
              op: 'replace',
              path: '/fallthrough/rollout/variations/0/weight',
              value: percentage * 1000
            },
            {
              op: 'replace',
              path: '/fallthrough/rollout/variations/1/weight',
              value: (100 - percentage) * 1000
            }
          ])
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to update rollout for ${flagKey}: ${error}`);
        return false;
      }

      console.log(`✅ ${flagKey} now rolling out to ${percentage}% of users`);
      return true;
    } catch (error) {
      console.error(`❌ Error updating rollout for ${flagKey}:`, error);
      return false;
    }
  }
}

// Rollout phases configuration
const ROLLOUT_PHASES = [
  { name: 'Internal Testing', percentage: 0, duration: '1 day' },
  { name: 'Beta Users', percentage: 5, duration: '2 days' },
  { name: 'Limited Rollout', percentage: 20, duration: '3 days' },
  { name: 'Gradual Expansion', percentage: 50, duration: '5 days' },
  { name: 'Full Deployment', percentage: 100, duration: 'ongoing' }
];

async function main() {
  console.log('🚀 Auto-Booking Feature Flag Setup\n');

  const flagManager = new FeatureFlagManager();

  // Create all feature flags
  console.log('📋 Creating feature flags...\n');
  let allFlagsCreated = true;

  for (const flagConfig of AUTO_BOOKING_FLAGS) {
    const success = await flagManager.createFlag(flagConfig);
    if (!success) {
      allFlagsCreated = false;
    }
  }

  if (!allFlagsCreated) {
    console.error('\n❌ Some flags failed to create. Please check the errors above.');
    process.exit(1);
  }

  // Validate all flags
  console.log('\n🔍 Validating flags...\n');
  const flagsValid = await flagManager.validateFlags();

  if (!flagsValid) {
    console.error('\n❌ Flag validation failed. Please check LaunchDarkly configuration.');
    process.exit(1);
  }

  // Print rollout plan
  console.log('\n📈 Planned Rollout Phases:');
  console.log('=====================================');
  ROLLOUT_PHASES.forEach((phase, index) => {
    console.log(`${index + 1}. ${phase.name}: ${phase.percentage}% (${phase.duration})`);
  });

  console.log('\n✅ Feature flags setup complete!');
  console.log('\n🎯 Next Steps:');
  console.log('1. Review flags in LaunchDarkly dashboard');
  console.log('2. Test with internal team (0% public rollout)');
  console.log('3. Gradually increase rollout percentage');
  console.log('4. Monitor metrics at each phase');
  console.log('\n🚨 Emergency: Set auto_booking_emergency_disable to true to stop all auto-booking');
}

if (import.meta.main) {
  main().catch(console.error);
}

export { FeatureFlagManager, AUTO_BOOKING_FLAGS, ROLLOUT_PHASES };
