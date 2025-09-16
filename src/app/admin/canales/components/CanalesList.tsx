'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
import CanalItem from './CanalItem';

interface CanalAdquisicion {
    id: string;
    nombre: string;
    descripcion: string | null;
    color: string | null;
    icono: string | null;
    isActive: boolean;
    isVisible: boolean;
    orden: number;
    createdAt: Date;
    updatedAt: Date;
}

interface CanalesListProps {
    canales: CanalAdquisicion[];
    loading: boolean;
    isReordering: boolean;
    onEdit: (canal: CanalAdquisicion) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, isActive: boolean) => void;
    onToggleVisible: (id: string, isVisible: boolean) => void;
    onReorder: (canales: CanalAdquisicion[]) => void;
}


export default function CanalesList({
    canales,
    loading,
    isReordering,
    onEdit,
    onDelete,
    onToggleActive,
    onToggleVisible,
    onReorder
}: CanalesListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = canales.findIndex((canal) => canal.id === active.id);
            const newIndex = canales.findIndex((canal) => canal.id === over.id);

            const reorderedCanales = arrayMove(canales, oldIndex, newIndex);
            onReorder(reorderedCanales);
        }
    };

    const filteredCanales = canales.filter(canal => {
        const matchesSearch = canal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            canal.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });


    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-4 bg-zinc-700 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar canales..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Indicador de reordenamiento */}
            {isReordering && (
                <div className="flex items-center justify-center py-2">
                    <div className="flex items-center space-x-2 text-zinc-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-400"></div>
                        <span className="text-sm">Actualizando orden...</span>
                    </div>
                </div>
            )}

            {/* Lista de canales con drag and drop */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredCanales.map(canal => canal.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {filteredCanales.map((canal) => (
                            <CanalItem
                                key={canal.id}
                                canal={canal}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleActive={onToggleActive}
                                onToggleVisible={onToggleVisible}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {filteredCanales.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-zinc-400">No se encontraron canales</p>
                </div>
            )}
        </div>
    );
}
