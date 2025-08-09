/**
 * AWS Step Functions Integration Service
 * 
 * This service provides a clean interface between the existing React frontend
 * and the new AWS Step Functions backend. It's completely isolated so it won't
 * affect any existing functionality.
 */

import { Campaign, CampaignFormData } from "@/types/campaign";
import { featureFlags } from "./featureFlags";

interface StepFunctionsCampaignRequest {
  userId: string;
  criteria: {
    destination: string;
    departureAirports: string[];
    departureDates: { start: string; end: string };
    maxPrice: number;
    minDuration: number;
    maxDuration: number;
    directFlightsOnly: boolean;
    cabinClass: string;
    travelerProfileId?: string;
    paymentMethodId: string;
  };
}

interface StepFunctionsResponse {
  success: boolean;
  campaignId?: string;
  executionArn?: string;
  error?: string;
}

class StepFunctionsService {
  private apiEndpoint: string;

  constructor() {
    // AWS API Gateway endpoint for Step Functions
    this.apiEndpoint = process.env.VITE_AWS_STEP_FUNCTIONS_API || '';
    
    if (!this.apiEndpoint && featureFlags.useAwsStepFunctions()) {
      console.warn('AWS Step Functions API endpoint not configured');
    }
  }

  /**
   * Create a new auto-booking campaign using Step Functions
   */
  async createCampaign(formData: CampaignFormData, userId: string): Promise<Campaign> {
    if (!featureFlags.useAwsStepFunctions()) {
      throw new Error('Step Functions not enabled - use legacy service');
    }

    if (featureFlags.isDebugMode()) {
      console.log('🔧 [StepFunctions] Creating campaign:', { formData, userId });
    }

    try {
      const request: StepFunctionsCampaignRequest = {
        userId,
        criteria: {
          destination: formData.destination,
          departureAirports: formData.departureAirports || [],
          departureDates: {
            start: formData.departureDates.start.toISOString(),
            end: formData.departureDates.end.toISOString()
          },
          maxPrice: formData.maxPrice,
          minDuration: formData.minDuration || 3,
          maxDuration: formData.maxDuration || 14,
          directFlightsOnly: formData.directFlightsOnly || false,
          cabinClass: formData.cabinClass || 'economy',
          travelerProfileId: formData.travelerProfileId,
          paymentMethodId: formData.paymentMethodId
        }
      };

      const response = await fetch(`${this.apiEndpoint}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Step Functions API error: ${response.statusText}`);
      }

      const result: StepFunctionsResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create campaign');
      }

      // Convert to Campaign format expected by frontend
      return {
        id: result.campaignId!,
        user_id: userId,
        trip_request_id: '', // Will be created by Step Functions
        status: 'watching',
        criteria: request.criteria as any,
        price_history: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Step Functions specific fields
        executionArn: result.executionArn
      } as Campaign;

    } catch (error) {
      console.error('Step Functions campaign creation failed:', error);
      
      if (featureFlags.isDebugMode()) {
        // In debug mode, don't fail - just log and fallback
        console.warn('🔧 [StepFunctions] Creation failed, consider fallback');
      }
      
      throw error;
    }
  }

  /**
   * Pause a Step Functions campaign
   */
  async pauseCampaign(campaignId: string): Promise<Campaign> {
    if (!featureFlags.useAwsStepFunctions()) {
      throw new Error('Step Functions not enabled');
    }

    const response = await fetch(`${this.apiEndpoint}/campaigns/${campaignId}/pause`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to pause campaign: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Resume a Step Functions campaign
   */
  async resumeCampaign(campaignId: string): Promise<Campaign> {
    if (!featureFlags.useAwsStepFunctions()) {
      throw new Error('Step Functions not enabled');
    }

    const response = await fetch(`${this.apiEndpoint}/campaigns/${campaignId}/resume`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to resume campaign: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Delete a Step Functions campaign
   */
  async deleteCampaign(campaignId: string): Promise<void> {
    if (!featureFlags.useAwsStepFunctions()) {
      throw new Error('Step Functions not enabled');
    }

    const response = await fetch(`${this.apiEndpoint}/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete campaign: ${response.statusText}`);
    }
  }

  /**
   * Get campaigns from Step Functions
   */
  async getCampaigns(userId: string): Promise<Campaign[]> {
    if (!featureFlags.useAwsStepFunctions()) {
      throw new Error('Step Functions not enabled');
    }

    const response = await fetch(`${this.apiEndpoint}/campaigns?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get authentication token for Step Functions API
   */
  private async getAuthToken(): Promise<string> {
    // For now, we'll use a simple token - in production, this should integrate
    // with your existing auth system (Supabase JWT)
    const token = localStorage.getItem('supabase.auth.token');
    return token || 'development-token';
  }

  /**
   * Health check for Step Functions integration
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.apiEndpoint) return false;
      
      const response = await fetch(`${this.apiEndpoint}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const stepFunctionsService = new StepFunctionsService();
