#!/usr/bin/env node

/**
 * Fix no-undef and no-unused-vars for specific remaining errors
 */

const fs = require('fs');
const path = require('path');

function fixSpecificErrors() {
  console.log('🔧 Fixing specific no-undef and no-unused-vars errors...\n');

  const fixes = [
    {
      file: 'scripts/advanced-optimization.js',
      search: [
        "const { error } = require('console');",
        "const { _error } = require('console');"
      ],
      replace: "const { error, _error } = require('console');"
    },
    {
      file: 'scripts/create-business-dashboards.js',
      search: [
        "const { error } = require('console');",
        "const { _error } = require('console');"
      ],
      replace: "const { error, _error } = require('console');"
    },
    {
      file: 'scripts/dashboard-best-practices.js',
      search: [
        "const { error } = require('console');",
        "const { _error } = require('console');"
      ],
      replace: "const { error, _error } = require('console');"
    }
  ];

  let fixedFiles = 0;
  
  for (const { file, search, replace } of fixes) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  Skipping ${file} (not found)`);
      continue;
    }

    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;

    search.forEach(s => {
      content = content.replace(new RegExp(s, 'g'), replace);
    });

    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed errors in ${file}`);
      fixedFiles++;
    }
  }
  
  console.log(`\n🎉 Fixed errors in ${fixedFiles} files`);
}

fixSpecificErrors();

