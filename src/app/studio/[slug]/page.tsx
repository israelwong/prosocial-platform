import { redirect } from 'next/navigation';

// Página raíz del studio - redirige al dashboard
export default async function StudioRootPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // Redirigir al dashboard por defecto
    const { slug } = await params;
    redirect(`/studio/${slug}/dashboard`);
}
