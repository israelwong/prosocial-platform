import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface StudioLayoutProps {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params

    // Buscar el studio por slug
    const studio = await prisma.studios.findUnique({
        where: { slug },
        select: {
            id: true,
            studio_name: true,
            slug: true,
            descripcion: true,
            logo_url: true,
            isotipo_url: true,
            website: true,
            phone: true,
            email: true,
            address: true,
            is_active: true
        }
    })

    if (!studio || !studio.is_active) {
        return {
            title: 'Studio no encontrado',
            description: 'El studio solicitado no existe o no está activo'
        }
    }

    // Configurar metadata dinámico
    const metadata: Metadata = {
        title: `${studio.studio_name} - Estudio Fotográfico`,
        description: studio.descripcion || `${studio.studio_name} - Estudio fotográfico profesional`,
        keywords: ['fotografía', 'estudio fotográfico', studio.studio_name],
        authors: [{ name: studio.studio_name }],
        openGraph: {
            title: `${studio.studio_name} - Estudio Fotográfico`,
            description: studio.descripcion || `${studio.studio_name} - Estudio fotográfico profesional`,
            siteName: studio.studio_name,
            type: 'website',
            images: studio.logo_url ? [
                {
                    url: studio.logo_url,
                    width: 1200,
                    height: 630,
                    alt: studio.studio_name,
                }
            ] : undefined,
        },
        // Twitter/X metadata (compatible con ambas plataformas)
        twitter: {
            card: 'summary_large_image',
            title: `${studio.studio_name} - Estudio Fotográfico`,
            description: studio.descripcion || `${studio.studio_name} - Estudio fotográfico profesional`,
            images: studio.logo_url ? [studio.logo_url] : undefined,
        },
    }

    // Si el studio tiene isotipo, usarlo como favicon (preferido)
    // Si no tiene isotipo pero tiene logo, usar el logo como fallback
    const faviconUrl = studio.isotipo_url || studio.logo_url
    if (faviconUrl) {
        metadata.icons = {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
        }
    }

    return metadata
}

export default async function StudioLayout({ children, params }: StudioLayoutProps) {
    const { slug } = await params

    return (
        <div>
            {children}
        </div>
    )
}