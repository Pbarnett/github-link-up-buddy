#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
// Removed unused info function
// Removed unused success function
// Removed unused error function

function fixRemainingIssues() {
  console.info('Fixing remaining ESLint issues...');
  let fixedCount = 0;

  // Define files with specific issues
  const fileFixes = [
    // Files with unused utility function assignments
    'scripts/advanced-optimization.js',
    'scripts/create-business-dashboards.js', 
    'scripts/dashboard-best-practices.js',
    'scripts/deploy-phase2.js',
    'scripts/diagnostics/localhost-binding-check.js',
    'scripts/dev-wrapper.js',
    'scripts/development/ai-code-review.js',
    'scripts/deployment/setup-branch-protection.js',
    
    // Files with parsing issues
    'scripts/create-test-env.js',
    'scripts/create-type-declarations.js',
    'scripts/development/ai-code-analysis.js',
    'scripts/development/enforce-organization.js',
    'scripts/development/quality-gates.js',
    'scripts/enforcement/ai-code-review.js',
    'scripts/diagnostics/fix-localhost-binding.js'
  ];

  for (const file of fileFixes) {
    const filePath = path.join(__dirname, '../..', file);
    
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Remove unused utility function assignments that are never called
      const patterns = [
        /const info = \([^)]*\) => [^;]+;\s*\n/g,
        /const warning = \([^)]*\) => [^;]+;\s*\n/g,
        /const error = \([^)]*\) => [^;]+;\s*\n/g,
        /const success = \([^)]*\) => [^;]+;\s*\n/g,
        /const log = \([^)]*\) => [^;]+;\s*\n/g
      ];

      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          for (const match of matches) {
            const funcName = match.match(/const (\w+) =/)?.[1];
            if (funcName) {
              // Check if function is actually called
              const funcCallRegex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
              const calls = content.match(funcCallRegex);
              const callCount = calls ? calls.length : 0;
              
              // If not called at all, remove the assignment
              if (callCount === 0) {
                content = content.replace(match, '');
                modified = true;
              }
            }
          }
        }
      }

      // 2. Fix parsing errors from spread operator
      if (content.includes("Unexpected token '..'")) {
        // Fix spread operator usage in destructuring
        content = content.replace(/const {\s*\.\.\.\s*rest\s*} = /g, 'const ');
        content = content.replace(/\.\.\.\w+/g, '');
        modified = true;
      }

      // 3. Fix duplicate identifier declarations
      if (content.includes('has already been declared')) {
        // Remove duplicate log declarations
        const logDeclarations = content.match(/const log = [^;]+;/g);
        if (logDeclarations && logDeclarations.length > 1) {
          // Keep only the first one
          for (let i = 1; i < logDeclarations.length; i++) {
            content = content.replace(logDeclarations[i], '');
            modified = true;
          }
        }

        // Remove duplicate fs declarations  
        if (fsDeclarations && fsDeclarations.length > 1) {
          // Keep only the first one
          for (let i = 1; i < fsDeclarations.length; i++) {
            content = content.replace(fsDeclarations[i], '');
            modified = true;
          }
        }
      }

      // 4. Fix missing fs/path imports for files that use them
      if (file.includes('fix-localhost-binding.js')) {
          content = content.replace(/import { performance } from 'perf_hooks';/, 
          modified = true;
        }
      }

      // 5. Remove unused fs assignments
      if (content.includes("'fs' is assigned a value but never used")) {
        content = content.replace(/const fs = [^;]+;\s*\n?/g, '');
        modified = true;
      }

      // 6. Fix unused catch block variables
      content = content.replace(/} catch \(_error\) {([^}]*?)(?:console\.error\(error\)|throw error)/gs, 
        (match, body) => {
          return match.replace('_error', 'error');
        });

      if (modified) {
        fs.writeFileSync(filePath, content);
        fixedCount++;
        console.info(`Fixed: ${file}`);
      }

    } catch (err) {
      console.error(`Error fixing ${file}: ${error.message}`);
    }
  }

  console.log(`✅ Fixed ${fixedCount} files with targeted fixes`);
}

fixRemainingIssues();
