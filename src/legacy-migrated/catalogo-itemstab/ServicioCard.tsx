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

export function ServicioCard({ servicio, onEdit, onDelete, onDuplicate, precioPublicoCalculado }: ServicioCardProps) {
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
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
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
                    className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 flex-shrink-0"
                    aria-label="Arrastrar servicio"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Nombre del servicio */}
                <span className="text-sm text-zinc-200 truncate flex-1 min-w-0">
                    {servicio.nombre}
                </span>

                {/* Precio público */}
                <div className="text-sm font-semibold text-zinc-100 min-w-[80px] text-right flex-shrink-0">
                    {formatCurrency(precioPublicoCalculado)}
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={() => onEdit(servicio)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Editar servicio"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDuplicate(servicio.id)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Duplicar servicio"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(servicio)}
                        className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar servicio"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
