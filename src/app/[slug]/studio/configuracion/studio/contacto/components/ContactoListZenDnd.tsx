'use client';

import React, { useState, useEffect } from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { ZenInput } from '@/components/ui/zen';
import { ZenTextarea } from '@/components/ui/zen';
import { Plus, MapPin, Globe, Loader2, GripVertical, Phone, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { ZenBadge } from '@/components/ui/zen';
import { Telefono, ContactoData, TIPOS_TELEFONO } from '../types';
import { toast } from 'sonner';
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

// Función helper para obtener información del tipo de teléfono
const getTipoInfo = (tipo: string) => {
    return TIPOS_TELEFONO.find(t => t.value === tipo) || TIPOS_TELEFONO[0];
};

interface ContactoListZenDndProps {
    telefonos: Telefono[];
    contactoData: ContactoData;
    onAddTelefono: () => void;
    onEditTelefono: (telefono: Telefono) => void;
    onDeleteTelefono: (id: string) => void;
    onToggleActive: (id: string, is_active: boolean) => void; // Actualizado: activo → is_active
    onUpdateContactoData: (field: keyof ContactoData, value: string) => void;
    onSaveContactoData: (field: keyof ContactoData, value: string) => Promise<void>;
    onReorderTelefonos: (telefonos: Telefono[]) => Promise<void>;
    loading?: boolean;
}

// Componente Sortable para cada teléfono - Siguiendo patrón establecido
function SortableTelefonoItem({
    telefono,
    onDelete,
    onEdit,
    onToggleActive
}: {
    telefono: Telefono;
    onDelete: (id: string) => void;
    onEdit: (telefono: Telefono) => void;
    onToggleActive: (id: string, is_active: boolean) => void; // Actualizado: activo → is_active
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: telefono.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-4 bg-zinc-900/30 rounded-lg border transition-all duration-200 hover:bg-zinc-900/50 ${telefono.is_active // Actualizado: activo → is_active
                ? 'border-zinc-700 hover:border-zinc-600'
                : 'border-zinc-800 opacity-60 hover:opacity-80'
                } ${isDragging ? 'shadow-lg border-blue-500' : ''}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        {/* Handle de drag */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="flex-shrink-0 p-2 cursor-grab hover:bg-zinc-800 rounded-md transition-colors group"
                            title="Arrastrar para reordenar"
                        >
                            <GripVertical className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                        </div>

                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${telefono.is_active ? 'bg-green-900/20' : 'bg-zinc-800' // Actualizado: activo → is_active
                            }`}>
                            <Phone className={`h-5 w-5 ${telefono.is_active ? 'text-green-400' : 'text-zinc-500' // Actualizado: activo → is_active
                                }`} />
                        </div>
                        <div>
                            <p className="text-white font-medium text-lg">{telefono.number}</p> {/* Actualizado: numero → number */}
                            <div className="flex items-center gap-2 mt-1">
                                <ZenBadge
                                    variant="secondary"
                                    size="sm"
                                    className="text-xs"
                                >
                                    {getTipoInfo(telefono.type).label} {/* Actualizado: tipo → type */}
                                </ZenBadge>
                                <div className="flex items-center gap-1">
                                    {telefono.is_active ? ( // Actualizado: activo → is_active
                                        <CheckCircle className="h-3 w-3 text-green-400" />
                                    ) : (
                                        <XCircle className="h-3 w-3 text-red-400" />
                                    )}
                                    <span className={`text-xs ${telefono.is_active ? 'text-green-400' : 'text-red-400' // Actualizado: activo → is_active
                                        }`}>
                                        {telefono.is_active ? 'Activo' : 'Inactivo'} {/* Actualizado: activo → is_active */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <ZenButton
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleActive(telefono.id, !telefono.is_active)}
                        className={`h-9 px-4 text-xs transition-colors ${telefono.is_active // Actualizado: activo → is_active
                            ? 'border-green-600 text-green-400 hover:bg-green-900/20 hover:border-green-500'
                            : 'border-zinc-600 text-zinc-400 hover:bg-zinc-700 hover:border-zinc-500'
                            }`}
                    >
                        {telefono.is_active ? 'Desactivar' : 'Activar'} {/* Actualizado: activo → is_active */}
                    </ZenButton>

                    <ZenButton
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(telefono)}
                        className="h-9 w-9 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500 transition-colors"
                        title="Editar teléfono"
                    >
                        <Edit className="h-4 w-4" />
                    </ZenButton>

                    <ZenButton
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(telefono.id)}
                        className="h-9 w-9 p-0 border-red-600 text-red-400 hover:bg-red-900/20 hover:border-red-500 transition-colors"
                        title="Eliminar teléfono"
                    >
                        <Trash2 className="h-4 w-4" />
                    </ZenButton>
                </div>
            </div>
        </div>
    );
}

export function ContactoListZenDnd({
    telefonos,
    contactoData,
    onAddTelefono,
    onEditTelefono,
    onDeleteTelefono,
    onToggleActive,
    onUpdateContactoData,
    onSaveContactoData,
    onReorderTelefonos,
    loading
}: ContactoListZenDndProps) {
    const [savingField, setSavingField] = useState<string | null>(null);
    const [localData, setLocalData] = useState<ContactoData>(contactoData);
    const [localTelefonos, setLocalTelefonos] = useState<Telefono[]>(telefonos);
    const [isReordering, setIsReordering] = useState(false);

    // Sincronizar estado local con props
    useEffect(() => {
        setLocalData(contactoData);
    }, [contactoData]);

    useEffect(() => {
        setLocalTelefonos(telefonos);
    }, [telefonos]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleFieldBlur = async (field: keyof ContactoData) => {
        const value = localData[field];
        setSavingField(field);
        try {
            await onSaveContactoData(field, value);
            const fieldLabels = {
                direccion: 'dirección del negocio',
                website: 'página web'
            };
            toast.success(`${fieldLabels[field]} actualizada exitosamente`);
        } catch (error) {
            console.error('Error in handleFieldBlur:', error);
            toast.error(`Error al actualizar ${field === 'direccion' ? 'la dirección' : 'la página web'}`);
        } finally {
            setSavingField(null);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localTelefonos.findIndex(telefono => telefono.id === active.id);
            const newIndex = localTelefonos.findIndex(telefono => telefono.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newTelefonos = arrayMove(localTelefonos, oldIndex, newIndex);

                // Actualizar orden localmente
                const reorderedTelefonos = newTelefonos.map((telefono, index) => ({
                    ...telefono,
                    order: index
                }));

                setLocalTelefonos(reorderedTelefonos);
                setIsReordering(true);

                try {
                    await onReorderTelefonos(reorderedTelefonos);
                    toast.success('Orden de teléfonos actualizado');
                } catch (error) {
                    console.error('Error reordering telefonos:', error);
                    toast.error('Error al actualizar el orden de teléfonos');
                    // Revertir cambios
                    setLocalTelefonos(telefonos);
                } finally {
                    setIsReordering(false);
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Teléfonos con Drag & Drop */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <ZenCardTitle>Teléfonos de Contacto</ZenCardTitle>
                            <ZenCardDescription>
                                Gestiona los números de teléfono de tu estudio. Arrastra para reordenar.
                            </ZenCardDescription>
                        </div>
                        <ZenButton
                            onClick={onAddTelefono}
                            variant="primary"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Teléfono
                        </ZenButton>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="space-y-4">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-16 bg-zinc-700 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : localTelefonos.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                                <Plus className="h-8 w-8 text-zinc-500" />
                            </div>
                            <p className="text-zinc-400 mb-2">No hay teléfonos configurados</p>
                            <p className="text-zinc-500 text-sm">
                                Agrega números de teléfono para que los clientes puedan contactarte
                            </p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={localTelefonos.map(t => t.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {localTelefonos.map((telefono) => (
                                        <SortableTelefonoItem
                                            key={telefono.id}
                                            telefono={telefono}
                                            onDelete={onDeleteTelefono}
                                            onEdit={onEditTelefono}
                                            onToggleActive={onToggleActive}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* Indicador de reordenamiento */}
                    {isReordering && (
                        <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm text-zinc-400">Actualizando orden...</span>
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>

            {/* Dirección */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <ZenCardTitle>Dirección</ZenCardTitle>
                            <ZenCardDescription>
                                Ubicación física de tu estudio
                            </ZenCardDescription>
                        </div>
                        <ZenButton
                            onClick={() => handleFieldBlur('direccion')}
                            disabled={savingField === 'direccion'}
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            {savingField === 'direccion' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Actualizar'
                            )}
                        </ZenButton>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <MapPin className="h-4 w-4" />
                            <span>Dirección Completa</span>
                        </div>
                        <ZenTextarea
                            label=""
                            value={localData.direccion}
                            onChange={(e) => setLocalData(prev => ({ ...prev, direccion: e.target.value }))}
                            className="min-h-[100px]"
                            placeholder="Calle, número, colonia, ciudad, estado, código postal"
                        />
                    </div>
                </ZenCardContent>
            </ZenCard>

            {/* Página Web */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <ZenCardTitle>Página Web</ZenCardTitle>
                            <ZenCardDescription>
                                Sitio web oficial de tu estudio
                            </ZenCardDescription>
                        </div>
                        <ZenButton
                            onClick={() => handleFieldBlur('website')}
                            disabled={savingField === 'website'}
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            {savingField === 'website' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Actualizar'
                            )}
                        </ZenButton>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Globe className="h-4 w-4" />
                            <span>URL del Sitio Web</span>
                        </div>
                        <ZenInput
                            label=""
                            value={localData.website}
                            onChange={(e) => setLocalData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://www.tu-estudio.com"
                            type="url"
                        />
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
