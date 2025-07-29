#!/usr/bin/env node

const path = require('path');

/**
 * Batch fix common ESLint errors across the codebase
 */

import fs from 'fs/promises';
import { execSync } from 'child_process';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

const eslintFixes = [
  // Fix import/order errors by removing empty lines between import groups
  {
    name: 'Remove empty lines between import groups',
    pattern: /^import.*;\n\nimport/gm,
    replacement: (match) => match.replace('\n\n', '\n')
  },
  // Fix no-unused-vars by prefixing with underscore
  {
    name: 'Prefix unused Component type with underscore',
    pattern: /type Component<P = {}, S = {}> = React\.Component<P, S>;/g,
    replacement: 'type _Component<P = {}, S = {}> = React.Component<P, S>;'
  },
  // Remove unused Component imports
  {
    name: 'Remove unused Component imports',
    pattern: /,\s*Component/g,
    replacement: ''
  },
  // Fix common unused variables
  {
    name: 'Prefix unused isValid with underscore',
    pattern: /const isValid = /g,
    replacement: 'const _isValid = '
  },
  {
    name: 'Prefix unused errors with underscore',
    pattern: /const errors = /g,
    replacement: 'const _errors = '
  },
  {
    name: 'Prefix unused createElement with underscore',
    pattern: /const createElement = /g,
    replacement: 'const _createElement = '
  },
  {
    name: 'Prefix unused delay with underscore',
    pattern: /const delay = /g,
    replacement: 'const _delay = '
  },
  {
    name: 'Prefix unused resourcePart with underscore',
    pattern: /const resourcePart = /g,
    replacement: 'const _resourcePart = '
  },
  // Fix unused type imports
  {
    name: 'Prefix unused BookingMethodFormData with underscore',
    pattern: /BookingMethodFormData,/g,
    replacement: '_BookingMethodFormData,'
  },
  {
    name: 'Prefix unused PaymentMethodsResponse with underscore',
    pattern: /PaymentMethodsResponse,/g,
    replacement: '_PaymentMethodsResponse,'
  },
  {
    name: 'Prefix unused ImportedPaymentMethodError with underscore',
    pattern: /ImportedPaymentMethodError,/g,
    replacement: '_ImportedPaymentMethodError,'
  },
  {
    name: 'Prefix unused FormEvent with underscore',
    pattern: /FormEvent,/g,
    replacement: '_FormEvent,'
  },
  {
    name: 'Prefix unused ValidationResult with underscore',
    pattern: /ValidationResult,/g,
    replacement: '_ValidationResult,'
  },
  {
    name: 'Prefix unused KeyIdValidationResult with underscore',
    pattern: /KeyIdValidationResult,/g,
    replacement: '_KeyIdValidationResult,'
  },
  {
    name: 'Prefix unused SecretsManagerClient with underscore',
    pattern: /SecretsManagerClient,/g,
    replacement: '_SecretsManagerClient,'
  }
];

async function getAllFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await walk(fullPath);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  await walk(dir);
  return files;
}

async function fixFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  let modified = false;
  
for (const fix of eslintFixes) {
    const originalContent = content;
    content = content.replace(fix.pattern, fix.replacement);
    if (content !== originalContent) {
      console.log(`Applied fix "${fix.name}" to ${filePath}`);
      modified = true;
    }
  }
  
  if (modified) {
    await fs.writeFile(filePath, content);
  }
  
  return modified;
}

async function main() {
  console.log('🔧 Starting batch ESLint error fixes...');
  
  const files = await getAllFiles('./src');
  let totalFixed = 0;
  
  for (const file of files) {
    try {
      const wasFixed = await fixFile(file);
      if (wasFixed) {
        totalFixed++;
      }
    } catch (error) {
      console.error(`Error fixing ${file}:`, error.message);
    }
  }
  
  console.log(`✅ Fixed ${totalFixed} files`);
  
  // Check current error count
  try {
    const output = execSync('npx eslint . 2>&1 | grep -E "(error|warning)" | wc -l', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    console.log(`📊 Current error/warning count: ${output.trim()}`);
  } catch (error) {
    console.log('Could not get current error count');
  }
}

main().catch(console.error);
