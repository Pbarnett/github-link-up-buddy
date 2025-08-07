

./useCurrentUser';

export const useCampaigns = () => {
  const { userId } = useCurrentUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    console.log('🔍 useCampaigns: loadCampaigns called with userId:', userId);

    if (!userId) {
      console.log('🔍 useCampaigns: no userId, setting loading to false');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 useCampaigns: fetching campaigns for userId:', userId);
      setError(null);
      const data = await campaignService.getCampaigns(userId);
      console.log(
        '🔍 useCampaigns: campaigns fetched:',
        data.length,
        'campaigns'
      );
      setCampaigns(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load campaigns';
      console.error('🚨 useCampaigns: error loading campaigns:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

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
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to pause campaign';
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
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to resume campaign';
      throw new Error(errorMessage);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      await campaignService.deleteCampaign(campaignId);
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete campaign';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

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
