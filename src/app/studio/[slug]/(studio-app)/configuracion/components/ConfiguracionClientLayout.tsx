'use client';

import React from 'react';
import { ZenSidebarProvider } from '@/components/ui/zen';

export function ConfiguracionClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ZenSidebarProvider>
            {children}
        </ZenSidebarProvider>
    );
}
