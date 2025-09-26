import { redirect } from 'next/navigation';

// Página raíz del studio - redirige al dashboard manteniendo URL limpia
export default async function StudioRootPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // CAMBIO CRÍTICO: Redirigir a la URL limpia, no a la estructura interna
    // Esto mantiene zen.pro/mi-estudio → zen.pro/mi-estudio/dashboard
    redirect(`/${slug}/dashboard`);
}
