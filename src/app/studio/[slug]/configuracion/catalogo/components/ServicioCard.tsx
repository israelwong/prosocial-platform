'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { ZenBadge } from '@/components/ui/zen';
import type { ServicioData } from '@/lib/actions/schemas/catalogo-schemas';

interface ServicioCardProps {
    servicio: ServicioData;
    onEdit: (servicio: ServicioData) => void;
    onDelete: (servicio: ServicioData) => void;
    onDuplicate: (servicioId: string) => void;
}

export function ServicioCard({ servicio, onEdit, onDelete, onDuplicate }: ServicioCardProps) {
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
        }).format(amount);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group"
        >
            <div className="flex items-center w-full p-3 bg-zinc-800 border border-zinc-700/50 rounded-md hover:border-zinc-600 transition-colors">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 p-1 mr-2"
                    aria-label="Arrastrar servicio"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {/* Nombre */}
                        <span className="text-sm text-zinc-200 font-medium truncate">
                            {servicio.nombre}
                        </span>

                        {/* Badge de status */}
                        {servicio.status === 'inactive' && (
                            <ZenBadge variant="destructive" className="text-xs">
                                Inactivo
                            </ZenBadge>
                        )}
                    </div>

                    {/* Info adicional */}
                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span title="Costo">Costo: {formatCurrency(servicio.costo)}</span>
                        <span className="text-zinc-700">•</span>
                        <span title="Precio">Precio: {formatCurrency(servicio.precio_publico)}</span>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Botón editar */}
                    <button
                        onClick={() => onEdit(servicio)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Editar servicio"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>

                    {/* Botón duplicar */}
                    <button
                        onClick={() => onDuplicate(servicio.id)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Duplicar servicio"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </button>

                    {/* Botón eliminar */}
                    <button
                        onClick={() => onDelete(servicio)}
                        className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar servicio"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
