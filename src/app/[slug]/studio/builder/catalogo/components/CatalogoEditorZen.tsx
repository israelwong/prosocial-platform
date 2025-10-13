'use client';

import React, { useState, useCallback } from 'react';
import { ZenButton, ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Plus, Package, Wrench, Edit, Trash2, GripVertical, DollarSign } from 'lucide-react';
import { CatalogoData, CatalogoItem } from '../types';
import { CatalogoItemModal } from './CatalogoItemModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCatalogoItem } from './SortableCatalogoItem';

interface CatalogoEditorZenProps {
    studioSlug: string;
    data: CatalogoData | null;
    loading: boolean;
}

export function CatalogoEditorZen({ studioSlug, data, loading }: CatalogoEditorZenProps) {
    const [items, setItems] = useState<CatalogoItem[]>(data?.items || []);
    const [selectedItem, setSelectedItem] = useState<CatalogoItem | null>(null);
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingItem, setEditingItem] = useState<CatalogoItem | null>(null);

    // Sensores para drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Manejar creación de item
    const handleCreateItem = useCallback(() => {
        setEditingItem(null);
        setShowItemModal(true);
    }, []);

    // Manejar edición de item
    const handleEditItem = useCallback((item: CatalogoItem) => {
        setEditingItem(item);
        setShowItemModal(true);
    }, []);

    // Manejar eliminación de item
    const handleDeleteItem = useCallback((itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    }, []);

    // Manejar drag and drop de items
    const handleItemsDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        setItems(reorderedItems);
    };

    // Agrupar items por tipo
    const productos = items.filter(item => item.type === 'PRODUCTO');
    const servicios = items.filter(item => item.type === 'SERVICIO');

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-zinc-800/50 rounded animate-pulse"></div>
                <div className="h-32 bg-zinc-800/50 rounded animate-pulse"></div>
                <div className="h-32 bg-zinc-800/50 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con botón de crear */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Catálogo</h3>
                    <p className="text-sm text-zinc-400">Gestiona tus productos y servicios</p>
                </div>
                <ZenButton
                    onClick={handleCreateItem}
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Item
                </ZenButton>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ZenCard variant="outline" className="p-4">
                    <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-blue-400" />
                        <div>
                            <p className="text-sm text-zinc-400">Productos</p>
                            <p className="text-lg font-semibold text-zinc-100">{productos.length}</p>
                        </div>
                    </div>
                </ZenCard>

                <ZenCard variant="outline" className="p-4">
                    <div className="flex items-center gap-3">
                        <Wrench className="h-5 w-5 text-green-400" />
                        <div>
                            <p className="text-sm text-zinc-400">Servicios</p>
                            <p className="text-lg font-semibold text-zinc-100">{servicios.length}</p>
                        </div>
                    </div>
                </ZenCard>

                <ZenCard variant="outline" className="p-4">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-yellow-400" />
                        <div>
                            <p className="text-sm text-zinc-400">Total Items</p>
                            <p className="text-lg font-semibold text-zinc-100">{items.length}</p>
                        </div>
                    </div>
                </ZenCard>
            </div>

            {/* Lista de items con drag and drop */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleItemsDragEnd}
            >
                <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-zinc-300 mb-2">No hay items en tu catálogo</h3>
                                <p className="text-zinc-500 mb-4">Comienza agregando productos o servicios</p>
                                <ZenButton
                                    onClick={handleCreateItem}
                                    variant="primary"
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar Primer Item
                                </ZenButton>
                            </div>
                        ) : (
                            items.map((item) => (
                                <SortableCatalogoItem
                                    key={item.id}
                                    item={item}
                                    onEdit={handleEditItem}
                                    onDelete={handleDeleteItem}
                                />
                            ))
                        )}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Modal */}
            {showItemModal && (
                <CatalogoItemModal
                    isOpen={showItemModal}
                    onClose={() => setShowItemModal(false)}
                    item={editingItem}
                    onSave={(itemData) => {
                        if (editingItem) {
                            setItems(prev => prev.map(item =>
                                item.id === editingItem.id
                                    ? { ...item, ...itemData }
                                    : item
                            ));
                        } else {
                            const newItem: CatalogoItem = {
                                id: `item-${Date.now()}`,
                                ...itemData,
                                order: items.length
                            };
                            setItems(prev => [...prev, newItem]);
                        }
                        setShowItemModal(false);
                    }}
                />
            )}
        </div>
    );
}
