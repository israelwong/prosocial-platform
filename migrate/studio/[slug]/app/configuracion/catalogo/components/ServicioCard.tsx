'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Copy, Trash2 } from 'lucide-react';
import type { ServicioData } from '@/lib/actions/schemas/catalogo-schemas';

interface ServicioCardProps {
    servicio: ServicioData;
    onEdit: (servicio: ServicioData) => void;
    onDelete: (servicio: ServicioData) => void;
    onDuplicate: (servicioId: string) => void;
    // Campos calculados al vuelo
    utilidadCalculada: number;
    precioPublicoCalculado: number;
}

export function ServicioCard({ servicio, onEdit, onDelete, onDuplicate, utilidadCalculada, precioPublicoCalculado }: ServicioCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: servicio.id,
        data: {
            type: 'servicio',
            servicio,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group"
        >
            <div className="flex items-center gap-2 w-full p-2 bg-zinc-800 border border-zinc-700/50 rounded-md hover:border-zinc-600 hover:bg-zinc-800/80 transition-colors">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 p-1 flex-shrink-0"
                    aria-label="Arrastrar servicio"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Nombre - Desktop: flex-1, Mobile: full width */}
                <div className="flex-1 min-w-0">
                    <span className="text-sm text-zinc-200 truncate block">
                        {servicio.nombre}
                    </span>
                    {/* Badge de tipo y status - Solo mobile */}
                    <div className="flex items-center gap-2 mt-1 md:hidden">
                        <span
                            className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300"
                            title={servicio.tipo_utilidad === 'producto' ? 'Producto' : 'Servicio'}
                        >
                            {servicio.tipo_utilidad === 'producto' ? 'P' : 'S'}
                        </span>
                        {servicio.status === 'inactive' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                                Inactivo
                            </span>
                        )}
                    </div>
                </div>

                {/* Costo - Solo desktop */}
                <div className="hidden md:flex items-center min-w-[80px]">
                    <span className="text-xs text-zinc-400">
                        {formatCurrency(servicio.costo)}
                    </span>
                </div>

                {/* Gasto - Solo desktop */}
                <div className="hidden md:flex items-center min-w-[80px]">
                    <span className="text-xs text-zinc-400">
                        {formatCurrency(servicio.gasto)}
                    </span>
                </div>

                {/* Precio - Desktop y Mobile */}
                <div className="flex items-center min-w-[80px]">
                    <span className="text-sm font-semibold text-zinc-100">
                        {formatCurrency(precioPublicoCalculado)}
                    </span>
                </div>

                {/* Badge de tipo - Solo desktop con texto completo */}
                <div className="hidden md:flex items-center min-w-[75px]">
                    <span
                        className={`text-[10px] px-2 py-1 rounded font-medium ${servicio.tipo_utilidad === 'producto'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}
                    >
                        {servicio.tipo_utilidad === 'producto' ? 'Producto' : 'Servicio'}
                    </span>
                </div>

                {/* Acciones inline - Desktop: Botones, Mobile: Solo eliminar */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Desktop: Botones inline */}
                    <button
                        onClick={() => onEdit(servicio)}
                        className="hidden md:block p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Editar servicio"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => onDuplicate(servicio.id)}
                        className="hidden md:block p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Duplicar servicio"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </button>

                    {/* Mobile: Solo mostrar Editar y Eliminar */}
                    <button
                        onClick={() => onEdit(servicio)}
                        className="md:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Editar"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>

                    {/* Eliminar - Visible en ambos */}
                    <button
                        onClick={() => onDelete(servicio)}
                        className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar servicio"
                    >
                        <Trash2 className="h-3.5 w-3.5 md:h-3.5 md:w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
