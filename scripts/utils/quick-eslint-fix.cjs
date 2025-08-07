#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Common unused React imports to fix
const filesToFix = [
  'src/flightSearchV2/useFlightOffers.ts',
  'src/hooks/use-mobile.tsx',
  'src/hooks/useAnalytics.ts', 
  'src/hooks/useBehavioralTriggers.ts',
  'src/hooks/useCampaigns.ts',
  'src/hooks/useConditionalLogic.ts',
  'src/hooks/useCurrentUser.ts',
  'src/hooks/useDeferredSearch.ts',
  'src/hooks/useDuffelPayment.ts',
  'src/hooks/useFeatureFlag.ts',
  'src/hooks/useFilterState.ts',
  'src/hooks/useFormConfiguration.ts',
  'src/hooks/useFormState.ts',
  'src/hooks/useFormValidation.ts',
  'src/hooks/useNetworkStatus.ts',
  'src/hooks/usePaymentMethods.ts',
  'src/hooks/usePoolsSafe.ts',
  'src/hooks/useProfileKMS.ts',
  'src/hooks/useTravelerInfoCheck.ts',
  'src/hooks/useTripOffersLegacy.ts',
  'src/lib/feature-flags/useFeatureFlag.ts',
  'src/scripts/analytics/personalization-tracking.js'
];

console.log('🔧 Quick ESLint fixes for unused React imports...');

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove unused React import if it's the first import and not used
      if (content.includes("import * as React from 'react';") && !content.includes('React.')) {
        content = content.replace("import * as React from 'react';\n", '');
        console.log(`✅ Fixed React import in ${filePath}`);
      }
      
      if (content.includes("import { React } from 'react';") && !content.includes('React.')) {
        content = content.replace("import { React } from 'react';\n", '');
        console.log(`✅ Fixed React import in ${filePath}`);
      }
      
      if (content.includes("import React from 'react';") && !content.includes('React.') && !content.includes('<React.')) {
        content = content.replace("import React from 'react';\n", '');
        console.log(`✅ Fixed React import in ${filePath}`);
      }
      
      fs.writeFileSync(filePath, content);
    } catch (error) {
      console.log(`❌ Error fixing ${filePath}:`, error.message);
    }
  }
});

// Fix some specific files with known issues
const specificFixes = {
  'src/App.tsx': (content) => {
    // Remove unused TestBooking import
    return content.replace(/import.*TestBooking.*from.*;\n?/g, '');
  },
  'src/main.tsx': (content) => {
    // Remove unused SmartErrorBoundary import
    return content.replace(/,?\s*SmartErrorBoundary/g, '');
  }
};

Object.entries(specificFixes).forEach(([filePath, fixFn]) => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const newContent = fixFn(content);
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Applied specific fix to ${filePath}`);
    } catch (error) {
      console.log(`❌ Error applying fix to ${filePath}:`, error.message);
    }
  }
});

console.log('✅ Quick ESLint fixes completed!');
