'use client';

import React from 'react';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ZenCard,
    ZenCardContent,
    ZenCardTitle,
    ZenBadge,
    ZenButton,
} from '@/components/ui/zen';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { eliminarTipoEvento, actualizarOrdenTiposEvento, actualizarTipoEvento } from '@/lib/actions/studio/negocio/tipos-evento.actions';
import type { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/shadcn/switch';

interface TiposEventoListProps {
    tiposEvento: TipoEventoData[];
    onEdit: (tipo: TipoEventoData) => void;
    onTiposChange: (tipos: TipoEventoData[]) => void;
    studioSlug: string;
}

// Componente para cada item sortable
function SortableTipoEventoItem({
    tipo,
    onEdit,
    onDelete,
    onStatusChange
}: {
    tipo: TipoEventoData;
    onEdit: (tipo: TipoEventoData) => void;
    onDelete: (tipo: TipoEventoData) => void;
    onStatusChange: (tipo: TipoEventoData, newStatus: 'active' | 'inactive') => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tipo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative">
            <ZenCard className="mb-3 bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <ZenCardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                {...attributes}
                                {...listeners}
                                className="p-1 hover:bg-zinc-800 rounded cursor-grab active:cursor-grabbing"
                            >
                                <GripVertical className="h-4 w-4 text-zinc-500" />
                            </button>
                            <div>
                                <ZenCardTitle className="text-white text-lg">
                                    {tipo.nombre}
                                </ZenCardTitle>
                                <div className="flex items-center gap-2 mt-1">

                                    <ZenBadge variant="outline" className="text-xs">
                                        {tipo.paquetes?.length || 0} paquete{(tipo.paquetes?.length || 0) !== 1 ? 's' : ''}
                                    </ZenBadge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400">Activo</span>
                                <Switch
                                    checked={tipo.status === 'active'}
                                    onCheckedChange={(checked) =>
                                        onStatusChange(tipo, checked ? 'active' : 'inactive')
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <ZenButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(tipo)}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    <Edit className="h-4 w-4" />
                                </ZenButton>
                                <ZenButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDelete(tipo)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </ZenButton>
                            </div>
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}

export function TiposEventoList({
    tiposEvento,
    onEdit,
    onTiposChange,
    studioSlug,
}: TiposEventoListProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [tipoToDelete, setTipoToDelete] = React.useState<TipoEventoData | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = tiposEvento.findIndex((tipo) => tipo.id === active.id);
            const newIndex = tiposEvento.findIndex((tipo) => tipo.id === over.id);

            const newTipos = arrayMove(tiposEvento, oldIndex, newIndex);

            // Actualizar la UI inmediatamente para mejor UX
            onTiposChange(newTipos);

            // Actualizar el orden en la base de datos en segundo plano
            try {
                const ordenData = newTipos.map((tipo, index) => ({
                    id: tipo.id,
                    orden: index,
                }));

                await actualizarOrdenTiposEvento(studioSlug, { tipos: ordenData });
                toast.success('Orden actualizado correctamente');
            } catch (error) {
                console.error('Error actualizando orden:', error);
                toast.error('Error al actualizar el orden');
                // Revertir cambios en la UI si la actualización falló
                onTiposChange(tiposEvento);
            }
        }
    };

    const handleDelete = (tipo: TipoEventoData) => {
        setTipoToDelete(tipo);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!tipoToDelete) return;

        setIsDeleting(true);
        try {
            const result = await eliminarTipoEvento(tipoToDelete.id);
            if (result.success) {
                onTiposChange(tiposEvento.filter(t => t.id !== tipoToDelete.id));
                setIsDeleteModalOpen(false);
                setTipoToDelete(null);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error eliminando tipo de evento:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTipoToDelete(null);
    };

    const handleStatusChange = async (tipo: TipoEventoData, newStatus: 'active' | 'inactive') => {
        try {
            const result = await actualizarTipoEvento(tipo.id, {
                status: newStatus,
            });

            if (result.success && result.data) {
                // Actualizar el tipo en la lista
                onTiposChange(
                    tiposEvento.map(t =>
                        t.id === tipo.id
                            ? { ...t, status: newStatus }
                            : t
                    )
                );
                toast.success(`Tipo de evento ${newStatus === 'active' ? 'activado' : 'desactivado'} correctamente`);
            } else {
                toast.error(result.error || 'Error al actualizar el estado');
            }
        } catch (error) {
            console.error('Error actualizando estado:', error);
            toast.error('Error al actualizar el estado');
        }
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tiposEvento.map(tipo => tipo.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {tiposEvento.map((tipo) => (
                            <SortableTipoEventoItem
                                key={tipo.id}
                                tipo={tipo}
                                onEdit={onEdit}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Eliminar Tipo de Evento"
                message="¿Estás seguro de que quieres eliminar este tipo de evento? Esta acción no se puede deshacer."
                itemName={tipoToDelete?.nombre}
                loading={isDeleting}
            />
        </>
    );
}
