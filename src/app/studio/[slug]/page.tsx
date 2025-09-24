import { redirect } from 'next/navigation';

// Página raíz del studio - redirige al dashboard
export default function StudioRootPage({
    params,
}: {
    params: { slug: string };
}) {
    // Redirigir al dashboard por defecto
    redirect(`/studio/${params.slug}/dashboard`);
}
