import React from 'react';
import { ConfiguracionSidebar } from './components';

// Este layout envuelve la página de configuración y sus sub-páginas
export default async function ConfigurationLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const { slug } = await params;

    return (
        <div className="flex h-full">
            <ConfiguracionSidebar studioSlug={slug} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
