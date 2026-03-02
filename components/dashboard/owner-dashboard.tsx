'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  QrCode,
  MapPin,
  TrendingUp,
  CheckCircle,
  Eye,
  Edit,
  Loader2,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { QRCodeDialog } from '@/components/dashboard/qr-code-dialog';
import { createClient } from '@/lib/supabase/client';
import { generateCampaignQRCode } from '@/lib/qr-generator';
interface Campaign {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  bounty_amount: number;
  qr_code: string;
  status: string;
  signs_deployed: number;
  signs_reported: number;
  signs_removed: number;
  total_bounty_paid: number;
  created_at: string;
  updated_at: string;
}

export function OwnerDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [qrDialogCampaign, setQrDialogCampaign] = useState<Campaign | null>(null);

  const loadCampaigns = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setCampaigns(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleCreateCampaign = async (formData: FormData) => {
    setCreating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const bountyAmount = parseFloat(formData.get('bountyAmount') as string) || 5.0;

    const { error } = await supabase.from('campaigns').insert({
      owner_id: user.id,
      name,
      description: description || null,
      bounty_amount: bountyAmount,
      qr_code: generateCampaignQRCode(name),
    });

    setCreating(false);
    if (!error) {
      setCreateDialogOpen(false);
      loadCampaigns();
    }
  };

  const totalDeployed = campaigns.reduce((sum, c) => sum + c.signs_deployed, 0);
  const totalRemoved = campaigns.reduce((sum, c) => sum + c.signs_removed, 0);
  const complianceRate = totalDeployed > 0
    ? Math.round(((totalDeployed - totalRemoved) / totalDeployed) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userType="owner" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your sign campaigns and track performance</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new sign campaign with a bounty for cleanup.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateCampaign} className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input id="name" name="name" required placeholder="e.g. Summer Sale 2026" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Campaign details..." rows={3} />
                </div>
                <div>
                  <Label htmlFor="bountyAmount">Bounty Amount ($)</Label>
                  <Input id="bountyAmount" name="bountyAmount" type="number" min="1" step="0.50" defaultValue="5.00" required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={creating}>
                    {creating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : 'Create Campaign'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {campaigns.filter(c => c.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Signs Deployed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalDeployed}</div>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Across all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Signs Removed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalRemoved}</div>
              <p className="text-xs text-gray-500 mt-1">
                {totalDeployed > 0 ? ((totalRemoved / totalDeployed) * 100).toFixed(1) : 0}% of deployed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{complianceRate}%</div>
              <Progress value={complianceRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>Create and manage your sign campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No campaigns yet. Create your first campaign to get started.</p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{campaign.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                {campaign.status}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Created {new Date(campaign.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {campaign.description && (
                              <p className="text-sm text-gray-600 mt-2">{campaign.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => setQrDialogCampaign(campaign)}>
                              <QrCode className="w-4 h-4 mr-2" />
                              QR Code
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <Separator className="mb-3" />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Deployed</span>
                            <div className="font-semibold">{campaign.signs_deployed}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Reported</span>
                            <div className="font-semibold text-orange-600">{campaign.signs_reported}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Removed</span>
                            <div className="font-semibold text-green-600">{campaign.signs_removed}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Bounty</span>
                            <div className="font-semibold">${campaign.bounty_amount}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sign Locations</CardTitle>
                <CardDescription>View all your deployed signs on the map</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Map integration coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {qrDialogCampaign && (
        <QRCodeDialog
          open={!!qrDialogCampaign}
          onOpenChange={(open) => { if (!open) setQrDialogCampaign(null); }}
          campaignId={qrDialogCampaign.id}
          campaignName={qrDialogCampaign.name}
        />
      )}
    </div>
  );
}
