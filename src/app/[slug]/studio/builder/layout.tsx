import React from 'react';
import { ZenSidebarProvider } from '@/components/ui/zen/layout/ZenSidebar';
import { StudioBuilderSidebar } from './components/StudioBuilderSidebar';
import { AppHeader } from '../components/AppHeader';
import { Toaster } from 'sonner';

export default async function BuilderLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const { slug } = await params;

    return (
        <ZenSidebarProvider>
            <div className="flex h-screen overflow-hidden">
                <StudioBuilderSidebar studioSlug={slug} />
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <AppHeader studioSlug={slug} />
                        {/* Contenido principal - Ahora ocupa todo el ancho */}
                        <main className="flex-1 overflow-y-auto bg-zinc-900/40">
                            <div className="mx-auto max-w-7xl p-4 md:p-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" richColors />
        </ZenSidebarProvider>
    );
}
