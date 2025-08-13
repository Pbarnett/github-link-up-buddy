#!/usr/bin/env node
/**
 * Quality gates runner
 * Runs formatting check, ESLint, TypeScript type-check, and unit tests with coverage.
 * Fails fast on the first failing gate.
 */
const { spawnSync } = require('child_process');

function run(cmd, args, opts = {}) {
  console.log(`› ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

function main() {
  // Prettier check
  run('pnpm', ['run', 'format:check']);

  // ESLint
  run('pnpm', ['run', 'lint']);

  // TypeScript type-check
  run('pnpm', ['run', 'tsc', '--noEmit']);

  // Unit/integration tests with coverage (Vitest thresholds enforce)
  run('pnpm', ['run', 'test', '--coverage']);

  console.log('✅ Quality gates passed');
}

main();
