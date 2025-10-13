'use client';

import React, { useState } from 'react';
import { ZenButton, ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Phone, Plus, GripVertical, Edit3, Trash2 } from 'lucide-react';
import { Telefono } from '../types';
import { TelefonoModal } from './TelefonoModal';
import { toast } from 'sonner';
import { crearTelefono, actualizarTelefono, eliminarTelefono } from '@/lib/actions/studio/config/contacto';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TelefonosSectionProps {
    telefonos: Telefono[];
    onLocalUpdate: (data: Partial<{ telefonos: Telefono[] }>) => void;
    studioSlug: string;
}

interface SortableTelefonoItemProps {
    telefono: Telefono;
    onToggle: (id: string, is_active: boolean) => void;
    onEdit: (telefono: Telefono) => void;
    onDelete: (id: string) => void;
}

function SortableTelefonoItem({ telefono, onToggle, onEdit, onDelete }: SortableTelefonoItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: telefono.id! });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`py-2 border-b border-zinc-800 last:border-b-0 ${isDragging ? 'shadow-lg' : ''} ${!telefono.is_active ? 'opacity-50' : ''}`}
        >
            {/* Fila 1: Icono drag | Teléfono | Switch | Iconos */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-1 cursor-grab hover:bg-zinc-700 rounded transition-colors" {...attributes} {...listeners}>
                        <GripVertical className="h-4 w-4 text-zinc-500" />
                    </div>
                    <p className="text-white font-medium text-lg">{telefono.numero}</p>
                </div>

                <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={telefono.is_active}
                            onChange={(e) => onToggle(telefono.id!, e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                    </label>

                    <button
                        onClick={() => onEdit(telefono)}
                        className="p-2 text-zinc-400 hover:text-blue-400 transition-colors"
                        title="Editar"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => onDelete(telefono.id!)}
                        className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Fila 2: Etiqueta | Badges de WhatsApp y Llamadas */}
            <div className="flex items-center gap-2 mt-2">
                {telefono.etiqueta && (
                    <label className="text-xs text-zinc-400 ml-5 border border-zinc-600 px-2 py-1 rounded">
                        {telefono.etiqueta}
                    </label>
                )}
                {telefono.tipo === 'llamadas' && (
                    <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                        Llamadas
                    </span>
                )}
                {telefono.tipo === 'whatsapp' && (
                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                        WhatsApp
                    </span>
                )}
                {telefono.tipo === 'ambos' && (
                    <>
                        <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                            Llamadas
                        </span>
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                            WhatsApp
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

export function TelefonosSection({ telefonos, onLocalUpdate, studioSlug }: TelefonosSectionProps) {
    const [telefonoModal, setTelefonoModal] = useState<{ open: boolean; telefono?: Telefono }>({ open: false });
    const [isReorderingTelefonos, setIsReorderingTelefonos] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleTelefonoSave = async (telefono: Telefono) => {
        try {
            if (telefono.id) {
                // Actualizar teléfono existente
                await actualizarTelefono(telefono.id, {
                    numero: telefono.numero,
                    tipo: telefono.tipo === 'whatsapp' ? 'WHATSAPP' :
                        telefono.tipo === 'llamadas' ? 'LLAMADAS' : 'AMBOS',
                    etiqueta: telefono.etiqueta,
                    is_active: telefono.is_active
                });
                const updated = telefonos.map(t => t.id === telefono.id ? telefono : t);
                onLocalUpdate({ telefonos: updated });
                toast.success('Teléfono actualizado exitosamente');
            } else {
                // Crear nuevo teléfono
                const nuevoTelefono = await crearTelefono(studioSlug, {
                    numero: telefono.numero,
                    tipo: telefono.tipo === 'whatsapp' ? 'WHATSAPP' :
                        telefono.tipo === 'llamadas' ? 'LLAMADAS' : 'AMBOS',
                    etiqueta: telefono.etiqueta,
                    is_active: telefono.is_active ?? true
                });
                // Usar el teléfono completo devuelto por la base de datos
                const updated = [...telefonos, {
                    id: nuevoTelefono.id,
                    numero: nuevoTelefono.number,
                    tipo: (nuevoTelefono.type === 'WHATSAPP' ? 'whatsapp' :
                        nuevoTelefono.type === 'LLAMADAS' ? 'llamadas' : 'ambos') as 'llamadas' | 'whatsapp' | 'ambos',
                    etiqueta: undefined, // No hay campo label en studio_phones
                    is_active: nuevoTelefono.is_active
                }];
                onLocalUpdate({ telefonos: updated }); // cspell:ignore telefonos
                toast.success('Teléfono agregado exitosamente');
            }
        } catch (error) {
            console.error('Error saving telefono:', error);
            toast.error('Error al guardar teléfono');
        } finally {
            setTelefonoModal({ open: false });
        }
    };

    const handleTelefonoDelete = async (id: string) => {
        try {
            await eliminarTelefono(id);
            const updated = telefonos.filter(t => t.id !== id);
            onLocalUpdate({ telefonos: updated });
            toast.success('Teléfono eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting telefono:', error);
            toast.error('Error al eliminar teléfono');
        }
    };

    const handleTelefonoToggle = async (id: string, is_active: boolean) => {
        try {
            const telefono = telefonos.find(t => t.id === id);
            if (telefono) {
                await actualizarTelefono(id, {
                    numero: telefono.numero,
                    tipo: telefono.tipo === 'whatsapp' ? 'WHATSAPP' :
                        telefono.tipo === 'llamadas' ? 'LLAMADAS' : 'AMBOS',
                    etiqueta: telefono.etiqueta,
                    is_active
                });
                const updated = telefonos.map(t => t.id === id ? { ...t, is_active } : t);
                onLocalUpdate({ telefonos: updated });
                toast.success(`Teléfono ${is_active ? 'activado' : 'desactivado'} exitosamente`);
            }
        } catch (error) {
            console.error('Error toggling telefono:', error);
            toast.error('Error al cambiar estado del teléfono');
        }
    };

    const handleTelefonosDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setIsReorderingTelefonos(true);
        try {
            const oldIndex = telefonos.findIndex(t => t.id === active.id);
            const newIndex = telefonos.findIndex(t => t.id === over.id);
            const reorderedTelefonos = arrayMove(telefonos, oldIndex, newIndex);

            onLocalUpdate({ telefonos: reorderedTelefonos });
            toast.success('Orden actualizado exitosamente');
        } catch (error) {
            console.error('Error reordering telefonos:', error);
            toast.error('Error al actualizar orden');
        } finally {
            setIsReorderingTelefonos(false);
        }
    };

    return (
        <>
            <ZenCard variant="default" padding="none">
                <ZenCardHeader className="border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-green-400" />
                            <ZenCardTitle>Teléfonos</ZenCardTitle>
                        </div>
                        <ZenButton
                            variant="outline"
                            size="sm"
                            onClick={() => setTelefonoModal({ open: true })}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Teléfono
                        </ZenButton>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="p-6">
                    {telefonos.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500">
                            <Phone className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                            <p>No hay teléfonos agregados</p>
                            <p className="text-sm">Agrega al menos un número de contacto</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleTelefonosDragEnd}
                        >
                            <SortableContext
                                items={telefonos.map(t => t.id!)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {telefonos.map((telefono) => (
                                        <SortableTelefonoItem
                                            key={telefono.id}
                                            telefono={telefono}
                                            onToggle={handleTelefonoToggle}
                                            onEdit={(telefono) => setTelefonoModal({ open: true, telefono })}
                                            onDelete={handleTelefonoDelete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* Indicador de reordenamiento */}
                    {isReorderingTelefonos && (
                        <div className="flex items-center justify-center py-2">
                            <div className="h-4 w-4 animate-spin mr-2 border-2 border-green-500 border-t-transparent rounded-full"></div>
                            <span className="text-sm text-zinc-400">Actualizando orden...</span>
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>

            {/* Modal */}
            <TelefonoModal
                isOpen={telefonoModal.open}
                onClose={() => setTelefonoModal({ open: false })}
                onSave={handleTelefonoSave}
                telefono={telefonoModal.telefono}
            />
        </>
    );
}
