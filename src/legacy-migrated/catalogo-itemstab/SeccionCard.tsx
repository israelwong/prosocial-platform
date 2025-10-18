'use client';

import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Plus, Trash2, FolderOpen, MoreVertical } from 'lucide-react';
import { CategoriaCard } from './CategoriaCard';
import type { SeccionData, CategoriaData, ServicioData } from '@/lib/actions/schemas/catalogo-schemas';
import type { ConfiguracionPrecios } from '@/lib/actions/studio/builder/catalogo/calcular-precio';

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
    studioConfig: ConfiguracionPrecios;
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

// Menú de acciones
function AccionesMenu({
    seccion,
    tieneCategorias,
    onEdit,
    onDelete,
    onAddCategoria,
}: {
    seccion: SeccionData;
    tieneCategorias: boolean;
    onEdit: (seccion: SeccionData) => void;
    onDelete: (seccion: SeccionData) => void;
    onAddCategoria: (seccionId: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar menú cuando se hace click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                title="Opciones"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 min-w-[180px]">
                    <button
                        onClick={() => {
                            onEdit(seccion);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        Editar Sección
                    </button>

                    <button
                        onClick={() => {
                            onAddCategoria(seccion.id);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Categoría
                    </button>

                    {!tieneCategorias && (
                        <button
                            onClick={() => {
                                onDelete(seccion);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-zinc-700"
                        >
                            <Trash2 className="h-4 w-4" />
                            Eliminar Sección
                        </button>
                    )}
                </div>
            )}
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
    studioConfig,
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

    return (
        <div ref={setNodeRef} style={style} className="w-full">
            <div className="p-4 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors">
                {/* Header de sección - Optimizado */}
                <div className="flex items-center justify-between gap-3">
                    {/* Nombre completo de la sección */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 flex-shrink-0"
                        >
                            <FolderOpen className="h-5 w-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-semibold text-zinc-100 truncate">
                                {seccion.nombre}
                            </h2>
                            {seccion.descripcion && (
                                <p className="text-xs text-zinc-400 mt-1 break-words">
                                    {seccion.descripcion}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Menú de acciones */}
                    <AccionesMenu
                        seccion={seccion}
                        tieneCategorias={tieneCategorias}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddCategoria={onAddCategoria}
                    />
                </div>

                {/* Lista de categorías */}
                {!hideChildren && (
                    <div className="mt-4">
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
                                            studioConfig={studioConfig}
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
