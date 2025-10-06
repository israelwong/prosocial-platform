'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MetodosPagoList } from './components/MetodosPagoList';

export default function MetodosPagoPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="space-y-6">
            {/* Contenido principal con ZEN Design System */}
            <MetodosPagoList studioSlug={slug} />
        </div>
    );
}
