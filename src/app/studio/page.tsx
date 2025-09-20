import { redirect } from 'next/navigation';

export default function StudioPage() {
    // Redirigir al dashboard del studio demo
    redirect('/studio/demo-studio/dashboard');
}
