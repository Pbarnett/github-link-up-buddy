
import logger from '@/lib/logger';

export interface TravelerProfileKMS {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  phone?: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
  knownTravelerNumber?: string;
  isPrimary: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  encryptionVersion?: number;
}

export interface TravelerProfileCreateData {
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  phone?: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
  knownTravelerNumber?: string;
  isPrimary?: boolean;
}

class TravelerProfileServiceKMS {
  /**
   * Get all traveler profiles for the current user with KMS decryption
   */
  async getTravelerProfiles(): Promise<TravelerProfileKMS[]> {
    try {
      logger.info(
        '[TravelerProfilesKMS] Fetching traveler profiles via edge function'
      );

      // Use the manage-traveler-profiles edge function with KMS support
      const { data, error } = await supabase.functions.invoke(
        'manage-traveler-profiles',
        {
          body: { action: 'get' },
        }
      );

      if (error) {
        logger.error('[TravelerProfilesKMS] Error from edge function:', error);
        throw new Error(`Failed to fetch traveler profiles: ${error.message}`);
      }

      logger.info(
        '[TravelerProfilesKMS] Traveler profiles fetched successfully'
      );
      return data || [];
    } catch (error) {
      logger.error('[TravelerProfilesKMS] getTravelerProfiles error:', error);
      throw error;
    }
  }

  /**
   * Create a new traveler profile with KMS encryption
   */
  async createProfile(
    profileData: TravelerProfileCreateData
  ): Promise<TravelerProfileKMS> {
    try {
      logger.info('[TravelerProfilesKMS] Creating new traveler profile');

      // Call edge function to handle encryption and storage
      const { data, error } = await supabase.functions.invoke(
        'manage-traveler-profiles',
        {
          body: {
            action: 'create',
            travelerData: profileData,
          },
        }
      );

      if (error) {
        logger.error('[TravelerProfilesKMS] Error from edge function:', error);
        throw new Error(`Failed to create traveler profile: ${error.message}`);
      }

      logger.info(
        '[TravelerProfilesKMS] Traveler profile created successfully'
      );
      return data as TravelerProfileKMS;
    } catch (error) {
      logger.error('[TravelerProfilesKMS] createProfile error:', error);
      throw error;
    }
  }

  /**
   * Update an existing traveler profile
   */
  async updateProfile(
    id: string,
    updates: Partial<TravelerProfileCreateData>
  ): Promise<TravelerProfileKMS> {
    try {
      logger.info('[TravelerProfilesKMS] Updating traveler profile:', id);

      // Call edge function to handle encryption and updates
      const { data, error } = await supabase.functions.invoke(
        'manage-traveler-profiles',
        {
          body: {
            action: 'update',
            travelerData: { id, ...updates },
          },
        }
      );

      if (error) {
        logger.error('[TravelerProfilesKMS] Error from edge function:', error);
        throw new Error(`Failed to update traveler profile: ${error.message}`);
      }

      return data as TravelerProfileKMS;
    } catch (error) {
      logger.error('[TravelerProfilesKMS] updateProfile error:', error);
      throw error;
    }
  }

  /**
   * Delete a traveler profile
   */
  async deleteProfile(id: string): Promise<void> {
    try {
      logger.info('[TravelerProfilesKMS] Deleting traveler profile:', id);

      const { error } = await supabase.functions.invoke(
        'manage-traveler-profiles',
        {
          body: {
            action: 'delete',
            travelerData: { id },
          },
        }
      );

      if (error) {
        logger.error('[TravelerProfilesKMS] Error from edge function:', error);
        throw new Error(`Failed to delete traveler profile: ${error.message}`);
      }

      logger.info(
        '[TravelerProfilesKMS] Traveler profile deleted successfully'
      );
    } catch (error) {
      logger.error('[TravelerProfilesKMS] deleteProfile error:', error);
      throw error;
    }
  }

  /**
   * Set a traveler profile as primary
   */
  async setPrimaryProfile(id: string): Promise<TravelerProfileKMS> {
    try {
      logger.info(
        '[TravelerProfilesKMS] Setting primary traveler profile:',
        id
      );

      // For simple updates like is_primary, we can update directly via database
      // First, unset all other primary profiles for this user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await supabase
        .from('traveler_profiles')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Then set the specified profile as primary
      const { data, error } = await supabase
        .from('traveler_profiles')
        .update({ is_primary: true })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        logger.error(
          '[TravelerProfilesKMS] Error setting primary profile:',
          error
        );
        throw new Error(
          `Failed to set primary traveler profile: ${error.message}`
        );
      }

      return data as TravelerProfileKMS;
    } catch (error) {
      logger.error('[TravelerProfilesKMS] setPrimaryProfile error:', error);
      throw error;
    }
  }

  /**
   * Verify a traveler profile (admin function)
   */
  async verifyProfile(id: string): Promise<TravelerProfileKMS> {
    try {
      logger.info('[TravelerProfilesKMS] Verifying traveler profile:', id);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('traveler_profiles')
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        logger.error('[TravelerProfilesKMS] Error verifying profile:', error);
        throw new Error(`Failed to verify traveler profile: ${error.message}`);
      }

      return data as TravelerProfileKMS;
    } catch (error) {
      logger.error('[TravelerProfilesKMS] verifyProfile error:', error);
      throw error;
    }
  }

  /**
   * Get a specific traveler profile by ID
   */
  async getProfile(id: string): Promise<TravelerProfileKMS | null> {
    try {
      const profiles = await this.getTravelerProfiles();
      return profiles.find(profile => profile.id === id) || null;
    } catch (error) {
      logger.error('[TravelerProfilesKMS] getProfile error:', error);
      throw error;
    }
  }

  /**
   * Get the primary traveler profile
   */
  async getPrimaryProfile(): Promise<TravelerProfileKMS | null> {
    try {
      const profiles = await this.getTravelerProfiles();
      return profiles.find(profile => profile.isPrimary) || null;
    } catch (error) {
      logger.error('[TravelerProfilesKMS] getPrimaryProfile error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const travelerProfileServiceKMS = new TravelerProfileServiceKMS();
