#!/usr/bin/env node

/**
 * Fix catch block variable naming consistency
 */

const fs = require('fs');
const path = require('path');

function fixCatchVariables() {
  console.log('🔧 Fixing catch block variable consistency...\n');
  
  const scriptsDir = 'scripts';
  const files = getAllJsFiles(scriptsDir);
  let fixedFiles = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix specific TypeScript issues
    if (file.endsWith('.ts')) {
      content = content.replace(/flagOperations\.forEach\(\(action, flagKey\) => \{/g, 'flagOperations.forEach((_action, _flagKey) => {');
      content = content.replace(/const execSync = require\('child_process'\)\.execSync;/g, 'import { execSync } from \'child_process\';');
    }
    
    // Method 1: Standardize all error variables to 'error' and remove unused prefixes
    content = content.replace(/} catch \(_?error?\) \{[^}]*?\$\{_error\.message\}/g, (match) => {
      return match.replace('} catch (_error) {', '} catch (error) {').replace('${_error.message}', '${error.message}');
    });
    
    content = content.replace(/} catch \(error\) \{[^}]*?\$\{_error\.message\}/g, (match) => {
      return match.replace('${_error.message}', '${error.message}');
    });
    
    // Fix template literal references
    content = content.replace(/\$\{_error\.message\}/g, '${error.message}');
    
    // Remove unused variable declarations in catch blocks - convert to parameter
    content = content.replace(/} catch \(error\) \{\s*(?:const|let) \w+ = [^;]+;/g, '} catch (error) {');
    
    // If error is caught but not used, remove the parameter
    const catchBlockRegex = /} catch \(error\) \{([^}]*)\}/g;
    content = content.replace(catchBlockRegex, (match, catchBody) => {
      if (!catchBody.includes('error.') && !catchBody.includes('${error')) {
        return '} catch {' + catchBody + '}';
      }
      return match;
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed catch variables in ${file}`);
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
  console.log('🧹 Starting catch variable consistency fix...\n');
  
  const fixes = fixCatchVariables();
  
  console.log(`\n🎉 Fixed catch variables in ${fixes} files`);
  
  console.log('\n🔍 Final error count check...');
}

main();
