#!/bin/bash

# Google OAuth Client Setup Script
# This script guides you through setting up a new Google OAuth client

set -e

echo "🚀 Google OAuth Client Setup for GitHub Link Up Buddy"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Create OAuth Client in Google Cloud Console${NC}"
echo "---------------------------------------------------"
echo ""
echo "1. Visit: https://console.cloud.google.com/apis/credentials"
echo "2. Select your project (or create a new one)"
echo "3. Click '+ CREATE CREDENTIALS' → 'OAuth client ID'"
echo "4. Application type: 'Web application'"
echo "5. Name: 'GitHub Link Up Buddy'"
echo ""

echo -e "${BLUE}Step 2: Configure Authorized Redirect URIs${NC}"
echo "--------------------------------------------"
echo ""
echo "Add these exact URIs (copy and paste):"
echo ""
echo -e "${GREEN}http://127.0.0.1:54321/auth/v1/callback${NC}"
echo -e "${GREEN}http://localhost:54321/auth/v1/callback${NC}"
echo -e "${GREEN}http://localhost:3000/auth/callback${NC}"
echo -e "${GREEN}https://your-domain.com/auth/callback${NC} (replace with your production domain)"
echo ""

echo -e "${BLUE}Step 3: Configure Authorized JavaScript Origins${NC}"
echo "-----------------------------------------------"
echo ""
echo "Add these origins:"
echo ""
echo -e "${GREEN}http://127.0.0.1:54321${NC}"
echo -e "${GREEN}http://localhost:54321${NC}"
echo -e "${GREEN}http://localhost:3000${NC}"
echo -e "${GREEN}https://your-domain.com${NC} (replace with your production domain)"
echo ""

echo -e "${YELLOW}After creating the OAuth client, you'll get:${NC}"
echo "- Client ID (format: xxxxxx-xxxxxxx.apps.googleusercontent.com)"
echo "- Client Secret (format: GOCSPX-xxxxxxxxxxxxxxxx)"
echo ""

read -p "Press Enter when you have created the OAuth client and have the credentials..."

echo ""
echo -e "${BLUE}Step 4: Enter Your New OAuth Credentials${NC}"
echo "-------------------------------------------"
echo ""

# Get Client ID
while true; do
    read -p "Enter your Google Client ID: " CLIENT_ID
    if [[ $CLIENT_ID =~ ^[0-9]+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$ ]]; then
        break
    else
        echo -e "${RED}Invalid format. Client ID should look like: 123456789-abc123.apps.googleusercontent.com${NC}"
    fi
done

# Get Client Secret
while true; do
    read -p "Enter your Google Client Secret: " CLIENT_SECRET
    if [[ $CLIENT_SECRET =~ ^GOCSPX-[a-zA-Z0-9_-]+$ ]]; then
        break
    else
        echo -e "${RED}Invalid format. Client Secret should look like: GOCSPX-abc123xyz${NC}"
    fi
done

echo ""
echo -e "${BLUE}Step 5: Update Environment Variables${NC}"
echo "--------------------------------------"
echo ""

# Update .env file
if [ -f ".env" ]; then
    echo "Updating .env file..."
    
    # Backup existing .env
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "Created backup: .env.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Update or add variables
    if grep -q "SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID" .env; then
        sed -i'' -e "s/SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=.*/SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=$CLIENT_ID/" .env
    else
        echo "SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=$CLIENT_ID" >> .env
    fi
    
    if grep -q "SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET" .env; then
        sed -i'' -e "s/SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=.*/SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=$CLIENT_SECRET/" .env
    else
        echo "SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=$CLIENT_SECRET" >> .env
    fi
    
    if grep -q "VITE_GOOGLE_CLIENT_ID" .env; then
        sed -i'' -e "s/VITE_GOOGLE_CLIENT_ID=.*/VITE_GOOGLE_CLIENT_ID=$CLIENT_ID/" .env
    else
        echo "VITE_GOOGLE_CLIENT_ID=$CLIENT_ID" >> .env
    fi
    
    echo -e "${GREEN}✅ Updated .env file${NC}"
else
    echo "Creating .env file..."
    cat > .env << EOF
# Google OAuth Configuration
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=$CLIENT_ID
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=$CLIENT_SECRET
VITE_GOOGLE_CLIENT_ID=$CLIENT_ID

# Add your other environment variables here
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
fi

# Update .env.local if it exists
if [ -f ".env.local" ]; then
    echo "Updating .env.local file..."
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
    
    if grep -q "SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID" .env.local; then
        sed -i'' -e "s/SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=.*/SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=$CLIENT_ID/" .env.local
    else
        echo "SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=$CLIENT_ID" >> .env.local
    fi
    
    if grep -q "SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET" .env.local; then
        sed -i'' -e "s/SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=.*/SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=$CLIENT_SECRET/" .env.local
    else
        echo "SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=$CLIENT_SECRET" >> .env.local
    fi
    
    if grep -q "VITE_GOOGLE_CLIENT_ID" .env.local; then
        sed -i'' -e "s/VITE_GOOGLE_CLIENT_ID=.*/VITE_GOOGLE_CLIENT_ID=$CLIENT_ID/" .env.local
    else
        echo "VITE_GOOGLE_CLIENT_ID=$CLIENT_ID" >> .env.local
    fi
    
    echo -e "${GREEN}✅ Updated .env.local file${NC}"
fi

echo ""
echo -e "${BLUE}Step 6: Test Configuration${NC}"
echo "----------------------------"
echo ""

# Test the new configuration
echo "Testing new OAuth configuration..."
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=$CLIENT_ID node test-oauth-config.cjs

echo ""
echo -e "${GREEN}🎉 OAuth Client Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Restart Supabase: npx supabase stop && npx supabase start"
echo "2. Test the authentication flow in your application"
echo "3. Deploy your changes to production"
echo "4. Update your production OAuth client with production domains"
echo ""

echo -e "${BLUE}Important Security Notes:${NC}"
echo "- Never commit your .env files to version control"
echo "- Keep your Client Secret secure"
echo "- Regularly rotate your OAuth credentials"
echo "- Monitor your OAuth usage in Google Cloud Console"
echo ""

echo -e "${YELLOW}Troubleshooting:${NC}"
echo "- If authentication fails, check the browser console for errors"
echo "- Verify redirect URIs match exactly"
echo "- Ensure your domain is authorized in Google Cloud Console"
echo "- Check Supabase configuration in supabase/config.toml"
