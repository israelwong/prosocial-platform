'use client';

import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus, Trash2, Package, MoreVertical } from 'lucide-react';
import { ServicioCard } from './ServicioCard';
import type { CategoriaData, ServicioData } from '@/lib/actions/schemas/catalogo-schemas';
import { calcularPrecio, type ConfiguracionPrecios } from '@/lib/actions/studio/builder/catalogo/calcular-precio';

interface CategoriaCardProps {
    categoria: CategoriaData;
    onEdit: (categoria: CategoriaData) => void;
    onDelete: (categoria: CategoriaData) => void;
    onAddServicio: (categoriaId: string) => void;
    onEditServicio: (servicio: ServicioData) => void;
    onDeleteServicio: (servicio: ServicioData) => void;
    onDuplicateServicio: (servicioId: string) => void;
    isParentDragging?: boolean;
    studioConfig: ConfiguracionPrecios;
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

// Menú de acciones
function AccionesMenu({
    categoria,
    tieneServicios,
    onEdit,
    onDelete,
    onAddServicio,
}: {
    categoria: CategoriaData;
    tieneServicios: boolean;
    onEdit: (categoria: CategoriaData) => void;
    onDelete: (categoria: CategoriaData) => void;
    onAddServicio: (categoriaId: string) => void;
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
                            onEdit(categoria);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        Editar Categoría
                    </button>

                    <button
                        onClick={() => {
                            onAddServicio(categoria.id);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Servicio
                    </button>

                    {!tieneServicios && (
                        <button
                            onClick={() => {
                                onDelete(categoria);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-zinc-700"
                        >
                            <Trash2 className="h-4 w-4" />
                            Eliminar Categoría
                        </button>
                    )}
                </div>
            )}
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
    studioConfig,
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
            <div className="p-3 rounded-md bg-zinc-800/70 border border-zinc-700/80 hover:border-zinc-600 transition-colors">
                {/* Header de categoría - Optimizado */}
                <div className="flex items-center justify-between gap-3">
                    {/* Nombre y descripción */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Drag Handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-300 flex-shrink-0"
                            aria-label="Arrastrar categoría"
                        >
                            <GripVertical className="h-4 w-4" />
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-zinc-200 truncate">
                                {categoria.nombre}
                            </h3>
                        </div>
                    </div>

                    {/* Menú de acciones */}
                    <AccionesMenu
                        categoria={categoria}
                        tieneServicios={tieneServicios}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddServicio={onAddServicio}
                    />
                </div>

                {/* Lista de servicios */}
                {!hideChildren && (
                    <div className="mt-3">
                        {tieneServicios ? (
                            <SortableContext
                                items={categoria.servicios.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {categoria.servicios.map((servicio) => {
                                        // Asegurar conversión a número
                                        const costo = Number(servicio.costo);
                                        const gasto = Number(servicio.gasto);

                                        const resultado = calcularPrecio(
                                            costo,
                                            gasto,
                                            servicio.tipo_utilidad as 'servicio' | 'producto',
                                            studioConfig
                                        );

                                        return (
                                            <ServicioCard
                                                key={servicio.id}
                                                servicio={servicio}
                                                onEdit={onEditServicio}
                                                onDelete={onDeleteServicio}
                                                onDuplicate={onDuplicateServicio}
                                                utilidadCalculada={resultado.utilidad_base}
                                                precioPublicoCalculado={resultado.precio_final}
                                            />
                                        );
                                    })}
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
