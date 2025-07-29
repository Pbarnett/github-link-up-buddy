#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
// Removed unused info function
// Removed unused error function

class ComprehensiveESLintFixer {
  constructor() {
    this.fixedFiles = 0;
    this.fixedErrors = 0;
  }

  async run() {
    console.info('Running comprehensive ESLint fix...');
    
    // Fix all JavaScript files in scripts directory
    await this.fixScriptsDirectory();
    
    // Fix React/TypeScript files in src directory
    await this.fixSrcDirectory();
    
    console.log(`✅ Fixed ${this.fixedFiles} files, resolved ${this.fixedErrors} errors`);
  }

  async fixScriptsDirectory() {
    const scriptsDir = path.join(__dirname, '../..');
    await this.processDirectory(scriptsDir, ['.js'], this.fixScriptFile.bind(this));
  }

  async fixSrcDirectory() {
    const srcDir = path.join(__dirname, '../../src');
    await this.processDirectory(srcDir, ['.ts', '.tsx'], this.fixSourceFile.bind(this));
  }

  async processDirectory(dir, extensions, processFn) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await this.processDirectory(fullPath, extensions, processFn);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            await processFn(fullPath);
          }
        }
      }
    } catch (err) {
      // Skip directories that can't be read
    }
  }

  async fixScriptFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let changes = 0;

      // 1. Fix unused utility function declarations (but not the definitions)
      const unusedUtilityPatterns = [
        /const error = \([^)]*\) => [^;]+;\s*\n/g,
        /const success = \([^)]*\) => [^;]+;\s*\n/g,
        /const warning = \([^)]*\) => [^;]+;\s*\n/g,
        /const info = \([^)]*\) => [^;]+;\s*\n/g,
        /const log = \([^)]*\) => [^;]+;\s*\n/g
      ];

      for (const pattern of unusedUtilityPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          // Only remove if the function is not actually used elsewhere in the file
          for (const match of matches) {
            const funcName = match.match(/const (\w+) =/)?.[1];
            if (funcName) {
              const usage = new RegExp(`\\b${funcName}\\(`, 'g');
              const usageCount = (content.match(usage) || []).length
              // If only declared but never used (count = 1 means only the declaration)
              if (usageCount <= 1) {
                content = content.replace(match, '');
                changes++;
              }
            }
          }
        }
      }

      // 2. Fix path imports for files that use path but don't import it
      if (content.includes('path.') && !content.includes('import path from')) {
        if (fsImportMatch) {
          content = content.replace(fsImportMatch[0], `${fsImportMatch[0]}\nimport path from 'path';`);
          changes++;
        }
      }

      // 3. Remove unused imports
      const unusedImports = ['fileURLToPath', 'dirname'];
      for (const imp of unusedImports) {
        if (content.includes(`'${imp}' is defined but never used`) || 
            (content.includes(imp) && !content.includes(`${imp}(`))) {
          // Remove from import statement
          content = content.replace(new RegExp(`,\\s*${imp}`, 'g'), '');
          content = content.replace(new RegExp(`${imp},\\s*`, 'g'), '');
          content = content.replace(new RegExp(`{\\s*${imp}\\s*}`, 'g'), '{}');
          content = content.replace(/import\s*{}\s*from\s*['"]url['"];\s*\n?/g, '');
          changes++;
        }
      }

      // 4. Fix catch block variable usage
      content = content.replace(/} catch \(_err\) {([^}]*?)throw err/gs, (match, catchBody) => {
        return match.replace('} catch (error) {', '} catch (err) {');
      });

      // 5. Add missing utility functions if they're used but not defined
      const utilityFunctions = ['info', 'warning', 'error', 'success'];
      for (const func of utilityFunctions) {
        if (content.includes(`${func}(`) && !content.includes(`const ${func} =`) && !content.includes(`function ${func}`)) {
          const utilityDefs = `
// Utility functions
// Removed unused info function
// Removed unused error function
`;
          // Insert after imports
          const lastImportMatch = content.match(/^import .+;$/gm);
          if (lastImportMatch) {
            const lastImport = lastImportMatch[lastImportMatch.length - 1];
            const insertIndex = content.indexOf(lastImport) + lastImport.length
            content = content.slice(0, insertIndex) + utilityDefs + content.slice(insertIndex);
            changes++;
            break; // Only add once
          }
        }
      }

      if (changes > 0 && content !== originalContent) {
        fs.writeFileSync(filePath, content);
        this.fixedFiles++;
        this.fixedErrors += changes;
        console.info(`Fixed script: ${path.relative(process.cwd();, filePath)} (${changes} changes)`);
      }

    } catch (err) {
      console.error(`Error fixing ${filePath}: ${error.message}`);
    }
  }

  async fixSourceFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let changes = 0;

      // 1. Fix unused React import
      if (content.includes("'React' is defined but never used")) {
        // Check if React is actually used
        const hasJSX = /<[A-Z]/.test(content) || /React\./.test(content) || /jsx/.test(content);
        if (!hasJSX) {
          content = content.replace(/import React[^;]*;\s*\n?/g, '');
          changes++;
        }
      }

      // 2. Fix unused imports by prefixing with underscore
      const commonUnusedImports = [
        'FC', 'use', 'startTransition', 'ChangeEvent', 'FormEvent', 
        'ComponentType', 'memo', 'createContext', 'useEffect', 'useState',
        'useRef', 'Slot', 'pbkdf2Sync', 'statSync', 'createHash'
      ];
      
      for (const imp of commonUnusedImports) {
        if (content.includes(`'${imp}' is defined but never used`)) {
          // Replace in import statements
          content = content.replace(new RegExp(`\\b${imp}\\b(?=\\s*[,}])`, 'g'), `_${imp}`);
          changes++;
        }
      }

      // 3. Fix import order - remove empty lines between import groups
      if (content.includes('There should be no empty line between import groups')) {
        const lines = content.split('\n');
        const fixedLines = [];
        let inImportSection = false;
        let lastWasImport = false;
        
        for (const line of lines) {
          if (line.trim().startsWith('import ')) {
            inImportSection = true;
            lastWasImport = true;
            fixedLines.push(line);
          } else if (inImportSection && line.trim() === '' && lastWasImport) {
            // Skip empty lines between imports
            lastWasImport = false;
            continue;
          } else {
            if (inImportSection && line.trim() !== '') {
              inImportSection = false;
            }
            lastWasImport = false;
            fixedLines.push(line);
          }
        }
        
        const newContent = fixedLines.join('\n');
        if (newContent !== content) {
          content = newContent;
          changes++;
        }
      }

      // 4. Prefix unused variables with underscore for TypeScript
      const unusedVarRegex = /const (\w+) = .+;.*\/\/ .+'(\w+)' is defined but never used/g;
      let match;
      while ((match = unusedVarRegex.exec(content)) !== null) {
        const varName = match[1];
        content = content.replace(new RegExp(`\\bconst ${varName}\\b`), `const _${varName}`);
        changes++;
      }

      // 5. Remove unused eslint-disable comments
      content = content.replace(/\/\* eslint-disable[^*]*\*\/\s*/g, '');
      content = content.replace(/\/\/ eslint-disable-next-line[^\n]*\n/g, '');

      if (changes > 0 && content !== originalContent) {
        fs.writeFileSync(filePath, content);
        this.fixedFiles++;
        this.fixedErrors += changes;
        console.info(`Fixed source: ${path.relative(process.cwd();, filePath)} (${changes} changes)`);
      }

    } catch (err) {
      console.error(`Error fixing ${filePath}: ${error.message}`);
    }
  }
}

// Run the fixer
const fixer = new ComprehensiveESLintFixer();
fixer.run().catch(err => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
