'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/ui/header-navigation';
import { MetodosPagoList } from './components/MetodosPagoList';
import { Plus } from 'lucide-react';

export default function MetodosPagoPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">
            {/* Header simplificado */}
            <HeaderNavigation
                title="Métodos de Pago"
                description="Gestiona los métodos de pago disponibles para tu negocio y configura las comisiones correspondientes"
                actionButton={{
                    label: 'Nuevo Método',
                    onClick: () => {
                        // Esta función se manejará en el componente MetodosPagoList
                        const event = new CustomEvent('openMetodoForm');
                        window.dispatchEvent(event);
                    },
                    icon: Plus
                }}
            />

            {/* Contenido principal */}
            <MetodosPagoList studioSlug={slug} />
        </div>
    );
}
