'use client';

import React from 'react';
import {
    IdentidadPreview,
    ContactoPreview,
    HorariosPreview,
    RedesPreview,
    DefaultPreview
} from './previews';

interface SectionPreviewProps {
    section: string;
    studioSlug: string;
    data?: Record<string, unknown>;
}

export function SectionPreview({ section, studioSlug, data }: SectionPreviewProps) {
    switch (section) {
        case 'identidad':
            return <IdentidadPreview data={data} studioSlug={studioSlug} />;
        case 'contacto':
            return <ContactoPreview data={data} studioSlug={studioSlug} />;
        case 'horarios':
            return <HorariosPreview data={data} studioSlug={studioSlug} />;
        case 'redes':
            return <RedesPreview data={data} studioSlug={studioSlug} />;
        default:
            return <DefaultPreview data={data} studioSlug={studioSlug} />;
    }
}