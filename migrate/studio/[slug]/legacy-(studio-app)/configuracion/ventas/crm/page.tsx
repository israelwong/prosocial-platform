import React from 'react';
import { ZenCard } from '@/components/ui/zen';

export default function CRMPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    CRM
                </h1>
                <p className="text-zinc-400">
                    Gestión de clientes y leads
                </p>
            </div>

            <ZenCard className="p-6">
                <div className="text-center py-8">
                    <div className="text-zinc-400 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-5.523-4.477-10-10-10S-3 12.477-3 18v2m20 0H7m0 0H2m5 0v-2c0-5.523 4.477-10 10-10s10 4.477 10 10v2M7 20H2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Gestión de CRM
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        Gestiona tus clientes y leads
                    </p>
                    <div className="text-sm text-zinc-500">
                        Funcionalidad en desarrollo
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}
