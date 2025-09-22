'use client';

import React from 'react';
import { Navbar, Sidebar } from './components';

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Navbar Superior */}
            <Navbar />

            <div className="flex">
                {/* Sidebar Lateral */}
                <Sidebar />

                {/* Contenido Principal */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}