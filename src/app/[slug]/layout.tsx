import { headers } from 'next/headers';
import { StudioProvider } from '@/contexts/StudioContext';
import { getStudioPublicProfile } from '@/lib/actions/studio/profile.actions';
import { notFound } from 'next/navigation';

export default async function StudioLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Obtener la ruta actual desde los headers
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';

    // Si es una ruta de studio o cliente, renderizar children directamente
    if (pathname.includes('/studio') || pathname.includes('/cliente')) {
        return <>{children}</>;
    }

    // Para rutas públicas (profile), necesitamos datos del studio
    const studioData = await getStudioPublicProfile(slug);
    if (!studioData) notFound();

    return (
        <StudioProvider initialData={studioData}>
            {children}
        </StudioProvider>
    );
}