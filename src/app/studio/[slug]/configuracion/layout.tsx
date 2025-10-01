import React from 'react';
import { ConfiguracionSidebarZen, ZenSidebarOverlay } from './components/ConfiguracionSidebarZen';
import { ZenSidebarProvider } from '@/components/ui/zen/layout/ZenSidebar';
import { BreadcrumbHeader } from './components/BreadcrumbHeader';

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
            <div className="flex h-full bg-zinc-950 overflow-hidden">
                <ConfiguracionSidebarZen studioSlug={slug} />
                <ZenSidebarOverlay />

                <main className="flex-1 p-2 sm:p-4 lg:ml-0 overflow-y-auto">
                    {/* Breadcrumb header dinámico */}
                    <BreadcrumbHeader />

                    {/* Separador */}
                    <div className="h-px bg-zinc-800 mb-6"></div>

                    <div className="mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ZenSidebarProvider>
    );
}
