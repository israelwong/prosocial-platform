'use client';

import React from 'react';
import { ZenHeader } from '@/components/ui/zen';

// Este es el layout raíz, común a TODAS las páginas del estudio
// Header global persistente en todas las páginas del studio
export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header global persistente */}
            <ZenHeader />
            {/* Contenido principal - altura restante después del header */}
            <div className="h-[calc(100vh-4rem)]">
                {children}
            </div>
        </div>
    );
}