'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ReglasAgendamientoList } from './components/ReglasAgendamientoList';

export default function ReglasAgendamientoPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="space-y-6">
            {/* Contenido principal con ZEN Design System */}
            <ReglasAgendamientoList studioSlug={slug} />
        </div>
    );
}
