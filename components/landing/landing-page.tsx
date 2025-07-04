'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, MapPin, QrCode, DollarSign, Shield, Users, Zap, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  const [activeTab, setActiveTab] = useState('owners');

  const features = [
    {
      icon: <QrCode className="w-8 h-8 text-blue-600" />,
      title: 'QR Code Generation',
      description: 'Generate unique QR codes for each campaign with instant tracking capabilities.'
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: 'GPS Tracking',
      description: 'Precise location tracking for sign deployment, reporting, and pickup verification.'
    },
    {
      icon: <DollarSign className="w-8 h-8 text-orange-600" />,
      title: 'Automated Payouts',
      description: 'Stripe-powered instant payments for verified sign cleanup bounties.'
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: 'Compliance Tracking',
      description: 'Real-time compliance monitoring and reporting dashboard.'
    }
  ];

  const userRoles = [
    {
      id: 'owners',
      title: 'Sign Owners',
      description: 'Manage campaigns, track deployments, and ensure compliance',
      features: [
        'Create unlimited campaigns',
        'Generate QR codes instantly',
        'GPS deployment tracking',
        'Compliance dashboard',
        'Automated reporting'
      ]
    },
    {
      id: 'workers',
      title: 'Gig Workers',
      description: 'Earn money by cleaning up expired signs in your area',
      features: [
        'Browse available bounties',
        'Interactive map view',
        'Photo proof uploads',
        'Instant payouts',
        'Flexible scheduling'
      ]
    },
    {
      id: 'public',
      title: 'Public Users',
      description: 'Report expired signs to keep communities clean',
      features: [
        'Scan QR codes easily',
        'Submit reports instantly',
        'GPS auto-location',
        'No account required',
        'Community impact tracking'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartSign</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
            Revolutionary Sign Management Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Clean Cities Through
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {' '}Smart Bounties
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform sign cleanup into a community-driven initiative. Deploy, track, and manage signs with GPS precision while rewarding gig workers for keeping cities clean.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-6 text-lg" asChild>
              <Link href="/auth/signup">
                Start Your Campaign
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
              <Link href="/worker/signup">
                Become a Gig Worker
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every User
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with intuitive design to make sign management effortless.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role and see how SmartSign makes sign management simple and rewarding.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              {userRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === role.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {role.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Role Content */}
          {userRoles.map((role) => (
            activeTab === role.id && (
              <Card key={role.id} className="max-w-4xl mx-auto shadow-xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl mb-4">{role.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold mb-4 text-gray-900">Key Features:</h4>
                      <ul className="space-y-3">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                          {role.id === 'owners' && <Users className="w-10 h-10 text-white" />}
                          {role.id === 'workers' && <DollarSign className="w-10 h-10 text-white" />}
                          {role.id === 'public' && <MapPin className="w-10 h-10 text-white" />}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {role.id === 'owners' && 'Manage campaigns with ease'}
                          {role.id === 'workers' && 'Earn money cleaning up'}
                          {role.id === 'public' && 'Help keep cities clean'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Signs Cleaned</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Campaigns</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2K+</div>
              <div className="text-blue-100">Gig Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Compliance Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your City?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of sign owners and gig workers who are already making cities cleaner and more compliant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/auth/signup">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/demo">
                Schedule Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SmartSign</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing sign management through community-driven solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-gray-400">
            <p>&copy; 2025 SmartSign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}