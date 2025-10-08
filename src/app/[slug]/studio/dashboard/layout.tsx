import React from 'react';
import { ZenSidebarProvider } from '@/components/ui/zen/layout/ZenSidebar';
import { DashboardSidebarZen } from './components/DashboardSidebarZen';
import { AppHeader } from '../components/AppHeader';

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const { slug } = await params;
    console.log('🔍 DashboardLayout - slug recibido:', slug);
    console.log('🔍 DashboardLayout - URL completa:', typeof window !== 'undefined' ? window.location.href : 'Server side');

    return (
        <ZenSidebarProvider>
            <div className="flex h-screen overflow-hidden">
                <DashboardSidebarZen studioSlug={slug} />
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <AppHeader studioSlug={slug} />
                        <main className="flex-1 overflow-y-auto bg-zinc-900/40">
                            <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </ZenSidebarProvider>
    );
}
