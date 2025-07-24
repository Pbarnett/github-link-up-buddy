/**
 * Travel Validation Utilities
 *
 * Provides validation logic for international travel requirements,
 * passport validation, and traveler data completeness.
 */

export interface TravelerData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  passportNumber?: string;
  passportExpiry?: string;
  nationality?: string;
  issuanceCountry?: string;
}

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  errors: string[];
  warnings: string[];
}

export interface TravelValidationContext {
  originLocationCode: string;
  destinationLocationCode: string;
  isRoundTrip?: boolean;
  departureDate: string;
  returnDate?: string;
}

/**
 * Country codes that require stricter documentation
 */
const ENHANCED_SECURITY_COUNTRIES = [
  'US',
  'CA',
  'GB',
  'AU',
  'NZ',
  'JP',
  'KR',
  'IL',
  'AE',
  'SA',
];

/**
 * Get country code from IATA airport code (first 2 characters)
 */
export function getCountryFromLocationCode(locationCode: string): string {
  return locationCode?.slice(0, 2).toUpperCase() || '';
}

/**
 * Determine if travel is international based on origin and destination
 */
export function isInternationalTravel(
  originLocationCode: string,
  destinationLocationCode: string
): boolean {
  const originCountry = getCountryFromLocationCode(originLocationCode);
  const destCountry = getCountryFromLocationCode(destinationLocationCode);

  return (
    originCountry !== '' && destCountry !== '' && originCountry !== destCountry
  );
}

/**
 * Check if destination requires enhanced security documentation
 */
export function requiresEnhancedSecurity(
  destinationLocationCode: string
): boolean {
  const destCountry = getCountryFromLocationCode(destinationLocationCode);
  return ENHANCED_SECURITY_COUNTRIES.includes(destCountry);
}

/**
 * Validate passport expiry date
 */
export function validatePassportExpiry(
  passportExpiry: string,
  departureDate: string,
  destinationLocationCode: string
): { isValid: boolean; error?: string; warning?: string } {
  try {
    const expiryDate = new Date(passportExpiry);
    const travelDate = new Date(departureDate);
    const today = new Date();

    // Check if passport is already expired
    if (expiryDate <= today) {
      return {
        isValid: false,
        error:
          'Passport has expired. Please renew your passport before traveling.',
      };
    }

    // Check if passport expires before travel date
    if (expiryDate <= travelDate) {
      return {
        isValid: false,
        error:
          'Passport expires before your travel date. Please renew your passport.',
      };
    }

    // Check 6-month rule for many destinations
    const sixMonthsFromTravel = new Date(travelDate);
    sixMonthsFromTravel.setMonth(sixMonthsFromTravel.getMonth() + 6);

    if (expiryDate < sixMonthsFromTravel) {
      const destCountry = getCountryFromLocationCode(destinationLocationCode);

      // Countries that strictly enforce 6-month rule
      const strictSixMonthCountries = [
        'US',
        'TH',
        'MY',
        'SG',
        'PH',
        'ID',
        'VN',
      ];

      if (strictSixMonthCountries.includes(destCountry)) {
        return {
          isValid: false,
          error:
            'Your destination requires your passport to be valid for at least 6 months from your travel date.',
        };
      } else {
        return {
          isValid: true,
          warning:
            'Your passport expires within 6 months of travel. Some destinations may require longer validity.',
        };
      }
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error:
        'Invalid passport expiry date format. Please use YYYY-MM-DD format.',
    };
  }
}

/**
 * Validate traveler data completeness for booking
 */
export function validateTravelerData(
  traveler: TravelerData,
  context: TravelValidationContext
): ValidationResult {
  const missingFields: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic required fields for all travel
  if (!traveler.firstName?.trim()) {
    missingFields.push('firstName');
  }

  if (!traveler.lastName?.trim()) {
    missingFields.push('lastName');
  }

  if (!traveler.email?.trim()) {
    missingFields.push('email');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.email)) {
    errors.push('Please enter a valid email address.');
  }

  // Date of birth validation
  if (!traveler.dateOfBirth?.trim()) {
    missingFields.push('dateOfBirth');
  } else {
    try {
      const birthDate = new Date(traveler.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 0 || age > 120) {
        errors.push('Please enter a valid date of birth.');
      }

      if (age < 18) {
        warnings.push(
          'Travelers under 18 may require additional documentation.'
        );
      }
    } catch {
      errors.push('Please enter a valid date of birth in YYYY-MM-DD format.');
    }
  }

  // International travel requirements
  const isInternational = isInternationalTravel(
    context.originLocationCode,
    context.destinationLocationCode
  );

  if (isInternational) {
    // Passport required for international travel
    if (!traveler.passportNumber?.trim()) {
      missingFields.push('passportNumber');
    }

    if (!traveler.passportExpiry?.trim()) {
      missingFields.push('passportExpiry');
    } else if (traveler.passportExpiry) {
      const passportValidation = validatePassportExpiry(
        traveler.passportExpiry,
        context.departureDate,
        context.destinationLocationCode
      );

      if (!passportValidation.isValid && passportValidation.error) {
        errors.push(passportValidation.error);
      }

      if (passportValidation.warning) {
        warnings.push(passportValidation.warning);
      }
    }

    if (!traveler.nationality?.trim()) {
      missingFields.push('nationality');
    }

    // Enhanced security destinations
    if (requiresEnhancedSecurity(context.destinationLocationCode)) {
      if (!traveler.issuanceCountry?.trim()) {
        missingFields.push('issuanceCountry');
      }

      warnings.push(
        'This destination may require additional security screening. Please arrive at the airport early.'
      );
    }
  }

  // Phone number validation (recommended for all travel)
  if (!traveler.phone?.trim()) {
    warnings.push('A phone number is recommended for travel notifications.');
  } else if (!/^\+?[\d\s\-()]+$/.test(traveler.phone)) {
    warnings.push('Please verify your phone number format is correct.');
  }

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors,
    warnings,
  };
}

/**
 * Get user-friendly field names for missing fields
 */
export function getFieldDisplayName(fieldName: string): string {
  const displayNames: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    email: 'Email Address',
    phone: 'Phone Number',
    passportNumber: 'Passport Number',
    passportExpiry: 'Passport Expiry Date',
    nationality: 'Nationality',
    issuanceCountry: 'Passport Issuing Country',
    gender: 'Gender',
  };

  return displayNames[fieldName] || fieldName;
}

/**
 * Format validation results into user-friendly messages
 */
export function formatValidationMessage(result: ValidationResult): {
  primaryMessage: string;
  details: string[];
  actionRequired: boolean;
} {
  if (result.isValid) {
    return {
      primaryMessage: 'All traveler information is complete.',
      details: result.warnings,
      actionRequired: false,
    };
  }

  const details: string[] = [];

  if (result.missingFields.length > 0) {
    const fieldNames = result.missingFields.map(getFieldDisplayName);
    details.push(`Missing required information: ${fieldNames.join(', ')}`);
  }

  if (result.errors.length > 0) {
    details.push(...result.errors);
  }

  if (result.warnings.length > 0) {
    details.push(...result.warnings);
  }

  const primaryMessage =
    result.missingFields.length > 0
      ? 'Please complete all required traveler information.'
      : 'Please correct the traveler information issues.';

  return {
    primaryMessage,
    details,
    actionRequired: true,
  };
}

/**
 * Quick check for minimum booking requirements
 */
export function hasMinimumBookingRequirements(
  traveler: TravelerData,
  context: TravelValidationContext
): boolean {
  const result = validateTravelerData(traveler, context);
  return result.isValid;
}

/**
 * Get travel requirements summary for user
 */
export function getTravelRequirementsSummary(
  context: TravelValidationContext
): {
  isInternational: boolean;
  requiresPassport: boolean;
  requiresEnhancedSecurity: boolean;
  recommendations: string[];
} {
  const isInternational = isInternationalTravel(
    context.originLocationCode,
    context.destinationLocationCode
  );

  const requiresPassport = isInternational;
  const enhancedSecurity = requiresEnhancedSecurity(
    context.destinationLocationCode
  );

  const recommendations: string[] = [];

  if (requiresPassport) {
    recommendations.push('Valid passport required for international travel');
    recommendations.push(
      'Ensure passport is valid for at least 6 months from travel date'
    );
  }

  if (enhancedSecurity) {
    recommendations.push(
      'Enhanced security screening may apply - arrive early at airport'
    );
  }

  if (isInternational) {
    recommendations.push('Check visa requirements for your destination');
    recommendations.push('Verify any COVID-19 or health requirements');
  }

  return {
    isInternational,
    requiresPassport,
    requiresEnhancedSecurity: enhancedSecurity,
    recommendations,
  };
}
