'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Loader2 } from 'lucide-react';
import { generateQRCode } from '@/lib/qr-generator';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
}

export function QRCodeDialog({ open, onOpenChange, campaignId, campaignName }: QRCodeDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    generateQRCode(campaignId)
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
      .finally(() => setLoading(false));
  }, [open, campaignId]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qr-${campaignName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>{campaignName}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          ) : qrDataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={`QR code for ${campaignName}`} className="w-64 h-64" />
              <p className="text-sm text-gray-500 text-center">
                Scan this QR code to report an expired sign from this campaign.
              </p>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            </>
          ) : (
            <p className="text-sm text-gray-500">Failed to generate QR code.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
