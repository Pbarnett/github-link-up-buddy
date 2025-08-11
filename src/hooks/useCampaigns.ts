import { useState, useEffect } from "react";
import { Campaign } from "@/types/campaign";
import { campaignServiceAdapter as campaignService } from "@/services/campaignServiceAdapter";
import { useCurrentUser } from "./useCurrentUser";

export const useCampaigns = () => {
  const { userId } = useCurrentUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await campaignService.getCampaigns(userId);
      setCampaigns(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load campaigns";
      setError(errorMessage);
      console.error("Failed to load campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCampaigns = async () => {
    setIsLoading(true);
    await loadCampaigns();
  };

  const pauseCampaign = async (campaignId: string) => {
    try {
      const updatedCampaign = await campaignService.pauseCampaign(campaignId);
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === campaignId ? updatedCampaign : campaign
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to pause campaign";
      throw new Error(errorMessage);
    }
  };

  const resumeCampaign = async (campaignId: string) => {
    try {
      const updatedCampaign = await campaignService.resumeCampaign(campaignId);
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === campaignId ? updatedCampaign : campaign
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resume campaign";
      throw new Error(errorMessage);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      await campaignService.deleteCampaign(campaignId);
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete campaign";
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [userId]);

  return {
    campaigns,
    isLoading,
    error,
    refreshCampaigns,
    pauseCampaign,
    resumeCampaign,
    deleteCampaign,
  };
};
