'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';
import { Edit, Trash2, GripVertical, Percent, DollarSign, CreditCard, DollarSignIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MetodoPagoData } from '../types';

interface MetodoPagoItemProps {
    metodo: MetodoPagoData;
    index: number;
    onEditar: (metodo: MetodoPagoData) => void;
    onEliminar: (metodoId: string) => void;
    onActualizarOrden?: (nuevoOrden: { id: string; orden: number }[]) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    disabled?: boolean;
}

export function MetodoPagoItem({
    metodo,
    index,
    onEditar,
    onEliminar,
    onActualizarOrden,
    onMoveUp,
    onMoveDown,
    disabled = false
}: MetodoPagoItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: metodo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Obtener icono según el método de pago
    const getMethodIcon = () => {
        switch (metodo.payment_method) {
            case 'card':
                return <CreditCard className="h-5 w-5" />;
            case 'cash':
            default:
                return <DollarSignIcon className="h-5 w-5" />;
        }
    };

    // Obtener color del badge según el método de pago
    const getTypeBadgeColor = () => {
        switch (metodo.payment_method) {
            case 'card':
                return 'bg-blue-600';
            case 'cash':
            default:
                return 'bg-green-600';
        }
    };

    // Obtener texto del método de pago
    const getTypeText = () => {
        switch (metodo.payment_method) {
            case 'card':
                return 'Tarjeta';
            case 'cash':
            default:
                return 'Efectivo';
        }
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`bg-zinc-900/50 border-zinc-800 transition-all duration-200 hover:shadow-lg ${isDragging ? 'opacity-50 scale-95' : ''
                } ${metodo.status === 'inactive' ? 'opacity-60' : ''}`}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    {/* Información Principal */}
                    <div className="flex items-center space-x-4 flex-1">
                        {/* Handle de arrastre */}
                        <div
                            className="cursor-move text-zinc-400 hover:text-zinc-300"
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-5 w-5" />
                        </div>

                        {/* Icono del método */}
                        <div className="text-zinc-400">
                            {getMethodIcon()}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                    {metodo.metodo_pago}
                                </h3>
                                <Badge
                                    variant={metodo.status === 'active' ? 'default' : 'secondary'}
                                    className={metodo.status === 'active' ? 'bg-green-600' : 'bg-zinc-600'}
                                >
                                    {metodo.status === 'active' ? 'Activo' : 'Inactivo'}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={getTypeBadgeColor()}
                                >
                                    {getTypeText()}
                                </Badge>
                            </div>

                            {/* Detalles de comisiones */}
                            <div className="flex items-center space-x-6 text-sm">
                                {metodo.comision_porcentaje_base && (
                                    <div className="flex items-center space-x-1 text-blue-400">
                                        <Percent className="h-4 w-4" />
                                        <span>
                                            {metodo.comision_porcentaje_base}% comisión
                                        </span>
                                    </div>
                                )}

                                {metodo.comision_fija_monto && (
                                    <div className="flex items-center space-x-1 text-green-400">
                                        <DollarSign className="h-4 w-4" />
                                        <span>
                                            ${metodo.comision_fija_monto} fijo
                                        </span>
                                    </div>
                                )}

                                {!metodo.comision_porcentaje_base && !metodo.comision_fija_monto && (
                                    <div className="flex items-center space-x-1 text-zinc-500">
                                        <span>Sin comisiones</span>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                        {/* Botones de ordenamiento */}
                        {onMoveUp && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onMoveUp}
                                disabled={disabled}
                                className="text-zinc-400 hover:text-white"
                                title="Mover hacia arriba"
                            >
                                ↑
                            </Button>
                        )}
                        {onMoveDown && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onMoveDown}
                                disabled={disabled}
                                className="text-zinc-400 hover:text-white"
                                title="Mover hacia abajo"
                            >
                                ↓
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditar(metodo)}
                            className="text-zinc-400 hover:text-white"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEliminar(metodo.id)}
                            className="text-zinc-400 hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
