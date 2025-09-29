'use client';

import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus, Trash2, Package } from 'lucide-react';
import { ZenBadge, ZenButton } from '@/components/ui/zen';
import { ServicioCard } from './ServicioCard';
import type { CategoriaData, ServicioData } from '@/lib/actions/schemas/catalogo-schemas';

interface CategoriaCardProps {
    categoria: CategoriaData;
    onEdit: (categoria: CategoriaData) => void;
    onDelete: (categoria: CategoriaData) => void;
    onAddServicio: (categoriaId: string) => void;
    onEditServicio: (servicio: ServicioData) => void;
    onDeleteServicio: (servicio: ServicioData) => void;
    onDuplicateServicio: (servicioId: string) => void;
    isParentDragging?: boolean;
}

// Componente para zona de drop vacía
function EmptyDropZone({ categoriaId }: { categoriaId: string }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `categoria-empty-${categoriaId}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={`text-center py-6 min-h-[80px] flex items-center justify-center border-2 border-dashed rounded-lg transition-colors ${isOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-700 bg-zinc-800/30'
                }`}
        >
            <div className="text-center">
                <div className="text-zinc-500 mb-1">
                    <Package className="h-6 w-6 mx-auto" />
                </div>
                <p className="text-xs text-zinc-400">
                    {isOver ? 'Suelta aquí' : 'Arrastra servicios aquí'}
                </p>
            </div>
        </div>
    );
}

export function CategoriaCard({
    categoria,
    onEdit,
    onDelete,
    onAddServicio,
    onEditServicio,
    onDeleteServicio,
    onDuplicateServicio,
    isParentDragging = false,
}: CategoriaCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: categoria.id,
        data: {
            type: 'categoria',
            categoria,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const hideChildren = isParentDragging || isDragging;
    const tieneServicios = categoria.servicios && categoria.servicios.length > 0;

    return (
        <div ref={setNodeRef} style={style} className="w-full">
            <div className="p-4 rounded-md bg-zinc-800/70 border border-zinc-700/80 hover:border-zinc-600 transition-colors">
                {/* Header de categoría */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                        {/* Drag Handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-300 p-1"
                            aria-label="Arrastrar categoría"
                        >
                            <GripVertical className="h-5 w-5" />
                        </button>

                        {/* Nombre */}
                        <h3 className="font-semibold text-zinc-200 truncate">
                            {categoria.nombre}
                        </h3>

                        {/* Badge con contador */}
                        <ZenBadge variant="outline" className="text-xs">
                            {categoria.servicios?.length || 0} servicio{categoria.servicios?.length !== 1 ? 's' : ''}
                        </ZenBadge>

                        {/* Botón editar */}
                        <button
                            onClick={() => onEdit(categoria)}
                            className="p-1 text-zinc-500 hover:text-white transition-colors"
                            title="Editar categoría"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Botón eliminar (solo si no tiene servicios) */}
                        {!tieneServicios && (
                            <button
                                onClick={() => onDelete(categoria)}
                                className="p-1 text-red-500 hover:text-red-400 transition-colors"
                                title="Eliminar categoría"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Botón agregar servicio */}
                    <ZenButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddServicio(categoria.id)}
                        className="flex items-center gap-1 text-xs"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Servicio
                    </ZenButton>
                </div>

                {/* Lista de servicios */}
                {!hideChildren && (
                    <div className="ml-6">
                        {tieneServicios ? (
                            <SortableContext
                                items={categoria.servicios.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {categoria.servicios.map((servicio) => (
                                        <ServicioCard
                                            key={servicio.id}
                                            servicio={servicio}
                                            onEdit={onEditServicio}
                                            onDelete={onDeleteServicio}
                                            onDuplicate={onDuplicateServicio}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        ) : (
                            <EmptyDropZone categoriaId={categoria.id} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
