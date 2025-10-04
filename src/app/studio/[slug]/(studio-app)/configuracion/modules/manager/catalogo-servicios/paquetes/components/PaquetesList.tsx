'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ZenCard, ZenCardContent, ZenButton, ZenBadge } from '@/components/ui/zen';
import { formatCurrency } from '@/lib/utils/pricing';
import { eliminarPaquete, duplicarPaquete } from '@/lib/actions/studio/manager/paquetes.actions';
import { Edit, Copy, Trash2, Eye } from 'lucide-react';

interface PaqueteData {
    id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    costo: number;
    gasto: number;
    utilidad: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    paquete_servicios: Array<{
        id: string;
        cantidad: number;
        servicios: {
            nombre: string;
        };
        servicio_categorias: {
            nombre: string;
        };
    }>;
    evento_tipos: {
        nombre: string;
    };
}

interface PaquetesListProps {
    paquetes: PaqueteData[];
    studioSlug: string;
}

export function PaquetesList({ paquetes, studioSlug }: PaquetesListProps) {
    const [eliminando, setEliminando] = useState<string | null>(null);
    const [duplicando, setDuplicando] = useState<string | null>(null);

    const handleEliminar = async (paqueteId: string, nombre: string) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar el paquete "${nombre}"?`)) {
            return;
        }

        setEliminando(paqueteId);
        const loadingToast = toast.loading('Eliminando paquete...');

        try {
            const result = await eliminarPaquete(paqueteId, studioSlug);
            toast.dismiss(loadingToast);

            if (result.success) {
                toast.success('Paquete eliminado exitosamente');
            } else {
                toast.error('Error al eliminar paquete', {
                    description: result.error
                });
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Error al eliminar paquete');
            console.error('Error eliminando paquete:', error);
        } finally {
            setEliminando(null);
        }
    };

    const handleDuplicar = async (paqueteId: string) => {
        setDuplicando(paqueteId);
        const loadingToast = toast.loading('Duplicando paquete...');

        try {
            const result = await duplicarPaquete(paqueteId, studioSlug);
            toast.dismiss(loadingToast);

            if (result.success) {
                toast.success('Paquete duplicado exitosamente');
            } else {
                toast.error('Error al duplicar paquete', {
                    description: result.error
                });
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Error al duplicar paquete');
            console.error('Error duplicando paquete:', error);
        } finally {
            setDuplicando(null);
        }
    };

    if (paquetes.length === 0) {
        return (
            <ZenCard>
                <ZenCardContent>
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="text-center space-y-3">
                            <h3 className="text-xl font-semibold text-zinc-300">
                                No hay paquetes creados
                            </h3>
                            <p className="text-zinc-500 max-w-md">
                                Crea tu primer paquete para comenzar a organizar tus servicios
                            </p>
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        );
    }

    return (
        <div className="space-y-4">
            {paquetes.map((paquete) => (
                <ZenCard key={paquete.id} className="hover:bg-zinc-800/50 transition-colors">
                    <ZenCardContent>
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-white">
                                            {paquete.nombre}
                                        </h3>
                                        <ZenBadge variant="secondary">
                                            {paquete.evento_tipos.nombre}
                                        </ZenBadge>
                                        <ZenBadge
                                            variant={paquete.status === 'active' ? 'default' : 'secondary'}
                                        >
                                            {paquete.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </ZenBadge>
                                    </div>

                                    {paquete.descripcion && (
                                        <p className="text-zinc-400 text-sm mb-3">
                                            {paquete.descripcion}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wide">Precio</div>
                                            <div className="text-lg font-semibold text-emerald-400">
                                                {formatCurrency(paquete.precio)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wide">Costo</div>
                                            <div className="text-lg font-semibold text-red-400">
                                                {formatCurrency(paquete.costo)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wide">Utilidad</div>
                                            <div className={`text-lg font-semibold ${paquete.utilidad > 0 ? 'text-emerald-400' : 'text-red-400'
                                                }`}>
                                                {formatCurrency(paquete.utilidad)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wide">Servicios</div>
                                            <div className="text-lg font-semibold text-zinc-300">
                                                {paquete.paquete_servicios.length}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-zinc-500">
                                        Creado: {new Date(paquete.createdAt).toLocaleDateString('es-ES')}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <Link href={`/studio/${studioSlug}/configuracion/modules/manager/catalogo-servicios/paquetes/editar/${paquete.id}`}>
                                        <ZenButton variant="secondary" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </ZenButton>
                                    </Link>

                                    <ZenButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleDuplicar(paquete.id)}
                                        disabled={duplicando === paquete.id}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </ZenButton>

                                    <ZenButton
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleEliminar(paquete.id, paquete.nombre)}
                                        disabled={eliminando === paquete.id}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </ZenButton>
                                </div>
                            </div>
                        </div>
                    </ZenCardContent>
                </ZenCard>
            ))}
        </div>
    );
}
