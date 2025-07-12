# LaunchDarkly API Setup Guide

## Required Environment Variables

To use the LaunchDarkly flag setup script, you need to set these environment variables:

```bash
# Required: Your LaunchDarkly API access token
export LAUNCHDARKLY_API_KEY="your-api-key-here"

# Optional: Override default project (defaults to "default")
export LAUNCHDARKLY_PROJECT_KEY="your-project-key"

# Optional: Override default environment (defaults to "production")
export LAUNCHDARKLY_ENVIRONMENT_KEY="production"
```

## Getting Your LaunchDarkly API Key

1. **Log in to LaunchDarkly Dashboard**
   - Go to https://app.launchdarkly.com
   - Sign in with your account

2. **Navigate to Access Tokens**
   - Click on your profile/account menu (top right)
   - Select "Account settings"
   - Click "Authorization" in the left sidebar
   - Click "Access tokens" tab

3. **Create a New Access Token**
   - Click "Create token"
   - Give it a descriptive name (e.g., "CLI Flag Setup")
   - Set the role to "Writer" or "Admin" (needed for flag creation)
   - Select your project scope
   - Click "Create token"

4. **Copy the Token**
   - Copy the generated token immediately (it won't be shown again)
   - Store it securely

## Setting Up Environment Variables

### Option 1: Export in Terminal (Temporary)
```bash
export LAUNCHDARKLY_API_KEY="your-api-key-here"
export LAUNCHDARKLY_PROJECT_KEY="your-project-key"
export LAUNCHDARKLY_ENVIRONMENT_KEY="production"
```

### Option 2: Add to .env.local (Persistent)
```bash
# Add to your .env.local file
LAUNCHDARKLY_API_KEY=your-api-key-here
LAUNCHDARKLY_PROJECT_KEY=your-project-key
LAUNCHDARKLY_ENVIRONMENT_KEY=production
```

Then source it:
```bash
source .env.local
```

### Option 3: Add to Shell Profile (Permanent)
Add to your `~/.zshrc` or `~/.bashrc`:
```bash
export LAUNCHDARKLY_API_KEY="your-api-key-here"
export LAUNCHDARKLY_PROJECT_KEY="your-project-key"
export LAUNCHDARKLY_ENVIRONMENT_KEY="production"
```

Then reload your shell:
```bash
source ~/.zshrc
```

## Finding Your Project Key

1. In the LaunchDarkly dashboard, the project key is shown in the URL
2. It's typically in the format: `https://app.launchdarkly.com/PROJECT_KEY/features`
3. Or check the "Project settings" page for the exact key

## Running the Setup Script

Once your environment variables are set:

```bash
./scripts/setup-launchdarkly-flags.sh
```

This will:
- Create the `wallet_ui` flag (100% enabled)
- Create the `profile_ui_revamp` flag (5% enabled)
- Configure proper targeting rules

## Verifying the Setup

After running the setup script, you can verify by:

1. **Check the LaunchDarkly Dashboard**
   - Visit your project's feature flags page
   - Confirm both flags are present with correct targeting

2. **Run the Verification Script**
   ```bash
   npm run verify:launchdarkly
   ```

3. **Run Staging Smoke Tests**
   ```bash
   ./scripts/staging-smoke-test.sh
   ```
