import React from 'react';
import { DashboardSidebarZen, ZenSidebarTrigger, ZenSidebarOverlay } from './components/DashboardSidebarZen';
import { ZenSidebarProvider } from '@/components/ui/zen/layout/ZenSidebar';

// Este layout envuelve las páginas del dashboard con ZEN Design System
export default async function MainAppLayout({
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
                <DashboardSidebarZen studioSlug={slug} />
                <ZenSidebarOverlay />

                <main className="flex-1 p-2 sm:p-4 lg:ml-0 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <ZenSidebarTrigger />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                            <p className="text-zinc-400">Herramientas del día a día</p>
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
