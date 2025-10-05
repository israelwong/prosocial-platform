import React from 'react';
import { ZenCard } from '@/components/ui/zen';

export default function ReglasContratacionPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Reglas de Contratación
                </h1>
                <p className="text-zinc-400">
                    Configura reglas como pago de contado 10% descuento, o 10% anticipo
                </p>
            </div>

            <ZenCard className="p-6">
                <div className="text-center py-8">
                    <div className="text-zinc-400 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Gestión de Reglas de Contratación
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        Define reglas como descuentos por pago de contado, anticipos, etc.
                    </p>
                    <div className="text-sm text-zinc-500">
                        Funcionalidad en desarrollo
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}
