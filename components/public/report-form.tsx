'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface ReportFormProps {
  campaignId?: string;
  qrCode?: string;
}

export function ReportForm({ qrCode }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [campaignName, setCampaignName] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setLocationError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (!qrCode) return;

    async function lookupCampaign() {
      const supabase = createClient();
      const { data } = await supabase
        .from('campaigns')
        .select('id, name')
        .eq('qr_code', qrCode)
        .eq('status', 'active')
        .single();

      if (data) {
        setCampaignId(data.id);
        setCampaignName(data.name);
      }
    }
    lookupCampaign();
  }, [qrCode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!location) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const supabase = createClient();

    let resolvedCampaignId = campaignId;

    if (!resolvedCampaignId && qrCode) {
      const { data } = await supabase
        .from('campaigns')
        .select('id')
        .eq('qr_code', qrCode)
        .eq('status', 'active')
        .single();
      resolvedCampaignId = data?.id || null;
    }

    if (!resolvedCampaignId) {
      toast.error('Could not find the associated campaign.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('reports').insert({
      campaign_id: resolvedCampaignId,
      description: (formData.get('description') as string) || null,
      reporter_email: (formData.get('email') as string) || null,
      reporter_phone: (formData.get('phone') as string) || null,
      location_lat: location.lat,
      location_lng: location.lng,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error('Failed to submit report. Please try again.');
      return;
    }

    setIsSubmitted(true);
    toast.success('Report submitted successfully!');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">Report Submitted!</CardTitle>
            <CardDescription className="text-green-700">
              Thank you for helping keep our community clean
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Your report has been received and a gig worker will be notified to remove the sign.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">QwikUp Signs</span>
          </div>
          <CardTitle className="text-2xl">Report Expired Sign</CardTitle>
          <CardDescription>
            Help keep our community clean by reporting expired signs
          </CardDescription>
          {campaignName && (
            <Badge className="w-fit mx-auto mt-3">
              Campaign: {campaignName}
            </Badge>
          )}
          {qrCode && !campaignName && (
            <Badge variant="outline" className="w-fit mx-auto mt-3">
              QR: {qrCode}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Location</span>
              </div>
              {location ? (
                <div className="text-sm text-blue-800">
                  Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              ) : locationError ? (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {locationError}
                </div>
              ) : (
                <div className="text-sm text-blue-600 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting your location...
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the sign condition or location details..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Contact Information (Optional)</Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email" className="text-sm text-gray-600">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm text-gray-600">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !location}>
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting Report...</>
              ) : (
                <><AlertTriangle className="w-4 h-4 mr-2" /> Submit Report</>
              )}
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Reports are processed by our community of gig workers
            </p>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>Anonymous reporting</span>
              <span>GPS verification</span>
              <span>Fast response</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
