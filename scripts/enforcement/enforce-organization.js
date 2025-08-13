#!/usr/bin/env node
/**
 * Repository organization enforcement
 * - Validates presence of key directories/files
 * - Flags code files in disallowed locations (e.g., root-level .ts/.tsx)
 * - Ensures basic test layout exists
 */

const fs = require('fs');
const path = require('path');

function exists(p) {
  return fs.existsSync(p);
}

function list(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function warn(msg) {
  console.warn(`⚠️  ${msg}`);
}

function main() {
  const repo = process.cwd();

  // Required files/directories
  const required = [
    'README.md',
    'CONTRIBUTING.md',
    'docs/REPOSITORY_ORGANIZATION_GUIDELINES.md',
    'src',
    'tests',
  ];
  for (const rel of required) {
    if (!exists(path.join(repo, rel))) {
      fail(`Missing required path: ${rel}`);
    }
  }

  // Root-level TypeScript/JSX code files are disallowed
  const root = list(repo);
  const disallowedExt = new Set(['.ts', '.tsx', '.jsx']);
  for (const ent of root) {
    if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (disallowedExt.has(ext)) {
        fail(`Root-level code file detected: ${ent.name}. Move it under src/ or appropriate directory.`);
      }
    }
  }

  // Check basic src layout
  const expectedSrcDirs = ['components', 'services', 'hooks', 'utils'];
  for (const d of expectedSrcDirs) {
    if (!exists(path.join(repo, 'src', d))) {
      warn(`Recommended directory missing: src/${d}. Consider creating it to keep structure consistent.`);
    }
  }

  // Tests layout sanity
  const expectedTestDirs = ['unit', 'integration', 'e2e'];
  for (const d of expectedTestDirs) {
    const p = path.join(repo, 'tests', d);
    if (!exists(p)) {
      warn(`Recommended tests subdirectory missing: tests/${d}`);
    }
  }

  if (process.exitCode && process.exitCode !== 0) {
    console.error('❌ Organization enforcement failed. See messages above.');
    process.exit(process.exitCode);
  } else {
    console.log('✅ Organization enforcement: OK');
    process.exit(0);
  }
}

main();
