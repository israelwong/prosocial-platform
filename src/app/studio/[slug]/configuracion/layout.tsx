import React from 'react';
import { ConfiguracionSidebar } from './components';

// Este layout envuelve la página de configuración y sus sub-páginas
export default function ConfigurationLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    return (
        <div className="flex h-full">
            <ConfiguracionSidebar studioSlug={params.slug} />
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
