'use client';

import React from 'react';
import { ProfileHeader } from './ProfileHeader';

/**
 * ProfileHeaderExample - Ejemplo de uso del nuevo ProfileHeader
 * Muestra cómo implementar el header con transición fluida
 */
export function ProfileHeaderExample() {
    // Datos de ejemplo
    const studioData = {
        studio_name: 'Demo Studio',
        slogan: 'Capturamos tus momentos inolvidables',
        logo_url: '/path/to/logo.jpg' // o null para mostrar placeholder
    };

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header con transición automática */}
            <ProfileHeader
                data={studioData}
                activeSection="inicio"
                loading={false}
            />

            {/* Contenido de ejemplo para probar el scroll */}
            <div className="px-4 py-8 space-y-8">
                <div className="h-96 bg-zinc-900 rounded-lg p-6">
                    <h2 className="text-white text-xl font-semibold mb-4">Sección 1</h2>
                    <p className="text-zinc-400">
                        Este es contenido de ejemplo para probar el scroll y ver la transición del header.
                        Haz scroll hacia abajo para ver cómo el header se compacta automáticamente.
                    </p>
                </div>

                <div className="h-96 bg-zinc-900 rounded-lg p-6">
                    <h2 className="text-white text-xl font-semibold mb-4">Sección 2</h2>
                    <p className="text-zinc-400">
                        Continúa scrolleando para ver la transición fluida entre estados.
                        El header cambiará de centrado a horizontal automáticamente.
                    </p>
                </div>

                <div className="h-96 bg-zinc-900 rounded-lg p-6">
                    <h2 className="text-white text-xl font-semibold mb-4">Sección 3</h2>
                    <p className="text-zinc-400">
                        En el estado compacto, verás el logo, nombre y slogan alineados horizontalmente,
                        con la navegación mostrando solo iconos.
                    </p>
                </div>
            </div>
        </div>
    );
}
