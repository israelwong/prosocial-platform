'use client';

import React, { useState, useCallback } from 'react';
import { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { ZenCard, ZenCardContent, ZenButton, ZenBadge } from '@/components/ui/zen';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/shadcn/dialog';
import { formatCurrency } from '@/lib/utils/pricing';
import { eliminarPaquete, duplicarPaquete, actualizarPosicionPaquete } from '@/lib/actions/studio/manager/paquetes.actions';
import { toast } from 'sonner';
import { Plus, Edit, Copy, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Componente para zona de drop vacía
interface EmptyTipoEventoDropZoneProps {
    tipoEvento: TipoEventoData;
}

function EmptyTipoEventoDropZone({ tipoEvento }: EmptyTipoEventoDropZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `tipo-evento-${tipoEvento.id}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={`text-center py-8 min-h-[100px] flex items-center justify-center border-2 border-dashed rounded-lg m-4 transition-colors ${isOver
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-zinc-700 bg-zinc-800/30'
                }`}
        >
            <div className="text-center">
                <div className="text-zinc-500 mb-2">
                    <Plus className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-zinc-400">
                    {isOver
                        ? 'Suelta aquí para agregar a este tipo de evento'
                        : 'Arrastra paquetes aquí para agregarlos a este tipo de evento'
                    }
                </p>
            </div>
        </div>
    );
}

// Componente para paquete arrastrable
interface SortablePaqueteItemProps {
    paquete: PaqueteData;
    studioSlug: string;
    onDuplicate: (paqueteId: string) => void;
    onDelete: (paqueteId: string, nombre: string) => void;
    isDeleting: boolean;
    isDuplicating: boolean;
}

function SortablePaqueteItem({
    paquete,
    studioSlug,
    onDuplicate,
    onDelete,
    isDeleting,
    isDuplicating
}: SortablePaqueteItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: paquete.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors ${isDragging ? 'shadow-lg border-zinc-600' : ''
                }`}
        >
            <div className="flex items-center gap-3 flex-1">
                {/* Handle de arrastre */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab hover:cursor-grabbing p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <GripVertical className="w-4 h-4" />
                </div>

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
                    <Link href={`/studio/${studioSlug}/configuracion/comercial/catalogo-servicios/paquetes/editar/${paquete.id}`}>
                        <ZenButton variant="secondary" size="sm">
                            <Edit className="w-4 h-4" />
                        </ZenButton>
                    </Link>

                    <ZenButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onDuplicate(paquete.id)}
                        disabled={isDuplicating}
                    >
                        <Copy className="w-4 h-4" />
                    </ZenButton>

                    <ZenButton
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(paquete.id, paquete.nombre)}
                        disabled={isDeleting}
                    >
                        <Trash2 className="w-4 h-4" />
                    </ZenButton>
                </div>
            </div>
        </div>
    );
}

export function TiposEventoList({ tiposEvento, studioSlug, paquetes = [] }: TiposEventoListProps) {
    const [eliminando, setEliminando] = useState<string | null>(null);
    const [duplicando, setDuplicando] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paqueteToDelete, setPaqueteToDelete] = useState<{ id: string; nombre: string } | null>(null);
    const [localPaquetes, setLocalPaquetes] = useState<PaqueteData[]>(paquetes);

    // Configurar sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Evita activación accidental
            },
        })
    );

    // Debug: verificar datos
    console.log('TiposEventoList - tiposEvento:', tiposEvento);
    console.log('TiposEventoList - paquetes:', paquetes);

    // Filtrar solo tipos activos
    const tiposActivos = tiposEvento.filter((tipo) => tipo.status === 'active');

    // Sincronizar paquetes locales con props
    React.useEffect(() => {
        setLocalPaquetes(paquetes);
    }, [paquetes]);

    // Agrupar paquetes por tipo de evento
    const paquetesPorTipo = tiposActivos.map(tipoEvento => {
        const paquetesDelTipo = localPaquetes.filter(paquete => paquete.evento_tipos.nombre === tipoEvento.nombre);
        console.log(`Tipo: ${tipoEvento.nombre}, Paquetes encontrados:`, paquetesDelTipo);
        return {
            tipoEvento,
            paquetes: paquetesDelTipo
        };
    });

    // Manejar drag & drop
    const handleDragEnd = useCallback(
        async (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over || !active) return;

            const activeId = String(active.id);
            const overId = String(over.id);

            if (activeId === overId) return;

            const paqueteActivo = localPaquetes.find(p => p.id === activeId);
            if (!paqueteActivo) return;

            console.log('🔍 Debug drag end:', {
                activeId,
                overId,
                paqueteActivo: paqueteActivo.nombre,
            });

            // Verificar si se está arrastrando a un tipo de evento vacío
            const isDroppingOnEmptyTipoEvento = overId.startsWith('tipo-evento-');
            let eventoTipoDestino: string | undefined;
            let paqueteDestino: PaqueteData | null = null;

            if (isDroppingOnEmptyTipoEvento) {
                // Extraer el ID del tipo de evento del ID del drop zone
                eventoTipoDestino = overId.replace('tipo-evento-', '');
            } else {
                // Se está soltando sobre otro paquete
                paqueteDestino = localPaquetes.find(p => p.id === overId) || null;
                if (!paqueteDestino) return;

                // Obtener el tipo de evento del paquete destino
                const eventoTipoDestinoNombre = paqueteDestino.evento_tipos.nombre;
                const tipoEventoDestino = tiposActivos.find(t => t.nombre === eventoTipoDestinoNombre);
                if (tipoEventoDestino) {
                    eventoTipoDestino = tipoEventoDestino.id;
                }
            }

            if (!eventoTipoDestino) return;

            // Determinar si es reordenamiento dentro del mismo tipo de evento
            const eventoTipoActivoNombre = paqueteActivo.evento_tipos.nombre;
            const eventoTipoActivo = tiposActivos.find(t => t.nombre === eventoTipoActivoNombre);
            const isReordering = eventoTipoActivo?.id === eventoTipoDestino;

            let newIndex = 0;

            if (isReordering) {
                // Reordenamiento dentro del mismo tipo de evento
                const paquetesDelTipo = localPaquetes.filter(p => p.evento_tipos.nombre === eventoTipoActivoNombre);
                const activeIndex = paquetesDelTipo.findIndex(p => p.id === activeId);
                const overIndex = paquetesDelTipo.findIndex(p => p.id === overId);

                if (activeIndex === -1 || overIndex === -1) return;
                newIndex = overIndex;
            } else {
                // Movimiento entre tipos de evento
                const eventoTipoDestinoNombre = tiposActivos.find(t => t.id === eventoTipoDestino)?.nombre;
                if (!eventoTipoDestinoNombre) return;

                const paquetesDelTipoDestino = localPaquetes.filter(p => p.evento_tipos.nombre === eventoTipoDestinoNombre);

                if (isDroppingOnEmptyTipoEvento) {
                    // Si se suelta en un tipo de evento vacío, insertar al final
                    newIndex = paquetesDelTipoDestino.length;
                } else {
                    // Si se suelta sobre un paquete, insertar en su posición
                    const overIndex = paquetesDelTipoDestino.findIndex(p => p.id === overId);
                    newIndex = overIndex === -1 ? paquetesDelTipoDestino.length : overIndex;
                }
            }

            console.log('📁 Movimiento:', {
                isReordering,
                fromTipoEvento: eventoTipoActivoNombre,
                toTipoEvento: tiposActivos.find(t => t.id === eventoTipoDestino)?.nombre,
                newIndex,
            });

            // Guardar estado original para revertir en caso de error
            const originalPaquetes = [...localPaquetes];

            // Actualizar estado local inmediatamente (optimistic update)
            setLocalPaquetes((currentPaquetes) => {
                const newPaquetes = [...currentPaquetes];

                // Remover el paquete de su posición actual
                const activeIndex = newPaquetes.findIndex(p => p.id === activeId);
                if (activeIndex === -1) return currentPaquetes;

                const [movedPaquete] = newPaquetes.splice(activeIndex, 1);

                // Actualizar el tipo de evento del paquete movido
                const nuevoTipoEvento = tiposActivos.find(t => t.id === eventoTipoDestino);
                if (nuevoTipoEvento) {
                    movedPaquete.evento_tipos = {
                        nombre: nuevoTipoEvento.nombre
                    };
                }

                // Encontrar la nueva posición de inserción
                const eventoTipoDestinoNombre = nuevoTipoEvento?.nombre;
                if (!eventoTipoDestinoNombre) return currentPaquetes;

                const targetTipoEventoPaquetes = newPaquetes.filter(p => p.evento_tipos.nombre === eventoTipoDestinoNombre);
                const insertIndex = Math.min(newIndex, targetTipoEventoPaquetes.length);

                // Insertar en la nueva posición
                newPaquetes.splice(insertIndex, 0, movedPaquete);

                return newPaquetes;
            });

            try {
                // Actualizar en el backend
                const result = await actualizarPosicionPaquete(
                    activeId,
                    studioSlug,
                    newIndex,
                    eventoTipoDestino
                );

                if (result.success) {
                    toast.success(
                        isReordering
                            ? 'Orden actualizado exitosamente'
                            : 'Paquete movido exitosamente'
                    );
                } else {
                    toast.error(result.error || 'Error al actualizar el orden');
                    setLocalPaquetes(originalPaquetes);
                }
            } catch (error) {
                console.error('Error updating position:', error);
                toast.error('Error al actualizar la posición');
                setLocalPaquetes(originalPaquetes);
            }
        },
        [localPaquetes, studioSlug, tiposActivos]
    );

    const handleEliminar = (paqueteId: string, nombre: string) => {
        setPaqueteToDelete({ id: paqueteId, nombre });
        setShowDeleteModal(true);
    };

    const confirmEliminar = async () => {
        if (!paqueteToDelete) return;

        setEliminando(paqueteToDelete.id);
        setShowDeleteModal(false);
        const loadingToast = toast.loading('Eliminando paquete...');

        try {
            const result = await eliminarPaquete(paqueteToDelete.id, studioSlug);
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
            setPaqueteToDelete(null);
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
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
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
                                        <Link href={`/studio/${studioSlug}/configuracion/comercial/catalogo-servicios/paquetes/crear/${tipoEvento.id}`}>
                                            <ZenButton size="sm">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Crear Paquete
                                            </ZenButton>
                                        </Link>
                                    </div>

                                    {/* Lista de paquetes con drag & drop */}
                                    {paquetes.length === 0 ? (
                                        <EmptyTipoEventoDropZone tipoEvento={tipoEvento} />
                                    ) : (
                                        <SortableContext
                                            items={paquetes.map(p => p.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-3">
                                                {paquetes.map((paquete) => (
                                                    <SortablePaqueteItem
                                                        key={paquete.id}
                                                        paquete={paquete}
                                                        studioSlug={studioSlug}
                                                        onDuplicate={handleDuplicar}
                                                        onDelete={handleEliminar}
                                                        isDeleting={eliminando === paquete.id}
                                                        isDuplicating={duplicando === paquete.id}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    )}
                                </div>
                            </ZenCardContent>
                        </ZenCard>
                    ))}
                </div>
            </DndContext>

            {/* Modal de confirmación de eliminación */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="bg-zinc-900 border-zinc-700">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Eliminar Paquete</h3>
                                <p className="text-sm text-zinc-400">Esta acción no se puede deshacer</p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="text-zinc-300">
                        ¿Estás seguro de que quieres eliminar el paquete{' '}
                        <span className="font-semibold text-white">&ldquo;{paqueteToDelete?.nombre}&rdquo;</span>?
                        <br />
                        <br />
                        Esta acción eliminará permanentemente el paquete y todos sus servicios asociados.
                    </DialogDescription>

                    <DialogFooter className="gap-3">
                        <ZenButton
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancelar
                        </ZenButton>
                        <ZenButton
                            variant="destructive"
                            onClick={confirmEliminar}
                            disabled={eliminando === paqueteToDelete?.id}
                        >
                            {eliminando === paqueteToDelete?.id ? 'Eliminando...' : 'Eliminar Paquete'}
                        </ZenButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

