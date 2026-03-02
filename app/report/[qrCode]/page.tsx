import { ReportForm } from '@/components/public/report-form';

interface ReportPageProps {
  params: Promise<{
    qrCode: string;
  }>;
}

export default async function QRReportPage({ params }: ReportPageProps) {
  const { qrCode } = await params;
  return <ReportForm qrCode={qrCode} />;
}
