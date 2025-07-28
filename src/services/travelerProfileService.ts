import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TravelerProfile {
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelerProfileResponse {
  success: boolean;
  data?: TravelerProfile | TravelerProfile[];
  error?: string;
  message?: string;
}

class TravelerProfileService {
  private baseUrl: string;

  constructor() {
    // Use Supabase Edge Function URL
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/secure-traveler-profiles`;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authenticated session found');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  private async handleResponse(
    response: Response
  ): Promise<TravelerProfileResponse> {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: 'Network error' }));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * Create a new traveler profile
   */
  async createProfile(
    profileData: Omit<TravelerProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TravelerProfile> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'create',
          data: profileData,
        }),
      });

      const result = await this.handleResponse(response);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create traveler profile');
      }

      return result.data as TravelerProfile;
    } catch (error) {
      console.error('Error creating traveler profile:', error);
      throw error;
    }
  }

  /**
   * Get all traveler profiles for the authenticated user
   */
  async getProfiles(): Promise<TravelerProfile[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${this.baseUrl}?action=get`, {
        method: 'GET',
        headers,
      });

      const result = await this.handleResponse(response);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch traveler profiles');
      }

      return (result.data as TravelerProfile[]) || [];
    } catch (error) {
      console.error('Error fetching traveler profiles:', error);
      throw error;
    }
  }

  /**
   * Get a specific traveler profile by ID
   */
  async getProfile(profileId: string): Promise<TravelerProfile> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(
        `${this.baseUrl}?action=get&profileId=${profileId}`,
        {
          method: 'GET',
          headers,
        }
      );

      const result = await this.handleResponse(response);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch traveler profile');
      }

      return result.data as TravelerProfile;
    } catch (error) {
      console.error('Error fetching traveler profile:', error);
      throw error;
    }
  }

  /**
   * Update an existing traveler profile
   */
  async updateProfile(
    profileId: string,
    updates: Partial<TravelerProfile>
  ): Promise<TravelerProfile> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          action: 'update',
          profileId,
          data: updates,
        }),
      });

      const result = await this.handleResponse(response);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update traveler profile');
      }

      return result.data as TravelerProfile;
    } catch (error) {
      console.error('Error updating traveler profile:', error);
      throw error;
    }
  }

  /**
   * Delete a traveler profile
   */
  async deleteProfile(profileId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(this.baseUrl, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          action: 'delete',
          profileId,
        }),
      });

      const result = await this.handleResponse(response);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete traveler profile');
      }
    } catch (error) {
      console.error('Error deleting traveler profile:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return !!session?.access_token;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const travelerProfileService = new TravelerProfileService();
export default travelerProfileService;
