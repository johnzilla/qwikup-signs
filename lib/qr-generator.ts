import QRCode from 'qrcode';

export async function generateQRCode(campaignId: string, text?: string): Promise<string> {
  const qrData = text || `${process.env.NEXT_PUBLIC_APP_URL}/report/${campaignId}`;
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function generateCampaignQRCode(campaignName: string): string {
  const timestamp = Date.now();
  const sanitizedName = campaignName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
  return `QR_${sanitizedName}_${timestamp}`;
}