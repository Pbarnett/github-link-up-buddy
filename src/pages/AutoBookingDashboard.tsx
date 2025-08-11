import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Plus, Plane, Pause, Play, X, Edit, Rocket, Check } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignCard } from "@/components/autobooking/CampaignCard";
import PageWrapper from "@/components/layout/PageWrapper";
import { withErrorBoundary } from "@/components/ErrorBoundary";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function AutoBookingDashboard() {
  const navigate = useNavigate();
  const { userId, loading } = useCurrentUser();
  const { campaigns, isLoading, error, refreshCampaigns, pauseCampaign, resumeCampaign, deleteCampaign } = useCampaigns();

  // No breadcrumbs needed since this is the main dashboard page

  const handleCreateCampaign = () => {
    navigate("/auto-booking/new");
  };

  const handleEditCampaign = (campaignId: string) => {
    navigate(`/auto-booking/edit/${campaignId}`);
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      await pauseCampaign(campaignId);
      toast({
        title: "Campaign paused",
        description: "Your auto-booking campaign has been paused.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pause campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    try {
      await resumeCampaign(campaignId);
      toast({
        title: "Campaign resumed",
        description: "Your auto-booking campaign is now active.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resume campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      try {
        await deleteCampaign(campaignId);
        toast({
          title: "Campaign deleted",
          description: "Your auto-booking campaign has been deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete campaign. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const activeCampaigns = campaigns?.filter(c => c.status === 'active' || c.status === 'watching') || [];
  const pausedCampaigns = campaigns?.filter(c => c.status === 'paused') || [];
  const completedCampaigns = campaigns?.filter(c => c.status === 'booked' || c.status === 'completed') || [];

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <PageWrapper>
        <div className="container mx-auto py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Show login prompt only after loading is complete and user is not authenticated
  if (!userId) {
    return (
      <PageWrapper>
        <div className="container mx-auto py-8">
          <Alert>
            <AlertDescription>
              Please log in to view your auto-booking campaigns.
            </AlertDescription>
          </Alert>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto py-8 space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Auto‑booking</h1>
            <p className="text-muted-foreground mt-2">Set your max price. I'll book when the fare drops.</p>
          </div>
          <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : !hasAnyCampaigns ? (
          {/* First‑time Welcome state */}
          <Card>
            <CardContent className="py-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <div className="flex items-center justify-center">
                  <Rocket className="h-12 w-12 text-primary" />
                </div>
                <h2 className="sr-only">Overview</h2>
                <p className="text-muted-foreground">
                  Tell me the trip and your limit. I check fares every 15 minutes. When a match appears, I buy it on your saved card and you get a note right away.
                </p>
                <div className="text-left max-w-3xl mx-auto">
                  <h3 className="mt-6 text-lg font-medium">What you can count on</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-1" />
                      <span>Never above your limit. Taxes and fees included.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-1" />
                      <span>Round trip only.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-1" />
                      <span>Nonstop only.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-1" />
                      <span>Carry-on and personal item included.</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">
                    If a flight breaks a rule at your price, I skip it.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You can pause or change your rule any time. Most U.S. fares refund within 24 hours.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Checkout is through Stripe. Your details stay encrypted.
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    You can relax any of these rules in your settings if you prefer.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Button size="lg" onClick={handleCreateCampaign} className="px-6">
                    <Plus className="h-4 w-4 mr-2" /> Set up auto-booking
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/search')} className="px-6">
                    Search flights now
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-sm text-muted-foreground hover:underline">See an example</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Example auto‑book rule</DialogTitle>
                      </DialogHeader>
                      <div className="text-sm space-y-2">
                        <p>LAX → CDG • Jul 4–18 • ≤ $800 • 0–1 stops</p>
                        <p className="text-muted-foreground">We’ll monitor continuously and purchase within your max price. You can pause anytime.</p>
                      </div>
                  </DialogContent>
                  </Dialog>
                  <AutoBookingFAQDialog
                    trigger={
                      <button className="text-xs text-muted-foreground hover:underline">
                        How auto‑booking works
                      </button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Campaigns */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Active Campaigns</h2>
                <Badge variant="secondary">{activeCampaigns.length}</Badge>
              </div>
              
              {activeCampaigns.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plane className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active campaigns</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Create your first auto-booking campaign to start finding great flight deals automatically.
                    </p>
                    <Button onClick={handleCreateCampaign}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onEdit={() => handleEditCampaign(campaign.id)}
                      onPause={() => handlePauseCampaign(campaign.id)}
                      onResume={() => handleResumeCampaign(campaign.id)}
                      onDelete={() => handleDeleteCampaign(campaign.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Paused Campaigns */}
            {pausedCampaigns.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">Paused Campaigns</h2>
                  <Badge variant="outline">{pausedCampaigns.length}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pausedCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onEdit={() => handleEditCampaign(campaign.id)}
                      onPause={() => handlePauseCampaign(campaign.id)}
                      onResume={() => handleResumeCampaign(campaign.id)}
                      onDelete={() => handleDeleteCampaign(campaign.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Campaigns */}
            {completedCampaigns.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">Completed Campaigns</h2>
                  <Badge variant="outline">{completedCampaigns.length}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onEdit={() => handleEditCampaign(campaign.id)}
                      onPause={() => handlePauseCampaign(campaign.id)}
                      onResume={() => handleResumeCampaign(campaign.id)}
                      onDelete={() => handleDeleteCampaign(campaign.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default withErrorBoundary(AutoBookingDashboard, 'page');
