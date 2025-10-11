'use client';

import React from 'react';
import { MobilePreviewContainer } from './MobilePreviewContainer';
import { HeaderPreview } from './HeaderPreview';
import { NavbarPreview } from './NavbarPreview';
import { ContactoSectionPreview } from './ContactoSectionPreview';

interface ContactoPreviewProps {
    data?: Record<string, unknown>;
    loading?: boolean;
    studioSlug?: string;
}

export function ContactoPreview({ data, loading = false }: ContactoPreviewProps) {
    return (
        <MobilePreviewContainer footerText="Vista previa del contacto - Sección Contacto">
            {/* Header del perfil */}
            <HeaderPreview data={data} loading={loading} />

            {/* Navbar simulado */}
            <NavbarPreview activeSection="contacto" />

            {/* Sección de Contacto */}
            <ContactoSectionPreview data={data} />

        </MobilePreviewContainer>
    );
}