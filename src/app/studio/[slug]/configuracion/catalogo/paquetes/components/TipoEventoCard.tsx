'use client';

import React from 'react';
import { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { ZenCard, ZenButton, ZenBadge } from '@/components/ui/zen';
import { PaqueteItem } from './PaqueteItem';

interface TipoEventoCardProps {
    tipoEvento: TipoEventoData;
    studioSlug: string;
}

export function TipoEventoCard({ tipoEvento, studioSlug }: TipoEventoCardProps) {
    const paquetesActivos = tipoEvento.paquetes?.filter((p) => p.status === 'active') || [];

    return (
        <ZenCard>
            {/* Header: Nombre del tipo de evento + Botón crear paquete */}
            <div className="flex items-center justify-between mb-6 p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">
                        {tipoEvento.nombre}
                    </h2>
                    <ZenBadge variant="secondary" className="text-xs">
                        {paquetesActivos.length} {paquetesActivos.length === 1 ? 'paquete' : 'paquetes'}
                    </ZenBadge>
                </div>

                <ZenButton
                    onClick={() => {
                        // TODO: Abrir modal para crear paquete
                        console.log('Crear paquete para:', tipoEvento.nombre);
                    }}
                    size="sm"
                >
                    Crear Paquete
                </ZenButton>
            </div>

            {/* Lista de paquetes o mensaje de vacío */}
            {paquetesActivos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-4 ">
                    <p className="text-zinc-500 text-sm py-6">
                        No hay paquetes asociados a este tipo de evento
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paquetesActivos.map((paquete) => (
                        <PaqueteItem
                            key={paquete.id}
                            paquete={paquete}
                            studioSlug={studioSlug}
                        />
                    ))}
                </div>
            )}
        </ZenCard>
    );
}

