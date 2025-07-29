#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
// Removed unused info function
function fixCriticalErrors() {
  console.info('Fixing critical ESLint errors...');
  
  // Files with specific issues that need targeted fixes
  const criticalFiles = [
    'scripts/dashboard-best-practices.js',
    'scripts/deploy-phase2.js', 
    'scripts/deploy-production.js',
    'scripts/create-test-env.js',
    'scripts/create-type-declarations.js'
  ];

  let fixedCount = 0;

  for (const file of criticalFiles) {
    const filePath = path.join(__dirname, '../..', file);
    
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Fix parsing errors from missing closing braces
      if (content.includes('Unexpected token }')) {
        // Find and fix malformed blocks
        content = content.replace(/{\s*$/, '');
        content = content.replace(/}\s*$/, '');
        modified = true;
      }

      // Add missing utility functions for deploy-production.js
      if (file.includes('deploy-production.js')) {
        if (!content.includes('const info =') && content.includes('console.info(');) {
          const utilityFunctions = `
// Utility functions
// Removed unused info function
`;
          // Insert after imports
          const importEnd = content.lastIndexOf('import ');
          if (importEnd !== -1) {
            const nextLine = content.indexOf('\n', importEnd);
            content = content.slice(0, nextLine + 1) + utilityFunctions + content.slice(nextLine + 1);
            modified = true;
          }
        }
      }

      // Fix path imports for files that use path but don't import it
      if ((content.includes('path.') || content.includes("'path' is not defined")) && !content.includes('import path from \'path\'')) {
        modified = true;
      }

      // Remove unused fileURLToPath imports
      if (content.includes('fileURLToPath') && !content.includes('__filename') && !content.includes('__dirname')) {
        content = content.replace(/,\s*fileURLToPath/, '');
        content = content.replace(/fileURLToPath,\s*/, '');
        content = content.replace(/{\s*fileURLToPath\s*}/, '{}');
        // If empty import, remove the line
        content = content.replace(/import\s*{}\s*from\s*['"]url['"];\s*\n?/, '');
        modified = true;
      }

      // Fix unused log assignments by removing them
      if (content.includes('\'log\' is assigned a value but never used')) {
        content = content.replace(/const log = [^;]+;\s*\n?/g, '');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        fixedCount++;
        console.info(`Fixed: ${file}`);
      }

    } catch (err) {
      console.error(`Error fixing ${file}: ${error.message}`);
    }
  }

  console.log(`✅ Fixed ${fixedCount} critical files`);
}

fixCriticalErrors();
