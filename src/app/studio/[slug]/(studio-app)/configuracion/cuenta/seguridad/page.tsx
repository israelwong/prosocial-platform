import React from 'react';
import { PasswordChangeForm, SecuritySettings } from './components';

interface SeguridadPageProps {
    params: {
        slug: string;
    };
}

export default async function SeguridadPage({ params }: SeguridadPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Seguridad</h1>
                <p className="text-zinc-400">
                    Gestiona tu contraseña, configuraciones de seguridad y sesiones
                </p>
            </div>

            {/* Layout de 2 columnas con altura igual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-stretch">
                {/* Columna 1: Cambio de contraseña */}
                <div className="flex flex-col h-full">
                    <PasswordChangeForm studioSlug={slug} />
                </div>

                {/* Columna 2: Configuraciones de seguridad */}
                <div className="flex flex-col h-full">
                    <SecuritySettings studioSlug={slug} />
                </div>
            </div>

            {/* Información adicional */}
            {/* <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="text-white font-medium mb-2">Próximas funcionalidades</h3>
                        <p className="text-zinc-400 text-sm mb-3">
                            En futuras actualizaciones agregaremos autenticación de dos factores (2FA),
                            historial detallado de accesos y notificaciones de seguridad avanzadas.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">2FA con TOTP</span>
                            <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">Historial de accesos</span>
                            <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">Notificaciones avanzadas</span>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
