import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface StudioPageProps {
    params: {
        slug: string
    }
}

export default async function StudioPublicPage({ params }: StudioPageProps) {
    const { slug } = params

    // Buscar el studio por slug
    const studio = await prisma.studios.findUnique({
        where: { slug },
        select: {
            id: true,
            studio_name: true,
            slug: true,
            descripcion: true,
            logo_url: true,
            website: true,
            phone: true,
            email: true,
            address: true,
            is_active: true
        }
    })

    if (!studio || !studio.is_active) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <div className="bg-zinc-900 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {studio.logo_url && (
                                <img
                                    src={studio.logo_url}
                                    alt={studio.studio_name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-white">{studio.studio_name}</h1>
                                {studio.descripcion && (
                                    <p className="text-zinc-400">{studio.descripcion}</p>
                                )}
                            </div>
                        </div>
                        <a
                            href={`/studio/${studio.slug}/dashboard`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Acceder al Dashboard
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Bienvenido a {studio.studio_name}
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8">
                        Tu estudio fotográfico profesional
                    </p>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {studio.phone && (
                            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                                <h3 className="text-lg font-semibold text-white mb-2">Teléfono</h3>
                                <p className="text-zinc-400">{studio.phone}</p>
                            </div>
                        )}
                        {studio.email && (
                            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                                <p className="text-zinc-400">{studio.email}</p>
                            </div>
                        )}
                        {studio.address && (
                            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                                <h3 className="text-lg font-semibold text-white mb-2">Dirección</h3>
                                <p className="text-zinc-400">{studio.address}</p>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            ¿Listo para comenzar?
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            Accede a tu dashboard para gestionar tu estudio fotográfico
                        </p>
                        <a
                            href={`/studio/${studio.slug}/dashboard`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
                        >
                            Ir al Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
