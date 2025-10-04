'use client';

import React, { useState } from 'react';
import { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { ZenCard, ZenCardContent, ZenButton, ZenBadge } from '@/components/ui/zen';
import { formatCurrency } from '@/lib/utils/pricing';
import { eliminarPaquete, duplicarPaquete } from '@/lib/actions/studio/manager/paquetes.actions';
import { toast } from 'sonner';
import { Plus, Edit, Copy, Trash2 } from 'lucide-react';
import Link from 'next/link';

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

interface TiposEventoListProps {
    tiposEvento: TipoEventoData[];
    studioSlug: string;
    paquetes?: PaqueteData[];
}

export function TiposEventoList({ tiposEvento, studioSlug, paquetes = [] }: TiposEventoListProps) {
    const [eliminando, setEliminando] = useState<string | null>(null);
    const [duplicando, setDuplicando] = useState<string | null>(null);

    // Debug: verificar datos
    console.log('TiposEventoList - tiposEvento:', tiposEvento);
    console.log('TiposEventoList - paquetes:', paquetes);

    // Filtrar solo tipos activos
    const tiposActivos = tiposEvento.filter((tipo) => tipo.status === 'active');

    // Agrupar paquetes por tipo de evento
    const paquetesPorTipo = tiposActivos.map(tipoEvento => {
        const paquetesDelTipo = paquetes.filter(paquete => paquete.evento_tipos.nombre === tipoEvento.nombre);
        console.log(`Tipo: ${tipoEvento.nombre}, Paquetes encontrados:`, paquetesDelTipo);
        return {
            tipoEvento,
            paquetes: paquetesDelTipo
        };
    });

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
            {paquetesPorTipo.map(({ tipoEvento, paquetes }) => (
                <ZenCard key={tipoEvento.id} className="border border-zinc-800/50">
                    <ZenCardContent>
                        <div className="p-6">
                            {/* Header del tipo de evento */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold text-white">
                                        {tipoEvento.nombre}
                                    </h3>
                                    <ZenBadge variant="secondary">
                                        {paquetes.length} paquete{paquetes.length !== 1 ? 's' : ''}
                                    </ZenBadge>
                                </div>
                                <Link href={`/studio/${studioSlug}/configuracion/modules/manager/catalogo-servicios/paquetes/crear/${tipoEvento.id}`}>
                                    <ZenButton size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Paquete
                                    </ZenButton>
                                </Link>
                            </div>

                            {/* Lista de paquetes */}
                            {paquetes.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500">
                                    <p>No hay paquetes creados para este tipo de evento</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {paquetes.map((paquete) => (
                                        <div
                                            key={paquete.id}
                                            className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-white">
                                                            {paquete.nombre}
                                                        </h4>
                                                        {paquete.descripcion && (
                                                            <p className="text-sm text-zinc-400 mt-1">
                                                                {paquete.descripcion}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-6 text-sm">
                                                        <div className="text-center">
                                                            <div className="text-zinc-500 text-xs">Precio</div>
                                                            <div className="font-semibold text-emerald-400">
                                                                {formatCurrency(paquete.precio)}
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-zinc-500 text-xs">Utilidad</div>
                                                            <div className={`font-semibold ${paquete.utilidad > 0 ? 'text-emerald-400' : 'text-red-400'
                                                                }`}>
                                                                {formatCurrency(paquete.utilidad)}
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-zinc-500 text-xs">Servicios</div>
                                                            <div className="font-semibold text-zinc-300">
                                                                {paquete.paquete_servicios.length}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Acciones */}
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </ZenCardContent>
                </ZenCard>
            ))}
        </div>
    );
}

