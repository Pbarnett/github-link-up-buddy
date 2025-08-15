#!/usr/bin/env node
/**
 * Simple sensitive pattern guard for server/edge code.
 * Fails if forbidden tokens are found in non-test, non-generated code.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const ignoreDirs = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'out', '.turbo', '.cache'
]);

// Target directories to scan (tighten scope to server-side areas)
const scanRoots = [
  'supabase/functions',
  'server',
  'packages',
  'src/services',
  'src/functions',
  'scripts' // exclude this script filename via allowlist below
].map(p => path.join(repoRoot, p)).filter(p => fs.existsSync(p));

// File extensions to scan
const exts = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs', '.sql']);

// Forbidden tokens (storage of PAN/CVV or encrypted payment blobs)
const forbidden = [
  /\bcard_number_encrypted\b/i,
  /\bcvv_encrypted\b/i,
  /\bencrypted_payment_data\b/i,
  /\bcard_number\b/i, // be careful; this is intentionally broad for server-side only
  /\bcvv\b/i
];

// Allowlist: files that may legitimately reference certain tokens (e.g., migrations, this checker)
function isAllowlisted(filePath) {
  const rel = path.relative(repoRoot, filePath);
  if (rel === 'scripts/security/sensitive-grep-check.cjs') return true;
  if (rel.startsWith('supabase/migrations/')) return true; // migrations can contain legacy columns
  if (rel.includes('.test.') || rel.includes('__tests__') || rel.includes('/tests/')) return true;
  return false;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.DS_')) continue;
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (exts.has(ext)) out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

let violations = [];
for (const root of scanRoots) {
  const files = walk(root);
  for (const file of files) {
    if (isAllowlisted(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    for (const re of forbidden) {
      if (re.test(content)) {
        violations.push({ file, pattern: re.source });
      }
    }
  }
}

if (violations.length) {
  console.error('\nSensitive pattern check failed. The following occurrences were found:');
  for (const v of violations) {
    console.error(` - ${path.relative(repoRoot, v.file)} :: /${v.pattern}/`);
  }
  console.error('\nRemove sensitive fields (PAN/CVV/encrypted blobs) from server/edge code.');
  process.exit(1);
} else {
  console.log('Sensitive pattern check passed.');
}

