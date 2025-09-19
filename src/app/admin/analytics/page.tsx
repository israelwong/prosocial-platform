import { redirect } from 'next/navigation';

export default function AnalyticsPage() {
    // Redirigir a la sección de marketing por defecto
    redirect('/admin/analytics/marketing');
}