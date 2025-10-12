'use client';

import React from 'react';
import { MobilePreviewContainer } from './MobilePreviewContainer';
// ProfileNavigation and ProfileContent are now handled by MobilePreviewContainer

interface SectionPreviewProps {
    section: string;
    studioSlug: string;
    data?: Record<string, unknown>;
    loading?: boolean;
}

// Componente IdentidadPreview integrado
function IdentidadPreview({ data, loading = false }: { data?: Record<string, unknown>; loading?: boolean }) {
    return (
        <MobilePreviewContainer
            data={data}
            loading={loading}
            showNavbar={false}
            showContent={true}
            contentVariant="skeleton"
        />
    );
}

// Componente ContactoPreview integrado
function ContactoPreview({ data, loading = false }: { data?: Record<string, unknown>; loading?: boolean }) {
    return (
        <MobilePreviewContainer
            data={data}
            loading={loading}
            showNavbar={true}
            showContent={true}
            activeTab="contacto"
            contentVariant="info"
        />
    );
}

export function SectionPreview({ section, studioSlug, data, loading = false }: SectionPreviewProps) {
    // studioSlug is available for future use if needed
    console.log('SectionPreview for studio:', studioSlug);

    switch (section) {
        case 'identidad':
            return <IdentidadPreview data={data} loading={loading} />;
        case 'contacto':
            return <ContactoPreview data={data} loading={loading} />;
        default:
            return <div className="w-full max-w-sm mx-auto p-4 text-center text-zinc-500">
                <p>Preview no disponible para la sección: {section}</p>
            </div>;
    }
}