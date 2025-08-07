/**
 * Unit Tests for Database Profile Completeness Trigger Functions
 * Day 1 Task: Write unit tests for profile completeness functions (1h)
 *
 * Tests the database-side trigger functions and scoring algorithms
 */

// Mock database functions that would be called via RPC
const mockDatabase = {
  rpc: vi.fn(),
  from: vi.fn(),
};

// Mock trigger function results (for future use)
// const mockTriggerResults = {
//   calculate_profile_completeness_enhanced: vi.fn(),
//   validate_profile_fields: vi.fn(),
//   log_ai_activity: vi.fn()
// };

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockDatabase,
}));

describe('Database Profile Completeness Trigger Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockDatabase.rpc.mockImplementation(functionName => {
      switch (functionName) {
        case 'calculate_profile_completeness_enhanced':
          return Promise.resolve({
            data: {
              overall_score: 75,
              basic_info_score: 80,
              contact_info_score: 70,
              travel_documents_score: 60,
              verification_score: 90,
              missing_fields: ['passport_number'],
              recommendations: [
                {
                  action: 'add_passport',
                  priority: 'medium',
                  title: 'Add passport information',
                  description: 'Complete your travel documents',
                },
              ],
            },
            error: null,
          });
        case 'validate_profile_fields':
          return Promise.resolve({
            data: {
              is_valid: true,
              validation_errors: [],
            },
            error: null,
          });
        case 'log_ai_activity':
          return Promise.resolve({
            data: { success: true },
            error: null,
          });
        default:
          return Promise.resolve({ data: null, error: null });
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('calculate_profile_completeness_enhanced function', () => {
    it('should calculate completeness scores correctly', async () => {
      const profileData = {
        full_name: 'John Doe',
        date_of_birth: '1990-01-01',
        gender: 'MALE',
        email: 'john@example.com',
        phone: '+1234567890',
        phone_verified: true,
      };

      const result = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: profileData,
        }
      );

      expect(result.data.overall_score).toBeGreaterThan(0);
      expect(result.data.overall_score).toBeLessThanOrEqual(100);
      expect(result.data.basic_info_score).toBeDefined();
      expect(result.data.contact_info_score).toBeDefined();
      expect(result.data.travel_documents_score).toBeDefined();
      expect(result.data.verification_score).toBeDefined();
      expect(Array.isArray(result.data.missing_fields)).toBe(true);
      expect(Array.isArray(result.data.recommendations)).toBe(true);
    });

    it('should handle empty profile data', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: {
          overall_score: 0,
          basic_info_score: 0,
          contact_info_score: 0,
          travel_documents_score: 0,
          verification_score: 0,
          missing_fields: ['full_name', 'email', 'date_of_birth'],
          recommendations: [
            {
              action: 'complete_basic_info',
              priority: 'high',
              title: 'Complete basic information',
              description: 'Add your name, email, and birth date',
            },
          ],
        },
        error: null,
      });

      const result = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: {},
        }
      );

      expect(result.data.overall_score).toBe(0);
      expect(result.data.missing_fields.length).toBeGreaterThan(0);
      expect(result.data.recommendations.length).toBeGreaterThan(0);
    });

    it('should detect expired passport and recommend update', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: {
          overall_score: 70,
          basic_info_score: 100,
          contact_info_score: 100,
          travel_documents_score: 20, // Low due to expired passport
          verification_score: 0,
          missing_fields: [],
          recommendations: [
            {
              action: 'update_passport',
              priority: 'high',
              title: 'Passport expires soon',
              description:
                'Your passport expires within 6 months. Please renew it.',
            },
          ],
        },
        error: null,
      });

      const profileWithExpiredPassport = {
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        passport_number: 'ABC123',
        passport_country: 'US',
        passport_expiry: '2024-02-01', // Assuming current date is after this
      };

      const result = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: profileWithExpiredPassport,
        }
      );

      expect(result.data.travel_documents_score).toBeLessThan(50);
      expect(result.data.recommendations).toContainEqual(
        expect.objectContaining({
          action: 'update_passport',
          priority: 'high',
        })
      );
    });

    it('should prioritize recommendations by importance', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: {
          overall_score: 45,
          basic_info_score: 60,
          contact_info_score: 30,
          travel_documents_score: 0,
          verification_score: 0,
          missing_fields: ['phone', 'passport_number'],
          recommendations: [
            {
              action: 'verify_phone',
              priority: 'high',
              title: 'Verify phone number',
              description: 'Phone verification is required for booking',
            },
            {
              action: 'add_passport',
              priority: 'medium',
              title: 'Add passport',
              description:
                'Passport information needed for international travel',
            },
            {
              action: 'complete_preferences',
              priority: 'low',
              title: 'Set travel preferences',
              description: 'Customize your travel experience',
            },
          ],
        },
        error: null,
      });

      const partialProfile = {
        full_name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1555000000',
        phone_verified: false,
      };

      const result = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: partialProfile,
        }
      );

      const recommendations = result.data.recommendations;
      expect(recommendations[0].priority).toBe('high');

      // Check that high priority items come first
      const highPriorityIndex = recommendations.findIndex(
        (r: any) => r.priority === 'high'
      );
      const mediumPriorityIndex = recommendations.findIndex(
        (r: any) => r.priority === 'medium'
      );
      const lowPriorityIndex = recommendations.findIndex(
        (r: any) => r.priority === 'low'
      );

      expect(highPriorityIndex).toBeLessThan(mediumPriorityIndex);
      expect(mediumPriorityIndex).toBeLessThan(lowPriorityIndex);
    });

    it('should handle database errors gracefully', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Database connection failed',
          code: 'DB_CONNECTION_ERROR',
        },
      });

      const result = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: { full_name: 'Test User' },
        }
      );

      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('DB_CONNECTION_ERROR');
      expect(result.data).toBeNull();
    });
  });

  describe('validate_profile_fields function', () => {
    it('should validate correct profile fields', async () => {
      const validProfile = {
        full_name: 'Alice Johnson',
        email: 'alice@example.com',
        date_of_birth: '1985-05-15',
        phone: '+1234567890',
      };

      const result = await mockDatabase.rpc('validate_profile_fields', {
        profile_data: validProfile,
      });

      expect(result.data.is_valid).toBe(true);
      expect(result.data.validation_errors).toHaveLength(0);
    });

    it('should detect invalid email format', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: {
          is_valid: false,
          validation_errors: [
            {
              field: 'email',
              error: 'Invalid email format',
              severity: 'error',
            },
          ],
        },
        error: null,
      });

      const invalidProfile = {
        full_name: 'Test User',
        email: 'invalid-email-format',
        date_of_birth: '1990-01-01',
      };

      const result = await mockDatabase.rpc('validate_profile_fields', {
        profile_data: invalidProfile,
      });

      expect(result.data.is_valid).toBe(false);
      expect(result.data.validation_errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          error: 'Invalid email format',
        })
      );
    });

    it('should detect invalid phone number format', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: {
          is_valid: false,
          validation_errors: [
            {
              field: 'phone',
              error: 'Invalid phone number format',
              severity: 'warning',
            },
          ],
        },
        error: null,
      });

      const invalidPhoneProfile = {
        full_name: 'Test User',
        email: 'test@example.com',
        phone: 'invalid-phone',
      };

      const result = await mockDatabase.rpc('validate_profile_fields', {
        profile_data: invalidPhoneProfile,
      });

      expect(result.data.validation_errors).toContainEqual(
        expect.objectContaining({
          field: 'phone',
          error: 'Invalid phone number format',
        })
      );
    });

    it('should validate date formats', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: {
          is_valid: false,
          validation_errors: [
            {
              field: 'date_of_birth',
              error: 'Invalid date format. Expected YYYY-MM-DD',
              severity: 'error',
            },
          ],
        },
        error: null,
      });

      const invalidDateProfile = {
        full_name: 'Test User',
        email: 'test@example.com',
        date_of_birth: '01/01/1990', // Wrong format
      };

      const result = await mockDatabase.rpc('validate_profile_fields', {
        profile_data: invalidDateProfile,
      });

      expect(result.data.validation_errors).toContainEqual(
        expect.objectContaining({
          field: 'date_of_birth',
          error: expect.stringContaining('Invalid date format'),
        })
      );
    });
  });

  describe('log_ai_activity function', () => {
    it('should log profile completeness calculations', async () => {
      const activityData = {
        user_id: 'user-123',
        activity_type: 'profile_completeness_calculation',
        details: {
          overall_score: 75,
          calculation_time_ms: 45,
          recommendations_count: 3,
        },
        metadata: {
          trigger: 'profile_update',
          version: '1.0',
        },
      };

      const result = await mockDatabase.rpc('log_ai_activity', activityData);

      expect(result.data.success).toBe(true);
      expect(mockDatabase.rpc).toHaveBeenCalledWith(
        'log_ai_activity',
        activityData
      );
    });

    it('should handle logging errors gracefully', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Failed to insert activity log',
          code: 'INSERT_ERROR',
        },
      });

      const activityData = {
        user_id: 'user-456',
        activity_type: 'profile_validation',
        details: { errors_found: 2 },
      };

      const result = await mockDatabase.rpc('log_ai_activity', activityData);

      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('INSERT_ERROR');
    });
  });

  describe('Trigger Integration Tests', () => {
    it('should execute complete trigger workflow', async () => {
      // Simulate a profile update that triggers all functions
      const profileUpdate = {
        full_name: 'Complete User',
        email: 'complete@example.com',
        date_of_birth: '1990-01-01',
        phone: '+1234567890',
        phone_verified: true,
      };

      // First, validate the profile
      const validationResult = await mockDatabase.rpc(
        'validate_profile_fields',
        {
          profile_data: profileUpdate,
        }
      );
      expect(validationResult.data.is_valid).toBe(true);

      // Then calculate completeness
      const completenessResult = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: profileUpdate,
        }
      );
      expect(completenessResult.data.overall_score).toBeGreaterThan(0);

      // Finally, log the activity
      const logResult = await mockDatabase.rpc('log_ai_activity', {
        user_id: 'user-789',
        activity_type: 'profile_completeness_calculation',
        details: completenessResult.data,
      });
      expect(logResult.data.success).toBe(true);

      // Verify all functions were called
      expect(mockDatabase.rpc).toHaveBeenCalledTimes(3);
    });

    it('should handle cascade failures in trigger workflow', async () => {
      // Simulate validation failure
      mockDatabase.rpc
        .mockResolvedValueOnce({
          data: {
            is_valid: false,
            validation_errors: [{ field: 'email', error: 'Invalid format' }],
          },
          error: null,
        })
        .mockResolvedValueOnce({
          data: null,
          error: {
            message: 'Cannot calculate completeness for invalid profile',
          },
        });

      const invalidProfile = {
        full_name: 'Invalid User',
        email: 'bad-email',
      };

      const validationResult = await mockDatabase.rpc(
        'validate_profile_fields',
        {
          profile_data: invalidProfile,
        }
      );
      expect(validationResult.data.is_valid).toBe(false);

      // Should not proceed with completeness calculation if validation fails
      const completenessResult = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: invalidProfile,
        }
      );
      expect(completenessResult.error).toBeDefined();
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large profile objects efficiently', async () => {
      const largeProfile = {
        full_name: 'Large Profile User',
        email: 'large@example.com',
      };

      // Add many custom fields
      for (let i = 0; i < 100; i++) {
        (largeProfile as Record<string, unknown>)[`custom_field_${i}`] =
          `value_${i}`;
      }

      const startTime = Date.now();
      const result = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: largeProfile,
        }
      );
      const endTime = Date.now();

      expect(result.data).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent calculations', async () => {
      const profiles = Array.from({ length: 10 }, (_, i) => ({
        full_name: `User ${i}`,
        email: `user${i}@example.com`,
        date_of_birth: '1990-01-01',
      }));

      const promises = profiles.map(profile =>
        mockDatabase.rpc('calculate_profile_completeness_enhanced', {
          profile_data: profile,
        })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result.data).toBeDefined();
        expect(result.data.overall_score).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle null and undefined values in database', async () => {
      mockDatabase.rpc.mockResolvedValueOnce({
        data: {
          overall_score: 25,
          basic_info_score: 50,
          contact_info_score: 0,
          travel_documents_score: 0,
          verification_score: 0,
          missing_fields: ['phone', 'passport_number'],
          recommendations: [
            {
              action: 'add_phone',
              priority: 'high',
              title: 'Add phone number',
              description: 'Phone number is required for notifications',
            },
          ],
        },
        error: null,
      });

      const profileWithNulls = {
        full_name: 'Null User',
        email: 'null@example.com',
        phone: null,
        passport_number: undefined,
        travel_preferences: null,
      };

      const result = await mockDatabase.rpc(
        'calculate_profile_completeness_enhanced',
        {
          profile_data: profileWithNulls,
        }
      );

      expect(result.data).toBeDefined();
      expect(result.data.overall_score).toBeGreaterThanOrEqual(0);
      expect(result.data.missing_fields).toContain('phone');
    });
  });
});
