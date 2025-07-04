import { ReportForm } from '@/components/public/report-form';

interface ReportPageProps {
  params: {
    qrCode: string;
  };
}

export default function QRReportPage({ params }: ReportPageProps) {
  return <ReportForm qrCode={params.qrCode} />;
}