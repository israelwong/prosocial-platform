'use client';

import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus, Trash2, FolderOpen } from 'lucide-react';
import { ZenBadge, ZenButton } from '@/components/ui/zen';
import { CategoriaCard } from './CategoriaCard';
import type { SeccionData, CategoriaData, ServicioData } from '@/lib/actions/schemas/catalogo-schemas';

interface SeccionCardProps {
    seccion: SeccionData;
    onEdit: (seccion: SeccionData) => void;
    onDelete: (seccion: SeccionData) => void;
    onAddCategoria: (seccionId: string) => void;
    onEditCategoria: (categoria: CategoriaData) => void;
    onDeleteCategoria: (categoria: CategoriaData) => void;
    onAddServicio: (categoriaId: string) => void;
    onEditServicio: (servicio: ServicioData) => void;
    onDeleteServicio: (servicio: ServicioData) => void;
    onDuplicateServicio: (servicioId: string) => void;
    isDragging?: boolean;
}

// Componente para zona de drop vacía
function EmptyDropZone({ seccionId }: { seccionId: string }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `seccion-empty-${seccionId}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={`text-center py-8 min-h-[100px] flex items-center justify-center border-2 border-dashed rounded-lg transition-colors ${isOver
                ? 'border-green-500 bg-green-500/10'
                : 'border-zinc-700 bg-zinc-800/30'
                }`}
        >
            <div className="text-center">
                <div className="text-zinc-500 mb-2">
                    <FolderOpen className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-zinc-400">
                    {isOver ? 'Suelta aquí' : 'Arrastra categorías aquí'}
                </p>
            </div>
        </div>
    );
}

export function SeccionCard({
    seccion,
    onEdit,
    onDelete,
    onAddCategoria,
    onEditCategoria,
    onDeleteCategoria,
    onAddServicio,
    onEditServicio,
    onDeleteServicio,
    onDuplicateServicio,
    isDragging = false,
}: SeccionCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({
        id: seccion.id,
        data: {
            type: 'seccion',
            seccion,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.5 : 1,
    };

    const hideChildren = isDragging || isSortableDragging;
    const tieneCategorias = seccion.categorias && seccion.categorias.length > 0;
    const totalServicios = seccion.categorias?.reduce(
        (acc, cat) => acc + (cat.servicios?.length || 0),
        0
    ) || 0;

    return (
        <div ref={setNodeRef} style={style} className="w-full">
            <div className="p-5 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors">
                {/* Header de sección */}
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                        {/* Drag Handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-300 p-1"
                            aria-label="Arrastrar sección"
                        >
                            <GripVertical className="h-6 w-6" />
                        </button>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {/* Nombre */}
                                <h2 className="text-xl font-bold text-zinc-100 truncate">
                                    {seccion.nombre}
                                </h2>

                                {/* Badges */}
                                <ZenBadge variant="secondary" className="text-xs">
                                    {seccion.categorias?.length || 0} categoría{seccion.categorias?.length !== 1 ? 's' : ''}
                                </ZenBadge>

                                <ZenBadge variant="outline" className="text-xs">
                                    {totalServicios} servicio{totalServicios !== 1 ? 's' : ''}
                                </ZenBadge>

                                {/* Botón editar */}
                                <button
                                    onClick={() => onEdit(seccion)}
                                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                                    title="Editar sección"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>

                                {/* Botón eliminar (solo si no tiene categorías) */}
                                {!tieneCategorias && (
                                    <button
                                        onClick={() => onDelete(seccion)}
                                        className="p-1 text-red-500 hover:text-red-400 transition-colors"
                                        title="Eliminar sección"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Descripción */}
                            {seccion.descripcion && (
                                <p className="text-sm text-zinc-400 truncate">
                                    {seccion.descripcion}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botón agregar categoría */}
                    <ZenButton
                        variant="outline"
                        size="sm"
                        onClick={() => onAddCategoria(seccion.id)}
                        className="flex items-center gap-1.5"
                    >
                        <Plus className="h-4 w-4" />
                        Categoría
                    </ZenButton>
                </div>

                {/* Lista de categorías */}
                {!hideChildren && (
                    <div className="ml-8">
                        {tieneCategorias ? (
                            <SortableContext
                                items={seccion.categorias.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {seccion.categorias.map((categoria) => (
                                        <CategoriaCard
                                            key={categoria.id}
                                            categoria={categoria}
                                            onEdit={onEditCategoria}
                                            onDelete={onDeleteCategoria}
                                            onAddServicio={onAddServicio}
                                            onEditServicio={onEditServicio}
                                            onDeleteServicio={onDeleteServicio}
                                            onDuplicateServicio={onDuplicateServicio}
                                            isParentDragging={isSortableDragging}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        ) : (
                            <EmptyDropZone seccionId={seccion.id} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
