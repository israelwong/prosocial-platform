'use client';

import React from 'react';
import { Navbar } from './components';

// Este es el layout raíz, común a TODAS las páginas del estudio
export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
            <Navbar />
            {children}
        </div>
    );
}