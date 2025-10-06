import React from 'react';
import { ZenCard } from '@/components/ui/zen';

export default function PlatformPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Plataforma
                </h1>
                <p className="text-zinc-400">
                    Configuración general de la plataforma
                </p>
            </div>

            <ZenCard className="p-6">
                <div className="text-center py-8">
                    <div className="text-zinc-400 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Configuración de Plataforma
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        Configuración general de la plataforma
                    </p>
                    <div className="text-sm text-zinc-500">
                        Funcionalidad en desarrollo
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}