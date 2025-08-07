/**
 * World-Class OAuth Configuration Validator
 *
 * Provides comprehensive validation, diagnostics, and troubleshooting
 * for OAuth configuration issues in production environments.
 */

interface OAuthValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  environment: 'development' | 'staging' | 'production';
  detectedUrls: {
    current: string;
    supabase: string;
    expectedRedirect: string;
  };
}

interface SupabaseAuthConfig {
  siteUrl: string;
  redirectUrls: string[];
  providers: {
    google: {
      enabled: boolean;
      clientId: string;
    };
  };
}

/**
 * Comprehensive OAuth configuration validator
 */
export class OAuthValidator {
  private static instance: OAuthValidator;

  public static getInstance(): OAuthValidator {
    if (!OAuthValidator.instance) {
      OAuthValidator.instance = new OAuthValidator();
    }
    return OAuthValidator.instance;
  }

  /**
   * Validate complete OAuth configuration
   */
  public async validateConfiguration(): Promise<OAuthValidationResult> {
    const result: OAuthValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: [],
      environment: this.detectEnvironment(),
      detectedUrls: this.getDetectedUrls(),
    };

    // Validate environment consistency
    this.validateEnvironment(result);

    // Validate URL configurations
    this.validateUrls(result);

    // Validate Supabase configuration
    await this.validateSupabaseConfig(result);

    // Validate Google OAuth configuration
    this.validateGoogleOAuthConfig(result);

    // Generate recommendations
    this.generateRecommendations(result);

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Detect the current environment
   */
  private detectEnvironment(): 'development' | 'staging' | 'production' {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    } else if (hostname.includes('staging') || hostname.includes('preview')) {
      return 'staging';
    } else {
      return 'production';
    }
  }

  /**
   * Get detected URLs for validation
   */
  private getDetectedUrls() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const current = `${protocol}//${host}`;

    return {
      current,
      supabase: import.meta.env.VITE_SUPABASE_URL || '',
      expectedRedirect: `${current}/auth/callback`,
    };
  }

  /**
   * Validate environment consistency
   */
  private validateEnvironment(result: OAuthValidationResult): void {
    const { environment, detectedUrls } = result;

    // Check for development environment issues
    if (environment === 'development') {
      if (
        !detectedUrls.current.includes('localhost') &&
        !detectedUrls.current.includes('127.0.0.1')
      ) {
        result.errors.push(
          'Development environment detected but not using localhost URLs'
        );
      }

      if (detectedUrls.supabase.includes('127.0.0.1')) {
        result.warnings.push(
          "Using local Supabase instance - ensure it's running"
        );
      }
    }

    // Check for production environment issues
    if (environment === 'production') {
      if (detectedUrls.current.includes('localhost')) {
        result.errors.push(
          'Production environment detected but using localhost URLs'
        );
      }

      if (!detectedUrls.current.startsWith('https://')) {
        result.errors.push('Production environment must use HTTPS');
      }
    }
  }

  /**
   * Validate URL configurations
   */
  private validateUrls(result: OAuthValidationResult): void {
    const { detectedUrls } = result;

    // Validate current URL
    try {
      new URL(detectedUrls.current);
    } catch {
      result.errors.push('Invalid current URL detected');
    }

    // Validate Supabase URL
    try {
      new URL(detectedUrls.supabase);
      if (
        !detectedUrls.supabase.includes('supabase.co') &&
        !detectedUrls.supabase.includes('127.0.0.1')
      ) {
        result.warnings.push("Supabase URL doesn't match expected format");
      }
    } catch {
      result.errors.push('Invalid Supabase URL configuration');
    }

    // Validate redirect URL format
    try {
      new URL(detectedUrls.expectedRedirect);
    } catch {
      result.errors.push('Invalid redirect URL format');
    }
  }

  /**
   * Validate Supabase configuration
   */
  private async validateSupabaseConfig(
    result: OAuthValidationResult
  ): Promise<void> {
    try {
      const response = await fetch(
        `${result.detectedUrls.supabase}/auth/v1/settings`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          },
        }
      );

      if (!response.ok) {
        result.errors.push(
          'Cannot access Supabase auth settings - check API key'
        );
        return;
      }

      const authConfig = await response.json();

      // Validate Google OAuth is enabled
      if (!authConfig.external?.google) {
        result.errors.push('Google OAuth is not enabled in Supabase');
      }
    } catch (error) {
      result.errors.push(
        'Failed to validate Supabase configuration: ' + (error as Error).message
      );
    }
  }

  /**
   * Validate Google OAuth configuration
   */
  private validateGoogleOAuthConfig(result: OAuthValidationResult): void {
    // This would typically validate Google Cloud Console configuration
    // For now, we'll add recommendations
    result.recommendations.push(
      'Verify Google Cloud Console OAuth 2.0 Client has correct redirect URIs'
    );
    result.recommendations.push(
      'Ensure Supabase callback URL is added to Google OAuth configuration'
    );
  }

  /**
   * Generate environment-specific recommendations
   */
  private generateRecommendations(result: OAuthValidationResult): void {
    const { environment, detectedUrls } = result;

    if (environment === 'development') {
      result.recommendations.push(
        'For development: Use http://localhost:3000 or http://127.0.0.1:3000'
      );
      result.recommendations.push(
        'Ensure Supabase site_url is set to your development URL'
      );
      result.recommendations.push(
        'Add localhost callback URLs to Supabase redirect URLs'
      );
    } else if (environment === 'production') {
      result.recommendations.push('For production: Ensure all URLs use HTTPS');
      result.recommendations.push(
        'Use production domain in Supabase site_url configuration'
      );
      result.recommendations.push(
        'Remove development URLs from production OAuth configuration'
      );
    }

    // Always recommend
    result.recommendations.push(
      'Keep OAuth client secrets secure and use environment variables'
    );
    result.recommendations.push('Regularly rotate OAuth client secrets');
    result.recommendations.push('Monitor OAuth callback success rates');
  }

  /**
   * Format validation results for console output
   */
  public formatResults(result: OAuthValidationResult): string {
    const sections = [];

    sections.push(`🔍 OAuth Configuration Validation (${result.environment})`);
    sections.push(`📍 Current: ${result.detectedUrls.current}`);
    sections.push(`🗄️ Supabase: ${result.detectedUrls.supabase}`);
    sections.push(`🔗 Redirect: ${result.detectedUrls.expectedRedirect}`);
    sections.push('');

    if (result.errors.length > 0) {
      sections.push('❌ ERRORS:');
      result.errors.forEach(error => sections.push(`  • ${error}`));
      sections.push('');
    }

    if (result.warnings.length > 0) {
      sections.push('⚠️ WARNINGS:');
      result.warnings.forEach(warning => sections.push(`  • ${warning}`));
      sections.push('');
    }

    if (result.recommendations.length > 0) {
      sections.push('💡 RECOMMENDATIONS:');
      result.recommendations.forEach(rec => sections.push(`  • ${rec}`));
      sections.push('');
    }

    sections.push(
      result.isValid
        ? '✅ Configuration is valid'
        : '❌ Configuration has issues'
    );

    return sections.join('\n');
  }
}

/**
 * Quick validation function for use in auth service
 */
export async function validateOAuthConfig(): Promise<void> {
  const validator = OAuthValidator.getInstance();
  const result = await validator.validateConfiguration();

  console.log(validator.formatResults(result));

  if (!result.isValid) {
    console.warn(
      'OAuth configuration issues detected. Review the errors above.'
    );
  }
}

/**
 * Development helper to force validation
 */
export function runOAuthDiagnostics(): Promise<OAuthValidationResult> {
  const validator = OAuthValidator.getInstance();
  return validator.validateConfiguration();
}
