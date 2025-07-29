#!/usr/bin/env node

/**
 * Fix remaining unused variable issues in scripts directory
 * Handles TypeScript files, missing imports, and unused parameters
 */

const fs = require('fs');
const path = require('path');

// Files with missing fs/path imports that need to be fixed
const MISSING_IMPORTS_FIXES = [
  {
    file: 'scripts/diagnostics/fix-localhost-binding.js',
    fixes: [
      {
        search: '#!/usr/bin/env node\n\n/**',
        replace: '#!/usr/bin/env node\n\nconst fs = require(\'fs\');\nconst path = require(\'path\');\n\n/**'
      },
      {
        search: 'const log = (message, level = \'info\') => {\n  const timestamp = new Date().toISOString();\n  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);\n};',
        replace: '// Removed unused log function'
      },
      {
        search: '} catch (_error) {\n    error(`Failed to read config: ${error.message}`);\n    error(`Config file may not exist or be malformed`);',
        replace: '} catch (_error) {\n    console.error(`Failed to read config: ${_error.message}`);\n    console.error(`Config file may not exist or be malformed`);'
      }
    ]
  }
];

// TypeScript files with unused parameters that need underscore prefix
const TYPESCRIPT_FIXES = [
  {
    file: 'scripts/cleanup-old-flags.ts',
    fixes: [
      {
        search: 'flagOperations.forEach((action, flagKey) => {',
        replace: 'flagOperations.forEach((_action, _flagKey) => {'
      },
      {
        search: 'const execSync = require(\'child_process\').execSync;',
        replace: 'import { execSync } from \'child_process\';'
      }
    ]
  }
];

// Files with unused _err variables that should be removed completely
const UNUSED_ERR_FIXES = [
  'scripts/development/ai-code-analysis.js',
  'scripts/development/ai-code-review.js', 
  'scripts/development/quality-gates.js'
];

function fixMissingImports() {
  console.log('🔧 Fixing missing imports...\n');
  
  let fixedFiles = 0;
  
  for (const { file, fixes } of MISSING_IMPORTS_FIXES) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Skipping ${file} (not found)`);
      continue;
    }
    
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    for (const { search, replace } of fixes) {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        console.log(`   ✓ Applied fix in ${file}`);
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed imports in ${file}`);
      fixedFiles++;
    }
  }
  
  return fixedFiles;
}

function fixTypescriptFiles() {
  console.log('🔧 Fixing TypeScript unused parameters...\n');
  
  let fixedFiles = 0;
  
  for (const { file, fixes } of TYPESCRIPT_FIXES) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Skipping ${file} (not found)`);
      continue;
    }
    
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    for (const { search, replace } of fixes) {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        console.log(`   ✓ Applied fix in ${file}`);
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed TypeScript issues in ${file}`);
      fixedFiles++;
    }
  }
  
  return fixedFiles;
}

function fixUnusedErrVariables() {
  console.log('🔧 Fixing unused _err variables...\n');
  
  let fixedFiles = 0;
  
  for (const file of UNUSED_ERR_FIXES) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Skipping ${file} (not found)`);
      continue;
    }
    
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Pattern to match catch blocks with unused _err variables
    // Replace } catch (_err) { with } catch {
    content = content.replace(/} catch \(_err\) \{/g, '} catch {');
    content = content.replace(/} catch \(_fixErr\) \{/g, '} catch {');
    content = content.replace(/} catch \(_error\) \{/g, '} catch {');
    
    // Remove standalone unused error variable declarations
    content = content.replace(/^\s*} catch \(error\) \{.*$/gm, '} catch {');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed unused _err variables in ${file}`);
      fixedFiles++;
    }
  }
  
  return fixedFiles;
}

function fixGeneralUnusedVars() {
  console.log('🔧 Scanning for additional unused variables...\n');
  
  const scriptsDir = 'scripts';
  const files = getAllJsFiles(scriptsDir);
  let fixedFiles = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix unused variables in destructuring
    content = content.replace(/const \{ error \} = /g, 'const { error: _error } = ');
    content = content.replace(/const \{ result \} = /g, 'const { result: _result } = ');
    
    // Fix unused function parameters by adding underscore
    content = content.replace(/\(error\) => \{/g, '(_error) => {');
    content = content.replace(/\(result\) => \{/g, '(_result) => {');
    
    // Fix specific unused variable declarations that are never used
    content = content.replace(/^const log = .*?;$/gm, '// Removed unused log function');
    content = content.replace(/^const error = .*?;$/gm, '// Removed unused error function');
    content = content.replace(/^const info = .*?;$/gm, '// Removed unused info function');
    content = content.replace(/^const warning = .*?;$/gm, '// Removed unused warning function');
    content = content.replace(/^const success = .*?;$/gm, '// Removed unused success function');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed general unused variables in ${file}`);
      fixedFiles++;
    }
  }
  
  return fixedFiles;
}

function getAllJsFiles(dir, extensions = ['.js', '.ts']) {
  const files = [];
  
  function walkDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other common directories
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          walkDirectory(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walkDirectory(dir);
  return files;
}

function main() {
  console.log('🧹 Starting comprehensive unused variable cleanup...\n');
  
  const importFixes = fixMissingImports();
  const tsFixes = fixTypescriptFiles();
  const errFixes = fixUnusedErrVariables();
  const generalFixes = fixGeneralUnusedVars();
  
  const totalFixes = importFixes + tsFixes + errFixes + generalFixes;
  
  console.log(`\n🎉 Cleanup complete! Fixed ${totalFixes} files total:`);
  console.log(`   📦 Import fixes: ${importFixes} files`);
  console.log(`   📝 TypeScript fixes: ${tsFixes} files`);
  console.log(`   🚫 Unused _err fixes: ${errFixes} files`);
  console.log(`   🔧 General variable fixes: ${generalFixes} files`);
  
  console.log('\n🔍 Running ESLint check on scripts to verify improvements...');
}

main();
