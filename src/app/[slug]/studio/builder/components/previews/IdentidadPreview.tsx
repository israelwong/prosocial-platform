'use client';

import React from 'react';
import { MobilePreviewContainer } from './MobilePreviewContainer';
import { HeaderPreview } from './HeaderPreview';
import { NavbarPreview } from './NavbarPreview';
import { ContentPreviewSkeleton } from './ContentPreviewSkeleton';

interface IdentidadPreviewProps {
    data?: Record<string, unknown>;
    loading?: boolean;
    studioSlug?: string;
}

export function IdentidadPreview({ data, loading = false }: IdentidadPreviewProps) {
    return (
        <MobilePreviewContainer footerText="Vista previa del header - Sección Identidad">
            {/* Header del perfil - Sección Identidad */}
            <HeaderPreview data={data} loading={loading} />

            {/* Navbar simulado - Sin indicador activo */}
            <NavbarPreview />

            {/* Contenido simulado */}
            <ContentPreviewSkeleton />
        </MobilePreviewContainer>
    );
}
