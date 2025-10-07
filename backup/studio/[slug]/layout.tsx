'use client';

import React from 'react';

// Este es el layout raíz más externo para cualquier ruta de [slug]
// No aplica estilos globales para permitir layouts anidados full-width o centrados.
export default function StudioRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
        </div>
    );
}