'use client';

import React, { useState, useEffect } from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { Plus, Share2, GripVertical } from 'lucide-react';
import { RedSocialItemZenDnd } from './RedSocialItemZenDnd';
import { Plataforma, RedSocial } from '../types';
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

interface RedSocialListZenDndProps {
    redes: RedSocial[];
    plataformas: Plataforma[];
    onEditRed: (red: RedSocial) => void;
    onDeleteRed: (id: string) => void;
    onToggleActive: (id: string, activo: boolean) => void;
    onAddRed: () => void;
    onReorderRedes: (redes: RedSocial[]) => Promise<void>; // New prop for reordering
    loading?: boolean;
}

export function RedSocialListZenDnd({
    redes,
    plataformas,
    onEditRed,
    onDeleteRed,
    onToggleActive,
    onAddRed,
    onReorderRedes, // Destructure new prop
    loading
}: RedSocialListZenDndProps) {
    const [items, setItems] = useState<RedSocial[]>(redes); // State for Dnd

    useEffect(() => {
        setItems(redes); // Update Dnd items when props change
    }, [redes]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over?.id);

            const newOrder = arrayMove(items, oldIndex, newIndex);
            setItems(newOrder); // Optimistic update

            try {
                await onReorderRedes(newOrder);
                toast.success("Orden de redes sociales actualizado");
            } catch (error) {
                toast.error("Error al reordenar redes sociales");
                setItems(redes); // Revert on error
            }
        }
    };

    const getPlataformaInfo = (plataformaId: string | null) => {
        if (!plataformaId) return null;
        return plataformas.find(p => p.id === plataformaId);
    };

    return (
        <ZenCard variant="default" padding="none">
            <ZenCardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <ZenCardTitle>Redes Sociales Configuradas</ZenCardTitle>
                        <ZenCardDescription>
                            Gestiona tus enlaces a redes sociales y sitios web. Arrastra para reordenar.
                        </ZenCardDescription>
                    </div>
                    <ZenButton
                        onClick={onAddRed}
                        variant="primary"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Red Social
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
                ) : items.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                            <Share2 className="h-8 w-8 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400 mb-2">No hay redes sociales configuradas</p>
                        <p className="text-zinc-500 text-sm mb-4">
                            Agrega enlaces a tus redes sociales para que los clientes puedan encontrarte
                        </p>
                        <div className="text-xs text-zinc-600">
                            Plataformas disponibles: {plataformas.filter(p => p.isActive).length} de {plataformas.length}
                        </div>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {items.map((red) => {
                                    const plataformaInfo = getPlataformaInfo(red.plataformaId);
                                    return (
                                        <RedSocialItemZenDnd
                                            key={red.id}
                                            red={red}
                                            plataforma={plataformaInfo}
                                            onEdit={onEditRed}
                                            onDelete={onDeleteRed}
                                            onToggleActive={onToggleActive}
                                        />
                                    );
                                })}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <GripVertical className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium text-sm">Información sobre redes sociales</h4>
                            <div className="text-xs text-zinc-400 space-y-1">
                                <p>• Arrastra las redes sociales para reordenarlas según tu preferencia</p>
                                <p>• Las redes activas aparecerán en tu perfil público</p>
                                <p>• Puedes configurar diferentes redes para cada plataforma</p>
                                <p>• El orden se guarda automáticamente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ZenCardContent>
        </ZenCard>
    );
}
