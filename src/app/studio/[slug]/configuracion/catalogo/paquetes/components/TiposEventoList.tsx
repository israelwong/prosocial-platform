'use client';

import React from 'react';
import { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { TipoEventoCard } from './TipoEventoCard';
import { ZenCard, ZenCardContent } from '@/components/ui/zen';

interface TiposEventoListProps {
    tiposEvento: TipoEventoData[];
    studioSlug: string;
}

export function TiposEventoList({ tiposEvento, studioSlug }: TiposEventoListProps) {
    // Filtrar solo tipos activos
    const tiposActivos = tiposEvento.filter((tipo) => tipo.status === 'active');

    if (tiposActivos.length === 0) {
        return (
            <ZenCard>
                <ZenCardContent>
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="text-center space-y-3">
                            <h3 className="text-xl font-semibold text-zinc-300">
                                No hay tipos de evento configurados
                            </h3>
                            <p className="text-zinc-500 max-w-md">
                                Primero debes crear tipos de evento antes de poder crear paquetes
                            </p>
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        );
    }

    return (
        <div className="space-y-6">
            {tiposActivos.map((tipoEvento) => (
                <TipoEventoCard
                    key={tipoEvento.id}
                    tipoEvento={tipoEvento}
                    studioSlug={studioSlug}
                />
            ))}
        </div>
    );
}

