'use client';

import React from 'react';
import { PaqueteData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { ZenButton } from '@/components/ui/zen';

interface PaqueteItemProps {
    paquete: PaqueteData;
    studioSlug: string;
}

export function PaqueteItem({ paquete, studioSlug }: PaqueteItemProps) {
    const precioFormateado = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(paquete.precio || 0);

    return (
        <div className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            {/* Nombre */}
            <div className="mb-3">
                <h3 className="text-base font-semibold text-white">
                    {paquete.nombre}
                </h3>
            </div>

            {/* Precio */}
            <div className="mb-4">
                <span className="text-lg font-bold text-emerald-400">
                    {precioFormateado}
                </span>
            </div>

            {/* Acciones (visibles al hover) */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZenButton
                    onClick={() => {
                        // TODO: Abrir modal de edición
                        console.log('Editar paquete:', paquete.id);
                    }}
                    variant="secondary"
                    size="sm"
                >
                    Editar
                </ZenButton>
                <ZenButton
                    onClick={() => {
                        // TODO: Confirmar eliminación
                        console.log('Eliminar paquete:', paquete.id);
                    }}
                    variant="destructive"
                    size="sm"
                >
                    Eliminar
                </ZenButton>
            </div>
        </div>
    );
}

