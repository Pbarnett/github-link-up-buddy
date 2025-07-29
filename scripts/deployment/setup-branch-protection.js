#!/usr/bin/env node

/**
 * Parker Flight - Branch Protection Rules Setup
 * 
 * This script sets up professional-grade branch protection rules
 * using the GitHub API to enforce quality gates and security policies.
 */

import { execSync } from 'child_process';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// const fs = require('fs'); // Unused import removed

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m', 
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'

};
// Removed unused log function

const step = (message) => console.log(`🔧 ${message}`, 'cyan');

const BRANCH_PROTECTION_CONFIG = {
  // Main production branch
  main: {
    required_status_checks: {
      strict: true,
      contexts: [
        'build-and-test',
        'e2e-critical',
        'quality-gates',
        'security-scan',
        'performance-audit'
      ]
    },
    enforce_admins: true,
    required_pull_request_reviews: {
      required_approving_review_count: 2,
      dismiss_stale_reviews: true,
      require_code_owner_reviews: true,
      require_last_push_approval: true
    },
    restrictions: null, // Allow all users/teams to push (can be restricted later)
    required_linear_history: true,
    allow_force_pushes: false,
    allow_deletions: false
  },
  
  // Development branch
  develop: {
    required_status_checks: {
      strict: true,
      contexts: [
        'build-and-test',
        'quality-gates'
      ]
    },
    enforce_admins: false,
    required_pull_request_reviews: {
      required_approving_review_count: 1,
      dismiss_stale_reviews: true,
      require_code_owner_reviews: false,
      require_last_push_approval: false
    },
    restrictions: null,
    required_linear_history: false,
    allow_force_pushes: false,
    allow_deletions: false
  }

class BranchProtectionSetup {
  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN
    this.repoOwner = process.env.GITHUB_REPOSITORY?.split('/')[0];
    this.repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
    
    // Try to get repo info from git if not in CI
    if (!this.repoOwner || !this.repoName) {
      try {
        const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
        const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
        if (match) {
          this.repoOwner = match[1];
          this.repoName = match[2];
        }
      } catch (error) {
        // Will handle in validation
      }
    }
  }

  async setup() {
    try {
      console.log('🛡️  Setting up Professional Branch Protection Rules', 'bright');
      console.log('='.repeat(60), 'blue');
      
      this.validateEnvironment();
      
      for (const [branch, config] of Object.entries(BRANCH_PROTECTION_CONFIG)) {
        await this.setupBranchProtection(branch, config);
      }
      
      await this.setupCodeowners();
      await this.validateSetup();
      
      console.log('🎉 Branch protection rules configured successfully!');
      
    } catch (err) {
      console.error(`Branch protection setup failed: ${err.message}`);
      process.exit(1);
    }
  }

  validateEnvironment() {
    console.log('Validating environment...');
    
    if (!this.githubToken) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    
    if (!this.repoOwner || !this.repoName) {
      throw new Error('Could not determine repository owner/name. Set GITHUB_REPOSITORY or run from git repo.');
    }
    
    console.info(`Repository: ${this.repoOwner}/${this.repoName}`);
  }

  async setupBranchProtection(branch, config) {
    console.log(`Setting up protection for ${branch} branch...`);
    
    const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/branches/${branch}/protection`;
    
    const curlCommand = [
      'curl',
      '-X', 'PUT',
      '-H', `Authorization: token ${this.githubToken}`,
      '-H', 'Accept: application/vnd.github.v3+json',
      '-H', 'Content-Type: application/json',
      '--data', JSON.stringify(config),
      apiUrl
    ];

    try {
      const result = execSync(curlCommand.join(' '), { encoding: 'utf-8' });
      const response = JSON.parse(result);
      
      if (response.message) {
        if (response.message.includes('Branch not found')) {
          console.warn(`Branch ${branch} does not exist yet - protection will apply when created`);
        } else if (response.message.includes('Required status check')) {
          console.warn(`Some status checks for ${branch} may not exist yet`);
        } else {
          throw new Error(response.message);
        }
      } else {
        console.log(`✅ Branch protection configured for ${branch}`);
      }
    } catch (err) {
      if (err.message.includes('Branch not found')) {
        console.warn(`Branch ${branch} does not exist yet`);
      } else {
        throw new Error(`Failed to setup protection for ${branch}: ${error.message}`);
      }
    }
  }

  async setupCodeowners() {
    console.log('Setting up CODEOWNERS file...');
    
    const codeownersContent = `# Global code ownership
# These owners will be requested for review when anyone opens a pull request.

# Root files and configuration
* @${this.repoOwner}

# Critical infrastructure files
/.github/ @${this.repoOwner}
/scripts/deployment/ @${this.repoOwner}
/scripts/security/ @${this.repoOwner}
/docs/deployment/ @${this.repoOwner}

# Database and migrations
/database/ @${this.repoOwner}
/supabase/migrations/ @${this.repoOwner}

# Security-sensitive files
**/.env* @${this.repoOwner}
**/secrets.* @${this.repoOwner}
**/security.* @${this.repoOwner}

# Production configurations
**/*production* @${this.repoOwner}
**/*prod* @${this.repoOwner}

# Package management
package.json @${this.repoOwner}
package-lock.json @${this.repoOwner}
`;

    try {
      const fs = await import('fs');
      if (!fs.existsSync('.github')) {
        fs.mkdirSync('.github', { recursive: true });
      }
      
      fs.writeFileSync('.github/CODEOWNERS', codeownersContent);
      console.log('CODEOWNERS file created');
    } catch (err) {
      console.warn(`Could not create CODEOWNERS file: ${err.message}`);
    }
  }

  async validateSetup() {
    console.log('Validating branch protection setup...');
    
    for (const branch of Object.keys(BRANCH_PROTECTION_CONFIG)) {
      try {
        const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/branches/${branch}/protection`;
        const result = execSync(`curl -H "Authorization: token ${this.githubToken}" ${apiUrl}`, { encoding: 'utf-8' });
        const protection = JSON.parse(result);
        
        if (protection.required_status_checks) {
          console.log(`✅ ${branch}: Status checks configured (${protection.required_status_checks.contexts.length} checks)`);
        }
        
        if (protection.required_pull_request_reviews) {
          console.log(`✅ ${branch}: PR reviews required (${protection.required_pull_request_reviews.required_approving_review_count} approvals)`);
        }
        
      } catch (error) {
        console.warn(`Could not validate protection for ${branch}`);
      }
    }
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new BranchProtectionSetup();
  setup.setup().catch(err => {
    console.error(`❌ Branch protection setup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = BranchProtectionSetup;
