import React from 'react';
import { CurrentPlanCard, BillingHistoryCard } from './components';
import { obtenerDatosSuscripcion } from '@/lib/actions/studio/config/suscripcion/suscripcion.actions';

interface SuscripcionPageProps {
    params: {
        slug: string;
    };
}

export default async function SuscripcionPage({ params }: SuscripcionPageProps) {
    const { slug } = await params;
    
    // Obtener datos de suscripción
    const result = await obtenerDatosSuscripcion(slug);
    
    if (!result.success || !result.data) {
        return (
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Suscripción</h1>
                    <p className="text-zinc-400">
                        Gestiona tu plan de suscripción y facturación
                    </p>
                </div>

                {/* Error State */}
                <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 text-red-400">⚠️</div>
                        <div>
                            <h3 className="text-red-300 font-medium">Error al cargar suscripción</h3>
                            <p className="text-red-400 text-sm mt-1">{result.error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Suscripción</h1>
                <p className="text-zinc-400">
                    Gestiona tu plan de suscripción y facturación
                </p>
            </div>

            {/* Layout de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna 1: Plan actual */}
                <div className="space-y-6">
                    <CurrentPlanCard data={result.data} studioSlug={slug} />
                </div>

                {/* Columna 2: Historial de facturación */}
                <div className="space-y-6">
                    <BillingHistoryCard data={result.data} />
                </div>
            </div>
        </div>
    );
}
