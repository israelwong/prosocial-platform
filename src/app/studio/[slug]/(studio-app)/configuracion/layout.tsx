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
    const { slug } = await params;
    return (
        <ZenSidebarProvider>
            <div className="flex h-screen overflow-hidden">
                <ConfiguracionSidebarZenV2 studioSlug={slug} />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <AppHeader studioSlug={slug} />
                    <main className="flex-1 overflow-y-auto bg-zinc-900/40">
                        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ZenSidebarProvider>
    );
}
