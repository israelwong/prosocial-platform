'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PaquetesList } from './PaquetesList';
import { obtenerPaquetes } from '@/lib/actions/studio/builder/catalogo/paquetes.actions';
import type { PaqueteFromDB } from '@/lib/actions/schemas/paquete-schemas';

interface PaquetesTabProps {
    studioSlug: string;
}

export function PaquetesTab({ studioSlug }: PaquetesTabProps) {
    const [loading, setLoading] = useState(true);
    const [paquetes, setPaquetes] = useState<PaqueteFromDB[]>([]);

    useEffect(() => {
        cargarPaquetes();
    }, [studioSlug]);

    const cargarPaquetes = async () => {
        try {
            setLoading(true);
            const result = await obtenerPaquetes(studioSlug);

            if (result.success && result.data) {
                setPaquetes(result.data);
            } else {
                toast.error(result.error || 'Error al cargar paquetes');
            }
        } catch (error) {
            console.error('Error cargando paquetes:', error);
            toast.error('Error al cargar paquetes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
                            <div className="h-5 bg-zinc-700 rounded w-3/4"></div>
                            <div className="h-8 bg-zinc-700 rounded w-1/2"></div>
                            <div className="h-10 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <PaquetesList
            studioSlug={studioSlug}
            initialPaquetes={paquetes}
            onPaquetesChange={setPaquetes}
        />
    );
}
