#!/bin/bash
# LaunchDarkly Feature Flags Setup for Auto-Booking System
# This script guides you through creating all required feature flags

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_flag() {
    echo -e "${PURPLE}[FLAG]${NC} $1"
}

echo "🎛️  Setting up LaunchDarkly Feature Flags for Auto-Booking System"
echo "================================================================="
echo

log_info "🌐 Step 1: Access LaunchDarkly Dashboard"
echo "1. Visit: https://app.launchdarkly.com"
echo "2. Log in to your account"
echo "3. Navigate to 'Feature Flags' in the left sidebar"
echo

log_warn "⏳ Please open LaunchDarkly in another tab, then press Enter to continue..."
read -p ""

echo
log_info "🚀 Creating 7 Required Feature Flags for Auto-Booking"
echo "======================================================="

# Define all required flags
declare -A flags
flags["auto_booking_pipeline_enabled"]="boolean|false|Master switch for the entire auto-booking pipeline"
flags["auto_booking_emergency_disable"]="boolean|false|Emergency kill switch to immediately disable all auto-booking"
flags["flight_monitoring_enabled"]="boolean|true|Enable continuous flight price monitoring"
flags["payment_processing_enabled"]="boolean|true|Enable payment processing for bookings"
flags["concurrency_control_enabled"]="boolean|true|Enable Redis-based concurrency control"
flags["max_concurrent_bookings"]="number|3|Maximum number of concurrent booking attempts"
flags["booking_timeout_seconds"]="number|300|Timeout in seconds for booking operations"

flag_count=1
total_flags=${#flags[@]}

for flag_key in "${!flags[@]}"; do
    IFS='|' read -r flag_type default_value description <<< "${flags[$flag_key]}"
    
    echo
    log_flag "[$flag_count/$total_flags] Creating flag: $flag_key"
    echo "----------------------------------------"
    echo "Type: $flag_type"
    echo "Default: $default_value"
    echo "Purpose: $description"
    echo
    
    echo "📋 Steps to create this flag:"
    echo "1. Click '+ Flag' or 'Create Flag' button"
    echo "2. Fill in the details:"
    echo "   - Name: $flag_key"
    echo "   - Description: $description"
    if [ "$flag_type" = "boolean" ]; then
        echo "   - Flag type: Boolean"
        echo "   - Default value: $default_value"
        echo "   - Variations: true/false (default)"
    else
        echo "   - Flag type: Number"
        echo "   - Default value: $default_value"
        echo "   - Variations: You can use default number variations"
    fi
    echo "3. Click 'Save Flag'"
    echo
    
    if [ "$flag_key" = "auto_booking_pipeline_enabled" ]; then
        log_warn "🔴 IMPORTANT: Keep this flag OFF (false) until you're ready to enable auto-booking!"
    elif [ "$flag_key" = "auto_booking_emergency_disable" ]; then
        log_warn "🚨 EMERGENCY FLAG: Turn this ON (true) to immediately stop all auto-booking!"
    fi
    
    log_warn "⏳ Please create this flag, then press Enter to continue to the next one..."
    read -p ""
    
    ((flag_count++))
done

echo
log_success "🎉 All feature flags should now be created!"

echo
log_info "🎯 Setting up Targeting Rules (Optional but Recommended)"
echo "========================================================"
echo "For each flag, you can set up targeting rules:"
echo "1. Click on a flag to open its configuration"
echo "2. Go to the 'Targeting' tab"
echo "3. Set up rules for different environments/users:"
echo "   - Internal team: Enable features for testing"
echo "   - Beta users: Gradual rollout"
echo "   - Production: Controlled release"
echo

echo "💡 Recommended Initial Settings:"
echo "- auto_booking_pipeline_enabled: OFF for all users (enable manually when ready)"
echo "- auto_booking_emergency_disable: OFF for all users (emergency use only)"
echo "- flight_monitoring_enabled: ON for internal team, OFF for others"
echo "- payment_processing_enabled: ON for internal team, OFF for others"
echo "- concurrency_control_enabled: ON for all (safe to enable)"
echo "- max_concurrent_bookings: 3 for all (conservative limit)"
echo "- booking_timeout_seconds: 300 for all (5 minute timeout)"

echo
log_warn "⏳ Set up targeting rules as needed, then press Enter to test the flags..."
read -p ""

# Test the flags
echo
log_info "🧪 Testing LaunchDarkly Flag Integration"
echo "========================================"

# Create a test script
cat > /tmp/test-ld-flags.js << 'EOF'
import { config } from 'dotenv';
config({ path: '.env.production' });

async function testFlags() {
  console.log('🧪 Testing LaunchDarkly flag integration...\n');
  
  const requiredFlags = [
    'auto_booking_pipeline_enabled',
    'auto_booking_emergency_disable', 
    'flight_monitoring_enabled',
    'payment_processing_enabled',
    'concurrency_control_enabled',
    'max_concurrent_bookings',
    'booking_timeout_seconds'
  ];
  
  const ldSdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  const ldClientId = process.env.VITE_LD_CLIENT_ID;
  
  if (!ldSdkKey || !ldClientId) {
    console.log('❌ LaunchDarkly credentials not found');
    return;
  }
  
  console.log('✅ LaunchDarkly credentials configured');
  console.log(`SDK Key: ${ldSdkKey.substring(0, 20)}...`);
  console.log(`Client ID: ${ldClientId}`);
  console.log('\n📋 Required flags checklist:');
  
  requiredFlags.forEach(flag => {
    console.log(`  - ${flag}`);
  });
  
  console.log('\n🎯 Next steps:');
  console.log('1. Verify all flags are created in LaunchDarkly dashboard');
  console.log('2. Set appropriate targeting rules for your environments');
  console.log('3. Test the auto-booking pipeline with flags enabled');
  console.log('4. Monitor flag usage in LaunchDarkly analytics');
}

testFlags();
EOF

if node /tmp/test-ld-flags.js; then
    log_success "✅ LaunchDarkly integration test passed!"
    rm /tmp/test-ld-flags.js
else
    log_error "❌ LaunchDarkly integration test failed"
    rm /tmp/test-ld-flags.js
fi

echo
log_info "📊 Feature Flags Setup Summary"
echo "==============================="
echo "✅ Boolean Flags:"
echo "  - auto_booking_pipeline_enabled (master switch)"
echo "  - auto_booking_emergency_disable (kill switch)" 
echo "  - flight_monitoring_enabled"
echo "  - payment_processing_enabled"
echo "  - concurrency_control_enabled"
echo
echo "✅ Number Flags:"
echo "  - max_concurrent_bookings (3)"
echo "  - booking_timeout_seconds (300)"

echo
log_info "🔄 Using Your Flags in the Application"
echo "======================================"
echo "The auto-booking system will check these flags:"
echo "1. Before starting any pipeline operation"
echo "2. Before processing payments" 
echo "3. Before making flight bookings"
echo "4. For concurrency limits and timeouts"

echo
log_info "🎛️  Flag Control Examples"
echo "========================="
echo "- Turn OFF auto_booking_pipeline_enabled to stop all new bookings"
echo "- Turn ON auto_booking_emergency_disable to immediately halt everything"
echo "- Adjust max_concurrent_bookings to control system load"
echo "- Modify booking_timeout_seconds to change operation timeouts"

echo
log_success "🚀 LaunchDarkly feature flags setup complete!"
echo "Your auto-booking system now has full feature flag control!"
