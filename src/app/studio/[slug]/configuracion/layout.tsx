import React from 'react';
import { ConfiguracionSidebarZen, ZenSidebarTrigger, ZenSidebarOverlay } from './components/ConfiguracionSidebarZen';
import { ZenSidebarProvider } from '@/components/ui/zen/layout/ZenSidebar';

// Este layout envuelve la página de configuración y sus sub-páginas
// Ahora usa ZEN Design System con ZenSidebar
export default async function ConfigurationLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const { slug } = await params;

    return (
        <ZenSidebarProvider>
            <div className="flex min-h-screen bg-zinc-950 overflow-hidden">
                <ConfiguracionSidebarZen studioSlug={slug} />
                <ZenSidebarOverlay />

                <main className="flex-1 p-2 sm:p-4 lg:ml-0 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <ZenSidebarTrigger />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Configuración</h1>
                            <p className="text-zinc-400">Gestiona la configuración de tu estudio</p>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ZenSidebarProvider>
    );
}
