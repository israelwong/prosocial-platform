'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaqueteData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { ZenButton } from '@/components/ui/zen';
import { eliminarPaquete } from '@/lib/actions/studio/negocio/paquetes.actions';
import { toast } from 'sonner';

interface PaqueteItemProps {
    paquete: PaqueteData;
    studioSlug: string;
}

export function PaqueteItem({ paquete, studioSlug }: PaqueteItemProps) {
    const router = useRouter();
    const [eliminando, setEliminando] = useState(false);

    const precioFormateado = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(paquete.precio || 0);

    const handleEditar = () => {
        router.push(`/${studioSlug}/configuracion/modules/manager/catalogo-servicios/paquetes/editar/${paquete.id}`);
    };

    const handleEliminar = async () => {
        if (eliminando) return;

        const confirmar = window.confirm(
            `¿Estás seguro de eliminar el paquete "${paquete.nombre}"? Esta acción no se puede deshacer.`
        );

        if (!confirmar) return;

        setEliminando(true);
        toast.loading('Eliminando paquete...');

        try {
            const result = await eliminarPaquete(studioSlug, paquete.id);

            if (result.success) {
                toast.dismiss();
                toast.success('Paquete eliminado correctamente');
                router.refresh();
            } else {
                toast.dismiss();
                toast.error(result.error || 'Error al eliminar el paquete');
            }
        } catch (error) {
            toast.dismiss();
            toast.error('Error inesperado al eliminar el paquete');
            console.error('Error eliminando paquete:', error);
        } finally {
            setEliminando(false);
        }
    };

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
                    onClick={handleEditar}
                    variant="secondary"
                    size="sm"
                >
                    Editar
                </ZenButton>
                <ZenButton
                    onClick={handleEliminar}
                    variant="destructive"
                    size="sm"
                    disabled={eliminando}
                >
                    {eliminando ? 'Eliminando...' : 'Eliminar'}
                </ZenButton>
            </div>
        </div>
    );
}

