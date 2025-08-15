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
import { AutoBookingFAQDialog } from "@/components/autobooking/AutoBookingFAQDialog";
import { ensureAuthenticated } from "@/lib/auth/ensureAuthenticated";

function AutoBookingDashboard() {
  const navigate = useNavigate();
  const { userId, loading } = useCurrentUser();
  const { campaigns, isLoading, error, refreshCampaigns, pauseCampaign, resumeCampaign, deleteCampaign } = useCampaigns();

  // No breadcrumbs needed since this is the main dashboard page

  const handleCreateCampaign = async () => {
    const ok = await ensureAuthenticated();
    if (!ok) return; // redirected to login
    navigate("/auto-booking/new");
  };

  const handleEditCampaign = (campaignId: string) => {
    navigate(`/auto-booking/edit/${campaignId}`);
  };

  const handlePauseCampaign = async (campaignId: string) => {
    const ok = await ensureAuthenticated();
    if (!ok) return;
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
    const ok = await ensureAuthenticated();
    if (!ok) return;
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
    const ok = await ensureAuthenticated();
    if (!ok) return;
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

  const hasAnyCampaigns = (campaigns?.length || 0) > 0;

  return (
    <PageWrapper>
      <div className="container mx-auto py-10 px-4 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground mt-2 hidden md:block">We’ll auto-book your flight at whatever price you choose.</p>
            <p className="text-muted-foreground mt-2 md:hidden">We’ll auto-book your flight at whatever price you choose.</p>
          </div>
          {hasAnyCampaigns && (
            <Button variant="ghost" onClick={handleCreateCampaign} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New rule
            </Button>
          )}
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
          // First‑time Welcome state
          <Card>
            <CardContent className="py-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <div className="flex items-center justify-center">
                  <Rocket className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Book For Me</h2>
                <p className="text-muted-foreground hidden md:block">
                  Set your price. I’ll book when a fare matches. Today, tomorrow, or next month. I keep watch.
                </p>
                <p className="text-muted-foreground md:hidden">
                  Set your price. I’ll book when a fare matches.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Comfortable flights guaranteed</p>
                      <p className="text-sm text-muted-foreground">We only book nonstop, roundtrip flights with a carry‑on included.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Always on</p>
                      <p className="text-sm text-muted-foreground">We check fares around the clock, typically every 15 minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">You’re in control</p>
                      <p className="text-sm text-muted-foreground">Pause anytime; most U.S. fares are refundable within 24 hours.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Secure checkout</p>
                      <p className="text-sm text-muted-foreground">Payments are processed by Stripe; details stay encrypted.</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button size="lg" onClick={handleCreateCampaign} className="px-6">
                    <Plus className="h-4 w-4 mr-2" /> Book For Me
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
                        <p>LAX → CDG • Jul 4–18 • ≤ $800 • Nonstop roundtrip</p>
                        <p className="text-muted-foreground">I’ll monitor continuously and purchase within your max price. You can pause anytime.</p>
                      </div>
                  </DialogContent>
                  </Dialog>
                  <AutoBookingFAQDialog
                    trigger={
                      <button className="text-xs text-muted-foreground hover:underline">
                        How auto-booking works
                      </button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* Active Campaigns */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Active rules</h2>
                <Badge variant="secondary">{activeCampaigns.length}</Badge>
              </div>
              {activeCampaigns.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plane className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active rules</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Create a rule to start watching and booking automatically.
                    </p>
                    <Button onClick={handleCreateCampaign}>
                      <Plus className="h-4 w-4 mr-2" />
                      Book For Me
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
                  <h2 className="text-xl font-semibold">Paused rules</h2>
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
                  <h2 className="text-xl font-semibold">Completed rules</h2>
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
