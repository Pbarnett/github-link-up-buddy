#!/usr/bin/env node

import { glob } from 'glob';
const fs = require('fs');

// Function to fix React imports in a file
function fixReactImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Fix: import React, { forwardRef } from 'react'
  if (content.includes('import React,') && content.includes('forwardRef')) {
    content = content.replace(
      /import React,\s*\{\s*([^}]*forwardRef[^}]*)\s*\}\s*from\s*['"]react['"]/g,
      "import * as React from 'react'"
    );
    changed = true;
  }

  // Fix: import { forwardRef } from 'react' (standalone)
  if (content.includes("import { forwardRef }") && !content.includes('import React')) {
    content = content.replace(
      /import\s*\{\s*forwardRef[^}]*\}\s*from\s*['"]react['"]/g,
      "import * as React from 'react'"
    );
    changed = true;
  }

  // Fix missing React imports when using JSX
  if (content.includes('<') && content.includes('>') && !content.includes('import React') && !content.includes('import * as React')) {
    content = "import * as React from 'react';\n" + content;
    changed = true;
  }

  // Fix React.forwardRef usage
  if (content.includes('const { forwardRef } = React')) {
    content = content.replace(/const\s*\{\s*forwardRef\s*\}\s*=\s*React;?/g, '');
    content = content.replace(/forwardRef</g, 'React.forwardRef<');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed React imports in: ${filePath}`);
  }
}

// Get all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}');

console.log(`Processing ${files.length} files...`);

files.forEach(fixReactImports);

console.log('React import fixes completed!');
