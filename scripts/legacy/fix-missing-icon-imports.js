#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Map of commonly used icon components to their import names
const ICON_MAP = {
  'AlertCircle': 'AlertCircle',
  'AlertTriangle': 'AlertTriangle',
  'ArrowLeft': 'ArrowLeft',
  'ArrowRight': 'ArrowRight',
  'Bell': 'Bell',
  'Calendar': 'Calendar',
  'CalendarIcon': 'Calendar',
  'Check': 'Check',
  'CheckCircle': 'CheckCircle2',
  'CheckCircle2': 'CheckCircle2',
  'ChevronDown': 'ChevronDown',
  'ChevronLeft': 'ChevronLeft',
  'ChevronRight': 'ChevronRight',
  'ChevronUp': 'ChevronUp',
  'Clock': 'Clock',
  'CreditCard': 'CreditCard',
  'DollarSign': 'DollarSign',
  'Download': 'Download',
  'Eye': 'Eye',
  'FileText': 'FileText',
  'Filter': 'Filter',
  'Globe': 'Globe',
  'HelpCircle': 'HelpCircle',
  'Info': 'Info',
  'Loader2': 'Loader2',
  'Lock': 'Lock',
  'Mail': 'Mail',
  'MapPin': 'MapPin',
  'Package': 'Package',
  'Phone': 'Phone',
  'Plane': 'Plane',
  'PlaneTakeoff': 'PlaneTakeoff',
  'Plus': 'Plus',
  'RefreshCw': 'RefreshCw',
  'Save': 'Save',
  'Search': 'Search',
  'Settings': 'Settings',
  'Shield': 'Shield',
  'Trash2': 'Trash2',
  'Upload': 'Upload',
  'User': 'User',
  'Wifi': 'Wifi',
  'X': 'X',
  'XCircle': 'XCircle',
  'Zap': 'Zap'
};

// Also map for React Hook Form imports
const REACT_HOOK_FORM_IMPORTS = {
  'useForm': 'useForm',
  'Controller': 'Controller',
  'useFormContext': 'useFormContext',
  'FormProvider': 'FormProvider',
  'UseFormReturn': 'UseFormReturn',
  'Control': 'Control'
};

// Stripe imports
const STRIPE_IMPORTS = {
  'useStripe': 'useStripe',
  'useElements': 'useElements',
  'CardElement': 'CardElement',
  'Elements': 'Elements'
};

function findUsedIcons(content) {
  const usedIcons = new Set();
  
  // Find JSX elements that look like icons
  const iconPattern = /<(\w+)\s+className[^>]*\/?>|<(\w+)\s+[^>]*\/>|<(\w+)[\s>]/g;
  let match;
  
  while ((match = iconPattern.exec(content)) !== null) {
    const iconName = match[1] || match[2] || match[3];
    if (ICON_MAP[iconName]) {
      usedIcons.add(iconName);
    }
  }
  
  return usedIcons;
}

function findUsedReactHookFormImports(content) {
  const used = new Set();
  
  Object.keys(REACT_HOOK_FORM_IMPORTS).forEach(hookName => {
    const patterns = [
      new RegExp(`\\b${hookName}\\(`, 'g'),
      new RegExp(`\\b${hookName}<`, 'g'),
      new RegExp(`<${hookName}\\b`, 'g'),
      new RegExp(`: ${hookName}\\b`, 'g')
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        used.add(hookName);
        break;
      }
    }
  });
  
  return used;
}

function findUsedStripeImports(content) {
  const used = new Set();
  
  Object.keys(STRIPE_IMPORTS).forEach(stripeName => {
    const patterns = [
      new RegExp(`\\b${stripeName}\\(`, 'g'),
      new RegExp(`<${stripeName}\\b`, 'g'),
      new RegExp(`${stripeName}\\)`, 'g')
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        used.add(stripeName);
        break;
      }
    }
  });
  
  return used;
}

function addMissingImports(content, filePath) {
  let modified = false;
  let newContent = content;
  const lines = content.split('\n');
  
  // Find existing imports
  const existingImports = {
    lucide: new Set(),
    reactHookForm: new Set(),
    stripe: new Set()
  };
  
  let hasLucideImport = false;
  let hasReactHookFormImport = false;
  let hasStripeImport = false;
  let importInsertIndex = 0;
  
  // Find existing imports and where to insert new ones
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('import ')) {
      importInsertIndex = i + 1;
      
      if (line.includes("from 'lucide-react'")) {
        hasLucideImport = true;
        const match = line.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/);
        if (match) {
          match[1].split(',').forEach(imp => {
            existingImports.lucide.add(imp.trim());
          });
        }
      }
      
      if (line.includes("from 'react-hook-form'")) {
        hasReactHookFormImport = true;
        const match = line.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]react-hook-form['"]/);
        if (match) {
          match[1].split(',').forEach(imp => {
            existingImports.reactHookForm.add(imp.trim());
          });
        }
      }
      
      if (line.includes("from '@stripe/react-stripe-js'")) {
        hasStripeImport = true;
        const match = line.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]@stripe\/react-stripe-js['"]/);
        if (match) {
          match[1].split(',').forEach(imp => {
            existingImports.stripe.add(imp.trim());
          });
        }
      }
    } else if (line.trim() === '' && i > 0) {
      // Stop at first empty line after imports
      break;
    }
  }
  
  // Find what icons/imports are actually used
  const usedIcons = findUsedIcons(content);
  const usedReactHookForm = findUsedReactHookFormImports(content);
  const usedStripe = findUsedStripeImports(content);
  
  // Add missing Lucide imports
  const missingIcons = new Set();
  usedIcons.forEach(icon => {
    const importName = ICON_MAP[icon];
    if (importName && !existingImports.lucide.has(importName)) {
      missingIcons.add(importName);
    }
  });
  
  if (missingIcons.size > 0) {
    const newIcons = Array.from(missingIcons).sort();
    if (hasLucideImport) {
      // Add to existing import
      newContent = newContent.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/,
        (match, existingIcons) => {
          const allIcons = [...existingIcons.split(',').map(i => i.trim()), ...newIcons]
            .filter(Boolean)
            .sort();
          return `import { ${allIcons.join(', ')} } from 'lucide-react'`;
        }
      );
    } else {
      // Add new import
      lines.splice(importInsertIndex, 0, `import { ${newIcons.join(', ')} } from 'lucide-react';`);
      importInsertIndex++;
    }
    modified = true;
  }
  
  // Add missing React Hook Form imports
  const missingReactHookForm = new Set();
  usedReactHookForm.forEach(hook => {
    if (!existingImports.reactHookForm.has(hook)) {
      missingReactHookForm.add(hook);
    }
  });
  
  if (missingReactHookForm.size > 0) {
    const newHooks = Array.from(missingReactHookForm).sort();
    if (hasReactHookFormImport) {
      // Add to existing import
      newContent = newContent.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react-hook-form['"]/,
        (match, existingHooks) => {
          const allHooks = [...existingHooks.split(',').map(h => h.trim()), ...newHooks]
            .filter(Boolean)
            .sort();
          return `import { ${allHooks.join(', ')} } from 'react-hook-form'`;
        }
      );
    } else {
      // Add new import
      lines.splice(importInsertIndex, 0, `import { ${newHooks.join(', ')} } from 'react-hook-form';`);
      importInsertIndex++;
    }
    modified = true;
  }
  
  // Add missing Stripe imports
  const missingStripe = new Set();
  usedStripe.forEach(stripe => {
    if (!existingImports.stripe.has(stripe)) {
      missingStripe.add(stripe);
    }
  });
  
  if (missingStripe.size > 0) {
    const newStripe = Array.from(missingStripe).sort();
    if (hasStripeImport) {
      // Add to existing import
      newContent = newContent.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@stripe\/react-stripe-js['"]/,
        (match, existingStripe) => {
          const allStripe = [...existingStripe.split(',').map(s => s.trim()), ...newStripe]
            .filter(Boolean)
            .sort();
          return `import { ${allStripe.join(', ')} } from '@stripe/react-stripe-js'`;
        }
      );
    } else {
      // Add new import
      lines.splice(importInsertIndex, 0, `import { ${newStripe.join(', ')} } from '@stripe/react-stripe-js';`);
      importInsertIndex++;
    }
    modified = true;
  }
  
  if (modified && !hasLucideImport && !hasReactHookFormImport && !hasStripeImport) {
    // If we added imports, reconstruct content from lines
    newContent = lines.join('\n');
  }
  
  return { content: newContent, modified };
}

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', { absolute: true });

let fixedFiles = 0;
let totalIssues = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = addMissingImports(content, filePath);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      fixedFiles++;
      console.log(`Added missing imports to: ${path.relative(process.cwd(), filePath)}`);
      totalIssues++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Fix complete!`);
console.log(`📄 Fixed ${fixedFiles} files`);
console.log(`🔧 Added missing imports to ${totalIssues} files`);
