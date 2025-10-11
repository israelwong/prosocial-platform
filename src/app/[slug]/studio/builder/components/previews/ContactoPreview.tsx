'use client';

import React from 'react';
import { MobilePreviewContainer } from './MobilePreviewContainer';
import { NavbarPreview } from './NavbarPreview';
import { ContactoSectionPreview } from './ContactoSectionPreview';

interface ContactoPreviewProps {
    data?: Record<string, unknown>;
    loading?: boolean;
}

export function ContactoPreview({ data, loading = false }: ContactoPreviewProps) {
    return (
        <MobilePreviewContainer data={data} loading={loading}>
            {/* Navbar simulado */}
            <NavbarPreview activeSection="contacto" />

            {/* Sección de Contacto */}
            <ContactoSectionPreview data={data} />
        </MobilePreviewContainer>
    );
}