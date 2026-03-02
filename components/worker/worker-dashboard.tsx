'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  DollarSign,
  Camera,
  CheckCircle,
  Star,
  TrendingUp,
  Navigation,
  Loader2,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface AvailableBounty {
  id: string;
  address: string | null;
  location_lat: number;
  location_lng: number;
  status: string;
  campaign_id: string;
  campaigns: {
    name: string;
    bounty_amount: number;
  } | null;
}

interface ActiveClaim {
  id: string;
  bounty_amount: number;
  status: string;
  claimed_at: string;
  sign_pins: {
    address: string | null;
    location_lat: number;
    location_lng: number;
    campaigns: {
      name: string;
    } | null;
  } | null;
}

interface CompletedClaim {
  id: string;
  bounty_amount: number;
  completed_at: string | null;
  rating: number | null;
  sign_pins: {
    address: string | null;
    campaigns: {
      name: string;
    } | null;
  } | null;
}

export function WorkerDashboard() {
  const [bounties, setBounties] = useState<AvailableBounty[]>([]);
  const [activeClaims, setActiveClaims] = useState<ActiveClaim[]>([]);
  const [completedClaims, setCompletedClaims] = useState<CompletedClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('total_earnings, average_rating')
      .eq('id', user.id)
      .single();

    if (profile) {
      setTotalEarnings(profile.total_earnings);
      setAverageRating(profile.average_rating);
    }

    const { data: availablePins } = await supabase
      .from('sign_pins')
      .select('id, address, location_lat, location_lng, status, campaign_id, campaigns(name, bounty_amount)')
      .eq('status', 'reported')
      .limit(20);

    if (availablePins) setBounties(availablePins as unknown as AvailableBounty[]);

    const { data: active } = await supabase
      .from('claims')
      .select('id, bounty_amount, status, claimed_at, sign_pins(address, location_lat, location_lng, campaigns(name))')
      .eq('worker_id', user.id)
      .in('status', ['claimed', 'pickup_verified'])
      .order('claimed_at', { ascending: false });

    if (active) setActiveClaims(active as unknown as ActiveClaim[]);

    const { data: completed } = await supabase
      .from('claims')
      .select('id, bounty_amount, completed_at, rating, sign_pins(address, campaigns(name))')
      .eq('worker_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(20);

    if (completed) setCompletedClaims(completed as unknown as CompletedClaim[]);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClaimBounty = async (signPinId: string, bountyAmount: number) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('claims').insert({
      worker_id: user.id,
      sign_pin_id: signPinId,
      bounty_amount: bountyAmount,
    });

    if (error) {
      toast.error('Failed to claim bounty');
      return;
    }

    await supabase
      .from('sign_pins')
      .update({ status: 'claimed', claimed_at: new Date().toISOString() })
      .eq('id', signPinId);

    toast.success('Bounty claimed!');
    loadData();
  };

  const handleVerifyPickup = async (claimId: string) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('claims')
      .update({
        status: 'pickup_verified',
        pickup_verified_at: new Date().toISOString(),
      })
      .eq('id', claimId);

    if (error) {
      toast.error('Failed to verify pickup');
      return;
    }

    toast.success('Pickup verified!');
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userType="worker" />
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userType="worker" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600 mt-1">Find and claim sign cleanup bounties in your area</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{completedClaims.length}</div>
              <p className="text-xs text-gray-500 mt-1">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-yellow-500">{averageRating.toFixed(1)}</div>
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Average rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available Bounties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{bounties.length}</div>
              <p className="text-xs text-gray-500 mt-1">Ready to claim</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList>
            <TabsTrigger value="available">Available Bounties</TabsTrigger>
            <TabsTrigger value="claimed">My Claims</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Bounties</CardTitle>
                <CardDescription>Sign cleanup opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                {bounties.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No bounties available right now. Check back later.</p>
                ) : (
                  <div className="space-y-4">
                    {bounties.map((bounty) => (
                      <div key={bounty.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <h3 className="font-semibold">
                                {bounty.address || `${bounty.location_lat.toFixed(4)}, ${bounty.location_lng.toFixed(4)}`}
                              </h3>
                            </div>
                            <div className="text-sm text-gray-600">
                              Campaign: {bounty.campaigns?.name || 'Unknown'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              ${bounty.campaigns?.bounty_amount?.toFixed(2) || '0.00'}
                            </div>
                            <Button onClick={() => handleClaimBounty(bounty.id, bounty.campaigns?.bounty_amount || 0)}>
                              Claim Bounty
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claimed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Active Claims</CardTitle>
                <CardDescription>Bounties you have claimed</CardDescription>
              </CardHeader>
              <CardContent>
                {activeClaims.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No active claims. Browse available bounties to get started.</p>
                ) : (
                  <div className="space-y-4">
                    {activeClaims.map((claim) => (
                      <div key={claim.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <h3 className="font-semibold">
                                {claim.sign_pins?.address || 'Unknown location'}
                              </h3>
                              <Badge variant="outline">{claim.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Campaign: {claim.sign_pins?.campaigns?.name || 'Unknown'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              ${claim.bounty_amount.toFixed(2)}
                            </div>
                            <div className="flex gap-2">
                              {claim.status === 'claimed' && (
                                <Button size="sm" onClick={() => handleVerifyPickup(claim.id)}>
                                  <Camera className="w-4 h-4 mr-2" />
                                  Verify Pickup
                                </Button>
                              )}
                              {claim.status === 'pickup_verified' && (
                                <Badge className="bg-yellow-100 text-yellow-800">Awaiting completion</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion History</CardTitle>
                <CardDescription>Your past completed bounties</CardDescription>
              </CardHeader>
              <CardContent>
                {completedClaims.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No completed jobs yet.</p>
                ) : (
                  <div className="space-y-4">
                    {completedClaims.map((claim) => (
                      <div key={claim.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <h3 className="font-semibold">
                                {claim.sign_pins?.address || 'Sign removed'}
                              </h3>
                              <Badge variant="secondary">Completed</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Campaign: {claim.sign_pins?.campaigns?.name || 'Unknown'}
                              {claim.completed_at && (
                                <> &middot; Completed {new Date(claim.completed_at).toLocaleDateString()}</>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              +${claim.bounty_amount.toFixed(2)}
                            </div>
                            {claim.rating && (
                              <div className="flex items-center gap-1 mt-1 justify-end">
                                {[...Array(5)].map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`w-3 h-3 ${j < claim.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
