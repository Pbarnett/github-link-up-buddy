/**
 * Campaign Service Adapter - Safe Migration Layer
 * 
 * This adapter allows seamless switching between legacy Supabase
 * auto-booking and new AWS Step Functions without breaking existing code.
 * 
 * The existing React components can continue using the same interface
 * while we gradually migrate the backend.
 */

import { Campaign, CampaignFormData } from "@/types/campaign";
import { campaignService as legacyCampaignService } from "./campaignService";
import { stepFunctionsService } from "./stepFunctionsService";
import { featureFlags } from "./featureFlags";

class CampaignServiceAdapter {
  /**
   * Get campaigns - automatically chooses the right backend
   */
  async getCampaigns(userId: string): Promise<Campaign[]> {
    try {
      if (featureFlags.useAwsStepFunctions()) {
        if (featureFlags.isDebugMode()) {
          console.log('🔧 [Adapter] Using AWS Step Functions for getCampaigns');
        }
        
        // Check if Step Functions is healthy first
        const isHealthy = await stepFunctionsService.healthCheck();
        if (!isHealthy) {
          console.warn('Step Functions unhealthy, falling back to legacy');
          return await legacyCampaignService.getCampaigns(userId);
        }
        
        return await stepFunctionsService.getCampaigns(userId);
      } else {
        if (featureFlags.isDebugMode()) {
          console.log('🔧 [Adapter] Using legacy Supabase for getCampaigns');
        }
        return await legacyCampaignService.getCampaigns(userId);
      }
    } catch (error) {
      console.error('Campaign service error:', error);
      
      // If Step Functions fails, automatically fallback to legacy
      if (featureFlags.useAwsStepFunctions()) {
        console.warn('🔄 Step Functions failed, auto-fallback to legacy');
        try {
          return await legacyCampaignService.getCampaigns(userId);
        } catch (legacyError) {
          console.error('Legacy service also failed:', legacyError);
          throw new Error('Both Step Functions and legacy services failed');
        }
      }
      
      throw error;
    }
  }

  /**
   * Create campaign - with automatic fallback protection
   */
  async createCampaign(formData: CampaignFormData, userId: string): Promise<Campaign> {
    try {
      if (featureFlags.useAwsStepFunctions()) {
        if (featureFlags.isDebugMode()) {
          console.log('🔧 [Adapter] Creating campaign with Step Functions');
        }
        
        return await stepFunctionsService.createCampaign(formData, userId);
      } else {
        if (featureFlags.isDebugMode()) {
          console.log('🔧 [Adapter] Creating campaign with legacy service');
        }
        
        return await legacyCampaignService.createCampaign(formData, userId);
      }
    } catch (error) {
      console.error('Create campaign error:', error);
      
      // Critical: If Step Functions fails during creation, we should fallback
      if (featureFlags.useAwsStepFunctions()) {
        console.warn('🔄 Step Functions create failed, attempting legacy fallback');
        
        try {
          // Temporarily switch to legacy for this operation
          return await legacyCampaignService.createCampaign(formData, userId);
        } catch (legacyError) {
          console.error('Legacy create also failed:', legacyError);
          throw new Error(`Campaign creation failed: ${error}`);
        }
      }
      
      throw error;
    }
  }

  /**
   * Pause campaign - with fallback protection
   */
  async pauseCampaign(campaignId: string): Promise<Campaign> {
    try {
      if (featureFlags.useAwsStepFunctions()) {
        return await stepFunctionsService.pauseCampaign(campaignId);
      } else {
        return await legacyCampaignService.pauseCampaign(campaignId);
      }
    } catch (error) {
      if (featureFlags.useAwsStepFunctions()) {
        console.warn('Step Functions pause failed, trying legacy');
        return await legacyCampaignService.pauseCampaign(campaignId);
      }
      throw error;
    }
  }

  /**
   * Resume campaign - with fallback protection
   */
  async resumeCampaign(campaignId: string): Promise<Campaign> {
    try {
      if (featureFlags.useAwsStepFunctions()) {
        return await stepFunctionsService.resumeCampaign(campaignId);
      } else {
        return await legacyCampaignService.resumeCampaign(campaignId);
      }
    } catch (error) {
      if (featureFlags.useAwsStepFunctions()) {
        console.warn('Step Functions resume failed, trying legacy');
        return await legacyCampaignService.resumeCampaign(campaignId);
      }
      throw error;
    }
  }

  /**
   * Delete campaign - with fallback protection
   */
  async deleteCampaign(campaignId: string): Promise<void> {
    try {
      if (featureFlags.useAwsStepFunctions()) {
        return await stepFunctionsService.deleteCampaign(campaignId);
      } else {
        return await legacyCampaignService.deleteCampaign(campaignId);
      }
    } catch (error) {
      if (featureFlags.useAwsStepFunctions()) {
        console.warn('Step Functions delete failed, trying legacy');
        return await legacyCampaignService.deleteCampaign(campaignId);
      }
      throw error;
    }
  }

  /**
   * Get current service status for debugging/monitoring
   */
  getServiceStatus() {
    return {
      usingStepFunctions: featureFlags.useAwsStepFunctions(),
      usingLegacy: featureFlags.useLegacyAutoBooking(),
      isDebugMode: featureFlags.isDebugMode(),
      isRollbackMode: featureFlags.isRollbackMode(),
    };
  }

  /**
   * Force fallback to legacy system (emergency use)
   */
  emergencyFallbackToLegacy() {
    console.warn('🚨 EMERGENCY: Forcing fallback to legacy auto-booking');
    featureFlags.emergencyRollback();
  }
}

export const campaignServiceAdapter = new CampaignServiceAdapter();

// Make the adapter available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).campaignServiceStatus = () => campaignServiceAdapter.getServiceStatus();
  (window as any).emergencyFallback = () => campaignServiceAdapter.emergencyFallbackToLegacy();
}
