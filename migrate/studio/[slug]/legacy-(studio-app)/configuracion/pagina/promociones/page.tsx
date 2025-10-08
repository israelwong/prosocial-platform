import React from 'react';
import { ZenCard } from '@/components/ui/zen';

export default function PromocionesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Promociones
                </h1>
                <p className="text-zinc-400">
                    Gestiona tus promociones y ofertas
                </p>
            </div>

            <ZenCard className="p-6">
                <div className="text-center py-8">
                    <div className="text-zinc-400 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Gestión de Promociones
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        Gestiona tus promociones y ofertas
                    </p>
                    <div className="text-sm text-zinc-500">
                        Funcionalidad en desarrollo
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}
