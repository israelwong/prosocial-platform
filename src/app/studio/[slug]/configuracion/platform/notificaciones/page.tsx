import React from 'react';
import { ZenCard } from '@/components/ui/zen';

export default function NotificacionesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Notificaciones
                </h1>
                <p className="text-zinc-400">
                    Configura las notificaciones de tu estudio
                </p>
            </div>

            <ZenCard className="p-6">
                <div className="text-center py-8">
                    <div className="text-zinc-400 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4.828 17l2.586-2.586a2 2 0 012.828 0L12.828 17H4.828z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Configuración de Notificaciones
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        Configura las notificaciones de tu estudio
                    </p>
                    <div className="text-sm text-zinc-500">
                        Funcionalidad en desarrollo
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}