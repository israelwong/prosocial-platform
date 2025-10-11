'use client';

import React from 'react';
import { MobilePreviewContainer } from './MobilePreviewContainer';
import { NavbarPreview } from './NavbarPreview';
import { ContentPreviewSkeleton } from './ContentPreviewSkeleton';

interface IdentidadPreviewProps {
    data?: Record<string, unknown>;
    loading?: boolean;
}

export function IdentidadPreview({ data, loading = false }: IdentidadPreviewProps) {
    return (
        <MobilePreviewContainer data={data} loading={loading}>
            {/* Navbar simulado - Sin indicador activo */}
            <NavbarPreview />

            {/* Contenido simulado */}
            <ContentPreviewSkeleton />
        </MobilePreviewContainer>
    );
}
