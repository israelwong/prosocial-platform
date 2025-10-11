'use client';

import React from 'react';
import { MobilePreviewContainer } from './MobilePreviewContainer';
import { HeaderPreview } from './HeaderPreview';
import { NavbarPreview } from './NavbarPreview';
import { ContentPreviewSkeleton } from './ContentPreviewSkeleton';

interface DefaultPreviewProps {
    data?: any;
    studioSlug: string;
}

export function DefaultPreview({ data, studioSlug }: DefaultPreviewProps) {
    return (
        <MobilePreviewContainer footerText="Vista previa del perfil completo">
            {/* Header del perfil */}
            <HeaderPreview data={data} />

            {/* Navbar simulado */}
            <NavbarPreview />

            {/* Contenido simulado */}
            <ContentPreviewSkeleton />
        </MobilePreviewContainer>
    );
}
