'use client';

import React from 'react';
import { MobilePreviewContainer } from './MobilePreviewContainer';
import { HeaderPreview } from './HeaderPreview';
import { NavbarPreview } from './NavbarPreview';
import { ContentPreviewSkeleton } from './ContentPreviewSkeleton';

interface IdentidadPreviewProps {
    data?: any;
    studioSlug: string;
}

export function IdentidadPreview({ data, studioSlug }: IdentidadPreviewProps) {
    return (
        <MobilePreviewContainer footerText="Vista previa del header - Sección Identidad">
            {/* Header del perfil - Sección Identidad */}
            <HeaderPreview data={data} />

            {/* Navbar simulado */}
            <NavbarPreview activeSection="inicio" />

            {/* Contenido simulado */}
            <ContentPreviewSkeleton />
        </MobilePreviewContainer>
    );
}
