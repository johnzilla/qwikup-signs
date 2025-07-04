'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  DollarSign, 
  Camera, 
  Clock, 
  CheckCircle,
  Star,
  TrendingUp,
  Navigation
} from 'lucide-react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export function WorkerDashboard() {
  const [availableBounties] = useState([
    {
      id: 1,
      location: '123 Main St, Downtown',
      bountyAmount: 5.00,
      distance: '0.3 miles',
      campaign: 'Summer Sale 2024',
      reportedAt: '2 hours ago',
      status: 'available'
    },
    {
      id: 2,
      location: '456 Oak Ave, Midtown',
      bountyAmount: 7.50,
      distance: '0.8 miles',
      campaign: 'Black Friday Campaign',
      reportedAt: '4 hours ago',
      status: 'available'
    },
    {
      id: 3,
      location: '789 Pine St, Uptown',
      bountyAmount: 5.00,
      distance: '1.2 miles',
      campaign: 'Summer Sale 2024',
      reportedAt: '1 day ago',
      status: 'claimed'
    }
  ]);

  const [activeClaims] = useState([
    {
      id: 1,
      location: '321 Elm St, Downtown',
      bountyAmount: 7.50,
      campaign: 'Black Friday Campaign',
      claimedAt: '1 hour ago',
      status: 'claimed'
    }
  ]);

  const stats = {
    totalEarnings: 156.50,
    thisWeekEarnings: 42.50,
    completedJobs: 23,
    averageRating: 4.8,
    availableBounties: availableBounties.filter(b => b.status === 'available').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userType="worker" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="text-gray-600 mt-1">Find and claim sign cleanup bounties in your area</p>
          </div>
          <Button asChild>
            <Link href="/worker/map">
              <MapPin className="w-4 h-4 mr-2" />
              View Map
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalEarnings}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${stats.thisWeekEarnings}</div>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +15% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.completedJobs}</div>
              <p className="text-xs text-gray-500 mt-1">Total completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-yellow-500">{stats.averageRating}</div>
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
              <div className="text-2xl font-bold text-blue-600">{stats.availableBounties}</div>
              <p className="text-xs text-gray-500 mt-1">In your area</p>
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
                <CardDescription>
                  Sign cleanup opportunities in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableBounties.filter(b => b.status === 'available').map((bounty) => (
                    <div key={bounty.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <h3 className="font-semibold">{bounty.location}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Campaign: {bounty.campaign}</span>
                            <span>Reported: {bounty.reportedAt}</span>
                            <span>Distance: {bounty.distance}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            ${bounty.bountyAmount}
                          </div>
                          <Button>
                            Claim Bounty
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claimed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Active Claims</CardTitle>
                <CardDescription>
                  Bounties you've claimed and are working on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <h3 className="font-semibold">{claim.location}</h3>
                            <Badge variant="outline">Claimed</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Campaign: {claim.campaign}</span>
                            <span>Claimed: {claim.claimedAt}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            ${claim.bountyAmount}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Navigation className="w-4 h-4 mr-2" />
                              Navigate
                            </Button>
                            <Button size="sm">
                              <Camera className="w-4 h-4 mr-2" />
                              Verify Pickup
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion History</CardTitle>
                <CardDescription>
                  Your past completed bounties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h3 className="font-semibold">Sign removed from Main St</h3>
                            <Badge variant="secondary">Completed</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Campaign: Summer Sale 2024</span>
                            <span>Completed: {i + 1} days ago</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            +${(5 + i * 0.5).toFixed(2)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="w-3 h-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}