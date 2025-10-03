import React from 'react';
import { ConfiguracionSidebarZenV2 } from './components/ConfiguracionSidebarZenV2';
import { AppHeader } from '../components/AppHeader';
import { ZenSidebarProvider } from '@/components/ui/zen';

export default async function ConfiguracionLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    return (
        <ZenSidebarProvider>
            <div className="flex h-screen bg-zinc-900/50 overflow-hidden">
                <ConfiguracionSidebarZenV2 studioSlug={params.slug} />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <AppHeader studioSlug={params.slug} />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ZenSidebarProvider>
    );
}
