import React from 'react';
import { ZenSidebarProvider } from '@/components/ui/zen/layout/ZenSidebar';
import { DashboardSidebarZen } from '../components/DashboardSidebarZen';
import { AppHeader } from '../components/AppHeader';

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    return (
        <ZenSidebarProvider>
            <div className="flex h-screen bg-zinc-900/50 overflow-hidden">
                <DashboardSidebarZen studioSlug={params.slug} />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <AppHeader studioSlug={params.slug} />
                    <main className="flex-1 overflow-y-auto bg-zinc-900/50">
                        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ZenSidebarProvider>
    );
}
