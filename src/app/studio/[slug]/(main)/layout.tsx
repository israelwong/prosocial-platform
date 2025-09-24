import React from 'react';
import { SimpleSidebar } from '@/app/studio/[slug]/components/SimpleSidebar';

// Este layout envuelve las páginas que SÍ tienen sidebar
export default function MainAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-1 h-full overflow-hidden">
            <SimpleSidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
