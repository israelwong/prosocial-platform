'use client';

import { ConfiguracionSidebarZen, ZenSidebarTrigger, ZenSidebarOverlay } from './components/ConfiguracionSidebarZen';

interface ConfiguracionLayoutZenProps {
    children: React.ReactNode;
}

export default function ConfiguracionLayoutZen({ children }: ConfiguracionLayoutZenProps) {
    return (
        <div className="flex min-h-screen bg-zinc-950">
            <ConfiguracionSidebarZen />
            <ZenSidebarOverlay />

            <main className="flex-1 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <ZenSidebarTrigger />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Configuración</h1>
                        <p className="text-zinc-400">Gestiona la configuración de tu estudio</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
