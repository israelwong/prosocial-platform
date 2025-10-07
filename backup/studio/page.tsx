import { redirect } from 'next/navigation';

export default function StudioPage() {
    // Redirigir al dashboard del studio demo usando URL limpia
    redirect('/demo-studio/dashboard');
}
