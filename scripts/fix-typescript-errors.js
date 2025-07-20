#!/usr/bin/env node

/**
 * Master script to fix TypeScript errors systematically
 * Based on comprehensive analysis of React Hook Form, React 19, and TypeScript docs
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    const output = execSync(command, { 
      cwd: PROJECT_ROOT, 
      stdio: 'pipe', 
      encoding: 'utf-8' 
    });
    console.log(`✅ ${description} completed`);
    if (output.trim()) {
      console.log(output);
    }
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

function runCommandWithLiveOutput(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(command, { 
      cwd: PROJECT_ROOT, 
      stdio: 'inherit'
    });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    return false;
  }
}

async function checkCurrentErrors() {
  console.log('📊 Checking current TypeScript errors...');
  try {
    const output = execSync('npm run tsc 2>&1', { 
      cwd: PROJECT_ROOT, 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return { hasErrors: false, output };
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || '';
    const errorCount = (errorOutput.match(/error TS\d+:/g) || []).length;
    console.log(`Found ${errorCount} TypeScript errors`);
    return { hasErrors: true, errorCount, output: errorOutput };
  }
}

async function updateTsConfig() {
  console.log('\n🔧 Updating tsconfig.json for better type support...');
  
  const tsConfigPath = path.join(PROJECT_ROOT, 'tsconfig.json');
  let tsConfigContent = await fs.readFile(tsConfigPath, 'utf-8');
  
  // Remove JSON comments that are not valid JSON
  tsConfigContent = tsConfigContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, ''); // Remove // comments
  
  const tsConfig = JSON.parse(tsConfigContent);
  
  // Add @types path mapping if not exists
  if (!tsConfig.compilerOptions.paths['@/types']) {
    tsConfig.compilerOptions.paths['@/types'] = ['./src/types'];
    tsConfig.compilerOptions.paths['@/types/*'] = ['./src/types/*'];
    console.log('✅ Added @/types path mapping');
  }
  
  // Ensure proper module resolution
  if (tsConfig.compilerOptions.moduleResolution !== 'bundler') {
    console.log('⚠️  Consider using "bundler" for moduleResolution (already set)');
  }
  
  // Ensure skipLibCheck is true (helps with third-party type issues)
  if (!tsConfig.compilerOptions.skipLibCheck) {
    tsConfig.compilerOptions.skipLibCheck = true;
    console.log('✅ Enabled skipLibCheck for better compatibility');
  }
  
  await fs.writeFile(tsConfigPath, JSON.stringify(tsConfig, null, 2), 'utf-8');
  console.log('✅ Updated tsconfig.json');
}

async function installMissingTypes() {
  console.log('\n🔧 Installing missing @types packages...');
  
  const packagesToCheck = [
    '@types/react',
    '@types/react-dom', 
    '@types/node',
    '@types/uuid'
  ];
  
  for (const pkg of packagesToCheck) {
    try {
      await fs.access(path.join(PROJECT_ROOT, 'node_modules', pkg));
      console.log(`✅ ${pkg} already installed`);
    } catch {
      console.log(`📦 Installing ${pkg}...`);
      runCommand(`npm install --save-dev ${pkg}`, `Install ${pkg}`);
    }
  }
}

async function createGitignoreEntry() {
  const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
  try {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes('.tsbuildinfo')) {
      await fs.appendFile(gitignorePath, '\n# TypeScript build info\n.tsbuildinfo\n');
      console.log('✅ Added .tsbuildinfo to .gitignore');
    }
  } catch {
    console.log('⚠️  Could not update .gitignore');
  }
}

function displayFixSummary(beforeErrors, afterErrors) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 FIX SUMMARY');
  console.log('='.repeat(80));
  
  if (beforeErrors.hasErrors) {
    console.log(`Initial errors: ${beforeErrors.errorCount}`);
  } else {
    console.log('Initial state: No errors detected');
  }
  
  if (afterErrors.hasErrors) {
    console.log(`Remaining errors: ${afterErrors.errorCount}`);
    const fixed = beforeErrors.errorCount - afterErrors.errorCount;
    if (fixed > 0) {
      console.log(`✅ Fixed: ${fixed} errors`);
    }
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Review remaining errors manually');
    console.log('2. Check specific file imports and type annotations');
    console.log('3. Consider adding // @ts-ignore for complex third-party issues');
    console.log('4. Verify React Hook Form usage patterns');
  } else {
    console.log('🎉 All TypeScript errors fixed!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Commit your changes');
    console.log('2. Run tests to ensure everything works');
    console.log('3. Consider running the build process');
  }
  
  console.log('\n📚 HELPFUL RESOURCES:');
  console.log('- React Hook Form TypeScript docs: https://react-hook-form.com/get-started#TypeScript');
  console.log('- React TypeScript docs: https://react.dev/learn/typescript');
  console.log('- TypeScript Handbook: https://www.typescriptlang.org/docs/');
}

async function main() {
  console.log('🚀 Starting comprehensive TypeScript error fix...\n');
  console.log('This script will:');
  console.log('1. Check current errors');
  console.log('2. Create missing type declarations');
  console.log('3. Fix React import patterns');
  console.log('4. Update TypeScript configuration');
  console.log('5. Verify the fixes');
  
  // Step 1: Check initial state
  const beforeErrors = await checkCurrentErrors();
  
  // Step 2: Update tsconfig.json
  await updateTsConfig();
  
  // Step 3: Install missing types
  await installMissingTypes();
  
  // Step 4: Create type declarations
  const typeCreationSuccess = runCommandWithLiveOutput(
    'node scripts/create-type-declarations.js',
    'Creating type declarations'
  );
  
  if (!typeCreationSuccess) {
    console.error('❌ Failed to create type declarations');
    process.exit(1);
  }
  
  // Step 5: Fix React imports  
  const reactImportSuccess = runCommandWithLiveOutput(
    'node scripts/fix-react-imports.js',
    'Fixing React import patterns'
  );
  
  if (!reactImportSuccess) {
    console.error('❌ Failed to fix React imports');
    process.exit(1);
  }
  
  // Step 6: Create .gitignore entry
  await createGitignoreEntry();
  
  // Step 7: Clear TypeScript cache and check errors
  console.log('\n🔧 Clearing TypeScript cache...');
  try {
    await fs.unlink(path.join(PROJECT_ROOT, '.tsbuildinfo'));
    console.log('✅ Cleared .tsbuildinfo');
  } catch {
    console.log('⚠️  No .tsbuildinfo to clear');
  }
  
  // Step 8: Final error check
  console.log('\n🔍 Running final TypeScript check...');
  const afterErrors = await checkCurrentErrors();
  
  // Step 9: Display summary
  displayFixSummary(beforeErrors, afterErrors);
  
  // Exit with appropriate code
  process.exit(afterErrors.hasErrors ? 1 : 0);
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
