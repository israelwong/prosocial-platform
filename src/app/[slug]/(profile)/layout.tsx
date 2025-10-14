'use client';

import { ProfileHeader, ProfileFooter } from '@/components/ui/profile';
import { useStudio } from '@/contexts/StudioContext';

export default function ProfileLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { profileData, activeSection } = useStudio();

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* MOBILE: Una columna */}
            <div className="lg:hidden">
                {/* HEADER: Con scroll inteligente */}
                <ProfileHeader
                    data={profileData}
                    activeSection={activeSection}
                    slug={profileData.slug}
                />

                {/* CONTENIDO DINÁMICO */}
                <main className="px-4 py-6">
                    {children}
                </main>

                {/* FOOTER: Siempre visible */}
                <ProfileFooter data={profileData} />
            </div>

            {/* DESKTOP: Tres columnas */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:px-6 lg:py-6">
                {/* Columna 1: Perfil dinámico */}
                <div className="col-span-1">
                    {/* HEADER: Con scroll inteligente */}
                    <ProfileHeader
                        data={profileData}
                        activeSection={activeSection}
                        slug={profileData.slug}
                    />

                    {/* CONTENIDO DINÁMICO */}
                    <main className="px-4 py-6">
                        {children}
                    </main>

                    {/* FOOTER: Siempre visible */}
                    <ProfileFooter data={profileData} />
                </div>

                {/* Columna 2: Promociones */}
                <div className="col-span-1">
                    <div className="sticky top-6">
                        <div className="bg-zinc-900 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">🔥 Promociones</h3>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4">
                                    <h4 className="text-white font-medium">Descuento 20%</h4>
                                    <p className="text-white/80 text-sm">En sesiones de estudio</p>
                                    <button className="mt-2 bg-white/20 text-white px-3 py-1 rounded text-xs">
                                        Aplicar
                                    </button>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4">
                                    <h4 className="text-white font-medium">Paquete Familiar</h4>
                                    <p className="text-white/80 text-sm">3 sesiones por $299</p>
                                    <button className="mt-2 bg-white/20 text-white px-3 py-1 rounded text-xs">
                                        Reservar
                                    </button>
                                </div>
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4">
                                    <h4 className="text-white font-medium">Nuevo Cliente</h4>
                                    <p className="text-white/80 text-sm">Primera sesión gratis</p>
                                    <button className="mt-2 bg-white/20 text-white px-3 py-1 rounded text-xs">
                                        Aprovechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna 3: ZEN Magic */}
                <div className="col-span-1">
                    <div className="sticky top-6">
                        <div className="bg-zinc-900 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">✨ ZEN Magic</h3>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-4">
                                    <h4 className="text-white font-medium">Asistente IA</h4>
                                    <p className="text-white/80 text-sm">Pregúntame sobre servicios</p>
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-4">
                                    <p className="text-zinc-400 text-sm mb-3">¿En qué puedo ayudarte hoy?</p>
                                    <div className="space-y-2">
                                        <button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm transition-colors">
                                            💬 Consultar precios
                                        </button>
                                        <button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm transition-colors">
                                            📅 Agendar cita
                                        </button>
                                        <button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm transition-colors">
                                            📸 Ver portafolio
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg p-4">
                                    <h4 className="text-white font-medium">Recomendación IA</h4>
                                    <p className="text-white/80 text-sm">Basado en tus intereses</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
