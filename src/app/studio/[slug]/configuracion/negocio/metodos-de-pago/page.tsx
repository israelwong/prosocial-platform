'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MetodosPagoList } from './components/MetodosPagoList';

export default function MetodosPagoPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
            <MetodosPagoList studioSlug={slug} />
        </div>
    );
}
