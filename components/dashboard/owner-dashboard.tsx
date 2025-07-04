'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  QrCode, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Users,
  DollarSign,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export function OwnerDashboard() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Summer Sale 2024',
      status: 'active',
      signsDeployed: 45,
      signsReported: 3,
      signsRemoved: 2,
      bountyAmount: 5.00,
      createdAt: '2024-01-15',
      qrCode: 'QR_SUMMER_2024'
    },
    {
      id: 2,
      name: 'Black Friday Campaign',
      status: 'completed',
      signsDeployed: 120,
      signsReported: 8,
      signsRemoved: 8,
      bountyAmount: 7.50,
      createdAt: '2024-01-10',
      qrCode: 'QR_BLACKFRIDAY_2024'
    }
  ]);

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSignsDeployed: campaigns.reduce((sum, c) => sum + c.signsDeployed, 0),
    totalSignsRemoved: campaigns.reduce((sum, c) => sum + c.signsRemoved, 0),
    complianceRate: 94
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userType="owner" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your sign campaigns and track performance</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/campaigns/new">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeCampaigns} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Signs Deployed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSignsDeployed}</div>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                12% increase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Signs Removed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSignsRemoved}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((stats.totalSignsRemoved / stats.totalSignsDeployed) * 100).toFixed(1)}% of deployed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.complianceRate}%</div>
              <Progress value={stats.complianceRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>
                  Create and manage your sign campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                              Created {campaign.createdAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
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
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Deployed</span>
                          <div className="font-semibold">{campaign.signsDeployed}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Reported</span>
                          <div className="font-semibold text-orange-600">{campaign.signsReported}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Removed</span>
                          <div className="font-semibold text-green-600">{campaign.signsRemoved}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Bounty</span>
                          <div className="font-semibold">${campaign.bountyAmount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Signs Deployed</span>
                      <span className="font-semibold">{stats.totalSignsDeployed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Signs Reported</span>
                      <span className="font-semibold text-orange-600">11</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Signs Removed</span>
                      <span className="font-semibold text-green-600">{stats.totalSignsRemoved}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Compliance Rate</span>
                      <span className="font-semibold text-green-600">{stats.complianceRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Sign removed on Main St</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Sign reported expired</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">New sign deployed</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sign Locations</CardTitle>
                <CardDescription>
                  View all your deployed signs on the map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive map will be displayed here</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Shows deployed signs, reported signs, and active bounties
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}