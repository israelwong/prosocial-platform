'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
    // SecuritySettings, 
    // SessionsHistory, 
    PasswordChangeForm
} from './components';
import { Shield } from 'lucide-react';

export default function SeguridadPage() {
    const params = useParams();
    const studioSlug = params.slug as string;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header de la página */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                <Shield className="h-8 w-8 text-blue-400" />
                                Seguridad de Cuenta
                            </h1>
                            <p className="text-zinc-400">
                                Gestiona la seguridad de tu cuenta, contraseñas y sesiones
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid de componentes de seguridad - 3 columnas con altura uniforme */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Columna 1: Cambiar Contraseña */}
                    <div className="flex flex-col">
                        <PasswordChangeForm studioSlug={studioSlug} />
                    </div>

                    {/* Columna 2: Configuraciones de Seguridad */}
                    {/* <div className="flex flex-col">
                        <SecuritySettings studioSlug={studioSlug} />
                    </div> */}

                    {/* Columna 3: Historial de Sesiones */}
                    {/* <div className="flex flex-col">
                        <SessionsHistory studioSlug={studioSlug} />
                    </div> */}
                </div>
            </div>
        </div>
    );
}
