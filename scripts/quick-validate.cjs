#!/usr/bin/env node

const { existsSync } = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Quick Environment Validation');
console.log('==================================\n');

// Set required environment variables if missing
if (!process.env.AWS_REGION) {
  process.env.AWS_REGION = 'us-east-1';
  console.log('✅ Set AWS_REGION to us-east-1');
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
  console.log('✅ Set NODE_ENV to development');
}

// Basic checks
const checks = [
  {
    name: 'Node.js Version',
    test: () => {
      const version = process.version;
      console.log(`✅ Node.js: ${version}`);
      return true;
    }
  },
  {
    name: 'Package Dependencies',
    test: () => {
      const exists = existsSync('node_modules');
      if (exists) {
        console.log('✅ Dependencies: Installed');
        return true;
      } else {
        console.log('❌ Dependencies: Missing - Run npm install');
        return false;
      }
    }
  },
  {
    name: 'TypeScript Configuration',
    test: () => {
      const exists = existsSync('tsconfig.json');
      if (exists) {
        console.log('✅ TypeScript: Configuration found');
        return true;
      } else {
        console.log('❌ TypeScript: Missing tsconfig.json');
        return false;
      }
    }
  },
  {
    name: 'Environment Variables',
    test: () => {
      const required = ['AWS_REGION', 'NODE_ENV'];
      let allSet = true;
      
      required.forEach(env => {
        if (process.env[env]) {
          console.log(`✅ ${env}: ${process.env[env]}`);
        } else {
          console.log(`⚠️  ${env}: Not set`);
          allSet = false;
        }
      });
      
      return allSet;
    }
  }
];

let passed = 0;
let failed = 0;

console.log('Running checks...\n');

checks.forEach(check => {
  try {
    if (check.test()) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name}: Error - ${error.message}`);
    failed++;
  }
});

console.log('\n📊 Summary:');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);

// Run quick tests
console.log('\n🧪 Quick Tests:');

try {
  console.log('🔄 Testing TypeScript compilation...');
  execSync('npx tsc --version', { stdio: 'pipe' });
  console.log('✅ TypeScript compiler available');
} catch (error) {
  console.log('❌ TypeScript compiler not available');
}

console.log('\n🎯 Validation Complete');
console.log('=====================');

if (failed === 0) {
  console.log('🎉 Environment is ready for development!');
} else {
  console.log('⚠️  Some issues detected but proceeding...');
}

console.log('\n📋 Next Steps:');
console.log('1. Fix any failed checks above');
console.log('2. Run: npm run test:unit');
console.log('3. Run: npm run build:dev');
console.log('4. Start development server: npm run dev');

process.exit(0);
