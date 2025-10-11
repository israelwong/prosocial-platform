'use client';

import React from 'react';
import {
    IdentidadPreview,
    ContactoPreview
} from './previews';

interface SectionPreviewProps {
    section: string;
    studioSlug: string;
    data?: Record<string, unknown>;
    loading?: boolean;
}

export function SectionPreview({ section, studioSlug, data, loading = false }: SectionPreviewProps) {
    switch (section) {
        case 'identidad':
            return <IdentidadPreview data={data} studioSlug={studioSlug} loading={loading} />;
        case 'contacto':
            return <ContactoPreview data={data} studioSlug={studioSlug} loading={loading} />;
        default:
            return <div className="w-full max-w-sm mx-auto p-4 text-center text-zinc-500">
                <p>Preview no disponible para la sección: {section}</p>
            </div>;
    }
}