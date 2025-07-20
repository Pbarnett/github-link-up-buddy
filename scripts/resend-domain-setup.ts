#!/usr/bin/env tsx
/**
 * Resend Domain Setup & Verification Utility
 * Based on Resend API Reference and Best Practices
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface ResendDomainResponse {
  id: string;
  name: string;
  status: 'not_started' | 'pending' | 'verified' | 'failed';
  created_at: string;
  region: 'us-east-1' | 'eu-west-1' | 'sa-east-1' | 'ap-northeast-1';
  records?: Array<{
    record: string;
    name: string;
    value: string;
    type: 'MX' | 'TXT' | 'CNAME';
    priority?: number;
  }>;
}

interface ResendApiError {
  message: string;
  name: string;
}

class ResendDomainManager {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Create a new domain following Resend API best practices
   */
  async createDomain(domainName: string, region: string = 'us-east-1'): Promise<ResendDomainResponse> {
    console.log(`🌐 Creating domain: ${domainName} in region: ${region}`);
    
    const response = await fetch(`${this.baseUrl}/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domainName,
        region,
        // Use custom return path for better deliverability
        custom_return_path: 'mail'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ResendApiError;
      throw new Error(`Failed to create domain: ${error.message}`);
    }

    console.log(`✅ Domain created successfully: ${data.id}`);
    return data as ResendDomainResponse;
  }

  /**
   * Get domain details and DNS records
   */
  async getDomain(domainId: string): Promise<ResendDomainResponse> {
    const response = await fetch(`${this.baseUrl}/domains/${domainId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ResendApiError;
      throw new Error(`Failed to get domain: ${error.message}`);
    }

    return data as ResendDomainResponse;
  }

  /**
   * List all domains in the account
   */
  async listDomains(): Promise<{ data: ResendDomainResponse[] }> {
    const response = await fetch(`${this.baseUrl}/domains`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ResendApiError;
      throw new Error(`Failed to list domains: ${error.message}`);
    }

    return data;
  }

  /**
   * Verify domain configuration
   */
  async verifyDomain(domainId: string): Promise<ResendDomainResponse> {
    console.log(`🔍 Verifying domain: ${domainId}`);
    
    const response = await fetch(`${this.baseUrl}/domains/${domainId}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ResendApiError;
      throw new Error(`Failed to verify domain: ${error.message}`);
    }

    console.log(`✅ Domain verification initiated`);
    return data as ResendDomainResponse;
  }

  /**
   * Generate DNS configuration instructions
   */
  generateDNSInstructions(domain: ResendDomainResponse): string {
    if (!domain.records) {
      return 'No DNS records available. Please verify the domain first.';
    }

    let instructions = `\n🔧 DNS Configuration for ${domain.name}\n`;
    instructions += '='.repeat(50) + '\n\n';
    instructions += 'Add the following DNS records to your domain provider:\n\n';

    domain.records.forEach((record, index) => {
      instructions += `${index + 1}. ${record.type} Record:\n`;
      instructions += `   Name: ${record.name}\n`;
      instructions += `   Value: ${record.value}\n`;
      if (record.priority) {
        instructions += `   Priority: ${record.priority}\n`;
      }
      instructions += '\n';
    });

    instructions += '📋 Common DNS Providers:\n';
    instructions += '• Cloudflare: DNS > Records > Add record\n';
    instructions += '• GoDaddy: DNS Management > Add new record\n';
    instructions += '• Namecheap: Advanced DNS > Add new record\n';
    instructions += '• Route53: Hosted zones > Create record\n\n';
    
    instructions += '⏱️  DNS propagation typically takes 5-30 minutes.\n';
    instructions += '🔄 Run verification again after DNS changes propagate.\n';

    return instructions;
  }
}

/**
 * Interactive domain setup process
 */
async function setupDomain() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY environment variable is required');
    console.log('💡 Get your API key from: https://resend.com/api-keys');
    process.exit(1);
  }

  const domainManager = new ResendDomainManager(apiKey);
  
  try {
    console.log('🚀 Parker Flight - Resend Domain Setup\n');
    
    // Check if domain already exists
    console.log('📋 Checking existing domains...');
    const existingDomains = await domainManager.listDomains();
    
    const parkerFlightDomain = existingDomains.data.find(d => 
      d.name === 'parkerflight.com' || d.name.includes('parkerflight')
    );

    let domain: ResendDomainResponse;

    if (parkerFlightDomain) {
      console.log(`✅ Found existing domain: ${parkerFlightDomain.name} (${parkerFlightDomain.status})`);
      domain = await domainManager.getDomain(parkerFlightDomain.id);
    } else {
      console.log('🆕 Creating new domain: parkerflight.com');
      domain = await domainManager.createDomain('parkerflight.com', 'us-east-1');
    }

    // Display current status
    console.log(`\n📊 Domain Status: ${domain.status.toUpperCase()}`);
    console.log(`📍 Region: ${domain.region}`);
    console.log(`🆔 Domain ID: ${domain.id}`);

    if (domain.status !== 'verified') {
      // Generate DNS instructions
      const instructions = domainManager.generateDNSInstructions(domain);
      console.log(instructions);

      // Attempt verification
      console.log('🔍 Attempting domain verification...');
      const verificationResult = await domainManager.verifyDomain(domain.id);
      
      if (verificationResult.status === 'verified') {
        console.log('🎉 Domain verified successfully!');
      } else {
        console.log(`⏳ Domain verification status: ${verificationResult.status}`);
        console.log('💡 If DNS records are configured correctly, verification may take a few minutes.');
        console.log('🔄 You can run this script again to check verification status.');
      }
    } else {
      console.log('🎉 Domain is already verified and ready to use!');
      
      // Update environment configuration
      console.log('\n📝 Recommended environment variables:');
      console.log(`RESEND_DOMAIN=${domain.name}`);
      console.log(`RESEND_FROM_EMAIL=Parker Flight <noreply@${domain.name}>`);
      console.log(`RESEND_REPLY_TO_EMAIL=support@${domain.name}`);
    }

    // Generate test configuration
    await generateTestConfig(domain);

  } catch (error) {
    console.error('❌ Error during domain setup:', error.message);
    
    if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
      console.log('💡 Please check your RESEND_API_KEY is correct and has domain management permissions.');
    }
    
    process.exit(1);
  }
}

/**
 * Generate test configuration for the new domain
 */
async function generateTestConfig(domain: ResendDomainResponse) {
  const testConfig = `
# Updated Resend Configuration for Parker Flight
# Domain: ${domain.name} (Status: ${domain.status})

# Environment Variables
RESEND_API_KEY=${process.env.RESEND_API_KEY}
RESEND_DOMAIN=${domain.name}
RESEND_FROM_EMAIL=Parker Flight <noreply@${domain.name}>
RESEND_REPLY_TO_EMAIL=support@${domain.name}
ENVIRONMENT=production

# Test email command
# Run this after domain is verified:
npm run resend:test-send
`;

  console.log('\n💾 Test Configuration:');
  console.log(testConfig);
}

// Run the setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDomain().catch(console.error);
}

export { ResendDomainManager, setupDomain };
