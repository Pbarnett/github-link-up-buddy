#!/usr/bin/env bash
# Comprehensive setup script for Codex environment
# This script installs all dependencies needed for development and testing
# since network access will not be available after setup.

# Exit on error, but don't exit on subshell errors
set -e

# Function for section headers
log_section() {
  echo ""
  echo "======================================================="
  echo "🚀 $1"
  echo "======================================================="
  echo ""
}

# Function for task logging
log_task() {
  echo "🔹 $1"
}

# Function for success messages
log_success() {
  echo "✅ $1"
}

# Function for error messages
log_error() {
  echo "❌ $1"
}

# Start setup
log_section "CODEX ENVIRONMENT SETUP"
echo "Setting up development environment with all dependencies"
echo "This will ensure everything is pre-cached for offline use"

# Step 1: Set up Node.js package manager
log_section "Setting up package manager"
log_task "Enabling pnpm via corepack..."
corepack enable pnpm || { log_error "Failed to enable pnpm"; exit 1; }
log_success "pnpm enabled successfully"

# Step 2: Install dependencies
log_section "Installing project dependencies"
if [ -f "pnpm-lock.yaml" ]; then
  log_task "Lock file found, installing dependencies with --frozen-lockfile..."
  pnpm install --frozen-lockfile || { 
    log_error "Failed with --frozen-lockfile, falling back to regular install..."
    pnpm install
  }
else
  log_task "No lock file found, performing regular install..."
  pnpm install
fi

# Step 3: Ensure dev dependencies are installed
log_section "Ensuring all development dependencies are installed"
log_task "Installing dev dependencies explicitly..."
pnpm install -D

# Step 4: Install Vitest explicitly if it's used in the project
log_task "Checking for Vitest in dependencies..."
if grep -q '"vitest"' package.json; then
  log_task "Vitest found in package.json, ensuring it's installed..."
  pnpm add -D vitest
  
  # Verify Vitest installation
  if npx vitest --version > /dev/null 2>&1; then
    log_success "Vitest installed successfully: $(npx vitest --version)"
  else
    log_error "Vitest installation verification failed, attempting to install again..."
    pnpm add -D vitest@latest
  fi
else
  log_task "Vitest not found in package.json, checking if it's needed..."
  if grep -q '"test"' package.json && grep -q 'vitest' package.json; then
    log_task "Vitest references found, installing as a precaution..."
    pnpm add -D vitest@latest
  fi
fi

# Step 5: Install Playwright if it's used in the project
log_section "Checking for Playwright"
if grep -q '@playwright/test' package.json; then
  log_task "Playwright found in dependencies, installing browsers..."
  npx playwright install --with-deps
  log_success "Playwright browsers installed"
else
  log_task "Playwright not found in dependencies, skipping browser installation"
fi

# Step 6: Install any other global tools needed
log_section "Installing additional development tools"

# Check for ESLint
if grep -q '"eslint"' package.json; then
  log_task "Installing ESLint globally to ensure CLI availability..."
  pnpm add -g eslint
fi

# Check for TypeScript
if grep -q '"typescript"' package.json; then
  log_task "Installing TypeScript globally to ensure tsc availability..."
  pnpm add -g typescript
fi

# Step 7: Pre-build if necessary
log_section "Running pre-build steps"
if grep -q '"build"' package.json; then
  log_task "Running build script to ensure all dependencies are resolved..."
  pnpm run build || {
    log_error "Build failed, but continuing with setup..."
  }
fi

# Step 8: Run tests to verify everything works
log_section "Verifying test setup"
if grep -q '"test"' package.json; then
  log_task "Attempting to run tests to verify setup..."
  pnpm test -- --run || {
    log_error "Tests failed, but setup will continue..."
  }
fi

# Final verification
log_section "Verifying development environment"

# Check TypeScript
if [ -f "tsconfig.json" ]; then
  log_task "Verifying TypeScript installation..."
  npx tsc --version && log_success "TypeScript is working" || log_error "TypeScript verification failed"
fi

# Check Vitest again
if grep -q '"vitest"' package.json || grep -q 'vitest' package.json; then
  log_task "Verifying Vitest installation..."
  npx vitest --version && log_success "Vitest is working" || log_error "Vitest verification failed"
fi

# Check if pnpm can run scripts
log_task "Verifying pnpm script execution..."
pnpm --version && log_success "pnpm is working" || log_error "pnpm verification failed"

log_section "SETUP COMPLETE"
echo "The development environment has been set up successfully."
echo "All dependencies should now be pre-cached for offline use."
echo ""
echo "You can now run:"
echo "  - pnpm dev     (to start the development server)"
echo "  - pnpm test    (to run tests)"
echo "  - pnpm build   (to build the project)"
echo ""
